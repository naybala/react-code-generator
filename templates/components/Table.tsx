import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { BaseTable } from "@/components/common/BaseTable";
import { use__PascalName__Table } from "../hooks/use__PascalName__Table";

export default function __PascalName__Table() {
  const {
    t,
    params,
    loading,
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
  } = use__PascalName__Table();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {t("sidebar.__plural__")}
        </h1>

        {permissionStore.hasPermission("__plural__.store") && (
          <Button
            label="Add __plural__"
            icon="pi pi-plus"
            onClick={() => navigate("/__kebabName__/create")}
            aria-label="Add __PascalName__"
          />
        )}
      </div>

      <div className="mb-4">
        <div className="w-full md:w-[450px] flex gap-2">
          <div className="flex-1">
            <InputText
              ref={searchInputRef}
              placeholder="Search..."
              className="w-full"
              defaultValue={params.search}
              onKeyDown={onSearchKeyDown}
              aria-label="Search"
            />
          </div>
          <Button
            label="Reset"
            icon="pi pi-refresh"
            onClick={resetFilter}
            outlined
            severity="secondary"
            aria-label="Reset"
          />
          <Button
            label="Search"
            icon="pi pi-search"
            onClick={handleSearch}
            aria-label="Search"
          />
        </div>
      </div>

      <BaseTable
        items={items}
        columns={columns}
        loading={loading}
        actions={actions}
        isHeaderStart={true}
        isTextStart={true}
        isBorder={true}
        isActionStart={false}
      />

      <div className="mt-4 bg-white dark:bg-gray-800 rounded shadow-md border dark:border-gray-700">
        <Paginator
          first={(params.page - 1) * params.limit}
          rows={params.limit}
          totalRecords={totalRecords}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={onPageChange}
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          className="p-paginator-sm dark:bg-gray-800 dark:text-gray-100"
          aria-label="Pagination"
        />
      </div>
    </div>
  );
}
