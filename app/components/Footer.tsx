// =======================================
// File: app/components/footer.tsx
// =======================================

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/20 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* === Footer Links === */}
          <nav aria-label="フッターリンク">
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-gray-300"
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="transition hover:text-gray-300"
                >
                  免責事項
                </Link>
              </li>
            </ul>
          </nav>

          {/* === Copyright === */}
          <p className="text-xs tracking-wide text-white/80">
            © {new Date().getFullYear()} LIT STUDIO — All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
