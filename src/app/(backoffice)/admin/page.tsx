import { PageContainer } from "@/components/layout/page-container";

export default function AdminPage() {
  return (
    <main className="min-h-screen py-16">
      <PageContainer className="max-w-3xl">
        <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm font-bold uppercase tracking-wider text-stone-500">
            Tehnosklad
          </p>
          <h1 className="mt-3 text-3xl font-black">Административная панель</h1>
          <p className="mt-5 text-stone-600">
            На Этапе 1 подготовлена только отдельная серверная граница маршрута.
            Вход через Supabase Auth и защищённые разделы будут реализованы на
            этапе административной панели.
          </p>
        </section>
      </PageContainer>
    </main>
  );
}
