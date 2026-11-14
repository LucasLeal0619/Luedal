import { describe, expect, it, vi } from "vitest";
import { signOutAccount } from "@/lib/sign-out";

describe("Account sign-out", () => {
  it("clears protected queries, ends the session and opens login in order", async () => {
    const calls: string[] = [];
    await signOutAccount({
      cancelQueries: async () => { calls.push("cancel"); },
      clearQueries: () => { calls.push("cache"); },
      endSession: async () => { calls.push("session"); return { error: null }; },
      clearProfile: () => { calls.push("profile"); },
      goToLogin: async () => { calls.push("login"); },
    });
    expect(calls).toEqual(["cancel", "cache", "session", "profile", "login"]);
  });
  it("does not pretend to sign out when the session cannot be cleared", async () => {
    const clearProfile = vi.fn();
    const goToLogin = vi.fn();
    await expect(signOutAccount({
      cancelQueries: async () => {}, clearQueries: () => {},
      endSession: async () => ({ error: new Error("offline") }),
      clearProfile, goToLogin,
    })).rejects.toThrow("offline");
    expect(clearProfile).not.toHaveBeenCalled();
    expect(goToLogin).not.toHaveBeenCalled();
  });
});