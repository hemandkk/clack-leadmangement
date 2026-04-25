import { useQuery } from "@tanstack/react-query";
import { masterApi } from "@leadpro/api-client";
import { useDebounce } from "./useDebounce";
import { useState } from "react";

export function useProducts(search = "") {
  const debounced = useDebounce(search, 300);
  return useQuery({
    queryKey: ["master", "products", debounced],
    queryFn: async () =>
      (await masterApi.listProducts(debounced || undefined)).data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useOrganisations(search = "") {
  const debounced = useDebounce(search, 300);
  return useQuery({
    queryKey: ["master", "organisations", debounced],
    queryFn: async () =>
      (await masterApi.listOrganisations(debounced || undefined)).data,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAssignableStaff() {
  return useQuery({
    queryKey: ["master", "assignable-staff"],
    queryFn: async () => (await masterApi.listAssignableStaff()).data,
    staleTime: 1000 * 60 * 3,
  });
}
