import { Suspense } from "react";
import SearchResultsClient from "@/components/search/SearchResultsClient";
export const metadata = { title: "Product Search | Entice Jewels" };
export default function SearchPage() { return <Suspense fallback={<main className="pt-40 min-h-[70vh] text-center">Loading products...</main>}><SearchResultsClient /></Suspense>; }
