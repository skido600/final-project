import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
});

export const envConfig = envSchema.parse(process.env);
