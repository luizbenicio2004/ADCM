import { useState, useEffect } from "react";
import {
  collection, query, orderBy, onSnapshot,
  doc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import AdminLayout from "../../components/admin/AdminLayout";
import { Heart, Eye, EyeOff, Trash2, CheckCircle } from "lucide-react";

const CATEGORIAS_COR = {
  "Saúde":          "bg-red-100 text-red-700",
  "Família":        "bg-purple-100 text-purple-700",
  "Finanças":       "bg-green-100 text-green-700",
  "Relacionamento": "bg-pink-100 text-pink-700",
  "Trabalho":       "bg-orange-100 text-orange-700",
  "Outro":          "bg-gray-100 text-gray-600",
};

function formatarData(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminOracao() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading]  = useState(true);
  const [filtro, setFiltro]    = useState("todos");
  const [excluindo, setExcluindo] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "pedidos_oracao"),
      orderBy("criadoEm", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setPedidos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const naoLidos = pedidos.filter((p) => !p.lido).length;

  const lista = pedidos.filter((p) => {
    if (filtro === "nao_lidos") return !p.lido;
    if (filtro === "lidos")     return p.lido;
    return true;
  });

  async function marcarLido(id, lido) {
    await updateDoc(doc(db, "pedidos_oracao", id), { lido: !lido });
  }

  async function excluir(id) {
    setExcluindo(id);
    await deleteDoc(doc(db, "pedidos_oracao", id));
    setExcluindo(null);
  }

  return (
    <AdminLayout
      title="Pedidos de Oração"
      subtitle={naoLidos > 0 ? `${naoLidos} não lido${naoLidos > 1 ? "s" : ""}` : "Todos lidos"}
    >
      {/* Filtros */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { key: "todos",     label: `Todos (${pedidos.length})` },
          { key: "nao_lidos", label: `Não lidos (${naoLidos})` },
          { key: "lidos",     label: "Lidos" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFiltro(key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
              filtro === key
                ? "bg-blue-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-blue-900/40"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : lista.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Heart size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nenhum pedido encontrado.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-xl border p-5 transition ${
                p.lido ? "border-gray-200 opacity-70" : "border-blue-200 shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-gray-900 text-sm truncate">
                      {p.nome || "Anônimo"}
                    </span>
                    {p.categoria && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORIAS_COR[p.categoria] ?? CATEGORIAS_COR["Outro"]}`}>
                        {p.categoria}
                      </span>
                    )}
                    {p.lido ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                        <CheckCircle size={10} /> Orado
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" title="Não lido" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                    {p.pedido}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-2">{formatarData(p.criadoEm)}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => marcarLido(p.id, p.lido)}
                    title={p.lido ? "Marcar como não orado" : "Marcar como orado"}
                    className="p-2 rounded-lg text-gray-400 hover:text-blue-900 hover:bg-blue-50 transition"
                  >
                    {p.lido ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => excluir(p.id)}
                    disabled={excluindo === p.id}
                    title="Excluir pedido"
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
