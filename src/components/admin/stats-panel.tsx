import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Item } from "@/db/schema";
import { Euro, Gift, CheckCircle } from "lucide-react";

interface StatsPanelProps {
    items: Item[];
}

export function StatsPanel({ items }: StatsPanelProps) {
    const totalItems = items.length;
    const reservedItems = items.filter((i) => i.isReserved).length;
    const progress = totalItems > 0 ? (reservedItems / totalItems) * 100 : 0;

    // Calculate total value of reserved items
    const totalReservedValue = items
        .filter((i) => i.isReserved)
        .reduce((sum, item) => sum + (item.currentAmount || item.price || 0), 0);

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Progression</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {reservedItems} / {totalItems}
                    </div>
                    <p className="text-xs text-muted-foreground">cadeaux réservés</p>
                    <div className="h-2 w-full bg-gray-100 mt-3 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valeur Offerte</CardTitle>
                    <Euro className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {totalReservedValue.toLocaleString("fr-FR", {
                            style: "currency",
                            currency: "EUR"
                        })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        montant total estimé des cadeaux pris
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cadeaux</CardTitle>
                    <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalItems}</div>
                    <p className="text-xs text-muted-foreground">
                        articles dans la liste
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
