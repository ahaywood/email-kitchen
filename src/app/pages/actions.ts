"use server";

import { Resend } from "resend";
import { env } from "cloudflare:workers";
import { Constants } from "../shared/constants";
import WelcomeEmail from "@/app/email/WelcomeEmail";

export async function sendWelcomeEmail(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    console.error("❌ Email is required");
    return { error: "Email is required", success: false };
  }

  const resend = new Resend(env.RESEND_API);
  const { data, error } = await resend.emails.send({
    from: Constants.FORM_EMAIL,
    to: email,
    subject: "👋 Welcome",
    react: WelcomeEmail({ name: email }),
  });

  if (error) {
    console.error("❌ Error sending email", error);
    return { error: error.message, success: false };
  }

  console.log("📥 Email sent successfully", data);
  return { success: true, error: null };
}
