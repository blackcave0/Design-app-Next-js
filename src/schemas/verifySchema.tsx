import {z} from 'zod'

export const verifySchem = z.object({
  code : z.string().length(6, "Verfication code must be 6 characters long")
})