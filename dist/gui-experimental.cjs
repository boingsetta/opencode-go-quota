"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const j=require("solid-js"),h=require("@opencode/plugin/gui"),re="https://opencode.ai/console",ie="OpenCode Go",se=`.goq-card {
  position: fixed;
  top: 46px;
  right: 14px;
  width: 340px;
  z-index: 2147483000;
  padding: 0;
  overflow: hidden;
  border-radius: 10px;
  background: var(--v2-background-bg-base, #161616);
  box-shadow: var(--v2-elevation-floating, 0 8px 16px rgba(0, 0, 0, 0.16), 0 4px 8px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.12));
  color: var(--v2-text-text-base, #fafafa);
  font-family: var(--font-family-sans, "Inter", ui-sans-serif, system-ui, "Segoe UI", sans-serif);
  font-size: 13px;
  font-weight: 440;
  line-height: 16px;
  letter-spacing: -0.04px;
  opacity: 0;
  transform: translateY(-6px) scale(0.985);
  pointer-events: none;
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.goq-card[data-open="true"] { opacity: 1; transform: none; pointer-events: auto; }
.goq-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 14px 0; }
.goq-title { font-size: 13px; font-weight: 530; letter-spacing: -0.04px; color: var(--v2-text-text-base, #fafafa); }
.goq-plan {
  display: inline-flex;
  align-items: center;
  height: 16px;
  padding: 0 4px;
  border-radius: 2px;
  background: var(--v2-background-bg-layer-03, #3a3a3a);
  color: var(--v2-text-text-muted, #aeaeae);
  font-size: 11px;
  font-weight: 530;
  line-height: 12px;
  letter-spacing: 0.05px;
  text-transform: uppercase;
}
.goq-ws { margin: 0; padding: 2px 14px 10px; font-size: 13px; color: var(--v2-text-text-muted, #aeaeae); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.goq-ws-sub { color: var(--v2-text-text-faint, #808080); }
.goq-rows { padding: 0 0 4px; }
.goq-row { padding: 10px 14px; border-top: 0.5px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.10)); }
.goq-rows .goq-row:first-child { border-top: 0; padding-top: 4px; }
.goq-row-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.goq-label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 530; color: var(--v2-text-text-base, #fafafa); }
.goq-status { display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; font-size: 13px; }
.goq-value { font-size: 13px; font-weight: 530; font-variant-numeric: tabular-nums; color: var(--v2-text-text-base, #fafafa); }
.goq-value[data-tone="danger"] { color: var(--v2-state-fg-danger, #f87171); }
.goq-dot { width: 3px; height: 3px; flex-shrink: 0; border-radius: 50%; background: var(--v2-icon-icon-muted, #808080); }
.goq-reset { font-size: 13px; font-weight: 440; color: var(--v2-text-text-muted, #aeaeae); white-space: nowrap; }
.goq-track { margin-top: 8px; height: 8px; border-radius: 2px; overflow: hidden; background: var(--v2-background-bg-layer-03, #3a3a3a); }
.goq-fill { height: 100%; border-radius: 2px; background: var(--v2-background-bg-inverse, #fafafa); transition: width 0.35s ease; }
.goq-fill[data-tone="danger"] { background: var(--v2-state-fg-danger, #f87171); }
.goq-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 10px 14px 12px; border-top: 0.5px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.10)); font-size: 13px; color: var(--v2-text-text-faint, #808080); }
.goq-link { color: var(--v2-text-text-muted, #aeaeae); cursor: pointer; text-decoration: none; }
.goq-link:hover { color: var(--v2-text-text-base, #fafafa); text-decoration: underline; text-underline-offset: 2px; }
.goq-empty { padding: 4px 14px 10px; font-size: 13px; color: var(--v2-text-text-muted, #aeaeae); }

[data-slot="titlebar-update"]:not(.self-start):has(> button[aria-label^="OpenCode Go"]) {
  width: 24px;
  height: 24px;
}
[data-slot="titlebar-update"]:not(.self-start):has(> button[aria-label^="OpenCode Go"]):hover,
[data-slot="titlebar-update"]:not(.self-start):has(> button[aria-label^="OpenCode Go"]):focus-within {
  width: max-content;
}
[data-slot="titlebar-update"]:not(.self-start):has(> button[aria-label^="OpenCode Go"]) > button > span:not([data-slot]) {
  position: relative;
  width: 24px;
  height: 24px;
}
[data-slot="titlebar-update"]:not(.self-start):has(> button[aria-label^="OpenCode Go"]) > button > span:not([data-slot]) > svg:not(.goq-ring) {
  display: none;
}
.goq-ring { position: absolute; inset: 0; width: 24px; height: 24px; pointer-events: none; overflow: visible; }
.goq-ring .goq-arc { fill: none; stroke-linecap: round; transition: stroke-dasharray 0.35s ease, opacity 0.2s ease; }
.goq-ring .goq-track { fill: none; stroke: rgba(255, 255, 255, 0.12); stroke-width: 3.4; }
.goq-ring .goq-month { stroke: #ffffff; stroke-width: 3.4; }
.goq-ring .goq-week { stroke: #f59e0b; stroke-width: 2.2; }
.goq-ring .goq-roll { stroke: #60a5fa; stroke-width: 1.2; }
.goq-ring .goq-logo { fill: currentColor; opacity: 0.92; }
.goq-ring.goq-limited .goq-logo { fill: #f87171; }
`,r=o=>o.replace(/[&<>"']/g,p=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[p]),le=h.Plugin.define({i18n:{en:{"pill.head":"OpenCode Go","pill.loading":"OpenCode Go · …","pill.anon":"OpenCode Go · not signed in","pill.error":"OpenCode Go · unavailable","pill.noPlan":"OpenCode Go · no plan","pill.limited":"OpenCode Go · limit reached","card.title":"OpenCode Go","card.plan":"Go","card.rolling":"Rolling 5 hours","card.weekly":"This week","card.monthly":"This month","card.reset.before":"resets in ","card.reset.after":"","card.limited":"Limit reached","card.anon":"Not signed in to the OpenCode Console.","card.error":"Could not read usage from the server.","card.noPlan":"No active Go plan on this workspace.","card.budget":"Console budget","card.console":"Open Console","card.updated":"updated ","unit.minute":"min","unit.hour":"h","unit.day":"d","unit.now":"just now","command.group":"OpenCode Go","command.refresh":"Refresh OpenCode Go quota","command.open":"Open OpenCode Go usage in Console"},zh:{"pill.head":"OpenCode Go","pill.loading":"OpenCode Go · …","pill.anon":"OpenCode Go · 未登录","pill.error":"OpenCode Go · 获取失败","pill.noPlan":"OpenCode Go · 未订阅","pill.limited":"OpenCode Go · 已达上限","card.title":"OpenCode Go","card.plan":"Go","card.rolling":"滚动 5 小时","card.weekly":"本周","card.monthly":"本月","card.reset.before":"","card.reset.after":"后重置","card.limited":"已达上限","card.anon":"尚未登录 OpenCode Console。","card.error":"无法从服务端读取用量。","card.noPlan":"当前工作区没有生效的 Go 订阅。","card.budget":"Console 预算","card.console":"打开 Console","card.updated":"更新于 ","unit.minute":"分钟","unit.hour":"小时","unit.day":"天","unit.now":"刚刚","command.group":"OpenCode Go","command.refresh":"刷新 OpenCode Go 额度","command.open":"在 Console 中查看 OpenCode Go 用量"}},setup(o){const[p,G]=j.createSignal({kind:"loading"}),[_,D]=j.createSignal(0);let w=!1;const X=(e,t,n,a)=>{const l=typeof e=="number"?e:typeof e=="string"?Number(e):NaN;return Number.isFinite(l)?Math.min(a,Math.max(n,l)):t},M=e=>typeof e=="string"&&e.trim()?e.trim():void 0,Y=X(o.options.refreshSeconds,60,15,3600),L=M(o.options.location),B=M(o.options.openUrl)??re;let f=L,y=0;const Z=e=>{const t=e.replace(/[\\/]+$/,"").split(/[\\/]/);return t[t.length-1]||e},S=e=>!Number.isFinite(e)||e<=0?"0%":e<1?`${e.toFixed(2)}%`:e<10?`${e.toFixed(1)}%`:`${Math.round(e)}%`,J=e=>{const t=e-Date.now();if(!Number.isFinite(t)||t<=0)return`0 ${o.t("unit.minute")}`;const n=Math.round(t/6e4);if(n<60)return`${n} ${o.t("unit.minute")}`;const a=Math.round(n/60);return a<48?`${a} ${o.t("unit.hour")}`:`${Math.round(a/24)} ${o.t("unit.day")}`},K=e=>{const t=Date.now()-e;if(!Number.isFinite(t)||t<6e4)return o.t("unit.now");const n=Math.round(t/6e4);if(n<60)return`${n} ${o.t("unit.minute")}`;const a=Math.round(n/60);return a<48?`${a} ${o.t("unit.hour")}`:`${Math.round(a/24)} ${o.t("unit.day")}`},x=()=>{const e=p();return e.kind==="ready"?e.info.workspace.usageURL:B},N=()=>{const e=p();if(e.kind==="loading")return o.t("pill.loading");if(e.kind==="anon")return o.t("pill.anon");if(e.kind==="error")return o.t("pill.error");const t=e.info.go;return t?t.monthly.limited?o.t("pill.limited"):`${o.t("pill.head")} · ${S(t.monthly.percent)}`:o.t("pill.noPlan")},W=()=>{const e=p();if(e.kind==="error")return"circle-x";if(e.kind==="anon")return"lock";if(e.kind!=="ready")return"globe";const t=e.info.go;return t?t.monthly.limited?"circle-ban-sign":[t.rolling.percent,t.weekly.percent,t.monthly.percent].some(n=>n>=90)?"circle-exclamation":"globe":"globe"};o.add(h.TitlebarItem,()=>({id:"quota",icon:W(),label:N(),title:N(),busy:p().kind==="loading",run:()=>o.system.openExternal(x())})),o.add(h.Command,()=>({id:"quota.refresh",title:o.t("command.refresh"),group:o.t("command.group"),keywords:"opencode go quota usage limit 额度 用量",run:()=>{q()}})),o.add(h.Command,()=>({id:"quota.open",title:o.t("command.open"),group:o.t("command.group"),keywords:"opencode go console usage 额度 用量",run:()=>o.system.openExternal(x())}));const v=document.createElement("style");v.dataset.plugin="go-quota",v.textContent=se,document.head.appendChild(v);const i=document.createElement("div");i.className="goq-card",i.dataset.open="false",document.body.appendChild(i);const s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.setAttribute("viewBox","0 0 24 24"),s.setAttribute("class","goq-ring"),s.setAttribute("aria-hidden","true"),s.innerHTML='<circle class="goq-track" cx="12" cy="12" r="9.4"/><circle class="goq-arc goq-month" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/><circle class="goq-arc goq-week" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/><circle class="goq-arc goq-roll" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/><g class="goq-logo" transform="translate(5.7 5.7) scale(0.7875)"><g transform="translate(1.2 1.2) scale(0.85)"><path opacity="0.2" d="M11.1999 12.8H4.79993V6.40002H11.1999V12.8Z"/><path d="M11.2 3.2H4.79998V12.8H11.2V3.2ZM14.4 16H1.59998V0H14.4V16Z"/></g></g>';const A=s.querySelector(".goq-month"),E=s.querySelector(".goq-week"),R=s.querySelector(".goq-roll");for(const e of[A,E,R])e.setAttribute("pathLength","100");const Q=()=>{const e=document.querySelectorAll('[data-slot="titlebar-update"]');for(const t of e){if(t.classList.contains("self-start"))continue;const n=t.querySelector('button[aria-label^="OpenCode Go"]');if(n){for(const a of Array.from(n.children))if(a.tagName==="SPAN"&&!a.hasAttribute("data-slot"))return a}}return null},k=(e,t)=>{const n=Math.max(0,Math.min(100,Number(t)||0));e.setAttribute("stroke-dasharray",`${n} ${100-n}`),e.style.opacity=n>0?"1":"0"},$=e=>{const t=e?Number(e.percent):0;return Number.isFinite(t)?t:0};let T="";const F=()=>{const e=Q();if(!e)return;s.parentNode!==e&&e.appendChild(s);const t=p(),n=t.kind==="ready"?t.info.go:void 0,a=$(n?.monthly),l=$(n?.weekly),d=$(n?.rolling),c=!!n&&(n.monthly.limited||n.weekly.limited||n.rolling.limited),O=t.kind==="loading",U=`${t.kind}|${a}|${l}|${d}|${c}`;U!==T&&(T=U,k(A,a),k(E,l),k(R,d),s.style.display=O?"none":"block",s.classList.toggle("goq-limited",c),s.style.opacity=t.kind==="ready"&&n?"1":"0.55")};F();const ee=setInterval(F,500),C=(e,t)=>{const n=Math.max(0,Math.min(100,t.percent)),a=t.limited?"danger":"ok",l=`${o.t("card.reset.before")}${J(t.resetsAt)}${o.t("card.reset.after")}`;return`<div class="goq-row">
        <div class="goq-row-head">
          <span class="goq-label">${r(e)}</span>
          <span class="goq-status">
            <span class="goq-value" data-tone="${a}">${t.limited?o.t("card.limited"):S(t.percent)}</span>
            <span class="goq-dot" aria-hidden="true"></span>
            <span class="goq-reset">${r(l)}</span>
          </span>
        </div>
        <div class="goq-track"><div class="goq-fill" data-tone="${a}" style="width:${n}%"></div></div>
      </div>`},H=()=>{const e=p(),t=`<div class="goq-foot">
        <span>${r(`${o.t("card.updated")}${K(_())}`)}</span>
        <a class="goq-link" data-act="open">${r(o.t("card.console"))}</a>
      </div>`;if(e.kind==="loading"){i.innerHTML=`<div class="goq-head"><span class="goq-title">${r(o.t("card.title"))}</span></div>
          <div class="goq-empty">…</div>${t}`;return}if(e.kind==="anon"){i.innerHTML=`<div class="goq-head"><span class="goq-title">${r(o.t("card.title"))}</span></div>
          <div class="goq-empty">${r(o.t("card.anon"))}</div>${t}`;return}if(e.kind==="error"){i.innerHTML=`<div class="goq-head"><span class="goq-title">${r(o.t("card.title"))}</span></div>
          <div class="goq-empty">${r(o.t("card.error"))}</div>${t}`;return}const n=e.info,a=n.go,l=n.workspace.name??n.workspace.id,d=`<div class="goq-head">
          <span class="goq-title">${r(o.t("card.title"))}</span>
          ${a?`<span class="goq-plan">${r(o.t("card.plan"))}</span>`:""}
        </div>
        <div class="goq-ws">${r(l)}${f?`<span class="goq-ws-sub"> · ${r(Z(f))}</span>`:""}</div>`;if(!a){const c=n.budgets[0],O=c?`<div class="goq-row">
              <div class="goq-row-head">
                <span class="goq-label">${r(o.t("card.budget"))}</span>
                <span class="goq-value">$${c.spent.toFixed(2)} / $${c.limit.toFixed(2)}</span>
              </div>
              <div class="goq-track"><div class="goq-fill" style="width:${Math.min(100,c.spent/Math.max(c.limit,.01)*100)}%"></div></div>
            </div>`:`<div class="goq-empty">${r(o.t("card.noPlan"))}</div>`;i.innerHTML=`${d}<div class="goq-rows">${O}</div>${t}`;return}i.innerHTML=`${d}
        <div class="goq-rows">
          ${C(o.t("card.rolling"),a.rolling)}
          ${C(o.t("card.weekly"),a.weekly)}
          ${C(o.t("card.monthly"),a.monthly)}
        </div>${t}`};let g;const te=()=>{g!==void 0&&(clearTimeout(g),g=void 0),i.dataset.open="true"},P=()=>{g===void 0&&(g=window.setTimeout(()=>{g=void 0,i.dataset.open="false"},300))};i.addEventListener("click",e=>{e.target?.dataset.act==="open"&&(e.preventDefault(),o.system.openExternal(x()))});let u=null;const oe=()=>{if(u&&document.contains(u))return u;u=null;for(const e of document.querySelectorAll("[aria-label]"))if((e.getAttribute("aria-label")??"").startsWith(ie)){u=e;break}return u},ne=(e,t,n)=>t>=e.left&&t<=e.right&&n>=e.top&&n<=e.bottom;let m=0;const z=e=>{m||(m=requestAnimationFrame(()=>{m=0;const n=oe()?.getBoundingClientRect(),a=n?ne(n,e.clientX,e.clientY):!1;let l=!1;if(i.dataset.open==="true"){const d=i.getBoundingClientRect(),c=n?Math.min(d.top,n.top):d.top;l=e.clientX>=d.left&&e.clientX<=d.right&&e.clientY>=c&&e.clientY<=d.bottom}a||l?te():P()}))};window.addEventListener("pointermove",z,{passive:!0});const b=()=>P();document.addEventListener("pointerleave",b),window.addEventListener("blur",b);const q=async()=>{const e=++y;try{const t=await o.client.usage.limits(f?{location:{directory:f}}:void 0);if(w||e!==y)return;G(t.data?{kind:"ready",info:t.data}:{kind:"anon"})}catch(t){if(w||e!==y)return;G({kind:"error",message:t instanceof Error?t.message:String(t)})}D(Date.now()),H()};h.createKeyed(()=>o.sessions.current()?.directory,e=>{f=L??e??void 0,H(),q()});const ae=setInterval(()=>{q()},Y*1e3);let I=0;const V=()=>{const e=Date.now();e-I<15e3||(I=e,q())};return window.addEventListener("focus",V),()=>{w=!0,clearInterval(ae),clearInterval(ee),g!==void 0&&clearTimeout(g),m&&cancelAnimationFrame(m),window.removeEventListener("pointermove",z),document.removeEventListener("pointerleave",b),window.removeEventListener("blur",b),window.removeEventListener("focus",V),s.remove(),i.remove(),v.remove()}}});exports.default=le;
