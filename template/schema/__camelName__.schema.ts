import { z } from "zod";

export const __PascalName__Schema = z.object({
  __schemaFields__,
});

export type __PascalName__FormInput = z.infer<typeof __PascalName__Schema>;
