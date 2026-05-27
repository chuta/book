import { createHmac, timingSafeEqual } from "crypto";

export function verifyKorapayWebhookSignature(
  payload: unknown,
  signatureHeader: string | null
): boolean {
  const secret = process.env.KORAPAY_SECRET_KEY;
  if (!secret || !signatureHeader) {
    return false;
  }

  const data = (payload as { data?: unknown })?.data;
  if (!data) {
    return false;
  }

  const hash = createHmac("sha256", secret)
    .update(JSON.stringify(data))
    .digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(hash, "utf8"),
      Buffer.from(signatureHeader, "utf8")
    );
  } catch {
    return false;
  }
}
