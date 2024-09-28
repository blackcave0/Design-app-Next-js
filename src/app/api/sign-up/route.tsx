import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function POST(request: Request) {
  await dbConnect();
  try {
    // Get the data from the request body we have three email, username, password
    const { username, email, password } = await request.json();

    // Check if the user already exists
    const existingUseVerifiedByUsername = await UserModel.findOne({ username, verified: true });
    if (existingUseVerifiedByUsername) {
      return Response.json({
        success: false,
        message: 'Username already exists'
      }, { status: 400 })
    }

    // Check if the email already exists
    const existingUserByEmail = await UserModel.findOne({ email });

    // Generate a verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // If the email already exists, return an error
    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: 'Email already exists'
        }, { status: 400 })
      } else {
        const expiryDate = new Date();
        const hasedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hasedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;
        expiryDate.setDate(expiryDate.getHours() + 1);
        await existingUserByEmail.save();
      }
    } else {
      // #--If the email doesn't exist, create a new user
      // Hash the password
      const hasedPassword = await bcrypt.hash(password, 10);

      //-- settign password expiry date to 1 hour from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getHours() + 1);

      // Create a new user
      const newUser = new UserModel({ username, email, password: hasedPassword, verifyCode, verifyCodeExpiry: expiryDate, isVarified: false, isAcceptingMessages: true, messages: [] });
      await newUser.save();

      // Send verification email
      const emailResponse: ApiResponse = await sendVerificationEmail(email, username, verifyCode);
      if (!emailResponse.success) {
        return Response.json({
          success: false,
          message: emailResponse.message ? emailResponse.message : 'Error sending verification email'
        }, { status: 500 })
      }
      return Response.json({
        success: true,
        message: 'User registered successfully'
      }, { status: 201 })
    }
  } catch (error) {
    console.log('Error registering user', error)
    return Response.json({
      success: false,
      message: 'Error registering user'
    }, { status: 500 })
  }
}
