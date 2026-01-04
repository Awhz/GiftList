"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { List } from "@/db/schema";
import { updateList } from "@/actions/lists";
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

interface EditListDialogProps {
    list: List;
}

export function EditListDialog({ list }: EditListDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState(list.title);
    const [preamble, setPreamble] = useState(list.preamble || "");
    const [notificationEmail, setNotificationEmail] = useState(list.notificationEmail || "");
    const [isPublished, setIsPublished] = useState(list.isPublished || false);
    const [bannerBgColor, setBannerBgColor] = useState(list.bannerBgColor || "#fdf2f8");
    const [bannerEmojis, setBannerEmojis] = useState(list.bannerEmojis || "✨🎀✨");
    const [iconFile, setIconFile] = useState<File | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let headerIconUrl: string | undefined = list.headerIconUrl || undefined;

            if (iconFile) {
                const uploadData = new FormData();
                uploadData.append("file", iconFile);
                headerIconUrl = await uploadImage(uploadData);
            }

            await updateList(list.id, {
                title,
                preamble,
                isPublished,
                notificationEmail: notificationEmail || undefined,
                bannerBgColor,
                headerIconUrl,
                bannerEmojis,
            });
            setOpen(false);
            router.refresh();
        } catch (error) {
            console.error("Error updating list:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-200">
                    ✏️ Modifier
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Modifier la liste</DialogTitle>
                    <DialogDescription>
                        Mettez à jour les informations et l&apos;apparence de votre liste.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-title">Nom de la liste *</Label>
                        <Input
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border-gray-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-preamble">Description / Préambule</Label>
                        <Textarea
                            id="edit-preamble"
                            value={preamble}
                            onChange={(e) => setPreamble(e.target.value)}
                            rows={3}
                            className="border-gray-200 resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-notificationEmail">Email de notification</Label>
                        <Input
                            id="edit-notificationEmail"
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
                                <Label htmlFor="edit-bannerBgColor">Couleur de fond</Label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        id="edit-bannerBgColor"
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
                                <Label htmlFor="edit-bannerEmojis">Emojis décoratifs</Label>
                                <Input
                                    id="edit-bannerEmojis"
                                    value={bannerEmojis}
                                    onChange={(e) => setBannerEmojis(e.target.value)}
                                    placeholder="✨🎀✨"
                                    className="border-gray-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mt-3">
                            <Label htmlFor="edit-iconFile">Icône personnalisée</Label>
                            <Input
                                id="edit-iconFile"
                                type="file"
                                accept="image/*"
                                className="border-gray-200"
                                onChange={(e) => setIconFile(e.target.files?.[0] || null)}
                            />
                            {list.headerIconUrl && (
                                <p className="text-xs text-gray-500">
                                    Icône actuelle : <a href={list.headerIconUrl} target="_blank" className="text-rose-500 underline">Voir</a>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="edit-isPublished"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                        />
                        <Label htmlFor="edit-isPublished" className="text-sm text-gray-600">
                            Liste publiée (visible publiquement)
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
                            {loading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
