import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <p className="text-sm font-bold text-stone-500">404</p>
      <h1 className="mt-3 text-4xl font-black">Страница не найдена</h1>
      <Link
        className="mt-8 inline-flex min-h-11 items-center font-bold underline"
        href="/ru"
      >
        Tehnosklad
      </Link>
    </div>
  );
}
