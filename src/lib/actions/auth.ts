"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/lib/auth";

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export interface AuthActionResult {
  ok: false;
  error: string;
}

export async function authenticate(
  _: AuthActionResult | undefined,
  formData: FormData
): Promise<AuthActionResult | undefined> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      senha: formData.get("senha"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "E-mail ou senha inválidos." };
    }
    throw error;
  }
}
