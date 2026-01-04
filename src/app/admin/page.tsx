import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/actions/auth";
import { getLists, deleteList, deleteAllLists } from "@/actions/lists";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateListDialog } from "@/components/admin/create-list-dialog";
import { DeleteAllDialog } from "@/components/admin/delete-all-dialog";
import { ShareButton } from "@/components/admin/share-button";

export default async function AdminDashboard() {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        redirect("/admin/login");
    }

    const lists = await getLists();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Gérez vos listes de cadeaux</p>
                </div>
                <div className="flex gap-3">
                    <DeleteAllDialog />
                    <CreateListDialog />
                </div>
            </div>

            {/* Lists Grid */}
            {lists.length === 0 ? (
                <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                            <span className="text-4xl">🎁</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune liste</h3>
                        <p className="text-gray-500 mb-6 text-center max-w-md">
                            Créez votre première liste de cadeaux pour commencer
                        </p>
                        <CreateListDialog />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {lists.map((list) => (
                        <Link key={list.id} href={`/admin/lists/${list.id}`}>
                            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:scale-[1.02]">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                                            {list.title}
                                        </CardTitle>
                                        <Badge
                                            variant={list.isPublished ? "default" : "secondary"}
                                            className={
                                                list.isPublished
                                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                                    : "bg-gray-100 text-gray-600"
                                            }
                                        >
                                            {list.isPublished ? "Publié" : "Brouillon"}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-gray-500 line-clamp-2">
                                        {list.preamble || "Pas de description"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <span>🔗</span>
                                            <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                /liste/{list.slug}
                                            </code>
                                        </span>
                                        <ShareButton slug={list.slug} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
