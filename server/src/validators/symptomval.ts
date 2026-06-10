import { z } from "zod";

export const AiSuggestionSchema = z.object({
  symptoms: z.string().min(1, "Symptoms are required"),
});
