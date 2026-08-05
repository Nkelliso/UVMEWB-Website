"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { addContactSubmission } from "@/lib/store";

export async function login(formData: FormData) {
  const password = formData.get("password") as string;
  if (password && password === process.env.ADMIN_PASSWORD) {
    const store = await cookies();
    store.set("ewb_auth", "1", {
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

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in every field." };
  }
  try {
    await addContactSubmission({ name, email, message });
    return { ok: true };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Something went wrong — please email us directly." };
  }
}
