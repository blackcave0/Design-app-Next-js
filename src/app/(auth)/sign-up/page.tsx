'use client'

// Importing necessary libraries and hooks
import { zodResolver } from "@hookform/resolvers/zod" // Resolver for Zod validation with React Hook Form
import { useForm } from "react-hook-form" // Hook for managing form state and validation
import * as z from "zod" // Library for schema-based validation
import Link from "next/link" // Used for client-side navigation in Next.js
import { useEffect, useState } from "react" // React hooks for component lifecycle and state management
import { useDebounceCallback } from 'usehooks-ts' // Hook for debouncing a function (useful to limit the rate of API calls)
import { useToast } from "@/hooks/use-toast" // Custom hook to show toast messages for feedback
import { useRouter } from "next/navigation" // Next.js hook for programmatic routing
import { signUpValidation } from "@/schemas/signUpSchema" // Validation schema for form using Zod
import axios, { AxiosError } from 'axios' // Axios library for HTTP requests and error handling
import { ApiResponse } from "@/types/apiResponse" // Type definition for API response
import { Form, FormControl, /* FormDescription */ FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form" // UI components for form structure
import { Input } from "@/components/ui/input" // UI component for input fields
import { Button } from "@/components/ui/button" // UI component for buttons
import { Loader2 } from "lucide-react" // Icon for loading spinner

// The main functional component for the sign-up page
const Page = () => {
  // State to manage the input value of the username field
  const [username, setUsername] = useState('')

  // State for storing feedback message about username availability
  const [usernameMessage, setUsernameMessage] = useState('')

  // State to track if username availability is being checked
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)

  // State to track if the form is being submitted
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Debouncing the username input to reduce API calls when checking its availability
  const debounced = useDebounceCallback(setUsername, 500)

  // Toast hook for showing success or error messages
  const { toast } = useToast()

  // Router hook to redirect users after successful sign-up
  const router = useRouter();

    // Setting up the form using React Hook Form and integrating Zod schema for validation
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation), // Zod resolver for form validation
    mode : 'onChange',
    defaultValues: { // Default form values
      username: '',
      email: '',
      password: ''
    }
  })

  // useEffect hook to check username availability when the `username` state changes
  useEffect(() => {
    const checkUsernameUnique = async () => {
      // Only check if the username is not empty
      if (username) {
        setIsCheckingUsername(true) // Set state to indicate checking is in progress
        setUsernameMessage('') // Clear any previous messages
        try {
          // API call to check if the username is available
          const response = await axios.get(`/api/check-username?username=${username}`)
          setUsernameMessage(response?.data?.message) // Set response message
        } catch (error) {
          // Error handling if the request fails
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message || 'Username check failed')
        } finally {
          setIsCheckingUsername(false) // Set state to indicate the check has completed
        }
      }
    }
    checkUsernameUnique(); // Execute the function when `username` changes
  }, [username]) // Dependency array to trigger on username change

  // Function that gets executed when the form is submitted
  const onSubmit = async (data: z.infer<typeof signUpValidation>) => {
    setIsSubmitting(true) // Set state to indicate form submission is in progress
    try {
      // API call to submit the sign-up form data
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      // Show success toast message
      toast({
        title: 'Success',
        description: response.data.message
      })
      // Redirect user to the verification page using the username
      router.replace(`/verify/${data?.username}`)
      setIsSubmitting(false) // Reset the submitting state
    } catch (error) {
      // Handle errors during form submission
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error Signup faild',
        description: axiosError.response?.data.message || 'Something went wrong',
      })
      setIsSubmitting(false) // Reset the submitting state
    }
  }

  // JSX to render the sign-up form
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Join Mystery Message
          </h1>
          <p className="mb-44">
            sign up to start your anonymous adventure
          </p>
        </div>

        {/* Form component to wrap the form fields */}
        <Form {...form} >
          {/* Actual form element with the submit handler */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Username field */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value) // Trigger debounced username check
                      }}
                      autoFocus
                      aria-invalid={!!form.formState.errors.username} // Accessibility improvement for invalid field
                      aria-describedby="username-error"
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}

                  {/* Real-time username availability feedback */}
                  <p
                    id="username-error"
                    className={`text-sm ${
                      usernameMessage === 'Username available' ? 'text-green-500' : 'text-red-500'
                    }`}
                    aria-live="assertive"
                  >
                    {usernameMessage || 'Checking username availability...'}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email field */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    aria-invalid={!!form.formState.errors.email}
                    aria-describedby="email-error"
                  />
                </FormControl>
                <FormMessage id="email-error" />
              </FormItem>
              )}
            />

            {/* Password field */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                  <Input
                      type="password"
                      placeholder="Enter a strong password"
                      {...field}
                      aria-invalid={!!form.formState.errors.password}
                      aria-describedby="password-error"
                    />
                  </FormControl>

                  {/* Password strength meter */}
                  {field.value.length > 0 && (
                    <p className={`text-sm ${field.value.length > 6 ? 'text-green-500' : 'text-red-500'}`}>
                      {field.value.length > 6 ? 'Strong password' : 'Weak password'}
                    </p>
                  )}
                  <FormMessage id="password-error" />
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />

            {/* Submit button */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Please wait
                </>
              ) : 'Sign up'}
            </Button>
          </form>
        </Form>

        {/* Link to login page for existing users */}
        <div className="text-center mt-">
          <p>
            Already a member? {''}
            <Link href="/sign-in" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page // Exporting the component


// defination of this code and how it's work with full explaination and add proper comment on the each line of statement or method for better understanding why this code are write for 