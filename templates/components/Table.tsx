import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { BaseTable } from "@/components/common/BaseTable";
import { useUserTable } from "../hooks/useUserTable";

export default function UserTable() {
  const {
    items,
    loading,
    columns,
    actions,
    params,
    totalRecords,
    searchInputRef,
    onPageChange,
    handleSearch,
    resetFilter,
    onSearchKeyDown,
    navigate,
  } = useUserTable();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button
          label="Add User"
          icon="pi pi-plus"
          onClick={() => navigate("/users/create")}
        />
      </div>

      <div className="mb-4 flex gap-2 w-full md:w-[400px]">
        <InputText
          ref={searchInputRef}
          placeholder="Search..."
          defaultValue={params.search}
          onKeyDown={onSearchKeyDown}
          className="flex-1"
        />
        <Button label="Reset" outlined onClick={resetFilter} />
        <Button label="Search" onClick={handleSearch} />
      </div>

      <BaseTable
        items={items}
        columns={columns}
        loading={loading}
        actions={actions}
        isBorder
      />

      <div className="mt-4">
        <Paginator
          first={(params.page - 1) * params.limit}
          rows={params.limit}
          totalRecords={totalRecords}
          onPageChange={onPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </div>
    </div>
  );
}
