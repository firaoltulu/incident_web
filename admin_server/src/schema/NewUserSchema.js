// import { z } from "zod";
const { z } = require("zod");

const NewUserSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required!' }),
  middleName: z.string().min(1, { message: ' Middle Name is required!' }),
  lastName: z.string().min(1, { message: 'Last name is required!' }),

  userEmail: z
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),

  phoneNumber: z.string().min(1, { message: 'Phone number is required!' }),

  company: z.string().min(1, { message: "Company is required!" }),

  defaultPassword: z
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' }),

  // role: zod.string().min(1, { message: 'Role is required!' }),
  // Not required
});

module.exports = { NewUserSchema };