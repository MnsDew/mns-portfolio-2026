import emailjs from "@emailjs/nodejs";
import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { contactRateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 8_192;

function getEmailJsConfig() {
  const serviceId =
    process.env.EMAILJS_SERVICE_ID ??
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId =
    process.env.EMAILJS_TEMPLATE_ID ??
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey =
    process.env.EMAILJS_PUBLIC_KEY ??
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  return { serviceId, templateId, publicKey, privateKey };
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  const ip = getClientIp(request);
  const rate = await contactRateLimit(ip);
  if (!rate.success) {
    return NextResponse.json(
      { error: "rate_limit", retryAfter: rate.retryAfterSec },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSec ?? 60),
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const website =
    typeof (body as { website?: unknown }).website === "string"
      ? (body as { website: string }).website
      : "";

  if (website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, message } = parsed.data;

  const { serviceId, templateId, publicKey, privateKey } = getEmailJsConfig();
  if (!serviceId || !templateId || !publicKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: name,
        reply_to: email,
        message,
      },
      {
        publicKey,
        ...(privateKey ? { privateKey } : {}),
      }
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
