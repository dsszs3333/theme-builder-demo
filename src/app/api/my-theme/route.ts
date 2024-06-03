import { getThemeData } from "@/components/ui/ThemePicker";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);

  const hue = url.searchParams.get("hue");

  return NextResponse.json(getThemeData(hue!), { status: 200 });
}
