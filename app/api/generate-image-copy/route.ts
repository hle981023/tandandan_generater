import { NextResponse } from "next/server";
import { z } from "zod";

import { generateDemoImageCopy } from "@/lib/tandandan/demo";

const imageBriefSchema = z.object({
  productName: z.string().trim().min(1),
  productFacts: z.string().trim().min(1),
  nutritionFacts: z.string(),
  occasion: z.string().trim().min(1),
  objective: z.string().trim().min(1),
  mood: z.enum(["product", "ingredient", "culture"]),
  ratio: z.enum(["4:5", "9:16"]),
});

export async function POST(request: Request) {
  const parsed = imageBriefSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력 내용을 다시 확인해 주세요.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  return NextResponse.json(generateDemoImageCopy(parsed.data));
}
