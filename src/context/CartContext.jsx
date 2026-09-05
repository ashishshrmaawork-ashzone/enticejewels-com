"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCatalogSession, saveCatalogSession } from "@/lib/api";

const CartContext = createContext(null);
const STORAGE_KEY = "entice-cart";
const WISHLIST_KEY = "entice-wishlist";
const TOKEN_KEY = "entice-catalog-token";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recent, setRecent] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [sessionToken, setSessionToken] = useState("");

  // Load any previously saved cart once, on mount.
  useEffect(() => {
    let active = true;
    (async () => { try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const localItems = raw ? JSON.parse(raw) : [];
      const localWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      const server = await getCatalogSession(localStorage.getItem(TOKEN_KEY) || "");
      if (!active) return;
      localStorage.setItem(TOKEN_KEY, server.token);
      setSessionToken(server.token);
      const nextItems = server.cart?.length ? server.cart : localItems;
      setItems(nextItems);
      const nextWishlist = server.wishlist?.length ? server.wishlist : localWishlist;
      setWishlist(nextWishlist); setRecent(server.recent || []);
      if (!server.cart?.length && localItems.length) await saveCatalogSession(server.token, { cart: localItems, wishlist: server.wishlist || [], compare: [], recent: server.recent || [] });
    } catch {
      try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setItems(JSON.parse(raw)); } catch { /* ignore */ }
    }
    setHydrated(true);
    })();
    return () => { active = false; };
  }, []);

  // Persist on every change, once hydrated (avoids clobbering saved data on first render).
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) saveCatalogSession(token, { cart: items, wishlist, compare: [], recent }).catch(() => {});
      } catch {
        // ignore
      }
    }
  }, [items, wishlist, recent, hydrated]);

  useEffect(() => {
    const syncAuthenticatedSession = async () => {
      try {
        const account = await getCatalogSession("");
        const mergeUnique = (remote, local) => [...(remote || []), ...(local || []).filter((item) => !(remote || []).some((saved) => saved.id === item.id))];
        const merged = await saveCatalogSession("", { cart: mergeUnique(account.cart, items), wishlist: mergeUnique(account.wishlist, wishlist), compare: [], recent: mergeUnique(account.recent, recent).slice(0, 20) });
        setItems(merged.cart || []); setWishlist(merged.wishlist || []); setRecent(merged.recent || []);
      } catch { /* keep local state if account sync is unavailable */ }
    };
    window.addEventListener("entice-auth-change", syncAuthenticatedSession);
    return () => window.removeEventListener("entice-auth-change", syncAuthenticatedSession);
  }, [items, wishlist, recent]);

  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.key === product.key);
      if (existing) {
        return prev.map((i) => (i.key === product.key ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (key) => setItems((prev) => prev.filter((i) => i.key !== key));

  const updateQty = (key, qty) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty: Math.max(1, qty) } : i)));

  const clearCart = () => setItems([]);
  const toggleWishlist = (product) => setWishlist((list) => {
    const next = list.some((item) => item.id === product.id) ? list.filter((item) => item.id !== product.id) : [...list, { ...product, qty: 1 }];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) saveCatalogSession(token, { cart: items, wishlist: next, compare: [], recent }).catch(() => {});
    return next;
  });
  const trackRecent = (product) => setRecent((list) => [{ ...product, qty: 1 }, ...list.filter((item) => item.id !== product.id)].slice(0, 20));
  const restoreSession = async (token) => {
    if (!/^[a-f0-9]{64}$/.test(token)) throw new Error("Invalid recovery code");
    const server = await getCatalogSession(token);
    localStorage.setItem(TOKEN_KEY, token); setSessionToken(token); setItems(server.cart || []); setWishlist(server.wishlist || []); setRecent(server.recent || []);
  };

  const totalCount = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalCount, totalPrice, hydrated, wishlist, recent, toggleWishlist, trackRecent, sessionToken, restoreSession }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
