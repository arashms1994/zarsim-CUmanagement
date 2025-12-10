import { useQuery } from "@tanstack/react-query";
import { getDarkhastMavadList } from "../api/getData";
import type { IDarkhastMavadListItem } from "../types/type";

export const useDarkhastMavad = () => {
  return useQuery<IDarkhastMavadListItem[] | null, Error>({
    queryKey: ["crm-notifications"],
    queryFn: () => getDarkhastMavadList(),
    staleTime: 1000,
  });
};
