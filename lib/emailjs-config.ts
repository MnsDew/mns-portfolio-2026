export function getPublicEmailJsConfig() {
  return {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
  };
}

export function isEmailJsConfigured() {
  const { serviceId, templateId, publicKey } = getPublicEmailJsConfig();
  return Boolean(serviceId && templateId && publicKey);
}
