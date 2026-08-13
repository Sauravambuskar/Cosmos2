import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "wouter";
import { parseCategories, parseQuery, parseTransaction, type Transaction } from "@/lib/search";

/**
 * The listing filters that live in the URL, so nav links ("Rent Warehouse"),
 * the home page search box, shared links and the back button all land on the
 * same filtered view.
 *
 * The text box keeps its own state so typing stays instant; the URL catches up
 * on a short debounce.
 */
export interface ListingFilters {
  /** Current text in the search box (updates on every keystroke). */
  query: string;
  setQuery: (value: string) => void;
  transaction: Transaction;
  setTransaction: (value: Transaction) => void;
  /** Categories requested via `?category=` — normalised to database slugs. */
  urlCategories: string[];
}

const QUERY_SYNC_DELAY_MS = 350;

/**
 * The `?q=` half of the filters, shared by the listing pages and the global
 * search page: local state for instant typing, debounced back into the URL.
 */
function useDebouncedUrlQuery(params: URLSearchParams, setParams: ReturnType<typeof useSearchParams>[1]) {
  const urlQuery = parseQuery(params);
  const [query, setQuery] = useState(urlQuery);

  // Adopt queries that arrive from outside the box: hero search, nav links,
  // browser back/forward.
  const lastUrlQuery = useRef(urlQuery);
  useEffect(() => {
    if (urlQuery !== lastUrlQuery.current) {
      lastUrlQuery.current = urlQuery;
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  // Push the typed query back into the URL so the view stays shareable.
  useEffect(() => {
    if (query === urlQuery) return;
    const timer = setTimeout(() => {
      lastUrlQuery.current = query;
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("search"); // legacy alias — `q` is canonical
          if (query) next.set("q", query);
          else next.delete("q");
          return next;
        },
        { replace: true },
      );
    }, QUERY_SYNC_DELAY_MS);
    return () => clearTimeout(timer);
  }, [query, urlQuery, setParams]);

  return [query, setQuery] as const;
}

/**
 * The global search page's state: the shared search box plus its filter chips,
 * all held in the URL so a result set can be shared or bookmarked.
 */
export interface GlobalSearchState {
  query: string;
  setQuery: (value: string) => void;
  params: URLSearchParams;
  /** Set a filter param, or drop it entirely when passed `null`. */
  setParam: (key: string, value: string | null) => void;
}

export function useGlobalSearch(): GlobalSearchState {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useDebouncedUrlQuery(params, setParams);

  const setParam = useCallback(
    (key: string, value: string | null) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === null) next.delete(key);
        else next.set(key, value);
        return next;
      });
    },
    [setParams],
  );

  return { query, setQuery, params, setParam };
}

export function useListingFilters(): ListingFilters {
  const [params, setParams] = useSearchParams();

  const transaction = parseTransaction(params);
  const urlCategoriesKey = parseCategories(params).join(",");
  const urlCategories = useMemo(
    () => (urlCategoriesKey ? urlCategoriesKey.split(",") : []),
    [urlCategoriesKey],
  );

  const [query, setQuery] = useDebouncedUrlQuery(params, setParams);

  const setTransaction = useCallback(
    (value: Transaction) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("type"); // legacy alias — `transaction` is canonical
        next.set("transaction", value);
        return next;
      });
    },
    [setParams],
  );

  return { query, setQuery, transaction, setTransaction, urlCategories };
}
