import { z } from "zod";
export const services = ["Towing Service", "Recovery Service", "Flatbed Towing", "Roadside Assistance"] as const;
export const contactSchema = z.object({
 name: z.string().trim().min(2).max(100),
 phone: z.string().trim().min(7).max(25).regex(/^\+?[0-9 ()-]+$/),
 email: z.string().trim().email().max(254),
 service: z.enum(services),
 location: z.string().trim().min(2).max(200),
 message: z.string().trim().min(10).max(3000),
 website: z.string().max(0).optional(),
 consent: z.literal(true),
});
