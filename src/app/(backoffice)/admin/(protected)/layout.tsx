import type { ReactNode } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { signOutAdmin } from "@/features/admin/auth/actions";
import { requireAdmin } from "@/features/admin/auth/guard";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();
  return (
    <>
      <header className="border-b border-stone-200 bg-white">
        <PageContainer className="flex min-h-20 items-center justify-between gap-4 py-3">
          <div>
            <p className="font-black">Tehnosklad Admin</p>
            <p className="text-sm text-stone-600">
              {admin.email} · {admin.role}
            </p>
          </div>
          <form action={signOutAdmin}>
            <button className="button-secondary" type="submit">
              Выйти
            </button>
          </form>
        </PageContainer>
      </header>
      {children}
    </>
  );
}
