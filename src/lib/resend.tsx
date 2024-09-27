import { Resend } from "resend";
// Suggested code may be subject to a license. Learn more: ~LicenseLog:4118347081.

export const resend = new Resend(process.env.RESEND_API_KEY);

// export default resend