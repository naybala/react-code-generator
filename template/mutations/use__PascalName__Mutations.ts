import { useMutation, useQueryClient } from "@tanstack/react-query";
import { __PascalName__API } from "../api/__camelName__.api";
import { __camelName__Keys } from "../queries/__camelName__.keys";

export function use__PascalName__Mutations() {
  const queryClient = useQueryClient();

  /**
   * CREATE
   */
  const create = useMutation({
    mutationFn: __PascalName__API.create,

    onMutate: async (newItem: any) => {
      await queryClient.cancelQueries({
        queryKey: __camelName__Keys.lists(),
      });

      const previousLists = queryClient.getQueriesData({
        queryKey: __camelName__Keys.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: __camelName__Keys.lists() },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              data: [
                {
                  ...newItem,
                  id: `temp-id-${Date.now()}`,
                },
                ...(old.data.data || []),
              ],
              total: (old.data.total || 0) + 1,
            },
          };
        }
      );

      return { previousLists };
    },

    onError: (_err, _newItem, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: __camelName__Keys.all,
      });
    },
  });

  /**
   * UPDATE
   */
  const update = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      __PascalName__API.update(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: __camelName__Keys.lists(),
      });
      await queryClient.cancelQueries({
        queryKey: __camelName__Keys.details(),
      });

      const previousLists = queryClient.getQueriesData({
        queryKey: __camelName__Keys.lists(),
      });

      const previousDetail = queryClient.getQueryData(
        __camelName__Keys.detail(id)
      );

      // Update lists
      queryClient.setQueriesData(
        { queryKey: __camelName__Keys.lists() },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((item: any) =>
                item.id === id ? { ...item, ...data } : item
              ),
            },
          };
        }
      );

      // Update detail
      queryClient.setQueryData(__camelName__Keys.detail(id), (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: { ...old.data, ...data },
        };
      });

      return { previousLists, previousDetail };
    },

    onError: (_err, { id }, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousDetail) {
        queryClient.setQueryData(
          __camelName__Keys.detail(id),
          context.previousDetail
        );
      }
    },

    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({
        queryKey: __camelName__Keys.all,
      });
      queryClient.invalidateQueries({
        queryKey: __camelName__Keys.detail(id),
      });
    },
  });

  /**
   * DELETE
   */
  const remove = useMutation({
    mutationFn: __PascalName__API.delete,

    onMutate: async (id: string | number) => {
      await queryClient.cancelQueries({
        queryKey: __camelName__Keys.lists(),
      });

      const previousLists = queryClient.getQueriesData({
        queryKey: __camelName__Keys.lists(),
      });

      queryClient.setQueriesData(
        { queryKey: __camelName__Keys.lists() },
        (old: any) => {
          if (!old || !old.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.filter((item: any) => item.id !== id),
              total: Math.max((old.data.total || 1) - 1, 0),
            },
          };
        }
      );

      return { previousLists };
    },

    onError: (_err, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: __camelName__Keys.all,
      });
    },
  });

  return {
    create,
    update,
    remove,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isRemoving: remove.isPending,
  };
}
