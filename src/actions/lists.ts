"use server";

import { db } from "@/db";
import { lists, type NewList, type List } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function getLists(): Promise<List[]> {
    return await db.select().from(lists).orderBy(lists.createdAt);
}

export async function getPublishedLists(): Promise<List[]> {
    return await db.select().from(lists).where(eq(lists.isPublished, true)).orderBy(lists.createdAt);
}

export async function getListBySlug(slug: string): Promise<List | undefined> {
    const result = await db.select().from(lists).where(eq(lists.slug, slug)).limit(1);
    return result[0];
}

export async function getListById(id: number): Promise<List | undefined> {
    const result = await db.select().from(lists).where(eq(lists.id, id)).limit(1);
    return result[0];
}

export async function createList(data: {
    title: string;
    preamble?: string;
    headerImage?: string;
    notificationEmail?: string;
    bannerBgColor?: string;
    headerIconUrl?: string;
    bannerEmojis?: string;
    isPublished?: boolean;
}): Promise<List> {
    const slug = generateSlug(data.title);
    const newList: NewList = {
        slug,
        title: data.title,
        preamble: data.preamble || null,
        headerImage: data.headerImage || null,
        notificationEmail: data.notificationEmail || null,
        bannerBgColor: data.bannerBgColor || "#fdf2f8",
        headerIconUrl: data.headerIconUrl || null,
        bannerEmojis: data.bannerEmojis ?? "✨🎀✨",
        isPublished: data.isPublished ?? false,
    };

    const result = await db.insert(lists).values(newList).returning();
    revalidatePath("/admin");
    return result[0];
}

export async function updateList(
    id: number,
    data: Partial<{
        title: string;
        slug: string;
        preamble: string;
        headerImage: string;
        notificationEmail: string;
        bannerBgColor: string;
        headerIconUrl: string;
        bannerEmojis: string;
        isPublished: boolean;
    }>
): Promise<List | undefined> {
    // If title is being updated, regenerate the slug
    const updates: Record<string, unknown> = { ...data };
    if (data.title && !data.slug) {
        updates.slug = generateSlug(data.title);
    }

    const result = await db.update(lists).set(updates).where(eq(lists.id, id)).returning();
    revalidatePath("/admin");
    revalidatePath(`/liste/${result[0]?.slug}`);
    return result[0];
}

export async function deleteList(id: number): Promise<void> {
    await db.delete(lists).where(eq(lists.id, id));
    revalidatePath("/admin");
}

export async function deleteAllLists(): Promise<void> {
    await db.delete(lists);
    revalidatePath("/admin");
}
