import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { classNames } from "primereact/utils";

export default function __PascalName__Form() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isViewMode = window.location.pathname.includes("/view/");

  const {
    form,
    setForm,
    submit,
    errors,
    isEditMode,
    countries,
    isLoading,
    isCreating,
    isUpdating,
  } = use__PascalName__Form(id);

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
    <div className="p-4 max-w-4xl mx-auto">
         <PersistenceLoader visible={isPending} />
         <Card
           className="shadow-xl border-t-4 border-t-brand-primary"
           title={
             isViewMode
               ? "View __PascalName__"
               : isEditMode
               ? "Edit __PascalName__"
               : "Create __PascalName__"
           }
         >
           {isLoading ? (
             <div className="flex justify-center p-8">
               <i className="pi pi-spin pi-spinner text-4xl text-brand-primary"></i>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-2">
                   <label htmlFor="name" className="font-bold">
                     Name
                   </label>
                   <InputText
                     id="name"
                     name="name"
                     value={form.name}
                     onChange={handleChange}
                     disabled={isViewMode}
                     className={classNames("w-full transition-all", {
                       "p-invalid": errors.name,
                     })}
                   />
                   {errors.name && (
                     <small className="p-error">{errors.name}</small>
                   )}
                 </div>
   
                
   
               <div className="flex justify-end gap-2 mt-4">
                 <Button
                   type="button"
                   label="Cancel"
                   icon="pi pi-times"
                   outlined
                   onClick={() => navigate(-1)}
                 />
                 {!isViewMode && (
                   <Button
                     type="submit"
                     label={isEditMode ? "Update" : "Create"}
                     icon="pi pi-check"
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
