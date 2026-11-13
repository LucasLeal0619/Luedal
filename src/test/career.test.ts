import { describe, it, expect } from "vitest";
import { analyze, demoProfile, emptyProfile, GOAL, skills, explain } from "@/lib/career";
describe("Career rules", () => {
  it("supports Backend Junior as the initial goal", () => {
    expect(GOAL).toBe("Desenvolvedor Backend Júnior");
    expect(emptyProfile().goal).toBe(GOAL);
  });
  it("registers evidence without calling a skill technically validated", () => {
    const a = analyze(demoProfile());
    expect(a.evidenced.has("node")).toBe(true);
    expect(a.evidenced.has("integration")).toBe(false);
  });
  it("prioritizes integration tests when REST and PostgreSQL are declared", () => {
    const a = analyze(demoProfile());
    expect(a.recommendations[0]?.id).toBe("integration");
    const integration = skills.find((s) => s.id === "integration");
    if (!integration) throw new Error("Missing integration skill");
    expect(a.ready(integration)).toBe(true);
  });
  it("does not invent recommendations for an empty profile", () => {
    expect(analyze(emptyProfile()).recommendations).toEqual([]);
  });
  it("does not use the Backend graph for an unrelated goal", () => {
    const profile=demoProfile();profile.goal="Arquiteto de software";
    expect(analyze(profile).recommendations).toEqual([]);
  });
  it("does not equate self-assessment with evidence", () => {
    const p = emptyProfile();
    p.familiarity["integration"] = 4;
    expect(analyze(p).gaps.some((s) => s.id === "integration")).toBe(true);
    expect(analyze(p).mapped.length).toBe(1);
  });
  it("updates route when evidence is added", () => {
    const p = demoProfile();
    const evidence = p.evidences[0];
    if (!evidence) throw new Error("Missing demo evidence");
    evidence.skills.push("integration");
    expect(analyze(p).recommendations[0]?.id).toBe("docker");
  });
  it("completing an activity does not create a skill evidence", () => {
    const p = demoProfile();
    p.progress["integration"] = "completed";
    expect(analyze(p).recommendations.some((s) => s.id === "integration")).toBe(false);
    expect(analyze(p).evidenced.has("integration")).toBe(false);
  });
  it("a new empty profile contains no fabricated competencies or evidence", () => {
    expect(emptyProfile().evidences).toEqual([]);
    expect(analyze(emptyProfile()).mapped.length).toBe(0);
  });
});
