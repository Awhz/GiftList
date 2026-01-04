import type { Item } from "@/db/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GiftCardProps {
    item: Item;
    onReserve?: () => void;
}

export function GiftCard({ item, onReserve }: GiftCardProps) {
    const isContribution = item.isContribution;
    const progress = isContribution && item.targetAmount
        ? Math.min(100, ((item.currentAmount || 0) / item.targetAmount) * 100)
        : 0;

    return (
        <Card
            className={`group border-0 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${item.isReserved ? "opacity-70" : ""
                }`}
        >
            <CardContent className="p-0">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gradient-to-br from-rose-50 to-purple-50">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23fdf2f8' width='100' height='100'/%3E%3Ctext fill='%23f472b6' font-size='40' x='50%25' y='50%25' text-anchor='middle' dy='.35em'%3E🎁%3C/text%3E%3C/svg%3E";
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl">{isContribution ? "💰" : "🎁"}</span>
                        </div>
                    )}

                    {/* Contribution Badge */}
                    {isContribution && !item.isReserved && (
                        <div className="absolute top-3 left-3">
                            <Badge className="bg-amber-500 text-white text-xs px-2 py-1 shadow-md">
                                💰 Cagnotte
                            </Badge>
                        </div>
                    )}

                    {/* Reserved Badge */}
                    {item.isReserved && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Badge className="bg-green-500 text-white text-base px-4 py-2 shadow-lg">
                                {isContribution ? "✓ Objectif atteint" : "✓ Offert"}
                            </Badge>
                        </div>
                    )}

                    {/* Price Tag (for non-contribution items) */}
                    {item.price && !item.isReserved && !isContribution && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-white/90 text-rose-600 font-bold text-sm px-3 py-1 shadow-md">
                                {item.price.toFixed(2)} €
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-gray-800 line-clamp-2 mb-1 group-hover:text-rose-600 transition-colors">
                        {item.name}
                    </h3>

                    {item.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                            {item.description}
                        </p>
                    )}

                    {/* Contribution Progress */}
                    {isContribution && item.targetAmount && !item.isReserved && (
                        <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-amber-700 font-medium">
                                    {(item.currentAmount || 0).toFixed(2)} €
                                </span>
                                <span className="text-gray-500">
                                    / {item.targetAmount.toFixed(2)} €
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {Math.round(progress)}% de l&apos;objectif
                            </p>
                        </div>
                    )}

                    {item.isReserved ? (
                        <p className="text-sm text-green-600 font-medium">
                            {isContribution ? "Objectif atteint ! 🎉" : `Offert par ${item.reservedBy || "Anonyme"}`}
                        </p>
                    ) : (
                        onReserve && (
                            <Button
                                onClick={onReserve}
                                className={`w-full font-medium shadow-md hover:shadow-lg transition-all ${isContribution
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                        : "bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600"
                                    } text-white`}
                            >
                                {isContribution ? "💰 Participer" : "🎁 Offrir ce cadeau"}
                            </Button>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
