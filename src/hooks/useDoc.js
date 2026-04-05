import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

export function useDoc(collectionName, docId) {
  const [data, setDataState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName || !docId) return;

    const docRef = doc(db, collectionName, docId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setDataState({ id: snapshot.id, ...snapshot.data() });
        } else {
          setDataState(null);
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

  // 🔥 função para salvar/atualizar doc
  const save = async (newData) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, newData, { merge: true }); // merge evita sobrescrever tudo
    } catch (err) {
      console.error("Erro ao salvar documento:", err);
      setError(err);
    }
  };

  return {
    data,
    loading,
    error,
    save,
  };
}