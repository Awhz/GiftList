import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Lists table
export const lists = sqliteTable("lists", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").unique().notNull(),
    title: text("title").notNull(),
    preamble: text("preamble"),
    headerImage: text("header_image"),
    isPublished: integer("is_published", { mode: "boolean" }).default(false),
    notificationEmail: text("notification_email"),
    // Banner customization
    bannerBgColor: text("banner_bg_color").default("#fdf2f8"),
    headerIconUrl: text("header_icon_url"),
    bannerEmojis: text("banner_emojis").default("✨🎀✨"),
    createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Items table
export const items = sqliteTable("items", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    listId: integer("list_id")
        .notNull()
        .references(() => lists.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    url: text("url"),
    imageUrl: text("image_url"),
    price: real("price"),
    description: text("description"),
    isReserved: integer("is_reserved", { mode: "boolean" }).default(false),
    reservedBy: text("reserved_by"),
    // Contribution pool (cagnotte) fields
    isContribution: integer("is_contribution", { mode: "boolean" }).default(false),
    targetAmount: real("target_amount"), // Goal amount for the cagnotte
    currentAmount: real("current_amount").default(0), // Total contributed so far
    contributions: text("contributions"), // JSON array of {name, amount, date}
    createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

// Types
export type List = typeof lists.$inferSelect;
export type NewList = typeof lists.$inferInsert;
export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
