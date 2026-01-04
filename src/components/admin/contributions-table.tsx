import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Item } from "@/db/schema";
import { Badge } from "@/components/ui/badge";

interface ContributionsTableProps {
    items: Item[];
}

export function ContributionsTable({ items }: ContributionsTableProps) {
    const reservedItems = items.filter(
        (i) => i.isReserved || (i.contributions && i.contributions !== "[]")
    );

    if (reservedItems.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                Aucune contribution pour le moment.
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Cadeau</TableHead>
                        <TableHead>Offert par</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reservedItems.map((item) => {
                        // Handle contributions (cagnotte)
                        if (item.contributions) {
                            const contribs = JSON.parse(item.contributions);
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            return contribs.map((c: any, idx: number) => (
                                <TableRow key={`${item.id}-c-${idx}`}>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell>{c.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                            Participation
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {c.amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
                                    </TableCell>
                                </TableRow>
                            ));
                        }

                        // Handle standard reservation
                        return (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell>{item.reservedBy}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Réservation
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.price
                                        ? item.price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })
                                        : "-"}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
