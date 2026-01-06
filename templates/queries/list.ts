import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { __PascalName__API } from "../api/__plural__.api";
import { __camelName__Keys } from "./__camelName__.keys";

export function use__PascalName__List(params?: any) {
  return useQuery({
    queryKey: __camelName__Keys.list(params),
    queryFn: () => __PascalName__API.getAll(params),
    placeholderData: keepPreviousData,
  });
}
