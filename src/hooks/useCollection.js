// src/hooks/useCollection.js
import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";

// Cache em memória por sessão — evita re-fetches desnecessários durante a navegação
const sessionCache = new Map();

export function useCollection(collectionName) {
  const cached = sessionCache.get(collectionName);
  const [data, setData] = useState(cached ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;

    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(docs);
        setLoading(false);
        sessionCache.set(collectionName, docs);
      },
      (err) => {
        console.error("Erro ao buscar coleção:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  const dados = data;

  const adicionar = async (novoDoc) => {
    try {
      await addDoc(collection(db, collectionName), { ...novoDoc, createdAt: serverTimestamp() });
    } catch (err) {
      console.error("Erro ao adicionar:", err);
      throw err;
    }
  };

  const atualizar = async (id, dadosAtualizados) => {
    try {
      await updateDoc(doc(db, collectionName, id), dadosAtualizados);
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      throw err;
    }
  };

  const remover = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error("Erro ao remover:", err);
      throw err;
    }
  };

  return { data, dados, loading, error, adicionar, atualizar, remover };
}
