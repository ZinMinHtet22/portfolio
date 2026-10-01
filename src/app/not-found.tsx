import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center px-5 pb-32 pt-44 text-center md:px-10">
      <p className="text-sm text-white/40">404</p>
      <h1 className="display mt-5 text-[42px] text-white/60 md:text-[65px]">
        Page not found
      </h1>
      <p className="mt-4 text-white/50">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center rounded-[20px] bg-white px-5 text-[15px] font-medium tracking-[-0.03em] text-[#030303] transition-transform duration-200 hover:scale-[1.03]"
      >
        Back home
      </Link>
    </div>
  );
}
