import {Html, Head, Font, Preview, Heading, Row, Section, Text, Button} from "@react-email/components"

interface VerificationEmailProps {
  username : string;
  otp : string
}

export default function VerificationEmail ({username, otp} : VerificationEmailProps)  {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Robot"
          fallbackFontFamily="Verdana"
          webFont={{
              url : "https://fonts.googleapis.com/css2?family=Robot:wght@400;700&display=swap",
              format : "woff2"
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Here&apos;s your verification code: {otp}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username}</Heading>
        </Row>
        <Row>
          <Text>
            Thank you for registering with us. Please enter the following code to verify your account: {otp}
          </Text>
        </Row>
        <Row>
          <Button 
            href={`http://localhost:3000/verify/${username}`}
          >
            Verify Here
          </Button>
        </Row>
      </Section>
    </Html>
  )
} 