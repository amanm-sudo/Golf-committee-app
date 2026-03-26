import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://digitalheroes.co.in";

function isResendConfigured(): boolean {
  return !!(process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("your-resend-api-key"));
}

export async function sendWinnerNotification(
  email: string,
  name: string,
  tier: number,
  prizeAmount: number,
  cycleMonth: string
) {
  if (!isResendConfigured()) {
    console.warn("Resend API Key not configured. Skipping email notification to:", email);
    return;
  }

  try {
    await resend.emails.send({
      from: "Digital Heroes <onboarding@resend.dev>",
      to: email,
      subject: `🏆 You Won the ${cycleMonth} Digital Heroes Draw!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fbf9f6; padding: 40px;">
          <h1 style="font-family: Georgia, serif; font-style: italic; color: #012d1d; font-size: 2.5rem; margin-bottom: 4px;">Digital Heroes</h1>
          <p style="color: #d4af37; font-size: 10px; font-weight: bold; letter-spacing: 0.4em; text-transform: uppercase; margin-top: 0;">Premium Philanthropy</p>
          <hr style="border: none; border-top: 1px solid #e4e2df; margin: 32px 0;" />
          <h2 style="color: #012d1d;">Congratulations, ${name}! 🎉</h2>
          <p>You matched <strong>${tier} numbers</strong> in the <strong>${cycleMonth}</strong> monthly cycle.</p>
          <p>Your provisional prize amount is <strong style="color: #d4af37; font-size: 1.5rem;">₹${prizeAmount.toLocaleString()}</strong>.</p>
          <hr style="border: none; border-top: 1px solid #e4e2df; margin: 32px 0;" />
          <p><strong>Next Steps:</strong></p>
          <p>To claim your prize, you must upload a verified screenshot of your golf scorecard within <strong>14 days</strong>.</p>
          <a href="${APP_URL}/dashboard" style="display: inline-block; background: #012d1d; color: white; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 16px;">Claim Your Prize →</a>
          <p style="margin-top: 32px; color: #888; font-size: 12px;">— The Digital Heroes Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send winner notification:", error);
  }
}

export async function sendSubscriptionConfirmation(email: string, planName: string, amount: string) {
  if (!isResendConfigured()) {
    console.warn("Resend API Key not configured. Skipping sub email to:", email);
    return;
  }

  try {
    await resend.emails.send({
      from: "Digital Heroes <onboarding@resend.dev>",
      to: email,
      subject: "Digital Heroes: Your Membership is Confirmed",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fbf9f6; padding: 40px;">
          <h1 style="font-family: Georgia, serif; font-style: italic; color: #012d1d; font-size: 2.5rem; margin-bottom: 4px;">Digital Heroes</h1>
          <p style="color: #d4af37; font-size: 10px; font-weight: bold; letter-spacing: 0.4em; text-transform: uppercase; margin-top: 0;">Premium Philanthropy</p>
          <hr style="border: none; border-top: 1px solid #e4e2df; margin: 32px 0;" />
          <h2 style="color: #012d1d;">Your Commitment is Confirmed!</h2>
          <p>Thank you for subscribing to the <strong>${planName}</strong> plan.</p>
          <p>We've successfully processed your payment of <strong>${amount}</strong>.</p>
          <p>You can now log your golf scores and compete in the next monthly prize draw!</p>
          <a href="${APP_URL}/dashboard" style="display: inline-block; background: #012d1d; color: white; padding: 14px 28px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 16px;">Go to Your Dashboard →</a>
          <p style="margin-top: 32px; color: #888; font-size: 12px;">— The Digital Heroes Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send subscription receipt:", error);
  }
}

export async function sendSubscriptionCancellationEmail(email: string, name: string, periodEnd: string) {
  if (!isResendConfigured()) return;

  try {
    await resend.emails.send({
      from: "Digital Heroes <onboarding@resend.dev>",
      to: email,
      subject: "Digital Heroes: Subscription Cancellation Scheduled",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fbf9f6; padding: 40px;">
          <h1 style="font-family: Georgia, serif; font-style: italic; color: #012d1d; font-size: 2.5rem; margin-bottom: 4px;">Digital Heroes</h1>
          <hr style="border: none; border-top: 1px solid #e4e2df; margin: 32px 0;" />
          <h2 style="color: #012d1d;">Subscription Cancellation Confirmed</h2>
          <p>Hi ${name}, your Digital Heroes membership has been scheduled for cancellation.</p>
          <p>You will retain full access until <strong>${periodEnd}</strong>. No further charges will be made after that date.</p>
          <p>We'd love to have you back — you can resubscribe at any time from the pricing page.</p>
          <p style="margin-top: 32px; color: #888; font-size: 12px;">— The Digital Heroes Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send cancellation email:", error);
  }
}
