import { expect, it } from "vitest";
import { messagePair } from "@/lib/chat-persistence";
it("sets created_at on both rows to prevent NOT NULL failure in bulk insertion",()=>{
  const rows=messagePair("conversation","owner","Oi","Olá",0);
  expect(rows.map(r=>r.created_at)).toEqual(["1970-01-01T00:00:00.000Z","1970-01-01T00:00:00.001Z"]);
});
it("keeps both messages associated with the same owner and conversation",()=>{
  const rows=messagePair("conversation","owner","Oi","Olá",0);
  expect(rows.map(r=>[r.user_id,r.conversation_id])).toEqual([["owner","conversation"],["owner","conversation"]]);
});