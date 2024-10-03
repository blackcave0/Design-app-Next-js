//checking unique username 
import dbConncet from '@/lib/dbConnect'
import UserModel from '@/model/User'
import {z} from 'zod'
import { userNameValidation } from '@/schemas/signUpSchema'

const UserNameQuerySchema = z.object({
    username: userNameValidation
})

export async function GET(request: Request){
  //todo
  //checking method is get or not
  if(request.method !== 'GET'){
    return Response.json({
      success : false,
      message : 'Method not allowed'
    }, {status : 405})
  };
 
  await dbConncet();
  try {
    //checking username by url
    const {searchParams} = new URL(request.url);
    const qeuryParam = {username : searchParams.get('username')};

    // validate with zod
    const result = UserNameQuerySchema.safeParse(qeuryParam);
    console.log('result' ,result) //::todo Remove
    if(!result.success){
      const usernameError = result.error.format().username?._errors || [];
      return Response.json({
        success : false,
        message : usernameError.length > 0 ? usernameError.join(', ') : 'Invalid username'
      });
    };

    //destructure username from result.data
    const {username} = result.data;

    //finding username in database which is already verified
    const existingVerifiedUser = await UserModel.findOne({username, isVerified : true}) 
    if(existingVerifiedUser){
      return Response.json({
        // if username exist then return success false
        success : false,
        message : 'Username already taken'
      }, {status : 409})
    };

    return Response.json({
      success : true,
      message : 'Username available',
      username
    }, {status : 200})
    
  } catch (error) {
    console.log('Error checking username', error);
    return Response.json({
      success: false,
      message: 'Error checking username'
    }, {status : 500})
  }
}