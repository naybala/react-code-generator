import { apiRequest } from "@/utils/api";

export const __PascalName__API = {
  getAll: (params?: Record<string, any>) => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          searchParams.append(key, params[key]);
        }
      });
    }

    const queryString = searchParams.toString();

    return apiRequest(`/__kebabName__${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
    });
  },

  getOne: (id: string | number) =>
    apiRequest(`/__kebabName__/${id}`, { method: "GET" }),

  create: (body: any) =>
    apiRequest("/__kebabName__", {
      method: "POST",
      body,
    }),

  update: (id: string | number, body: any) =>
    apiRequest(`/__kebabName__/${id}`, {
      method: "PUT",
      body,
    }),

  delete: (id: string | number) =>
    apiRequest(`/__kebabName__/${id}`, {
      method: "DELETE",
    }),
};
