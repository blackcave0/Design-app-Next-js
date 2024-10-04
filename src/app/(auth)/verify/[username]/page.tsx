'use client'
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { verifySchem } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/apiResponse';
// import { signUpValidation } from '@/schemas/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
// import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod" // Library for schema-based validation

const VerifyAccount = () => {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const { toast } = useToast()

  // Setting up the form using React Hook Form and integrating Zod schema for validation
  const form = useForm<z.infer<typeof verifySchem>>({
    resolver: zodResolver(verifySchem), // Zod resolver for form validation
    defaultValues: { // Default form values
      code: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof verifySchem>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code
      })

      toast({
        title: 'Success',
        description: response.data.message
      })

      router.replace('/sign-in')
    } catch (error) {
      // Handle errors during form submission
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error Signup faild',
        description: axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
      })
    }
  }
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
              Verify Tour Account
            </h1>
            <p className='mb-4'>
              Enter the verification code sent to your email to verify your account.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Code" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}

export default VerifyAccount