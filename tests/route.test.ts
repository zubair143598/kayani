import { test, mock } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { Contact, ContactLimit } from "../src/lib/mongodb";
import { POST } from "../src/app/api/contact/route";
const data = { name: "Test Customer", phone: "+966507963500", email: "test@example.com", service: "Towing Service", location: "Dammam", message: "Test enquiry for vehicle towing.", consent: true };
const request = (body: unknown, origin = "http://localhost:3017") => new Request("http://localhost:3017/api/contact", { method: "POST", headers: { "Content-Type": "application/json", origin }, body: JSON.stringify(body) });
test("contact API validation, persistence, and delivery outcomes", async () => {
    process.env.SITE_URL = "http://localhost:3017";
    assert.equal((await POST(request(data, "https://other.example"))).status, 403);
    assert.equal((await POST(request({}))).status, 400);
    assert.equal((await POST(request({ message: "x".repeat(17000) }))).status, 413);
    delete process.env.MONGODB_URI;
    assert.equal((await POST(request(data))).status, 503);
    for (const key of ["MONGODB_URI", "SMTP_HOST", "SMTP_USER", "SMTP_PASS", "SMTP_FROM"]) process.env[key] = "test-placeholder";
    let emailed: Record<string, unknown> | undefined;
    let failEmail = false, count = 1;
    const statuses: string[] = [];
    mock.method(mongoose, "connect", async () => mongoose);
    mock.method(ContactLimit, "findOneAndUpdate", async () => ({ count }));
    mock.method(Contact, "create", async () => ({ _id: "test-record" }));
    mock.method(Contact, "updateOne", async (_query: unknown, update: { emailStatus: string }) => { statuses.push(update.emailStatus); });
    mock.method(nodemailer, "createTransport", () => ({ sendMail: async (mail: Record<string, unknown>) => { if (failEmail) throw new Error("simulated failure"); emailed = mail; return { accepted: ["md.zubair33759@gmail.com"] }; } }));
    try {
        assert.equal((await POST(request(data))).status, 201);
        assert.equal(emailed?.to, "md.zubair33759@gmail.com");
        assert.equal(emailed?.replyTo, data.email);
        assert.match(String(emailed?.text), /Test enquiry/);
        assert.equal(statuses.at(-1), "sent");
        failEmail = true;
        const failed = await POST(request(data));
        assert.equal(failed.status, 502);
        assert.equal((await failed.json()).saved, true);
        assert.equal(statuses.at(-1), "failed");
        count = 4;
        assert.equal((await POST(request(data))).status, 429);
    } finally { mock.restoreAll(); }
});
