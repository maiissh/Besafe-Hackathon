import { describe, expect, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import express from "express";
import serenaRoutes from "./routes/serena.routes.js";

// Create test app
const app = express();
app.use(express.json());
app.use("/api", serenaRoutes);

describe("serena.chat", () => {
  it("should accept an Arabic message and return a reply", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({
        message: "مرحبا، كيف حالك؟",
      })
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(true);
    expect(response.body.reply).toBeDefined();
    expect(typeof response.body.reply).toBe("string");
    expect(response.body.reply.length).toBeGreaterThan(0);
    expect(response.body.detectedLanguage).toBe("ar");
  }, 15000);

  it("should reject empty messages", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({
        message: "",
      })
      .expect(400);

    expect(response.body).toBeDefined();
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBeDefined();
  });

  it("should handle Arabic questions about internet safety", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({
        message: "ما هي أفضل طرق حماية كلمة المرور؟",
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.reply).toBeDefined();
    expect(response.body.reply.length).toBeGreaterThan(0);
    expect(response.body.detectedLanguage).toBe("ar");
  }, 15000);

  it("should handle English questions", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({
        message: "What is the capital of France?",
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.reply).toBeDefined();
    expect(response.body.reply.length).toBeGreaterThan(0);
    expect(response.body.detectedLanguage).toBe("en");
  }, 15000);

  it("should handle French questions", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({
        message: "Quelle est la capitale de la France?",
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.reply).toBeDefined();
    expect(response.body.reply.length).toBeGreaterThan(0);
    expect(["fr", "en"]).toContain(response.body.detectedLanguage);
  }, 15000);

  it("should handle Spanish questions", async () => {
    const response = await request(app)
      .post("/api/chat")
      .send({
        message: "¿Cuál es la capital de Francia?",
      })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.reply).toBeDefined();
    expect(response.body.reply.length).toBeGreaterThan(0);
    expect(["es", "en"]).toContain(response.body.detectedLanguage);
  }, 15000);
});