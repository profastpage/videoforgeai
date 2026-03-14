import { apiSuccess } from "@/lib/http";
import { getPromptTemplateCatalog } from "@/services/prompts/prompt-template-service";

export async function GET() {
  const catalog = await getPromptTemplateCatalog();
  return apiSuccess(catalog);
}
