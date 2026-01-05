import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { classNames } from "primereact/utils";
import { useUserForm } from "../hooks/useUserForm";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isViewMode = window.location.pathname.includes("/view/");

  const {
    form,
    setForm,
    submit,
    errors,
    isEditMode,
    isLoading,
    isCreating,
    isUpdating,
    fields, // array like [{ name: "name", label: "Name" }]
  } = useUserForm(id);

  const isPending = isCreating || isUpdating;

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card
        title={
          isViewMode ? "View User" : isEditMode ? "Edit User" : "Create User"
        }
        className="shadow-md"
      >
        {isLoading ? (
          <div className="flex justify-center p-6">
            <i className="pi pi-spin pi-spinner text-3xl"></i>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map((field: any) => (
              <div key={field.name} className="flex flex-col gap-1">
                <label className="font-medium">{field.label}</label>
                <InputText
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className={classNames("w-full", {
                    "p-invalid": errors[field.name],
                  })}
                />
                {errors[field.name] && (
                  <small className="p-error">{errors[field.name]}</small>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                label="Cancel"
                outlined
                onClick={() => navigate(-1)}
              />
              {!isViewMode && (
                <Button
                  type="submit"
                  label={isEditMode ? "Update" : "Create"}
                  loading={isPending}
                />
              )}
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
