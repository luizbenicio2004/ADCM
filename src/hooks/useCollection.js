// src/hooks/useCollection.js
import { useState, useEffect } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";

// Cache em memória por sessão com TTL de 5 minutos.
// Evita re-fetches desnecessários sem manter dados obsoletos indefinidamente.
const sessionCache = new Map(); // key → { docs, timestamp }
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

function getCached(key) {
  const entry = sessionCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    sessionCache.delete(key);
    return null;
  }
  return entry.docs;
}

function setCached(key, docs) {
  sessionCache.set(key, { docs, timestamp: Date.now() });
}

export function useCollection(collectionName) {
  const cached = getCached(collectionName);
  const [data, setData] = useState(cached ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) return;

    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setData(docs);
        setLoading(false);
        setCached(collectionName, docs);
      },
      (err) => {
        console.error("Erro ao buscar coleção:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  const adicionar = async (novoDoc) => {
    try {
      await addDoc(collection(db, collectionName), {
        ...novoDoc,
        createdAt: serverTimestamp(),
      });
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

  // NOTA: "dados" mantido como alias de "data" para compatibilidade retroativa
  return { data, dados: data, loading, error, adicionar, atualizar, remover };
}
