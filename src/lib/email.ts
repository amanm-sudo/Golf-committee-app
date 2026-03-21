import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWinnerNotification(
  email: string,
  name: string,
  tier: number,
  prizeAmount: number,
  cycleMonth: string
) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("your-resend-api-key")) {
    console.warn("Resend API Key not configured. Skipping email notification to:", email);
    return;
  }

  try {
    await resend.emails.send({
      // Resend requires this specific testing email until you verify a real domain!
      from: "Digital Heroes <onboarding@resend.dev>", 
      to: email,
      subject: `Action Required: You Won the ${cycleMonth} Digital Heroes Draw!`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2>Congratulations, ${name}! 🎉</h2>
          <p>You have matched <strong>${tier} numbers</strong> in the ${cycleMonth} monthly cycle.</p>
          <p>Your provisional prize amount is <strong>₹${prizeAmount.toLocaleString()}</strong>.</p>
          <br/>
          <p><strong>Next Steps:</strong></p>
          <p>To claim your prize pool share, you must upload a verified copy of your golf scorecard within <strong>14 days</strong>.</p>
          <p>Please log in to your <a href="https://digitalheroes.co.uk/dashboard">Dashboard</a> to submit your proof of play.</p>
          <br/>
          <p>Thank you for your active participation and continued philanthropy.</p>
          <p>— The Digital Heroes Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send Resend email:", error);
  }
}

export async function sendSubscriptionConfirmation(email: string, planName: string, amount: string) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("your-resend-api-key")) {
    console.warn("Resend API Key not configured. Skipping sub email to:", email);
    return;
  }

  try {
    await resend.emails.send({
      // Resend requires this specific testing email until you verify a real domain!
      from: "Digital Heroes <onboarding@resend.dev>",
      to: email,
      subject: "Digital Heroes: Subscription Processed",
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2>Your Commitment is Confirmed!</h2>
          <p>Thank you for subscribing to the <strong>${planName}</strong> plan.</p>
          <p>We successfully processed your payment of <strong>${amount}</strong>.</p>
          <p>You can now log your golf scores and compete in the next monthly prize draw!</p>
          <br/>
          <p>— The Digital Heroes Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send subscription receipt:", error);
  }
}
