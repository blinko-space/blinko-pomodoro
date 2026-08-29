import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseExtensionManifest } from "@blinko-cloud/cli/sdk";

const root=resolve(import.meta.dirname,"..");
const blinko=resolve(root,"node_modules/.bin/blinko");
const runCli=(command:"validate"|"build")=>execFileSync(blinko,["extension",command,"."],{cwd:root,encoding:"utf8"});

describe("Blinko Pomodoro App",()=>{
  it("declares only the App-state permissions needed for persistent presets",()=>{const manifest=parseExtensionManifest(JSON.parse(readFileSync(resolve(root,"blinko.app.json"),"utf8")));expect(manifest).toMatchObject({appId:"cloud.blinko.pomodoro",permissions:{required:["state:own:read","state:own:write"]},network:{domains:[]},ui:{customViews:[expect.objectContaining({id:"pomodoro.timer",presentation:"floating-window",resizable:true,maxWidth:520,maxHeight:720})]},contributes:{items:[expect.objectContaining({surface:"app/toolbar",viewId:"pomodoro.timer",icon:"timer"})]}});expect(runCli("validate")).toContain("Valid cloud.blinko.pomodoro");});
  it("packages a local user-started timer",()=>{runCli("build");const resourceIndex=JSON.parse(readFileSync(resolve(root,"dist/resource-index.json"),"utf8"));const resource=resourceIndex.resources.find((item:{id:string})=>item.id==="ui.pomodoro.timer");const html=readFileSync(resolve(root,"dist",resource.path),"utf8");expect(html).toContain("setInterval");expect(html).toContain("clearInterval");expect(html).toContain('id="startButton"');expect(html).not.toContain("data-blinko-drag-handle");expect(html).not.toContain("bridge.minimize()");expect(html).not.toContain("bridge.close()");expect(html).toContain('bridge.storage.set("settings"');expect(html).toContain("createOscillator");expect(html).not.toMatch(/<script\b[^>]*\bsrc\s*=/i);},15000);
  it("opens an accessible preset panel with an unambiguous controls icon",()=>{runCli("build");const resourceIndex=JSON.parse(readFileSync(resolve(root,"dist/resource-index.json"),"utf8"));const resource=resourceIndex.resources.find((item:{id:string})=>item.id==="ui.pomodoro.timer");const html=readFileSync(resolve(root,"dist",resource.path),"utf8");expect(html).toContain('aria-controls="settingsPanel"');expect(html).toContain('aria-expanded="false"');expect(html).toContain("setSettingsOpen");expect(html).toContain('id="saveStatus"');expect(html).toContain("saveFailed");expect(html).not.toContain('M12 3v2M12 19v2M3 12h2');},15000);
});
