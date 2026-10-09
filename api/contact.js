// Contact form → email, as a Vercel-style serverless function (POST /api/contact).
// Needs RESEND_API_KEY. Until a domain is verified in Resend, mail can only come from
// onboarding@resend.dev to the Resend account's own address; set CONTACT_FROM once it is.
const TO = process.env.CONTACT_TO || "bludennis17@gmail.com";
const FROM = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, message, company } = req.body || {};
  // honeypot filled: pretend it worked so the bot moves on
  if (company) return res.status(200).json({ ok: true });

  const str = (v, max) => typeof v === "string" && v.trim().length > 0 && v.length <= max;
  if (!str(name, 100) || !str(email, 200) || !str(message, 5000) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  // plain text only, so nothing the visitor types is ever rendered as HTML
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: TO,
      reply_to: email,
      subject: `Portfolio message from ${name.replace(/[\r\n]+/g, " ")}`,
      text: `${name} <${email}>\n\n${message}`,
    }),
  });

  if (!r.ok) return res.status(502).json({ error: "Send failed" });
  res.status(200).json({ ok: true });
}
