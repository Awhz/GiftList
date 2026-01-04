"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addItem } from "@/actions/items";
import { scrapeProductMetadata } from "@/actions/scrape";
import { uploadImage } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddItemFormProps {
    listId: number;
}

export function AddItemForm({ listId }: AddItemFormProps) {
    const [loading, setLoading] = useState(false);
    const [scraping, setScraping] = useState(false);
    const [url, setUrl] = useState("");
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [isContribution, setIsContribution] = useState(false);
    const [targetAmount, setTargetAmount] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();

    const handleScrape = async () => {
        if (!url) return;

        setScraping(true);
        try {
            const metadata = await scrapeProductMetadata(url);
            if (metadata.title) setName(metadata.title);
            if (metadata.imageUrl) setImageUrl(metadata.imageUrl);
            if (metadata.description) setDescription(metadata.description);
            if (metadata.price) {
                const numericPrice = metadata.price.replace(/[^0-9.,]/g, "").replace(",", ".");
                setPrice(numericPrice);
            }
        } catch (error) {
            console.error("Error scraping:", error);
        } finally {
            setScraping(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        setLoading(true);
        try {
            let finalImageUrl = imageUrl;

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                finalImageUrl = await uploadImage(formData);
            }

            await addItem({
                listId,
                name,
                url: url || undefined,
                imageUrl: finalImageUrl || undefined,
                price: price ? parseFloat(price) : undefined,
                description: description || undefined,
                isContribution,
                targetAmount: isContribution && targetAmount ? parseFloat(targetAmount) : undefined,
            });
            // Reset form
            setUrl("");
            setName("");
            setImageUrl("");
            setPrice("");
            setDescription("");
            setIsContribution(false);
            setTargetAmount("");
            setFile(null);
            router.refresh();
        } catch (error) {
            console.error("Error adding item:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* URL Row with Auto-fill */}
            <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                    <Label htmlFor="url">URL du produit</Label>
                    <Input
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.amazon.fr/..."
                        type="url"
                        className="border-gray-200"
                    />
                </div>
                <div className="flex items-end">
                    <Button
                        type="button"
                        onClick={handleScrape}
                        disabled={!url || scraping}
                        variant="outline"
                        className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                        {scraping ? "⏳ Chargement..." : "✨ Auto-remplir"}
                    </Button>
                </div>
            </div>

            {/* Main Fields */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Nom du cadeau *</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: LEGO Star Wars"
                        required
                        className="border-gray-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="49.99"
                        type="number"
                        step="0.01"
                        min="0"
                        className="border-gray-200"
                    />
                </div>
            </div>

            <div className="space-y-4 border rounded-lg p-4 bg-gray-50/50 block">
                <div className="space-y-2">
                    <Label htmlFor="imageFile">Image personnalisée (Upload)</Label>
                    <Input
                        id="imageFile"
                        type="file"
                        accept="image/*"
                        className="border-gray-200"
                        onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setFile(f);
                        }}
                    />
                    <p className="text-xs text-gray-500">Remplace l&apos;image de l&apos;URL si renseignée.</p>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-gray-50 px-2 text-muted-foreground">OU</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="imageUrl">URL de l&apos;image</Label>
                    <Input
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        type="url"
                        className="border-gray-200"
                        disabled={!!file}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description courte du produit..."
                    rows={2}
                    className="border-gray-200 resize-none"
                />
            </div>

            {/* Cagnotte Toggle */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isContribution"
                        checked={isContribution}
                        onChange={(e) => setIsContribution(e.target.checked)}
                        className="rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                    />
                    <Label htmlFor="isContribution" className="text-amber-800 font-medium">
                        💰 Cagnotte / Participation
                    </Label>
                </div>
                {isContribution && (
                    <div className="pl-6 space-y-2">
                        <p className="text-sm text-amber-700">
                            Les visiteurs pourront participer avec le montant de leur choix.
                        </p>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="targetAmount" className="text-sm text-amber-700">
                                Objectif (€) :
                            </Label>
                            <Input
                                id="targetAmount"
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                placeholder={price || "100"}
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-32 border-amber-200"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Preview */}
            {imageUrl && (
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <img
                        src={imageUrl}
                        alt="Aperçu"
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <span className="text-sm text-gray-600">Aperçu de l&apos;image</span>
                </div>
            )}

            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={loading || !name}
                    className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600"
                >
                    {loading ? "Ajout en cours..." : "Ajouter le cadeau"}
                </Button>
            </div>
        </form>
    );
}
