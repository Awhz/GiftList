"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
const SESSION_COOKIE_NAME = "admin_session";
const SESSION_VALUE = "authenticated";

export async function login(
    _prevState: { error: string | null },
    formData: FormData
): Promise<{ error: string | null }> {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set(SESSION_COOKIE_NAME, SESSION_VALUE, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        redirect("/admin");
    }

    return { error: "Identifiants incorrects" };
}

export async function logout(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
    redirect("/admin/login");
}

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    return session?.value === SESSION_VALUE;
}
