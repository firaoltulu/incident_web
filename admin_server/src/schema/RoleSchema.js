// import { z } from "zod";
const { z } = require("zod");

const NewRoleSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required!' }),
    description: z.string().min(1, { message: 'Description is required!' }),
    isActive: z.object({ enabled: z.boolean() }),
    modules: z
      .array(
        z.object({ value: z.string().min(1, { message: 'Modules value is required!' }) })
      )
      .optional()
      .refine((v) => v === undefined || Array.isArray(v), { message: 'Modules is required!' }),
  });

module.exports = { NewRoleSchema };