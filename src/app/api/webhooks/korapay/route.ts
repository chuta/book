import { NextResponse } from "next/server";
import { processKorapayWebhook } from "@/lib/commerce/checkout";
import { verifyKorapayWebhookSignature } from "@/lib/korapay/webhook";

export async function POST(request: Request) {
  let payload: {
    event?: string;
    data?: {
      reference?: string;
      payment_reference?: string;
      status?: string;
    };
  };

  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const signature = request.headers.get("x-korapay-signature");
  if (!verifyKorapayWebhookSignature(payload, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    await processKorapayWebhook({
      event: payload.event ?? "",
      data: payload.data ?? {},
    });
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Korapay webhook]", error);
    return NextResponse.json({ received: true });
  }
}
