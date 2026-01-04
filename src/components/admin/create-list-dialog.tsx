"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createList } from "@/actions/lists";
import { uploadImage } from "@/actions/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function CreateListDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notificationEmail, setNotificationEmail] = useState("");
    const [bannerBgColor, setBannerBgColor] = useState("#fdf2f8");
    const [bannerEmojis, setBannerEmojis] = useState("✨🎀✨");
    const [iconFile, setIconFile] = useState<File | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const preamble = formData.get("preamble") as string;
        const isPublished = formData.get("isPublished") === "on";

        try {
            let headerIconUrl: string | undefined;

            if (iconFile) {
                const uploadData = new FormData();
                uploadData.append("file", iconFile);
                headerIconUrl = await uploadImage(uploadData);
            }

            await createList({
                title,
                preamble,
                isPublished,
                notificationEmail: notificationEmail || undefined,
                bannerBgColor,
                headerIconUrl,
                bannerEmojis: bannerEmojis || undefined,
            });
            setOpen(false);
            setNotificationEmail("");
            setBannerBgColor("#fdf2f8");
            setBannerEmojis("✨🎀✨");
            setIconFile(null);
            router.refresh();
        } catch (error) {
            console.error("Error creating list:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white">
                    + Nouvelle liste
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer une nouvelle liste</DialogTitle>
                    <DialogDescription>
                        Donnez un nom à votre liste et personnalisez son apparence.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Nom de la liste *</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Ex: Noël de Léo"
                            required
                            className="border-gray-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="preamble">Description / Préambule</Label>
                        <Textarea
                            id="preamble"
                            name="preamble"
                            placeholder="Bienvenue sur ma liste de cadeaux..."
                            rows={3}
                            className="border-gray-200 resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notificationEmail">Email de notification</Label>
                        <Input
                            id="notificationEmail"
                            value={notificationEmail}
                            onChange={(e) => setNotificationEmail(e.target.value)}
                            placeholder="votre.email@exemple.com"
                            type="email"
                            className="border-gray-200"
                        />
                    </div>

                    {/* Banner Customization Section */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium text-sm text-gray-700 mb-3">🎨 Personnalisation de la bannière</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bannerBgColor">Couleur de fond</Label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        id="bannerBgColor"
                                        value={bannerBgColor}
                                        onChange={(e) => setBannerBgColor(e.target.value)}
                                        className="h-10 w-14 rounded border border-gray-200 cursor-pointer"
                                    />
                                    <Input
                                        value={bannerBgColor}
                                        onChange={(e) => setBannerBgColor(e.target.value)}
                                        className="border-gray-200 flex-1"
                                        placeholder="#fdf2f8"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bannerEmojis">Emojis décoratifs</Label>
                                <Input
                                    id="bannerEmojis"
                                    value={bannerEmojis}
                                    onChange={(e) => setBannerEmojis(e.target.value)}
                                    placeholder="✨🎀✨"
                                    className="border-gray-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mt-3">
                            <Label htmlFor="iconFile">Icône personnalisée (optionnel)</Label>
                            <Input
                                id="iconFile"
                                type="file"
                                accept="image/*"
                                className="border-gray-200"
                                onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                            />
                            <p className="text-xs text-gray-500">Remplace l&apos;icône 🎁 par défaut.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isPublished"
                            name="isPublished"
                            className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                        />
                        <Label htmlFor="isPublished" className="text-sm text-gray-600">
                            Publier immédiatement
                        </Label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600"
                        >
                            {loading ? "Création..." : "Créer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
