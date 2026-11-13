import { describe, it, expect } from "vitest";
import { canEnterWorkspace, destination, signupSchema, resetSchema } from "@/lib/auth-rules";
import { realProfile, profileContext, chatSchema, boundedHistory } from "@/lib/chat-rules";
describe("Authentication rules",()=>{
  it("denies a signed-out direct dashboard visit",()=>expect(canEnterWorkspace(null)).toBe(false));
  it("requires a real authenticated identity",()=>expect(canEnterWorkspace("real-user-id")).toBe(true));
  it("routes new accounts to onboarding",()=>expect(destination(false)).toBe("/onboarding"));
  it("routes completed accounts to dashboard",()=>expect(destination(true)).toBe("/dashboard"));
  it("rejects mismatched signup passwords",()=>expect(signupSchema.safeParse({name:"Lucas Eduardo",email:"lucas@example.com",password:"abcdefgh",confirm:"ijklmnop"}).success).toBe(false));
  it("rejects mismatched recovery passwords",()=>expect(resetSchema.safeParse({password:"abcdefgh",confirm:"ijklmnop"}).success).toBe(false));
  it("rejects passwords shorter than eight",()=>expect(resetSchema.safeParse({password:"1234567",confirm:"1234567"}).success).toBe(false));
});
describe("Private AI context",()=>{
  it("never assigns Alex Martins to an empty real account",()=>expect(realProfile({}).name).toBe(""));
  it("uses the actual stored name",()=>expect(profileContext(realProfile({name:"Lucas Eduardo"}),"/dashboard").name).toBe("Lucas Eduardo"));
  it("does not invent a goal before onboarding",()=>expect(profileContext(realProfile({}),"/dashboard").goal).toBeNull());
  it("rejects more than 2000 input characters",()=>expect(chatSchema.safeParse({conversationId:null,page:"/dashboard",message:"a".repeat(2001)}).success).toBe(false));
  it("keeps at most twenty history messages",()=>expect(boundedHistory(Array.from({length:30},(_,i)=>({content:String(i)}))).length).toBe(20));
  it("caps history at 24000 characters",()=>expect(boundedHistory(Array.from({length:10},()=>({content:"a".repeat(4000)}))).length).toBe(6));
});