// Suggested code may be subject to a license. Learn more: ~LicenseLog:592425610.
'use client'

// Importing necessary libraries and hooks
import { zodResolver } from "@hookform/resolvers/zod" // Resolver for Zod validation with React Hook Form
import { useForm } from "react-hook-form" // Hook for managing form state and validation
import * as z from "zod" // Library for schema-based validation
import Link from "next/link" // Used for client-side navigation in Next.js
import { useToast } from "@/hooks/use-toast" // Custom hook to show toast messages for feedback
import { useRouter } from "next/navigation" // Next.js hook for programmatic routing
// import axios, { AxiosError } from 'axios' // Axios library for HTTP requests and error handling
// import { ApiResponse } from "@/types/apiResponse" // Type definition for API response
import { Form, FormControl, /* FormDescription */ FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form" // UI components for form structure
import { Input } from "@/components/ui/input" // UI component for input fields
import { Button } from "@/components/ui/button" // UI component for buttons
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

// The main functional component for the sign-in page
const Page = () => {

  // State to track if the form is being submitted
  // const [isSubmitting, setIsSubmitting] = useState(false)


  // Toast hook for showing success or error messages
  const { toast } = useToast()

  // Router hook to redirect users after successful sign-in
  const router = useRouter();

  // Setting up the form using React Hook Form and integrating Zod schema for validation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema), // Zod resolver for form validation
    mode: 'onChange',
    defaultValues: { // Default form values
      // email: '',
      identifier: '',
      password: ''
    }
  })


  // Function that gets executed when the form is submitted
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: true,
      // callbackUrl: '/dashboard',
      // redirect: false,
      // callbackUrl: '/dashboard',
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: ' Login Error',
          description: `Incorrect username or password ${result.error}`,
          variant: 'destructive',
        })

        //both are same...
        /* toast({
          title: ' Login Error',
          description: `Incorrect username or password ${result.error}`,
          variant: 'destructive',
        }); */
      } else {
        toast({
          title: ' Login Error',
          description: `Something went wrong ${result.error}`,
          variant: 'destructive',
        });
      };
    }else if (result?.url) {
      router.replace('/dashboard')
    }
  }
  // JSX to render the sign-in form
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Join Mystery Message
          </h1>
          <p className="mb-44">
            sign in to start your anonymous adventure
          </p>
        </div>

        {/* Form component to wrap the form fields */}
        <Form {...form} >
          {/* Actual form element with the submit handler */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


            {/* Email field */}
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email/username"
                      {...field}
                    // aria-describedby="email-error"
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
            <Button type="submit" >
              Sign In
            </Button>
          </form>
        </Form>

        {/* Link to login page for existing users */}
        <div className="text-center mt-">
          <p>
            Create an account {''}
            <Link href="/sign-up" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page // Exporting the component


// defination of this code and how it's work with full explaination and add proper comment on the each line of statement or method for better understanding why this code are write for 