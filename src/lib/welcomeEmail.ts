import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = 'service_9kcyb2e'
const EMAILJS_WELCOME_TEMPLATE_ID = 'template_47nga3n'
const EMAILJS_RESET_TEMPLATE_ID = 'template_pm5h4ql'
const EMAILJS_PUBLIC_KEY = 'B87bSaRTf40kS57vr'

export async function sendWelcomeEmail(params: {
  toEmail: string
  toName: string
}) {
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_WELCOME_TEMPLATE_ID,
    {
      to_email: params.toEmail,
      to_name: params.toName,
      app_name: 'Organic Food Store',
    },
    { publicKey: EMAILJS_PUBLIC_KEY },
  )
}

export async function sendPasswordResetEmail(params: {
  toEmail: string
  toName: string
  resetUrl: string
}) {
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_RESET_TEMPLATE_ID,
    {
      to_email: params.toEmail,
      to_name: params.toName,
      reset_url: params.resetUrl,
      app_name: 'Organic Food Store',
    },
    { publicKey: EMAILJS_PUBLIC_KEY },
  )
}
