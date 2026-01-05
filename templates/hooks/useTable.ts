import { useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { confirmDialog } from "primereact/confirmdialog";
import { PaginatorPageChangeEvent } from "primereact/paginator";

import { use__PascalName__List } from "../queries/use__PascalName__List";
import { use__PascalName__Mutations } from "../mutations/use__PascalName__Mutations";

import { useAppToast } from "@/hooks/useAppToast";
import { usePermissionStore } from "@stores/permission";
import { TableColumn, TableAction } from "@/components/common/BaseTable";
import { __PascalName__ } from "@/types/__plural__";

export function use__PascalName__Table() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const permissionStore = usePermissionStore();
  const { showSuccess, showError } = useAppToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  /**
   * Derived params from URL
   */
  const params = {
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "10"),
    search: searchParams.get("search") || "",
  };

  const { data, isLoading } = use__PascalName__List(params);
  const { remove } = use__PascalName__Mutations();

  const items = (data as any)?.data?.data || [];
  const totalRecords = (data as any)?.data?.total || 0;

  /**
   * Sync search input
   */
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = params.search;
    }
  }, [params.search]);

  /**
   * Table columns
   */
  const columns: TableColumn[] = [__tableColumns__];

  /**
   * Handlers
   */
  const handleView = (item: __PascalName__) => {
    navigate(`/__kebabName__/view/${item.id}`);
  };

  const handleEdit = (item: __PascalName__) => {
    navigate(`/__kebabName__/edit/${item.id}`);
  };

  const handleDelete = (item: __PascalName__) => {
    confirmDialog({
      message: `Are you sure you want to delete ${item.name}?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => {
        try {
          await remove.mutateAsync(item.id!);
          showSuccess("Success", "__PascalName__ deleted successfully");
        } catch (err: any) {
          showError("Error", err.message || "Failed to delete __camelName__");
        }
      },
    });
  };

  /**
   * Pagination
   */
  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setSearchParams((prev) => {
      prev.set("page", (event.page + 1).toString());
      prev.set("limit", event.rows.toString());
      return prev;
    });
  };

  /**
   * Search
   */
  const handleSearch = () => {
    const value = searchInputRef.current?.value || "";
    setSearchParams((prev) => {
      if (value) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }
      prev.set("page", "1");
      return prev;
    });
  };

  const resetFilter = () => {
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setSearchParams((prev) => {
      prev.delete("search");
      prev.set("page", "1");
      return prev;
    });
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  /**
   * Table actions
   */
  const actions: TableAction[] = [__tableActions__];

  return {
    t,
    params,
    loading: isLoading,
    items,
    totalRecords,
    columns,
    actions,
    searchInputRef,
    onPageChange,
    handleSearch,
    resetFilter,
    onSearchKeyDown,
    navigate,
    permissionStore,
  };
}
