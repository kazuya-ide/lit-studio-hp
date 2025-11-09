import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-widest">
          LIT STUDIO
        </Link>
        <div className="flex gap-6 text-sm uppercase">
          <Link href="/about">About</Link>
          <Link href="/works">Works</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>
    </header>
  );
}
