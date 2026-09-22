import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createHash } from "node:crypto";
import { contactSchema } from "@/lib/contact-schema";
import { connectDB, Contact, ContactLimit } from "@/lib/mongodb";
export const runtime = "nodejs";
export const maxDuration = 60;
const reply = (error: string, status: number) => NextResponse.json({ error }, { status });
export async function POST(request: Request) {
 const origin = request.headers.get("origin");
 const expected = process.env.SITE_URL || new URL(request.url).origin;
 if (origin && origin !== new URL(expected).origin) return reply("ORIGIN", 403);
 if (!request.headers.get("content-type")?.includes("application/json")) return reply("CONTENT_TYPE", 415);
 // Stream with a hard byte limit, including requests without Content-Length.
 let raw = "";
 const reader = request.body?.getReader();
 if (!reader) return reply("INVALID", 400);
 const decoder = new TextDecoder(); let bytes = 0;
 try {
  while (true) { const { done, value } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > 16384) { await reader.cancel(); return reply("TOO_LARGE", 413); } raw += decoder.decode(value, { stream: true }); }
  raw += decoder.decode();
 } catch { return reply("INVALID", 400); }
 let input: unknown;
 try { input = JSON.parse(raw); } catch { return reply("INVALID", 400); }
 const parsed = contactSchema.safeParse(input);
 if (!parsed.success) return reply("INVALID", 400);
 if (!["MONGODB_URI", "SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"].every(key => process.env[key])) return reply("UNAVAILABLE", 503);
 const { website: _website, ...data } = parsed.data;
 let record;
 try {
  await connectDB();
  // Persistent per-email limit across instances; no reliance on untrusted IP headers.
  const bucket = Math.floor(Date.now() / 900000);
  const key = createHash("sha256").update(data.email.toLowerCase() + ":" + bucket).digest("hex");
  const limit = await ContactLimit.findOneAndUpdate({ _id: key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * 900000) } }, { upsert: true, new: true });
  if (limit.count > 3) return reply("RATE_LIMIT", 429);
  record = await Contact.create(data);
 } catch { console.error("Contact persistence failed"); return reply("UNAVAILABLE", 503); }
 try {
  const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 465), secure: process.env.SMTP_SECURE !== "false", auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000, disableFileAccess: true, disableUrlAccess: true });
  const info = await transport.sendMail({ from: process.env.SMTP_FROM, to: "md.zubair33759@gmail.com", replyTo: data.email, subject: "Kayani Towing — new " + data.service + " request", text: [`Request: ${record._id}`, `Name: ${data.name}`, `Phone: ${data.phone}`, `Email: ${data.email}`, `Service: ${data.service}`, `Location: ${data.location}`, "", data.message].join("\n") });
  if (!info.accepted?.length) throw new Error("Recipient rejected");
 } catch {
  await Contact.updateOne({ _id: record._id }, { emailStatus: "failed" }).catch(() => console.error("Email status update failed"));
  return NextResponse.json({ error: "EMAIL_FAILED", saved: true }, { status: 502 });
 }
 // A status-write failure must not report a delivered message as failed.
 await Contact.updateOne({ _id: record._id }, { emailStatus: "sent" }).catch(() => console.error("Email status update failed"));
 return NextResponse.json({ success: true }, { status: 201 });
}
