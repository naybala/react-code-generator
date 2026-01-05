import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppToast } from "@/hooks/useAppToast";

import { use__PascalName__Detail } from "../queries/use__PascalName__Detail";
import { use__PascalName__Mutations } from "../mutations/use__PascalName__Mutations";
import {
  __PascalName__Schema,
  __PascalName__FormInput,
} from "../schema/__camelName__.schema";

import { cleanFormData } from "@/utils/cleanForm";

export function use__PascalName__Form(id?: string) {
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { showSuccess, showError } = useAppToast();

  const { data: detailData, isLoading: isLoadingDetail } =
    use__PascalName__Detail(id);

  const { create, update, isCreating, isUpdating } =
    use__PascalName__Mutations();

  const [form, setForm] = useState<__PascalName__FormInput>({
    __formFields__
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Load edit data
   */
  useEffect(() => {
    const data = (detailData as any)?.data;
    if (data) {
      setForm({
        __editFormFields__
      });
    }
  }, [detailData]);

  /**
   * Validate form using schema
   */
  const validate = () => {
    const parsed = __PascalName__Schema.safeParse(form);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  /**
   * Submit handler
   */
  const submit = async () => {
    if (!validate()) return;

    try {
      const dataToSave = cleanFormData(form) as __PascalName__FormInput;

      if (isEditMode && id) {
        await update.mutateAsync({ id, data: dataToSave });
      } else {
        await create.mutateAsync(dataToSave);
      }

      showSuccess(
        "Success",
        `__PascalName__ ${isEditMode ? "updated" : "created"} successfully`
      );
      navigate(-1);
    } catch (err: any) {
      showError("Error", err.message || "Failed to save __camelName__");
    }
  };

  return {
    form,
    setForm,
    submit,
    errors,
    isEditMode,
    isLoading: isLoadingDetail,
    isCreating,
    isUpdating,
  };
}
