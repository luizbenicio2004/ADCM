import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export function useDoc(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName || !docId) return;

    const docRef = doc(db, collectionName, docId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao buscar documento:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  // CORRIGIDO: save() agora relança o erro para que o caller possa reagir.
  // Antes, o erro era engolido aqui e o caller via "Salvo com sucesso!" mesmo
  // quando a gravação havia falhado.
  const save = async (newData) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, newData, { merge: true });
    } catch (err) {
      console.error("Erro ao salvar documento:", err);
      setError(err);
      throw err; // ← relança para o componente tratar corretamente
    }
  };

  return { data, loading, error, save };
}
