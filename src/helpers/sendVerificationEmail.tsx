import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";

// Send verification email to the user
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  // Send verification email to the user
  try {
    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Verification Code',
      react: VerificationEmail({ username, otp:verifyCode }),
    })
    return {
      success: true,
      message: 'Verification email sent'
    }
  } catch (error) {
    console.log('Error sending verification email', error)
    return {
      success: false,
      message: 'Error sending verification email'
    }
  }
}