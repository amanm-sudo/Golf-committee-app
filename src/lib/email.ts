import nodemailer from "nodemailer";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://digitalheroes.co.in";

// Create a reusable transporter using Gmail SMTP with App Password
function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not your account password)
    },
  });
}

function isEmailConfigured(): boolean {
  return !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

// Shared branded HTML wrapper
function wrapEmail(content: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #fbf9f6; padding: 40px; border-radius: 8px;">
      <h1 style="font-family: Georgia, serif; font-style: italic; color: #012d1d; font-size: 2rem; margin-bottom: 0;">Digital Heroes</h1>
      <p style="color: #d4af37; font-size: 10px; font-weight: bold; letter-spacing: 0.4em; text-transform: uppercase; margin-top: 4px; margin-bottom: 0;">Premium Philanthropy</p>
      <hr style="border: none; border-top: 2px solid #e4e2df; margin: 24px 0;" />
      ${content}
      <hr style="border: none; border-top: 1px solid #e4e2df; margin: 32px 0;" />
      <p style="color: #999; font-size: 11px; margin: 0;">© 2026 Digital Heroes LP · <a href="${APP_URL}" style="color: #d4af37;">digitalheroes.co.in</a></p>
    </div>
  `;
}

export async function sendWinnerNotification(
  email: string,
  name: string,
  tier: number,
  prizeAmount: number,
  cycleMonth: string
) {
  if (!isEmailConfigured()) {
    console.warn("[Email] Gmail not configured. Skipping winner notification to:", email);
    return;
  }

  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: `"Digital Heroes" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `🏆 You Won the ${cycleMonth} Digital Heroes Draw!`,
      html: wrapEmail(`
        <h2 style="color: #012d1d; margin-bottom: 8px;">Congratulations, ${name}! 🎉</h2>
        <p style="color: #444;">You matched <strong>${tier} numbers</strong> in the <strong>${cycleMonth}</strong> monthly cycle.</p>
        <div style="background: #012d1d; color: white; border-radius: 8px; padding: 24px; margin: 24px 0; text-align: center;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; opacity: 0.6;">Your Provisional Prize</p>
          <p style="margin: 8px 0 0 0; font-size: 2.5rem; font-family: Georgia, serif; font-style: italic; color: #d4af37; font-weight: bold;">₹${prizeAmount.toLocaleString()}</p>
        </div>
        <p style="color: #444;"><strong>Next Steps:</strong> You must upload a screenshot of your golf scorecard within <strong>14 days</strong> to claim your prize.</p>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background: #d4af37; color: #012d1d; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 16px; letter-spacing: 0.05em;">
          Claim Your Prize →
        </a>
      `),
    });
    console.log("[Email] Winner notification sent to:", email);
  } catch (error) {
    console.error("[Email] Failed to send winner notification:", error);
  }
}

export async function sendSubscriptionConfirmation(
  email: string,
  planName: string,
  amount: string
) {
  if (!isEmailConfigured()) {
    console.warn("[Email] Gmail not configured. Skipping subscription confirmation to:", email);
    return;
  }

  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: `"Digital Heroes" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Digital Heroes: Your Membership is Confirmed ✅",
      html: wrapEmail(`
        <h2 style="color: #012d1d; margin-bottom: 8px;">Your Commitment is Confirmed!</h2>
        <p style="color: #444;">Thank you for subscribing to the <strong>${planName}</strong> plan.</p>
        <div style="background: #f5f3f0; border-left: 4px solid #d4af37; border-radius: 4px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #888;">Payment Processed</p>
          <p style="margin: 4px 0 0 0; font-size: 1.5rem; font-family: Georgia, serif; font-style: italic; color: #012d1d; font-weight: bold;">${amount}</p>
        </div>
        <p style="color: #444;">You can now log your golf scores and compete in the next monthly prize draw. Your subscription also automatically donates to your selected charity every cycle.</p>
        <a href="${APP_URL}/dashboard" style="display: inline-block; background: #012d1d; color: white; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 16px; letter-spacing: 0.05em;">
          Go to Your Dashboard →
        </a>
      `),
    });
    console.log("[Email] Subscription confirmation sent to:", email);
  } catch (error) {
    console.error("[Email] Failed to send subscription confirmation:", error);
  }
}

export async function sendSubscriptionCancellationEmail(
  email: string,
  name: string,
  periodEnd: string
) {
  if (!isEmailConfigured()) {
    console.warn("[Email] Gmail not configured. Skipping cancellation email to:", email);
    return;
  }

  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: `"Digital Heroes" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Digital Heroes: Subscription Cancellation Scheduled",
      html: wrapEmail(`
        <h2 style="color: #012d1d; margin-bottom: 8px;">Cancellation Confirmed</h2>
        <p style="color: #444;">Hi ${name}, your Digital Heroes membership has been scheduled for cancellation.</p>
        <div style="background: #fff8e1; border-left: 4px solid #d4af37; border-radius: 4px; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; color: #555;">You retain full access until <strong>${periodEnd}</strong>. No further charges will be made after that date.</p>
        </div>
        <p style="color: #444;">We'd love to have you back anytime — you can resubscribe with a single click from the pricing page.</p>
        <a href="${APP_URL}/pricing" style="display: inline-block; background: #012d1d; color: white; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 16px; letter-spacing: 0.05em;">
          View Membership Plans
        </a>
      `),
    });
    console.log("[Email] Cancellation email sent to:", email);
  } catch (error) {
    console.error("[Email] Failed to send cancellation email:", error);
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  if (!isEmailConfigured()) {
    console.warn("[Email] Gmail not configured. Skipping welcome email to:", email);
    return;
  }

  const transporter = getTransporter();

  try {
    await transporter.sendMail({
      from: `"Digital Heroes" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Digital Heroes! ⛳",
      html: wrapEmail(`
        <h2 style="color: #012d1d; margin-bottom: 8px;">Welcome to the Fairway, ${name}!</h2>
        <p style="color: #444;">We are thrilled to welcome you to the Digital Heroes platform.</p>
        <p style="color: #444;">Your account has been successfully created. You can now log in, view our charity partners, and choose a subscription plan when you're ready to start entering the monthly prize draws.</p>
        <a href="${APP_URL}/pricing" style="display: inline-block; background: #012d1d; color: white; padding: 14px 32px; border-radius: 999px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 16px; letter-spacing: 0.05em;">
          Explore Membership Plans →
        </a>
      `),
    });
    console.log("[Email] Welcome email sent to:", email);
  } catch (error) {
    console.error("[Email] Failed to send welcome email:", error);
  }
}
