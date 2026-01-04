"use server";

import { db } from "@/db";
import { items, type NewItem, type Item } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getItemsByListId(listId: number): Promise<Item[]> {
    return await db.select().from(items).where(eq(items.listId, listId)).orderBy(items.createdAt);
}

export async function getItemById(id: number): Promise<Item | undefined> {
    const result = await db.select().from(items).where(eq(items.id, id)).limit(1);
    return result[0];
}

export async function addItem(data: {
    listId: number;
    name: string;
    url?: string;
    imageUrl?: string;
    price?: number;
    description?: string;
    isContribution?: boolean;
    targetAmount?: number;
}): Promise<Item> {
    const newItem: NewItem = {
        listId: data.listId,
        name: data.name,
        url: data.url || null,
        imageUrl: data.imageUrl || null,
        price: data.price ?? null,
        description: data.description || null,
        isReserved: false,
        reservedBy: null,
        isContribution: data.isContribution ?? false,
        targetAmount: data.isContribution ? (data.targetAmount ?? data.price ?? null) : null,
        currentAmount: 0,
        contributions: null,
    };

    const result = await db.insert(items).values(newItem).returning();
    revalidatePath(`/admin/lists/${data.listId}`);
    return result[0];
}

export async function updateItem(
    id: number,
    data: Partial<{
        name: string;
        url: string;
        imageUrl: string;
        price: number;
        description: string;
    }>
): Promise<Item | undefined> {
    const result = await db.update(items).set(data).where(eq(items.id, id)).returning();
    if (result[0]) {
        revalidatePath(`/admin/lists/${result[0].listId}`);
    }
    return result[0];
}

export async function deleteItem(id: number): Promise<void> {
    const item = await getItemById(id);
    await db.delete(items).where(eq(items.id, id));
    if (item) {
        revalidatePath(`/admin/lists/${item.listId}`);
    }
}

export async function reserveItem(
    id: number,
    reservedBy?: string
): Promise<Item | undefined> {
    const result = await db
        .update(items)
        .set({
            isReserved: true,
            reservedBy: reservedBy?.trim() || "Anonyme",
        })
        .where(eq(items.id, id))
        .returning();

    // Send notification if configured
    try {
        const item = result[0];
        if (item) {
            const list = await db.query.lists.findFirst({
                where: (lists, { eq }) => eq(lists.id, item.listId),
            });

            if (list?.notificationEmail) {
                const { sendReservationEmail } = await import("@/lib/mail");
                await sendReservationEmail({
                    to: list.notificationEmail,
                    giftName: item.name,
                    giverName: item.reservedBy || "Anonyme",
                    listTitle: list.title,
                    listUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/lists/${list.id}`,
                });
            }
        }
    } catch (e) {
        // Silent error for notifications
        console.error("Notification error:", e);
    }

    return result[0];
}

export async function unreserveItem(id: number): Promise<Item | undefined> {
    const result = await db
        .update(items)
        .set({
            isReserved: false,
            reservedBy: null,
        })
        .where(eq(items.id, id))
        .returning();

    return result[0];
}

// Contribution type
export interface Contribution {
    name: string;
    amount: number;
    date: string;
}

export async function contributeToItem(
    id: number,
    amount: number,
    contributorName?: string
): Promise<Item | undefined> {
    const item = await getItemById(id);
    if (!item || !item.isContribution) {
        return undefined;
    }

    // Parse existing contributions
    const existingContributions: Contribution[] = item.contributions
        ? JSON.parse(item.contributions)
        : [];

    // Add new contribution
    const newContribution: Contribution = {
        name: contributorName?.trim() || "Anonyme",
        amount,
        date: new Date().toISOString(),
    };
    existingContributions.push(newContribution);

    // Calculate new total
    const newTotal = (item.currentAmount || 0) + amount;

    // Check if goal is reached
    const isFullyFunded = item.targetAmount ? newTotal >= item.targetAmount : false;

    const result = await db
        .update(items)
        .set({
            currentAmount: newTotal,
            contributions: JSON.stringify(existingContributions),
            isReserved: isFullyFunded,
            reservedBy: isFullyFunded ? "Objectif atteint" : null,
        })
        .where(eq(items.id, id))
        .returning();

    // Send notification if configured
    try {
        const updatedItem = result[0];
        if (updatedItem) {
            const list = await db.query.lists.findFirst({
                where: (lists, { eq }) => eq(lists.id, updatedItem.listId),
            });

            if (list?.notificationEmail) {
                const { sendReservationEmail } = await import("@/lib/mail");
                await sendReservationEmail({
                    to: list.notificationEmail,
                    giftName: updatedItem.name,
                    giverName: contributorName?.trim() || "Anonyme",
                    listTitle: list.title,
                    listUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/lists/${list.id}`,
                });
            }
        }
    } catch (e) {
        console.error("Notification error:", e);
    }

    return result[0];
}

