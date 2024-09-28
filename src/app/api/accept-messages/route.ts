import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

/**
 * This API route handles updating the message accepting status of a user.
 *
 * - POST: Updates the current user's message accepting status based on the request body.
 *
 * It uses NextAuth.js for authentication and MongoDB for data storage.
 */
export async function POST(request: Request) {
  await dbConnect();

  // 1. Get the current user's session using NextAuth.js
  const session = await getServerSession(authOptions);

  // 2. Type assertion for user object from the session
  const user = session?.user as User;

  // 3. Check if the user is authenticated
  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated"
    }, { status: 401 })
  }

  // 4. Extract userId and acceptMessages status from the request
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    // 5. Find and update the user in the database using their ID and the new `isAcceptingMessages` status
    //    - `findByIdAndUpdate` finds the user by ID and updates the specified fields.
    //    - `{ new: true }` option returns the updated user document.
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    )
    if (!updatedUser) {
      return Response.json({
        success: false,
        message: "User not found"
      }, { status: 404 })
    }

    // 6. Return the updated user document if the update was successful
    return Response.json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser
    }, { status: 200 })
  } catch (error) {
    // 7. Handle any errors that occur during the update process
    //    - Log the error for debugging.
    console.log('faild to update user status to accept messages', error);
    return Response.json({
      success: false,
      message: "Failed to update user status to accept messages"
    }, { status: 500 })
  }
}

/**
 * This is the GET route handler for /api/accept-messages.
 * It retrieves the message accepting status of the currently logged-in user.
 */
export async function GET() {
  try {
    // 1. Connect to the database
    await dbConnect();

    // 2. Get the current user's session using NextAuth.js
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    // 3. Check if the user is authenticated
    if (!session || !session.user) {
      return Response.json({
        success: false,
        message: "Not Authenticated"
      }, { status: 401 }); // Return 401 Unauthorized if not authenticated
    }

    // 4. Get the user's ID from the session
    const userId = user._id;

    // 5. Find the user in the database using their ID
    const foundUser = await UserModel.findById(userId);

    // 6. Check if the user exists in the database
    if (!foundUser) {
      return Response.json({
        success: false,
        message: "User not found"
      }, { status: 404 }); // Return 404 Not Found if user not found
    }

    // 7. Return the user's message accepting status
    return Response.json({
      success: true,
      message: "User found",
      isAcceptingMessages: foundUser.isAcceptingMessages // Correct typo here: isAcceptingMessages -> isAcceptingMessages
    }, { status: 200 }); // Return 200 OK with user status
  } catch (error) {
    // 8. Handle any errors that occur during the process
    console.error('Failed to get user status', error); // Log the error for debugging
    return Response.json({
      success: false,
      message: "Failed to get user status"
    }, { status: 500 }); // Return 500 Internal Server Error if an error occurs
  }
}
/**
 * This API route handles getting and updating the message accepting status of a user.
 *
 * - GET: Retrieves the current user's message accepting status.
 * - POST: Updates the current user's message accepting status based on the request body.
 *
 * It uses NextAuth.js for authentication and MongoDB for data storage.
 * ?defination of this code and how it's work with full explaination 
 */