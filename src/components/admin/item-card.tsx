"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/db/schema";
import { deleteItem, unreserveItem } from "@/actions/items";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ItemCardProps {
    item: Item;
    isAdmin?: boolean;
    onReserve?: () => void;
}

export function ItemCard({ item, isAdmin = false, onReserve }: ItemCardProps) {
    const [deleting, setDeleting] = useState(false);
    const [unreserving, setUnreserving] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Supprimer ce cadeau ?")) return;
        setDeleting(true);
        try {
            await deleteItem(item.id);
            router.refresh();
        } catch (error) {
            console.error("Error deleting item:", error);
        } finally {
            setDeleting(false);
        }
    };

    const handleUnreserve = async () => {
        setUnreserving(true);
        try {
            await unreserveItem(item.id);
            router.refresh();
        } catch (error) {
            console.error("Error unreserving item:", error);
        } finally {
            setUnreserving(false);
        }
    };

    return (
        <Card
            className={`group border-0 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md ${item.isReserved ? "opacity-75" : ""
                }`}
        >
            <CardContent className="p-4">
                {/* Image */}
                {item.imageUrl ? (
                    <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext fill='%239ca3af' font-size='40' x='50%25' y='50%25' text-anchor='middle' dy='.35em'%3E🎁%3C/text%3E%3C/svg%3E";
                            }}
                        />
                        {item.isReserved && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Badge className="bg-rose-500 text-white text-sm px-3 py-1">
                                    Réservé
                                </Badge>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="aspect-square mb-3 rounded-lg bg-gradient-to-br from-rose-50 to-purple-50 flex items-center justify-center">
                        <span className="text-4xl">{item.isReserved ? "✓" : "🎁"}</span>
                    </div>
                )}

                {/* Content */}
                <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1">
                    {item.name}
                </h3>

                {item.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                        {item.description}
                    </p>
                )}

                {item.price && (
                    <p className="text-lg font-bold text-rose-600 mb-2">
                        {item.price.toFixed(2)} €
                    </p>
                )}

                {item.isReserved && item.reservedBy && (
                    <p className="text-sm text-gray-500 mb-2">
                        Offert par <span className="font-medium">{item.reservedBy}</span>
                    </p>
                )}

                {/* Admin Actions */}
                {isAdmin && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:text-blue-600"
                            >
                                Voir le produit →
                            </a>
                        )}
                        <div className="flex-1" />
                        {item.isReserved && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleUnreserve}
                                disabled={unreserving}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                {unreserving ? "..." : "Annuler réservation"}
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            {deleting ? "..." : "Supprimer"}
                        </Button>
                    </div>
                )}

                {/* Public Reserve Button */}
                {!isAdmin && !item.isReserved && onReserve && (
                    <Button
                        onClick={onReserve}
                        className="w-full mt-3 bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white"
                    >
                        🎁 Offrir ce cadeau
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
