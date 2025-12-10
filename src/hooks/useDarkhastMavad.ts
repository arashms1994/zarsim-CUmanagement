import { useQuery } from "@tanstack/react-query";
import { getDarkhastMavadList } from "../api/getData";
import type { IDarkhastMavadListItem } from "../types/type";

export const useDarkhastMavad = () => {
  return useQuery<IDarkhastMavadListItem[] | null, Error>({
    queryKey: ["darkhast-mavad-list"],
    queryFn: () => getDarkhastMavadList(),
    staleTime: 1000,
  });
};
