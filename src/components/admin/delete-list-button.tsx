"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteList } from "@/actions/lists";
import { Button } from "@/components/ui/button";

interface DeleteListButtonProps {
    listId: number;
}

export function DeleteListButton({ listId }: DeleteListButtonProps) {
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette liste et tous ses cadeaux ?")) {
            return;
        }

        setDeleting(true);
        try {
            await deleteList(listId);
            router.push("/admin");
        } catch (error) {
            console.error("Error deleting list:", error);
            setDeleting(false);
        }
    };

    return (
        <Button
            variant="outline"
            onClick={handleDelete}
            disabled={deleting}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
        >
            {deleting ? "Suppression..." : "🗑️ Supprimer"}
        </Button>
    );
}
