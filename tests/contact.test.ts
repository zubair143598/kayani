import { test } from "node:test";
import assert from "node:assert/strict";
import { contactSchema } from "../src/lib/contact-schema";
const valid = { name: "Test Customer", phone: "+966 50 796 3500", email: "customer@example.com", service: "Flatbed Towing", location: "Dammam", message: "My car needs flatbed transport.", consent: true, website: "" };
test("accepts and trims legitimate submissions", () => { assert.equal(contactSchema.parse({ ...valid, name: "  Test Customer  " }).name, "Test Customer"); });
test("rejects malformed, oversized and automated submissions", () => { for (const change of [{ email: "invalid" }, { phone: "letters" }, { service: "invented" }, { consent: false }, { website: "spam" }, { message: "x".repeat(3001) }, { name: "" }]) assert.equal(contactSchema.safeParse({ ...valid, ...change }).success, false); });
