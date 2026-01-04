"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Item } from "@/db/schema";
import { reserveItem, contributeToItem } from "@/actions/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface ReservationModalProps {
    item: Item;
    listSlug: string;
    onClose: () => void;
}

export function ReservationModal({ item, listSlug, onClose }: ReservationModalProps) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const isContribution = item.isContribution;
    const remaining = item.targetAmount ? item.targetAmount - (item.currentAmount || 0) : 0;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (isContribution) {
                const contributionAmount = parseFloat(amount);
                if (!contributionAmount || contributionAmount <= 0) {
                    setLoading(false);
                    return;
                }
                await contributeToItem(item.id, contributionAmount, name || undefined);
            } else {
                await reserveItem(item.id, name || undefined);
            }
            setSuccess(true);
            setTimeout(() => {
                onClose();
                router.refresh();
            }, 2000);
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Dialog open onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md text-center">
                    <div className="py-8">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isContribution
                            ? "bg-gradient-to-br from-amber-100 to-orange-100"
                            : "bg-gradient-to-br from-green-100 to-emerald-100"
                            }`}>
                            <span className="text-4xl">{isContribution ? "💰" : "✓"}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Merci beaucoup ! 🎉
                        </h2>
                        <p className="text-gray-600">
                            {isContribution
                                ? `Votre participation de ${parseFloat(amount).toFixed(2)} € a été enregistrée.`
                                : `Le cadeau "${item.name}" a été réservé avec succès.`
                            }
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {isContribution ? "💰 Participer à la cagnotte" : "🎁 Offrir ce cadeau"}
                    </DialogTitle>
                    <DialogDescription>
                        {isContribution
                            ? "Choisissez le montant de votre participation."
                            : "Vous vous apprêtez à réserver ce cadeau pour l'offrir."
                        }
                    </DialogDescription>
                </DialogHeader>

                {/* Item Preview */}
                <div className="flex gap-4 p-4 bg-gray-50 rounded-lg my-4">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                    ) : (
                        <div className={`w-20 h-20 rounded-lg flex items-center justify-center ${isContribution
                            ? "bg-gradient-to-br from-amber-50 to-orange-50"
                            : "bg-gradient-to-br from-rose-50 to-purple-50"
                            }`}>
                            <span className="text-3xl">{isContribution ? "💰" : "🎁"}</span>
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        {isContribution && item.targetAmount ? (
                            <div className="text-sm">
                                <p className="text-amber-600 font-medium">
                                    {(item.currentAmount || 0).toFixed(2)} € / {item.targetAmount.toFixed(2)} €
                                </p>
                                <p className="text-gray-500">
                                    Reste {remaining.toFixed(2)} € pour atteindre l&apos;objectif
                                </p>
                            </div>
                        ) : item.price ? (
                            <p className="text-rose-600 font-bold">{item.price.toFixed(2)} €</p>
                        ) : null}
                        {item.url && (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:text-blue-600 inline-flex items-center gap-1 mt-1"
                            >
                                Voir le produit →
                            </a>
                        )}
                    </div>
                </div>

                {/* Contribution Amount Input */}
                {isContribution && (
                    <div className="space-y-2">
                        <Label htmlFor="amount">Montant de votre participation (€) *</Label>
                        <Input
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Ex: 20"
                            type="number"
                            step="0.01"
                            min="1"
                            className="border-amber-200 focus:border-amber-400"
                        />
                        <div className="flex gap-2 flex-wrap">
                            {[10, 20, 50, remaining > 0 ? Math.min(remaining, 100) : 100].map((preset) => (
                                <Button
                                    key={preset}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAmount(preset.toString())}
                                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                                >
                                    {preset} €
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Name Input */}
                <div className="space-y-2">
                    <Label htmlFor="reserverName">Votre nom (optionnel)</Label>
                    <Input
                        id="reserverName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Marie"
                        className="border-gray-200"
                    />
                    <p className="text-xs text-gray-500">
                        Si vous ne renseignez pas votre nom, vous apparaîtrez comme &quot;Anonyme&quot;.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || (!!isContribution && (!amount || parseFloat(amount) <= 0))}
                        className={`${isContribution
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            : "bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600"
                            }`}
                    >
                        {loading
                            ? (isContribution ? "Envoi..." : "Réservation...")
                            : (isContribution ? "✓ Confirmer ma participation" : "✓ Confirmer la réservation")
                        }
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
