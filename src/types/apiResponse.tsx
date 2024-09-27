import { Message } from "@/model/User";

// Define the ApiResponse interface
export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages? : boolean;
  messages? : Array<Message>
}

