import { notFound } from "next/navigation";
import { getListBySlug } from "@/actions/lists";
import { getItemsByListId } from "@/actions/items";
import { PublicHeader } from "@/components/public/public-header";
import { GiftGrid } from "@/components/public/gift-grid";

interface PublicListPageProps {
    params: Promise<{ slug: string }>;
}

export default async function PublicListPage({ params }: PublicListPageProps) {
    const resolvedParams = await params;
    const list = await getListBySlug(resolvedParams.slug);

    if (!list || !list.isPublished) {
        notFound();
    }

    const items = await getItemsByListId(list.id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
            <PublicHeader list={list} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="text-5xl">🎁</span>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                            Aucun cadeau pour le moment
                        </h2>
                        <p className="text-gray-500">
                            La liste est en cours de préparation, revenez bientôt !
                        </p>
                    </div>
                ) : (
                    <GiftGrid items={items} listSlug={list.slug} />
                )}
            </main>

            <footer className="text-center py-8 text-gray-400 text-sm">
                <p>Fait avec ❤️ pour les listes de cadeaux</p>
            </footer>
        </div>
    );
}
