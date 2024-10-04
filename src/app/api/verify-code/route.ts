import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    // Extract username and code from the request body
    const { username, code } = await request.json();
    
    // Decode the username (it might have been encoded in the frontend)
    const decodedUsername = decodeURIComponent(username);

    // Find the user in the database based on their username
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json({
        success: false,
        message: 'User not found'
      }, { status: 404 })
    }
    
    // Check if the provided code matches the one stored for the user
    const isCodeValid = user.verifyCode === code;

    // Check if the code has not expired
    // const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

    const isCodeNotExpired = new Date(user.verifyCodeExpiry).getTime() > new Date().getTime();

    user.verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now


    // If code is valid and not expired, mark the user as verified
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json({
        success: true,
        message: 'User verified successfully'
      }, { status: 200 })
    } else if (!isCodeNotExpired) {
      return Response.json({
        success: false,
        message: 'Code has expired'
      }, { status: 400 })
    } else {
      return Response.json({
        success: false,
        message: 'Invalid code'
      }, { status: 400 })
    }

  } catch (error) {
    console.log('Error verifying user', error)
    return Response.json({
      success: false,
      message: 'Error verifying user'
    }, { status: 500 })
  }
}