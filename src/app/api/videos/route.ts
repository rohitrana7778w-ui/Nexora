import { NextRequest, NextResponse } from "next/server";
import { getVideos } from "@/lib/youtube";
import { VideoCategory } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") as VideoCategory) || "All";
  const query = searchParams.get("q") || "";
  const limit = parseInt(searchParams.get("limit") || "24", 10);

  try {
    const videos = await getVideos({
      category,
      searchQuery: query,
      limit,
    });

    return NextResponse.json({
      success: true,
      category,
      query,
      count: videos.length,
      videos,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve videos" },
      { status: 500 }
    );
  }
}
