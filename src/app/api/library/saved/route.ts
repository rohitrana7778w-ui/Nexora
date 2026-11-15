import { NextRequest, NextResponse } from "next/server";
import { toggleSupabaseSaved } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = "guest", videoId, videoData } = body;

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: "videoId is required" },
        { status: 400 }
      );
    }

    const result = await toggleSupabaseSaved(userId, videoId, videoData);

    return NextResponse.json({
      success: true,
      saved: result,
      source: result !== null ? "supabase" : "local",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update saved video" },
      { status: 500 }
    );
  }
}
