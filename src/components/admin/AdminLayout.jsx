import { Link } from "react-router-dom";
import { Home, LayoutDashboard } from "lucide-react";

export default function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

        <div className="flex items-center gap-4">
          <Link
            to="/admin/dashboard"
            className="text-gray-500 hover:text-gray-900 transition-colors"
            title="Voltar ao painel"
          >
            <LayoutDashboard size={20} />
          </Link>

          <div>
            <h1 className="font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-blue-900 border border-blue-900/30 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
          title="Ver o site"
        >
          <Home size={15} />
          Ver site
        </Link>

      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {children}
      </main>

    </div>
  );
}
