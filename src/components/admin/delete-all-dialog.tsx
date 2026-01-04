"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAllLists } from "@/actions/lists";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteAllDialog() {
    const [open, setOpen] = useState(false);
    const [confirmation, setConfirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (confirmation !== "SUPPRIMER") return;

        setLoading(true);
        try {
            await deleteAllLists();
            setOpen(false);
            setConfirmation("");
            router.refresh();
        } catch (error) {
            console.error("Error deleting all lists:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setConfirmation("");
        }}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                    🗑️ Tout supprimer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-red-600">⚠️ Suppression totale</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Cette action est irréversible. Toutes les listes et tous les cadeaux seront supprimés définitivement.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">
                            Pour confirmer, tapez <strong>SUPPRIMER</strong> ci-dessous :
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmation" className="sr-only">
                            Confirmation
                        </Label>
                        <Input
                            id="confirmation"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            placeholder="SUPPRIMER"
                            className="border-gray-200"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        onClick={handleDelete}
                        disabled={confirmation !== "SUPPRIMER" || loading}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        {loading ? "Suppression..." : "Confirmer la suppression"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
