import { useQuery } from "@tanstack/react-query";
import { __PascalName__API } from "../api/__plural__.api";
import { __camelName__Keys } from "./__camelName__.keys";

export function use__PascalName__Detail(id?: string | number) {
  return useQuery({
    enabled: !!id,
    queryKey: id ? __camelName__Keys.detail(id) : [],
    queryFn: () => __PascalName__API.getOne(id!),
  });
}
