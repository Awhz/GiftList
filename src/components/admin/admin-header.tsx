"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/admin/login");
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-purple-500 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🎁</span>
                        </div>
                        <span className="font-bold text-xl text-gray-800">Mes Listes</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                                Dashboard
                            </Button>
                        </Link>
                        <form action={handleLogout}>
                            <Button
                                type="submit"
                                variant="outline"
                                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                            >
                                Déconnexion
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </header>
    );
}
