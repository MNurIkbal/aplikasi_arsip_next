import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function Breakbout({
    menu = "",
}) {
    return (
        <div className="w-full flex justify-between items-center  p-1 mb-5">
            <div className="text-right">
                <h2 className="text-xl font-extrabold text-gray-800 tracking-tight uppercase">
                    {menu}
                </h2>
            </div>
            {/* KIRI: BREADCRUMB */}
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm text-gray-500 font-medium">
                    <li className="inline-flex items-center">
                        <Link href="/dashboard" className="inline-flex items-center hover:text-indigo-600 transition-colors">
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center text-gray-900 font-bold">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <span className="ml-1 md:ml-2">
                                {menu}
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>
        </div>
    );
}