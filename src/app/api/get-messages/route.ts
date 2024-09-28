import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

/**
 * This API route retrieves messages for an authenticated user. 
 * 
 * It first authenticates the user using `getServerSession` and checks for a valid session. 
 * If authenticated, it fetches the user's messages from the database, sorting them by creation date in descending order. 
 * The messages are then returned in the response.
 * If the user is not authenticated or an error occurs, an appropriate error response is returned.
 *
 */
export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authenticated"
    }, { status: 401 })
  }

  // Convert the user ID to a MongoDB ObjectId
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    // Use MongoDB aggregation to retrieve user messages
    const user = await UserModel.aggregate([
      { $match: { _id: userId } }, // Match the user by ID
      { $unwind: '$messages' },   // Deconstruct the messages array
      { $sort: { 'messages.createdAt': -1 } }, // Sort messages by creation date (descending)
      {
        $group: {
          _id: '$_id',         // Group by user ID
          messages: { $push: '$messages' } // Push the sorted messages into an array
        }
      }
    ])

    /**
     * Explanation of the aggregation pipeline:
     * 1. `$match`: Filters the documents to only include the one with the matching user ID.
     * 2. `$unwind`: Deconstructs the `messages` array so each message becomes a separate document.
     * 3. `$sort`: Sorts the messages by their `createdAt` field in descending order (newest first).
     * 4. `$group`: Groups the messages back together by user ID and pushes them into a new `messages` array.
     */
    if (!user || user.length === 0) {
      return Response.json({
        success: false,
        message: "User not found"
      }, { status: 404 })
    }
    return Response.json({
      success: true,
      message: "User found",
      data: user[0].messages
    }, { status: 200 })
  } catch (error) {
    console.log('failed to get user messages', error);
    return Response.json({
      success: false,
      message: "Failed to get user messages"
    }, { status: 500 })
  }
}