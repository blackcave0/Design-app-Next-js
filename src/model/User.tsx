import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
  content : string;
  createdAt : Date
}

const MessageSchema : Schema<Message> = new Schema({
  content : {
    type : String,
    required : true
  },
  createdAt : {
    type : Date,
    required : true,
    default : Date.now
  }
})

export interface User extends Document {
  username : string;
  email : string;
  password : string;
  verifyCode : string;
  verifyCodeExpiry : Date;
  isVerified : boolean;
  isAccptingMessages : boolean;
  messages : Message[];
}

const UserSchema : Schema<User> = new Schema({
  username : {
    type : String,
    required : true,
    unique : true
  },
  email : {
    type : String,
    required : true,
    unique : true,
    match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password : {
    type : String,
    required : true
  },
  verifyCode : {
    type : String,
    required : true
  },
  verifyCodeExpiry : {
    type : Date,
    required : true
  },
  isVerified : {
    type : Boolean,
    required : true,
    default : false
  },
  isAccptingMessages : {
    type : Boolean,
    required : true,
    default : true
  },
  messages : [MessageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>('User', UserSchema)

export default UserModel