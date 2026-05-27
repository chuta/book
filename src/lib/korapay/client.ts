const KORAPAY_BASE_URL = "https://api.korapay.com/merchant/api/v1";

export type KorapayInitializePayload = {
  amount: number;
  currency: "NGN";
  reference: string;
  redirect_url: string;
  notification_url: string;
  narration: string;
  customer: {
    email: string;
    name?: string;
  };
  metadata?: Record<string, string | number | boolean>;
  channels?: string[];
};

export type KorapayInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    checkout_url: string;
  };
};

export type KorapayVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    status: "success" | "failed" | "pending" | "processing";
    amount: string;
    amount_paid: string;
    fee: string;
    currency: string;
    description?: string;
  };
};

function getSecretKey(): string {
  const key = process.env.KORAPAY_SECRET_KEY;
  if (!key) {
    throw new Error("KORAPAY_SECRET_KEY is not configured");
  }
  return key;
}

export function isKorapayConfigured(): boolean {
  return Boolean(process.env.KORAPAY_SECRET_KEY);
}

export async function initializeKorapayCharge(
  payload: KorapayInitializePayload
): Promise<KorapayInitializeResponse> {
  const response = await fetch(`${KORAPAY_BASE_URL}/charges/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = (await response.json()) as KorapayInitializeResponse;

  if (!response.ok || !body.status || !body.data?.checkout_url) {
    throw new Error(body.message || "Failed to initialize Korapay checkout");
  }

  return body;
}

export async function verifyKorapayCharge(
  reference: string
): Promise<KorapayVerifyResponse> {
  const response = await fetch(
    `${KORAPAY_BASE_URL}/charges/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
      },
    }
  );

  const body = (await response.json()) as KorapayVerifyResponse;

  if (!response.ok || !body.status) {
    throw new Error(body.message || "Failed to verify Korapay charge");
  }

  return body;
}
