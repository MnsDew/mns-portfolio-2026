const EMAILJS_API = "https://api.emailjs.com/api/v1.0/email/send";

export interface SendEmailParams {
  serviceId: string;
  templateId: string;
  publicKey: string;
  privateKey?: string;
  templateParams: Record<string, string>;
}

export async function sendEmailViaEmailJs({
  serviceId,
  templateId,
  publicKey,
  privateKey,
  templateParams,
}: SendEmailParams): Promise<void> {
  const res = await fetch(EMAILJS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lib_version: "5.0.2",
      user_id: publicKey,
      ...(privateKey ? { accessToken: privateKey } : {}),
      service_id: serviceId,
      template_id: templateId,
      template_params: templateParams,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `EmailJS ${res.status}`);
  }
}
