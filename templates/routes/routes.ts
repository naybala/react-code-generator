import React from "react";
import { SidebarRouteObject } from "@/types/sidebar";
import ProtectedRoute from "@/routers/ProtectedRoute";
import { BaseLoader } from "@/components/common/BaseLoader";

const __PascalName__List = React.lazy(
  () => import("@/features/__plural__/components/__PascalName__Table")
);

const __PascalName__Form = React.lazy(
  () => import("@/features/__plural__/components/__PascalName__Form")
);

export const __SCREAMING_SNAKE__PATHS = {
  list: "/__kebabName__",
  create: "/__kebabName__/create",
  edit: "/__kebabName__/edit/:id",
  view: "/__kebabName__/view/:id",
};

export const __SCREAMING_SNAKE__PERMISSIONS = {
  list: "__kebabName__.index",
  create: "__kebabName__.store",
  edit: "__kebabName__.edit",
  view: "__kebabName__.show",
};

const label = "sidebar.__plural__";
const icon = "pi pi-prime";

export const __camelName__Routes: SidebarRouteObject[] = [
  {
    path: __SCREAMING_SNAKE__PATHS.list,
    meta: {
      sidebar: true,
      label,
      icon,
      permission: __SCREAMING_SNAKE__PERMISSIONS.list,
    },
    element: (
      <React.Suspense fallback={<BaseLoader />}>
        <ProtectedRoute permission={__SCREAMING_SNAKE__PERMISSIONS.list}>
          <__PascalName__List />
        </ProtectedRoute>
      </React.Suspense>
    ),
  },
  {
    path: __SCREAMING_SNAKE__PATHS.create,
    meta: { sidebar: false },
    element: (
      <React.Suspense fallback={<BaseLoader />}>
        <ProtectedRoute permission={__SCREAMING_SNAKE__PERMISSIONS.create}>
          <__PascalName__Form />
        </ProtectedRoute>
      </React.Suspense>
    ),
  },
  {
    path: __SCREAMING_SNAKE__PATHS.edit,
    meta: { sidebar: false },
    element: (
      <React.Suspense fallback={<BaseLoader />}>
        <ProtectedRoute permission={__SCREAMING_SNAKE__PERMISSIONS.edit}>
          <__PascalName__Form />
        </ProtectedRoute>
      </React.Suspense>
    ),
  },
  {
    path: __SCREAMING_SNAKE__PATHS.view,
    meta: { sidebar: false },
    element: (
      <React.Suspense fallback={<BaseLoader />}>
        <ProtectedRoute permission={__SCREAMING_SNAKE__PERMISSIONS.view}>
          <__PascalName__Form />
        </ProtectedRoute>
      </React.Suspense>
    ),
  },
];
