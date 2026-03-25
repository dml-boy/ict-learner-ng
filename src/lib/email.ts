import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string, name: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: 'ICT Learner NG <onboarding@resend.dev>', // Resend default testing sender
      to: email,
      subject: 'Verify your ICT Learner NG account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h1 style="color: #059669;">Welcome to ICT Learner NG!</h1>
          <p>Hi ${name},</p>
          <p>Thank you for joining our platform. Please click the button below to verify your email address and activate your account:</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">Verify Email Address</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p>${verifyUrl}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="font-size: 12px; color: #666;">If you did not create this account, please ignore this email.</p>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    console.error('Resend Error:', error);
    return { success: false, error };
  }
}
