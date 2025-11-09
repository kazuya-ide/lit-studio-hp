export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-10 text-center text-gray-400 text-sm">
      <p>© {new Date().getFullYear()} LIT STUDIO</p>
      <p className="mt-2">
        Powered by{" "}
        <a href="https://lit4.net" target="_blank" className="underline">
          合同会社LIT
        </a>
      </p>
    </footer>
  );
}
