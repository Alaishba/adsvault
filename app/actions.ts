"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function revalidate(path: string) {
  revalidatePath(path);
}

export async function setAdminCookie() {
  cookies().set("advault_admin", "true", {
    maxAge: 604800, // 7 days
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });
}

export async function clearAdminCookie() {
  cookies().delete("advault_admin");
}
