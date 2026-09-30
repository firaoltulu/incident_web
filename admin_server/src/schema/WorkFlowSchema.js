// import { z } from "zod";
const { z } = require("zod");

const WorkFlowSchema = z.object({
  name: z.string().min(1, { message: 'Name is required!' }),
  module: z.string().min(1, { message: 'Module is required!' }),

  states: z.array(z.tuple([
    z.string(),
    z.number(),
    z.string(),
  ])),

  transition_rules: z.array(z.tuple([
    z.string(),
    z.string(),
    z.string(),
    z.string(),
  ])),
}).superRefine((data, ctx) => {
  const stateFirstFields = data.states.map(state => state[0]);
  data.transition_rules.forEach((rule, idx) => {
    if (!stateFirstFields.includes(rule[0])) {
      ctx.addIssue({
        path: ["transition_rules", idx, 0],
        message: `First field '${rule[0]}' is not present in states`,
        code: z.ZodIssueCode.custom,
      });
    }
    if (!stateFirstFields.includes(rule[2])) {
      ctx.addIssue({
        path: ["transition_rules", idx, 2],
        message: `Third field '${rule[2]}' is not present in states`,
        code: z.ZodIssueCode.custom,
      });
    }
  });
});

module.exports = { WorkFlowSchema };
