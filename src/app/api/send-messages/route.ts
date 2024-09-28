import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

/**
 * This is an API route handler function responsible for sending messages to a specific user.
 * 
 * ### Parameters:
 * *@param {Request} request - The incoming HTTP request object.
 * *@returns {Promise<Response>} A Response object containing the result of the operation.
 */
export async function POST(request:Request) {
  // 1. Establish a connection to the database
  await dbConnect();

  // 2. Extract username and content from the request body
  const {username, content} = await request.json();

  try {
    // 3. Find the user in the database based on the provided username
    const user = await UserModel.findOne({username});

    // 4. Check if the user exists
    if(!user) {
      return Response.json({
        success : false,
        message : "User not found"
      }, {status : 404})
    }
    
    // 5. Check if the user is accepting messages
    if(!user.isAcceptingMessages) {
      return Response.json({
        success : false,
        message : "User is not accepting messages"
      }, {status : 403})
    }

    // 6. Create a new message object
    const newMessage  = {
      content,
      createdAt : new Date()
    }

    // 7. Add the new message to the user's messages array
    user.messages.push(newMessage as Message);

    // 8. Save the updated user object to the database
    await user.save();

    // 9. Return a success response
    return Response.json({
      success : true,
      message : "Message sent successfully",
      data : newMessage
    }, {status : 201})

  } catch (error) {
    // 10. Handle any errors that occur during the process
    console.log('failed to send message', error);
    return Response.json({
      success : false,
      message : "Failed to send message"
    }, {status : 500})
  }
}
/*
** Explanation of functions, conditions and methods used:

 * `dbConnect()`: This function establishes a connection to the MongoDB database.
 * `request.json()`: This method parses the incoming request body as JSON.
 * `UserModel.findOne({username})`: This method searches the database for a user with the given username.
 * `Response.json()`: This method creates a new Response object with a JSON body.
 * `user.isAcceptingMessages`: This property of the User model indicates whether the user is currently accepting messages.
 * `user.messages.push()`: This method adds a new message to the user's messages array.
 * `user.save()`: This method saves the updated user object to the database.
 * `console.log()`: This function logs a message to the console.
*/