"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { addContactSubmission } from "@/lib/store";
import { sessionToken } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  if (password && password === process.env.ADMIN_PASSWORD) {
    const store = await cookies();
    store.set("ewb_auth", sessionToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    redirect("/admin");
  }
  redirect("/login?error=1");
}

export async function logout() {
  const store = await cookies();
  store.delete("ewb_auth");
  redirect("/");
}

export type ContactState = { ok: boolean; error?: string };

// Best-effort spam throttle: max 3 submissions per IP per 10 minutes. In-memory,
// so it resets on redeploy and isn't shared across serverless instances — enough
// to blunt casual form spam without a captcha. A honeypot field ("company")
// silently drops bots that fill hidden inputs.
const RATE_LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return true;
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: real users never see or fill this field.
  if ((formData.get("company") as string)?.trim()) {
    return { ok: true };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "unknown";
  if (rateLimited(ip)) {
    return { ok: false, error: "Too many messages — please try again later or email us directly." };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in every field." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  try {
    await addContactSubmission({ name, email, message });
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Something went wrong — please email us directly." };
  }
}
