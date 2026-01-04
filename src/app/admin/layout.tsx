import { redirect } from "next/navigation";
import { isAuthenticated } from "@/actions/auth";
import { AdminHeader } from "@/components/admin/admin-header";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const authenticated = await isAuthenticated();

    // Allow login page without authentication
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
            {authenticated && <AdminHeader />}
            <main>{children}</main>
        </div>
    );
}
