import { readFileSync } from "node:fs";

declare const Bun: {
  serve(options: { port: number; fetch(request: Request): Response }): { port: number };
};

const timerPath = new URL("../ui/timer.html", import.meta.url);
const bridge = `<script>window.blinkoCustomUi={storage:{get:async k=>JSON.parse(localStorage.getItem("preview:"+k)||"null"),set:async(k,v)=>localStorage.setItem("preview:"+k,JSON.stringify(v)),remove:async k=>localStorage.removeItem("preview:"+k)},state:()=>{},minimize:()=>{},expand:()=>{},close:()=>{}};</script>`;
const server=Bun.serve({port:Number(process.env.PORT??4180),fetch(request){const url=new URL(request.url);const theme=url.searchParams.get("theme")==="dark"?"dark":"light";const requested=url.searchParams.get("locale")??"zh-CN";const locale=/^(?:en|zh-CN|zh-TW)$/.test(requested)?requested:"en";const html=readFileSync(timerPath,"utf8").replace('<html lang="en">',`<html lang="${locale}" data-blinko-locale="${locale}" data-blinko-theme="${theme}">`).replace("<script>",`${bridge}<script>`);return new Response(html,{headers:{"content-type":"text/html; charset=utf-8"}})}});
console.log(`Blinko Pomodoro preview: http://localhost:${server.port}`);
