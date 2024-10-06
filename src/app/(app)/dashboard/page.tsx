'use client'
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/apiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
// import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwitched, setIsSwitched] = useState<boolean>(false)
  // Suggested code may be subject to a license. Learn more: ~LicenseLog:1148927104.
  const { toast } = useToast()

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message.id !== messageId))
  };

  const { data: session } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitched(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      setValue('acceptMessages', response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
        duration: 9000,

      })
    } finally {
      setIsSwitched(false)
    }

  }, [setValue, toast]); //if not work this add dependency [setValue]...

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || [])
      if (refresh) {
        toast({
          title: 'Success',
          description: 'Messages refreshed successfully',
          variant: 'default',
          duration: 9000,
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
        duration: 9000,

      })
    } finally {
      setIsLoading(false)

      setIsSwitched(false)
    }
  }, [setIsLoading, setMessages, toast]);


  useEffect(() => {
    if (!session || !session.user) return
    fetchAcceptMessage()
    fetchMessages()
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // Handle Switch change 
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', { acceptMessages: !acceptMessages })
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: 'Success',
        description: response.data.message,
        variant: 'default',
        duration: 9000,
      })

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
        duration: 9000,

      })
    }
  };

  // const { username } = session?.user as User
  /* const  username  = session?.user?.username || 'gust'
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: 'Url Copied',
      description: 'Profile URL copied to clipboard',
      variant: 'default',
      duration: 9000,
    })
  } */


  const [profileUrl, setProfileUrl] = useState<string>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const username = session?.user?.username || 'guest';
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const url = `${baseUrl}/u/${username}`;
      setProfileUrl(url);
    }
  }, [session]);

  const copyToClipboard = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: 'Url Copied',
        description: 'Profile URL copied to clipboard',
        variant: 'default',
        duration: 9000,
      });
    }
  };

  if (!session || !session.user) {
    return <div>Please Login</div>
  }

  return (
    <>
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rouded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Your Profile URL</h2>{' '}
          <div className="flex items-center">
            <input type="text" value={profileUrl} disabled className="input border-input w-full p-2 mr-2" />
            <button onClick={copyToClipboard} className="btn btn-primary">Copy</button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onChange={handleSwitchChange}
            disabled={isLoading || isSwitched}
          />
          <span className="ml-2">
            Accept Messages : {acceptMessages ? 'ON' : 'OFF'}
          </span>
          <Separator />

          <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              fetchMessages(true)
            }
            }
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {
              messages.length > 0 ? (
                messages.map((message) => (
                  <MessageCard
                    key={String(message._id)}
                    message={message}
                    onMessageDelete={handleDeleteMessage}
                  />
                ))
              ) : (
                <p>No Message to display</p>
              )

            }
          </div>


        </div>

      </div>
    </>
  )
}

export default Page