import { NextResponse } from "next/server";
import {
  createSignedDownloadUrl,
  getProductAsset,
  logDownload,
  userOwnsProduct,
} from "@/lib/db/commerce";
import { createSupabaseServerClient } from "@/lib/supabase/browser-server";

const ALLOWED_ASSETS = new Set(["pdf", "zip", "epub"]);

export async function GET(
  request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  const { productId } = await context.params;
  const { searchParams } = new URL(request.url);
  const assetType = (searchParams.get("asset") || "pdf").toLowerCase();

  if (!ALLOWED_ASSETS.has(assetType)) {
    return NextResponse.json({ error: "Invalid asset type." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const ownsProduct = await userOwnsProduct(user.id, productId);
  if (!ownsProduct) {
    return NextResponse.json({ error: "Purchase not found." }, { status: 403 });
  }

  const asset = await getProductAsset(productId, assetType);
  if (!asset) {
    return NextResponse.json({ error: "File not available." }, { status: 404 });
  }

  try {
    const signedUrl = await createSignedDownloadUrl(asset.storage_path);
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined;

    await logDownload({
      userId: user.id,
      productId,
      assetId: asset.id,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    return NextResponse.redirect(signedUrl, { status: 302 });
  } catch (error) {
    console.error("[Download]", error);
    return NextResponse.json(
      { error: "Download temporarily unavailable." },
      { status: 503 }
    );
  }
}
