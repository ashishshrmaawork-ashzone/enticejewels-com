"use client";

import { useCallback, useState } from "react";
import useLiveContent from "@/lib/useLiveContent";

export default function useLiveListing(fetchPage, perPage, sectionId) {
  const [page, setPage] = useState(1);
  const size = Math.max(1, Number(perPage) || 6);
  const loader = useCallback(async () => {
    const result = await fetchPage(page, size);
    const lastPage = Math.max(1, Number(result.pagination.total_pages) || 1);
    return page > lastPage ? fetchPage(lastPage, size) : result;
  }, [fetchPage, page, size]);
  const { data: result, loading, error } = useLiveContent(loader);
  const data = result || { items: [], featured: null, pagination: { page, total_pages: 0 } };

  function go(nextPage) {
    if (loading || nextPage < 1 || nextPage > data.pagination.total_pages || nextPage === data.pagination.page) return;
    setPage(nextPage);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return { data, loading, error, go };
}
