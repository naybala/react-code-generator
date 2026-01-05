export const __camelName__Keys = {
  all: ["__kebabName__"] as const,

  lists: () => [...__camelName__Keys.all, "list"] as const,

  list: (params?: any) => [...__camelName__Keys.lists(), params] as const,

  details: () => [...__camelName__Keys.all, "detail"] as const,

  detail: (id: string | number) =>
    [...__camelName__Keys.details(), id] as const,
};
