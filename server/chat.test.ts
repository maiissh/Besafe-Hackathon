import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type PublicContext = TrpcContext & { user: null };

function createPublicContext(): PublicContext {
  const ctx: PublicContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn( ),
    } as unknown as TrpcContext["res"],
  };

  return ctx;
}

describe("chat.sendMessage", () => {
  it("should accept an Arabic message and return a reply", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "مرحبا، كيف حالك؟",
    });

    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.reply).toBeDefined();
    expect(typeof result.reply).toBe("string");
    expect(result.reply.length).toBeGreaterThan(0);
    expect(result.detectedLanguage).toBe("ar");
  }, 15000);

  it("should reject empty messages", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.chat.sendMessage({
        message: "",
      });
      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should handle Arabic questions about internet safety", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "ما هي أفضل طرق حماية كلمة المرور؟",
    });

    expect(result.success).toBe(true);
    expect(result.reply).toBeDefined();
    expect(result.reply.length).toBeGreaterThan(0);
    expect(result.detectedLanguage).toBe("ar");
  }, 15000);

  it("should handle English questions", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "What is the capital of France?",
    });

    expect(result.success).toBe(true);
    expect(result.reply).toBeDefined();
    expect(result.reply.length).toBeGreaterThan(0);
    expect(result.detectedLanguage).toBe("en");
  }, 15000);

  it("should handle French questions", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "Quelle est la capitale de la France?",
    });

    expect(result.success).toBe(true);
    expect(result.reply).toBeDefined();
    expect(result.reply.length).toBeGreaterThan(0);
    expect(result.detectedLanguage).toBe("fr");
  }, 15000);

  it("should handle Spanish questions", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.chat.sendMessage({
      message: "¿Cuál es la capital de Francia?",
    });

    expect(result.success).toBe(true);
    expect(result.reply).toBeDefined();
    expect(result.reply.length).toBeGreaterThan(0);
    expect(result.detectedLanguage).toBe("es");
  }, 15000);
});
