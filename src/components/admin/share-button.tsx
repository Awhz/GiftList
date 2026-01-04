"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LinkIcon } from "lucide-react";

interface ShareButtonProps {
    slug: string;
}

export function ShareButton({ slug }: ShareButtonProps) {
    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const url = `${window.location.origin}/liste/${slug}`;

        try {
            await navigator.clipboard.writeText(url);
            toast.success("Lien copié dans le presse-papier !");
        } catch (err) {
            console.error("Failed to copy:", err);
            toast.error("Échec de la copie du lien");
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-8 hover:bg-rose-50 hover:text-rose-600 gap-2"
            onClick={handleShare}
        >
            <LinkIcon className="h-4 w-4" />
            Partager
        </Button>
    );
}
