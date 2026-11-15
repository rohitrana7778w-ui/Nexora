import { NextRequest, NextResponse } from "next/server";
import { recordSupabaseHistory } from "@/lib/supabase";

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

    const recorded = await recordSupabaseHistory(userId, videoId, videoData);

    return NextResponse.json({
      success: true,
      recorded,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to record watch history" },
      { status: 500 }
    );
  }
}
