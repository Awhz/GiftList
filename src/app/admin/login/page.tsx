"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
    const [state, formAction, pending] = useActionState(login, { error: null });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
            <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-rose-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-3xl">🎁</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">Administration</CardTitle>
                    <CardDescription className="text-gray-600">
                        Connectez-vous pour gérer vos listes de cadeaux
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                placeholder="admin"
                                required
                                className="border-gray-200 focus:border-rose-400 focus:ring-rose-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="border-gray-200 focus:border-rose-400 focus:ring-rose-400"
                            />
                        </div>
                        {state?.error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {state.error}
                            </div>
                        )}
                        <Button
                            type="submit"
                            disabled={pending}
                            className="w-full bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white font-medium"
                        >
                            {pending ? "Connexion..." : "Se connecter"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
