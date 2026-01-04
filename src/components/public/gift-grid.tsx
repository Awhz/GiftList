"use client";

import { useState } from "react";
import type { Item } from "@/db/schema";
import { GiftCard } from "./gift-card";
import { ReservationModal } from "./reservation-modal";

interface GiftGridProps {
    items: Item[];
    listSlug: string;
}

export function GiftGrid({ items, listSlug }: GiftGridProps) {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "RESERVED">("ALL");

    const filteredItems = items.filter((item) => {
        if (filter === "AVAILABLE") return !item.isReserved;
        if (filter === "RESERVED") return item.isReserved;
        return true;
    });

    const stats = {
        all: items.length,
        available: items.filter((i) => !i.isReserved).length,
        reserved: items.filter((i) => i.isReserved).length,
    };

    return (
        <div className="space-y-8">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <button
                    onClick={() => setFilter("ALL")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "ALL"
                        ? "bg-rose-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    Tout ({stats.all})
                </button>
                <button
                    onClick={() => setFilter("AVAILABLE")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "AVAILABLE"
                        ? "bg-rose-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    Disponibles ({stats.available})
                </button>
                <button
                    onClick={() => setFilter("RESERVED")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "RESERVED"
                        ? "bg-rose-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                >
                    Déjà offerts ({stats.reserved})
                </button>
            </div>

            {/* Grid */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-16 bg-white/50 rounded-2xl border border-dashed border-gray-200">
                    <span className="text-4xl block mb-4">🔍</span>
                    <p className="text-gray-500">Aucun cadeau ne correspond à ce filtre.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredItems.map((item) => (
                        <GiftCard
                            key={item.id}
                            item={item}
                            // Only allow reservation callback if item is not reserved
                            onReserve={!item.isReserved ? () => setSelectedItem(item) : undefined}
                        />
                    ))}
                </div>
            )}

            {/* Reservation Modal */}
            {selectedItem && (
                <ReservationModal
                    item={selectedItem}
                    listSlug={listSlug}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    );
}
