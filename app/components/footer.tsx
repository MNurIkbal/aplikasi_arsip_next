export default function Footer() {
  return (
    <footer className="bg-white border-t px-6 py-3 text-sm text-gray-500 text-center">
      © {new Date().getFullYear()} MyApp. All rights reserved.
    </footer>
  );
}