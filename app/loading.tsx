export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-indigo-600 border-b-gray-300 border-l-gray-300 rounded-full animate-spin"></div>
        <span className="mt-4 text-gray-700 font-semibold animate-pulse">Loading...</span>
      </div>
    </div>
  );
}