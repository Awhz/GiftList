import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/actions/auth";
import { getListById, updateList, deleteList } from "@/actions/lists";
import { getItemsByListId } from "@/actions/items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddItemForm } from "@/components/admin/add-item-form";
import { ItemCard } from "@/components/admin/item-card";
import { EditListDialog } from "@/components/admin/edit-list-dialog";
import { DeleteListButton } from "@/components/admin/delete-list-button";
import { StatsPanel } from "@/components/admin/stats-panel";
import { ContributionsTable } from "@/components/admin/contributions-table";

interface ListDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ListDetailPage({ params }: ListDetailPageProps) {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        redirect("/admin/login");
    }

    const resolvedParams = await params;
    const listId = parseInt(resolvedParams.id);
    if (isNaN(listId)) {
        notFound();
    }

    const list = await getListById(listId);
    if (!list) {
        notFound();
    }

    const items = await getItemsByListId(listId);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
                <Link
                    href="/admin"
                    className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                >
                    ← Retour au dashboard
                </Link>
            </nav>

            {/* List Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{list.title}</h1>
                        <Badge
                            variant={list.isPublished ? "default" : "secondary"}
                            className={
                                list.isPublished
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                            }
                        >
                            {list.isPublished ? "Publié" : "Brouillon"}
                        </Badge>
                    </div>
                    {list.preamble && (
                        <p className="text-gray-600 max-w-2xl">{list.preamble}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                        <span>URL publique:</span>
                        <code className="bg-gray-100 px-2 py-0.5 rounded">/liste/{list.slug}</code>
                        <Link
                            href={`/liste/${list.slug}`}
                            target="_blank"
                            className="text-rose-500 hover:text-rose-600"
                        >
                            Voir →
                        </Link>
                    </div>
                </div>
                <div className="flex gap-3">
                    <EditListDialog list={list} />
                    <DeleteListButton listId={list.id} />
                </div>
            </div>

            {/* Stats Panel */}
            <StatsPanel items={items} />

            {/* Content Tabs area - separating Items and Journal */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content: Items (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Add Item Form */}
                    <Card className="mb-8 border-0 bg-white/80 backdrop-blur-sm shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Ajouter un cadeau</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AddItemForm listId={list.id} />
                        </CardContent>
                    </Card>

                    {/* Items Grid */}
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Cadeaux ({items.length})
                        </h2>
                    </div>

                    {items.length === 0 ? (
                        <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <span className="text-4xl mb-4">🎀</span>
                                <p className="text-gray-500 text-center">
                                    Aucun cadeau dans cette liste.
                                    <br />
                                    Utilisez le formulaire ci-dessus pour en ajouter.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => (
                                <ItemCard key={item.id} item={item} isAdmin />
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: Journal (1/3 width) */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Journal des contributions
                        </h2>
                        <ContributionsTable items={items} />
                    </div>
                </div>
            </div>
        </div>
    );
}
