import { NextResponse } from "next/server";
import { z } from "zod";

import { rewriteDemoCopy } from "@/lib/tandandan/demo";

const rewriteBriefSchema = z.object({
  original: z.string().trim().min(1),
  placement: z.enum(["on-image", "caption", "cta"]),
  productFacts: z.string(),
  occasion: z.string(),
});

export async function POST(request: Request) {
  const parsed = rewriteBriefSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력 내용을 다시 확인해 주세요.", fields: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  return NextResponse.json(rewriteDemoCopy(parsed.data));
}
