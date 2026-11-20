export function contactEmail() {
  return process.env.CONTACT_PUBLIC_EMAIL || process.env.CONTACT_TO_EMAIL || "";
}

export function whatsappUrl() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  return /^\d{8,15}$/.test(phone) ? `https://wa.me/${phone}` : "";
}

export function contactReady() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM_EMAIL && process.env.CONTACT_TO_EMAIL &&
    (process.env.VERCEL_ENV !== "production" || (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)));
}
