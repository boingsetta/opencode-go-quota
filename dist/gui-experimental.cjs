"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const P=require("solid-js"),T=require("effect"),u=require("@opencode/plugin/gui"),$e="https://opencode.ai/console",xe="https://opencode.ai/zen/go/v1/usage",z="go-quota.apiKey",Ce="OpenCode Go",H=t=>{const d=Number(t?.percent??0),g=t?.resetsAt?Date.parse(t.resetsAt):0;return{percent:Number.isFinite(d)?d:0,limited:t?.status==="limited"||t?.status==="limit_reached",resetsAt:Number.isFinite(g)?g:0}},re=t=>u.Ipc.define({id:`${t}.usage`,methods:{fetch:{input:T.Schema.Struct({apiKey:T.Schema.String}),output:T.Schema.Unknown}}}),Ae=`.goq-card {
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
.goq-badges { display: inline-flex; align-items: center; gap: 4px; }
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
.goq-login { display: grid; gap: 8px; padding: 4px 14px 10px; }
.goq-input {
  width: 100%;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--v2-border-border-base, rgba(255, 255, 255, 0.14));
  border-radius: 6px;
  background: var(--v2-background-bg-layer-02, #232323);
  color: var(--v2-text-text-base, #fafafa);
  font: inherit;
  outline: none;
}
.goq-input::placeholder { color: var(--v2-text-text-faint, #808080); }
.goq-input:focus { border-color: var(--v2-border-border-focus, #5b5ef4); }
.goq-btn {
  height: 30px;
  border: 0;
  border-radius: 6px;
  background: var(--v2-background-bg-inverse, #fafafa);
  color: var(--v2-text-text-inverse, #161616);
  font: inherit;
  font-weight: 530;
  cursor: pointer;
}
.goq-btn:hover { opacity: 0.9; }
.goq-error { min-height: 16px; color: var(--v2-state-fg-danger, #f87171); font-size: 12px; }
.goq-foot-links { display: inline-flex; align-items: center; gap: 12px; }

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
`,r=t=>t.replace(/[&<>"']/g,d=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[d]),Se=u.Plugin.define({i18n:{en:{"pill.head":"OpenCode Go","pill.loading":"OpenCode Go · …","pill.anon":"OpenCode Go · not signed in","pill.error":"OpenCode Go · unavailable","pill.noPlan":"OpenCode Go · no plan","pill.limited":"OpenCode Go · limit reached","card.title":"OpenCode Go","card.plan":"Go","card.rolling":"Rolling 5 hours","card.weekly":"This week","card.monthly":"This month","card.reset.before":"resets in ","card.reset.after":"","card.limited":"Limit reached","card.anon":"Not signed in to the OpenCode Console.","card.error":"Could not read usage from the server.","card.noPlan":"No active Go plan on this workspace.","card.budget":"Console budget","card.console":"Open Console","card.updated":"updated ","card.api":"API","card.apiWorkspace":"API key","unit.minute":"min","unit.hour":"h","unit.day":"d","unit.now":"just now","login.action":"Use API key","login.submit":"Sign in","login.signOut":"Sign out","login.title":"OpenCode Go API key","login.description":"Paste your OpenCode Go API key. It is stored locally in plain text.","login.placeholder":"sk-...","login.saved":"API key saved","login.removed":"API key removed","login.invalid":"API key rejected","login.configured":"API key is configured in opencode.json","command.group":"OpenCode Go","command.refresh":"Refresh OpenCode Go quota","command.open":"Open OpenCode Go usage in Console","command.login":"Set OpenCode Go API key","command.logout":"Forget OpenCode Go API key"},zh:{"pill.head":"OpenCode Go","pill.loading":"OpenCode Go · …","pill.anon":"OpenCode Go · 未登录","pill.error":"OpenCode Go · 获取失败","pill.noPlan":"OpenCode Go · 未订阅","pill.limited":"OpenCode Go · 已达上限","card.title":"OpenCode Go","card.plan":"Go","card.rolling":"滚动 5 小时","card.weekly":"本周","card.monthly":"本月","card.reset.before":"","card.reset.after":"后重置","card.limited":"已达上限","card.anon":"尚未登录 OpenCode Console。","card.error":"无法从服务端读取用量。","card.noPlan":"当前工作区没有生效的 Go 订阅。","card.budget":"Console 预算","card.console":"打开 Console","card.updated":"更新于 ","card.api":"API","card.apiWorkspace":"API 密钥","unit.minute":"分钟","unit.hour":"小时","unit.day":"天","unit.now":"刚刚","login.action":"使用 API Key","login.submit":"登录","login.signOut":"退出 API Key","login.title":"OpenCode Go API Key","login.description":"粘贴你的 OpenCode Go API Key。它会以明文保存在本地。","login.placeholder":"sk-...","login.saved":"API Key 已保存","login.removed":"API Key 已清除","login.invalid":"API Key 无效","login.configured":"API Key 已在 opencode.json 中配置","command.group":"OpenCode Go","command.refresh":"刷新 OpenCode Go 额度","command.open":"在 Console 中查看 OpenCode Go 用量","command.login":"设置 OpenCode Go API Key","command.logout":"清除 OpenCode Go API Key"}},main(t){const d=re(t.id);t.provide(d,{fetch:async({apiKey:g})=>{const m=await fetch(xe,{headers:{Authorization:`Bearer ${g}`,Accept:"application/json"},signal:AbortSignal.timeout(15e3)});if(!m.ok)throw new Error(m.status===401?"invalid api key":`HTTP ${m.status}`);return await m.json()}})},setup(t){const[d,g]=P.createSignal({kind:"loading"}),[m,ie]=P.createSignal(0),[C,A]=P.createSignal(!1),[se,v]=P.createSignal(),U=t.main(re(t.id));let S=!1;const le=(e,o,n,a)=>{const s=typeof e=="number"?e:typeof e=="string"?Number(e):NaN;return Number.isFinite(s)?Math.min(a,Math.max(n,s)):o},L=e=>typeof e=="string"&&e.trim()?e.trim():void 0,de=le(t.options.refreshSeconds,60,15,3600),j=L(t.options.location),D=L(t.options.openUrl)??$e,ce=()=>{try{return localStorage.getItem(z)?.trim()||void 0}catch{return}},_=L(t.options.apiKey);let f=_??ce(),w=j,O=0;const ge=e=>{const o=e.replace(/[\\/]+$/,"").split(/[\\/]/);return o[o.length-1]||e},V=e=>!Number.isFinite(e)||e<=0?"0%":e<1?`${e.toFixed(2)}%`:e<10?`${e.toFixed(1)}%`:`${Math.round(e)}%`,pe=e=>{const o=e-Date.now();if(!Number.isFinite(o)||o<=0)return`0 ${t.t("unit.minute")}`;const n=Math.round(o/6e4);if(n<60)return`${n} ${t.t("unit.minute")}`;const a=Math.round(n/60);return a<48?`${a} ${t.t("unit.hour")}`:`${Math.round(a/24)} ${t.t("unit.day")}`},ue=e=>{const o=Date.now()-e;if(!Number.isFinite(o)||o<6e4)return t.t("unit.now");const n=Math.round(o/6e4);if(n<60)return`${n} ${t.t("unit.minute")}`;const a=Math.round(n/60);return a<48?`${a} ${t.t("unit.hour")}`:`${Math.round(a/24)} ${t.t("unit.day")}`},M=()=>{const e=d();return e.kind==="ready"?e.info.workspace.usageURL:D},Y=e=>{const o=document.querySelector('.goq-card [data-role="login-error"]');o&&(o.textContent=e)},E=async(e,o=!1)=>{const n=e.trim();if(n){v(void 0),Y("");try{await U.fetch({apiKey:n})}catch{const a=t.t("login.invalid");v(a),o?Y(a):(A(!0),h()),t.toast.show({variant:"error",title:a});return}f=n;try{localStorage.setItem(z,n)}catch{}A(!1),v(void 0),g({kind:"loading"}),h(),b(),t.toast.show({variant:"success",title:t.t("login.saved")})}},fe=async()=>{const e=await t.dialogs.prompt({title:t.t("login.title"),description:t.t("login.description"),placeholder:t.t("login.placeholder"),secret:!0});e&&await E(e,!1)},B=()=>{if(_){t.toast.show({variant:"error",title:t.t("login.configured")});return}f=void 0;try{localStorage.removeItem(z)}catch{}A(!1),v(void 0),g({kind:"loading"}),h(),b(),t.toast.show({variant:"success",title:t.t("login.removed")})},W=()=>{const e=d();if(e.kind==="loading")return t.t("pill.loading");if(e.kind==="anon")return t.t("pill.anon");if(e.kind==="error")return t.t("pill.error");const o=e.info.go;return o?o.monthly.limited?t.t("pill.limited"):`${t.t("pill.head")} · ${V(o.monthly.percent)}`:t.t("pill.noPlan")},me=()=>{const e=d();if(e.kind==="error")return"circle-x";if(e.kind==="anon")return"lock";if(e.kind!=="ready")return"globe";const o=e.info.go;return o?o.monthly.limited?"circle-ban-sign":[o.rolling.percent,o.weekly.percent,o.monthly.percent].some(n=>n>=90)?"circle-exclamation":"globe":"globe"};t.add(u.TitlebarItem,()=>({id:"quota",icon:me(),label:W(),title:W(),busy:d().kind==="loading",run:()=>t.system.openExternal(M())})),t.add(u.Command,()=>({id:"quota.refresh",title:t.t("command.refresh"),group:t.t("command.group"),keywords:"opencode go quota usage limit 额度 用量",run:()=>{b()}})),t.add(u.Command,()=>({id:"quota.open",title:t.t("command.open"),group:t.t("command.group"),keywords:"opencode go console usage 额度 用量",run:()=>t.system.openExternal(M())})),t.add(u.Command,()=>({id:"quota.login",title:t.t("command.login"),group:t.t("command.group"),keywords:"opencode go api key login 登录 密钥",run:()=>{fe()}})),t.add(u.Command,()=>({id:"quota.logout",title:t.t("command.logout"),group:t.t("command.group"),keywords:"opencode go api key logout 清除 密钥",run:()=>B()}));const G=document.createElement("style");G.dataset.plugin="go-quota",G.textContent=Ae,document.head.appendChild(G);const i=document.createElement("div");i.className="goq-card",i.dataset.open="false",document.body.appendChild(i);const c=document.createElementNS("http://www.w3.org/2000/svg","svg");c.setAttribute("viewBox","0 0 24 24"),c.setAttribute("class","goq-ring"),c.setAttribute("aria-hidden","true"),c.innerHTML='<circle class="goq-track" cx="12" cy="12" r="9.4"/><circle class="goq-arc goq-month" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/><circle class="goq-arc goq-week" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/><circle class="goq-arc goq-roll" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/><g class="goq-logo" transform="translate(5.7 5.7) scale(0.7875)"><g transform="translate(1.2 1.2) scale(0.85)"><path opacity="0.2" d="M11.1999 12.8H4.79993V6.40002H11.1999V12.8Z"/><path d="M11.2 3.2H4.79998V12.8H11.2V3.2ZM14.4 16H1.59998V0H14.4V16Z"/></g></g>';const X=c.querySelector(".goq-month"),Z=c.querySelector(".goq-week"),J=c.querySelector(".goq-roll");for(const e of[X,Z,J])e.setAttribute("pathLength","100");const ve=()=>{const e=document.querySelectorAll('[data-slot="titlebar-update"]');for(const o of e){if(o.classList.contains("self-start"))continue;const n=o.querySelector('button[aria-label^="OpenCode Go"]');if(n){for(const a of Array.from(n.children))if(a.tagName==="SPAN"&&!a.hasAttribute("data-slot"))return a}}return null},N=(e,o)=>{const n=Math.max(0,Math.min(100,Number(o)||0));e.setAttribute("stroke-dasharray",`${n} ${100-n}`),e.style.opacity=n>0?"1":"0"},K=e=>{const o=e?Number(e.percent):0;return Number.isFinite(o)?o:0};let Q="";const ee=()=>{const e=ve();if(!e)return;c.parentNode!==e&&e.appendChild(c);const o=d(),n=o.kind==="ready"?o.info.go:void 0,a=K(n?.monthly),s=K(n?.weekly),l=K(n?.rolling),q=!!n&&(n.monthly.limited||n.weekly.limited||n.rolling.limited),R=o.kind==="loading",$=`${o.kind}|${a}|${s}|${l}|${q}`;$!==Q&&(Q=$,N(X,a),N(Z,s),N(J,l),c.style.display=R?"none":"block",c.classList.toggle("goq-limited",q),c.style.opacity=o.kind==="ready"&&n?"1":"0.55")};ee();const he=setInterval(ee,500),F=(e,o)=>{const n=Math.max(0,Math.min(100,o.percent)),a=o.limited?"danger":"ok",s=`${t.t("card.reset.before")}${pe(o.resetsAt)}${t.t("card.reset.after")}`;return`<div class="goq-row">
        <div class="goq-row-head">
          <span class="goq-label">${r(e)}</span>
          <span class="goq-status">
            <span class="goq-value" data-tone="${a}">${o.limited?t.t("card.limited"):V(o.percent)}</span>
            <span class="goq-dot" aria-hidden="true"></span>
            <span class="goq-reset">${r(s)}</span>
          </span>
        </div>
        <div class="goq-track"><div class="goq-fill" data-tone="${a}" style="width:${n}%"></div></div>
      </div>`},h=()=>{const e=d(),o=se(),n=`<div class="goq-login">
        <input class="goq-input" data-role="api-key" type="password" placeholder="${r(t.t("login.placeholder"))}" autocomplete="off" spellcheck="false" />
        <button class="goq-btn" data-act="save-key">${r(t.t("login.submit"))}</button>
        <div class="goq-error" data-role="login-error">${o?r(o):""}</div>
      </div>`,a=`<div class="goq-foot">
        <span>${r(`${t.t("card.updated")}${ue(m())}`)}</span>
        <span class="goq-foot-links">
          ${e.kind==="ready"&&!C()?f?`<a class="goq-link" data-act="logout">${r(t.t("login.signOut"))}</a>`:`<a class="goq-link" data-act="toggle-login">${r(t.t("login.action"))}</a>`:""}
          <a class="goq-link" data-act="open">${r(t.t("card.console"))}</a>
        </span>
      </div>`;if(e.kind==="loading"){i.innerHTML=`<div class="goq-head"><span class="goq-title">${r(t.t("card.title"))}</span></div>
          <div class="goq-empty">…</div>${a}`;return}if(e.kind==="anon"){i.innerHTML=`<div class="goq-head"><span class="goq-title">${r(t.t("card.title"))}</span></div>
          <div class="goq-empty">${r(t.t("card.anon"))}</div>${n}${a}`;return}if(e.kind==="error"){i.innerHTML=`<div class="goq-head"><span class="goq-title">${r(t.t("card.title"))}</span></div>
          <div class="goq-empty">${r(t.t("card.error"))}</div>${n}${a}`;return}const s=e.info,l=s.go,q=s.workspace.name??s.workspace.id,R=`<span class="goq-badges">
          ${l?`<span class="goq-plan">${r(t.t("card.plan"))}</span>`:""}
          ${f?`<span class="goq-plan">${r(t.t("card.api"))}</span>`:""}
        </span>`,$=`<div class="goq-head">
          <span class="goq-title">${r(t.t("card.title"))}</span>
          ${R}
        </div>
        <div class="goq-ws">${r(q)}${w&&!f?`<span class="goq-ws-sub"> · ${r(ge(w))}</span>`:""}</div>`;if(!l){const x=s.budgets[0],ke=x?`<div class="goq-row">
              <div class="goq-row-head">
                <span class="goq-label">${r(t.t("card.budget"))}</span>
                <span class="goq-value">$${x.spent.toFixed(2)} / $${x.limit.toFixed(2)}</span>
              </div>
              <div class="goq-track"><div class="goq-fill" style="width:${Math.min(100,x.spent/Math.max(x.limit,.01)*100)}%"></div></div>
            </div>`:`<div class="goq-empty">${r(t.t("card.noPlan"))}</div>`;i.innerHTML=`${$}<div class="goq-rows">${ke}</div>${C()?n:""}${a}`;return}i.innerHTML=`${$}
        <div class="goq-rows">
          ${F(t.t("card.rolling"),l.rolling)}
          ${F(t.t("card.weekly"),l.weekly)}
          ${F(t.t("card.monthly"),l.monthly)}
        </div>${C()?n:""}${a}`};let p;const ye=()=>{p!==void 0&&(clearTimeout(p),p=void 0),i.dataset.open="true"},te=()=>{p===void 0&&(p=window.setTimeout(()=>{p=void 0,i.dataset.open="false"},300))};i.addEventListener("click",e=>{const n=e.target?.dataset.act;if(n==="toggle-login"){e.preventDefault(),A(!C()),v(void 0),h();return}if(n==="save-key"){e.preventDefault();const a=i.querySelector('[data-role="api-key"]');a&&E(a.value,!0);return}if(n==="logout"){e.preventDefault(),B();return}n==="open"&&(e.preventDefault(),t.system.openExternal(M()))}),i.addEventListener("keydown",e=>{if(e.key!=="Enter")return;const o=e.target;o?.dataset.role==="api-key"&&(e.preventDefault(),E(o.value,!0))}),i.addEventListener("input",e=>{if(e.target?.dataset.role!=="api-key")return;const n=i.querySelector('[data-role="login-error"]');n&&(n.textContent=""),v(void 0)});let y=null;const be=()=>{if(y&&document.contains(y))return y;y=null;for(const e of document.querySelectorAll("[aria-label]"))if((e.getAttribute("aria-label")??"").startsWith(Ce)){y=e;break}return y},qe=(e,o,n)=>o>=e.left&&o<=e.right&&n>=e.top&&n<=e.bottom;let k=0;const oe=e=>{k||(k=requestAnimationFrame(()=>{k=0;const n=be()?.getBoundingClientRect(),a=n?qe(n,e.clientX,e.clientY):!1;let s=!1;if(i.dataset.open==="true"){const l=i.getBoundingClientRect(),q=n?Math.min(l.top,n.top):l.top;s=e.clientX>=l.left&&e.clientX<=l.right&&e.clientY>=q&&e.clientY<=l.bottom}a||s?ye():te()}))};window.addEventListener("pointermove",oe,{passive:!0});const I=()=>te();document.addEventListener("pointerleave",I),window.addEventListener("blur",I);const b=async()=>{const e=++O;try{if(f){const o=await U.fetch({apiKey:f});if(S||e!==O)return;const n=o.usage??o;!n.rolling&&!n.weekly&&!n.monthly?g({kind:"anon"}):g({kind:"ready",info:{workspace:{id:"api-key",name:t.t("card.apiWorkspace"),usageURL:D},go:{rolling:H(n.rolling),weekly:H(n.weekly),monthly:H(n.monthly)},budgets:[]}})}else{const o=await t.client.usage.limits(w?{location:{directory:w}}:void 0);if(S||e!==O)return;g(o.data?{kind:"ready",info:o.data}:{kind:"anon"})}}catch(o){if(S||e!==O)return;g({kind:"error",message:o instanceof Error?o.message:String(o)})}ie(Date.now()),h()};u.createKeyed(()=>t.sessions.current()?.directory,e=>{w=j??e??void 0,h(),b()});const we=setInterval(()=>{b()},de*1e3);let ne=0;const ae=()=>{const e=Date.now();e-ne<15e3||(ne=e,b())};return window.addEventListener("focus",ae),()=>{S=!0,clearInterval(we),clearInterval(he),p!==void 0&&clearTimeout(p),k&&cancelAnimationFrame(k),window.removeEventListener("pointermove",oe),document.removeEventListener("pointerleave",I),window.removeEventListener("blur",I),window.removeEventListener("focus",ae),c.remove(),i.remove(),G.remove()}}});exports.default=Se;
