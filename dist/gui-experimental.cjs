"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const J=require("solid-js"),M=require("effect"),f=require("@opencode/plugin/gui"),he="https://opencode.ai/console",ve="https://opencode.ai/zen/go/v1/usage",N="go-quota.apiKey",ye="OpenCode Go",E=t=>{const l=Number(t?.percent??0),c=t?.resetsAt?Date.parse(t.resetsAt):0;return{percent:Number.isFinite(l)?l:0,limited:t?.status==="limited"||t?.status==="limit_reached",resetsAt:Number.isFinite(c)?c:0}},Q=t=>f.Ipc.define({id:`${t}.usage`,methods:{fetch:{input:M.Schema.Struct({apiKey:M.Schema.String}),output:M.Schema.Unknown}}}),be=`.goq-card {
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
`,r=t=>t.replace(/[&<>"']/g,l=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[l]),we=f.Plugin.define({i18n:{en:{"pill.head":"OpenCode Go","pill.loading":"OpenCode Go · …","pill.anon":"OpenCode Go · not signed in","pill.error":"OpenCode Go · unavailable","pill.noPlan":"OpenCode Go · no plan","pill.limited":"OpenCode Go · limit reached","card.title":"OpenCode Go","card.plan":"Go","card.rolling":"Rolling 5 hours","card.weekly":"This week","card.monthly":"This month","card.reset.before":"resets in ","card.reset.after":"","card.limited":"Limit reached","card.anon":"Not signed in to the OpenCode Console.","card.error":"Could not read usage from the server.","card.noPlan":"No active Go plan on this workspace.","card.budget":"Console budget","card.console":"Open Console","card.updated":"updated ","card.api":"API","card.apiWorkspace":"API key","unit.minute":"min","unit.hour":"h","unit.day":"d","unit.now":"just now","login.action":"Use API key","login.title":"OpenCode Go API key","login.description":"Paste your OpenCode Go API key. It is stored locally in plain text.","login.placeholder":"sk-...","login.saved":"API key saved","login.removed":"API key removed","login.invalid":"API key rejected","login.configured":"API key is configured in opencode.json","command.group":"OpenCode Go","command.refresh":"Refresh OpenCode Go quota","command.open":"Open OpenCode Go usage in Console","command.login":"Set OpenCode Go API key","command.logout":"Forget OpenCode Go API key"},zh:{"pill.head":"OpenCode Go","pill.loading":"OpenCode Go · …","pill.anon":"OpenCode Go · 未登录","pill.error":"OpenCode Go · 获取失败","pill.noPlan":"OpenCode Go · 未订阅","pill.limited":"OpenCode Go · 已达上限","card.title":"OpenCode Go","card.plan":"Go","card.rolling":"滚动 5 小时","card.weekly":"本周","card.monthly":"本月","card.reset.before":"","card.reset.after":"后重置","card.limited":"已达上限","card.anon":"尚未登录 OpenCode Console。","card.error":"无法从服务端读取用量。","card.noPlan":"当前工作区没有生效的 Go 订阅。","card.budget":"Console 预算","card.console":"打开 Console","card.updated":"更新于 ","card.api":"API","card.apiWorkspace":"API 密钥","unit.minute":"分钟","unit.hour":"小时","unit.day":"天","unit.now":"刚刚","login.action":"使用 API Key","login.title":"OpenCode Go API Key","login.description":"粘贴你的 OpenCode Go API Key。它会以明文保存在本地。","login.placeholder":"sk-...","login.saved":"API Key 已保存","login.removed":"API Key 已清除","login.invalid":"API Key 无效","login.configured":"API Key 已在 opencode.json 中配置","command.group":"OpenCode Go","command.refresh":"刷新 OpenCode Go 额度","command.open":"在 Console 中查看 OpenCode Go 用量","command.login":"设置 OpenCode Go API Key","command.logout":"清除 OpenCode Go API Key"}},main(t){const l=Q(t.id);t.provide(l,{fetch:async({apiKey:c})=>{const m=await fetch(ve,{headers:{Authorization:`Bearer ${c}`,Accept:"application/json"}});if(!m.ok)throw new Error(m.status===401?"invalid api key":`HTTP ${m.status}`);return await m.json()}})},setup(t){const[l,c]=J.createSignal({kind:"loading"}),[m,ee]=J.createSignal(0),K=t.main(Q(t.id));let k=!1;const te=(e,o,n,a)=>{const i=typeof e=="number"?e:typeof e=="string"?Number(e):NaN;return Number.isFinite(i)?Math.min(a,Math.max(n,i)):o},G=e=>typeof e=="string"&&e.trim()?e.trim():void 0,oe=te(t.options.refreshSeconds,60,15,3600),R=G(t.options.location),T=G(t.options.openUrl)??he,ne=()=>{try{return localStorage.getItem(N)?.trim()||void 0}catch{return}},F=G(t.options.apiKey);let h=F??ne(),w=R,$=0;const ae=e=>{const o=e.replace(/[\\/]+$/,"").split(/[\\/]/);return o[o.length-1]||e},H=e=>!Number.isFinite(e)||e<=0?"0%":e<1?`${e.toFixed(2)}%`:e<10?`${e.toFixed(1)}%`:`${Math.round(e)}%`,re=e=>{const o=e-Date.now();if(!Number.isFinite(o)||o<=0)return`0 ${t.t("unit.minute")}`;const n=Math.round(o/6e4);if(n<60)return`${n} ${t.t("unit.minute")}`;const a=Math.round(n/60);return a<48?`${a} ${t.t("unit.hour")}`:`${Math.round(a/24)} ${t.t("unit.day")}`},ie=e=>{const o=Date.now()-e;if(!Number.isFinite(o)||o<6e4)return t.t("unit.now");const n=Math.round(o/6e4);if(n<60)return`${n} ${t.t("unit.minute")}`;const a=Math.round(n/60);return a<48?`${a} ${t.t("unit.hour")}`:`${Math.round(a/24)} ${t.t("unit.day")}`},S=()=>{const e=l();return e.kind==="ready"?e.info.workspace.usageURL:T},z=async()=>{const o=(await t.dialogs.prompt({title:t.t("login.title"),description:t.t("login.description"),placeholder:t.t("login.placeholder"),secret:!0}))?.trim();if(o){try{await K.fetch({apiKey:o})}catch{t.toast.show({variant:"error",title:t.t("login.invalid")});return}h=o;try{localStorage.setItem(N,o)}catch{}c({kind:"loading"}),x(),y(),t.toast.show({variant:"success",title:t.t("login.saved")})}},se=()=>{if(F){t.toast.show({variant:"error",title:t.t("login.configured")});return}h=void 0;try{localStorage.removeItem(N)}catch{}c({kind:"loading"}),x(),y(),t.toast.show({variant:"success",title:t.t("login.removed")})},U=()=>{const e=l();if(e.kind==="loading")return t.t("pill.loading");if(e.kind==="anon")return t.t("pill.anon");if(e.kind==="error")return t.t("pill.error");const o=e.info.go;return o?o.monthly.limited?t.t("pill.limited"):`${t.t("pill.head")} · ${H(o.monthly.percent)}`:t.t("pill.noPlan")},le=()=>{const e=l();if(e.kind==="error")return"circle-x";if(e.kind==="anon")return"lock";if(e.kind!=="ready")return"globe";const o=e.info.go;return o?o.monthly.limited?"circle-ban-sign":[o.rolling.percent,o.weekly.percent,o.monthly.percent].some(n=>n>=90)?"circle-exclamation":"globe":"globe"};t.add(f.TitlebarItem,()=>({id:"quota",icon:le(),label:U(),title:U(),busy:l().kind==="loading",run:()=>t.system.openExternal(S())})),t.add(f.Command,()=>({id:"quota.refresh",title:t.t("command.refresh"),group:t.t("command.group"),keywords:"opencode go quota usage limit 额度 用量",run:()=>{y()}})),t.add(f.Command,()=>({id:"quota.open",title:t.t("command.open"),group:t.t("command.group"),keywords:"opencode go console usage 额度 用量",run:()=>t.system.openExternal(S())})),t.add(f.Command,()=>({id:"quota.login",title:t.t("command.login"),group:t.t("command.group"),keywords:"opencode go api key login 登录 密钥",run:()=>{z()}})),t.add(f.Command,()=>({id:"quota.logout",title:t.t("command.logout"),group:t.t("command.group"),keywords:"opencode go api key logout 清除 密钥",run:()=>se()}));const C=document.createElement("style");C.dataset.plugin="go-quota",C.textContent=be,document.head.appendChild(C);const s=document.createElement("div");s.className="goq-card",s.dataset.open="false",document.body.appendChild(s);const d=document.createElementNS("http://www.w3.org/2000/svg","svg");d.setAttribute("viewBox","0 0 24 24"),d.setAttribute("class","goq-ring"),d.setAttribute("aria-hidden","true"),d.innerHTML='<circle class="goq-track" cx="12" cy="12" r="9.4"/><circle class="goq-arc goq-month" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/><circle class="goq-arc goq-week" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/><circle class="goq-arc goq-roll" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/><g class="goq-logo" transform="translate(5.7 5.7) scale(0.7875)"><g transform="translate(1.2 1.2) scale(0.85)"><path opacity="0.2" d="M11.1999 12.8H4.79993V6.40002H11.1999V12.8Z"/><path d="M11.2 3.2H4.79998V12.8H11.2V3.2ZM14.4 16H1.59998V0H14.4V16Z"/></g></g>';const j=d.querySelector(".goq-month"),_=d.querySelector(".goq-week"),V=d.querySelector(".goq-roll");for(const e of[j,_,V])e.setAttribute("pathLength","100");const de=()=>{const e=document.querySelectorAll('[data-slot="titlebar-update"]');for(const o of e){if(o.classList.contains("self-start"))continue;const n=o.querySelector('button[aria-label^="OpenCode Go"]');if(n){for(const a of Array.from(n.children))if(a.tagName==="SPAN"&&!a.hasAttribute("data-slot"))return a}}return null},P=(e,o)=>{const n=Math.max(0,Math.min(100,Number(o)||0));e.setAttribute("stroke-dasharray",`${n} ${100-n}`),e.style.opacity=n>0?"1":"0"},I=e=>{const o=e?Number(e.percent):0;return Number.isFinite(o)?o:0};let D="";const Y=()=>{const e=de();if(!e)return;d.parentNode!==e&&e.appendChild(d);const o=l(),n=o.kind==="ready"?o.info.go:void 0,a=I(n?.monthly),i=I(n?.weekly),p=I(n?.rolling),b=!!n&&(n.monthly.limited||n.weekly.limited||n.rolling.limited),O=o.kind==="loading",u=`${o.kind}|${a}|${i}|${p}|${b}`;u!==D&&(D=u,P(j,a),P(_,i),P(V,p),d.style.display=O?"none":"block",d.classList.toggle("goq-limited",b),d.style.opacity=o.kind==="ready"&&n?"1":"0.55")};Y();const ce=setInterval(Y,500),L=(e,o)=>{const n=Math.max(0,Math.min(100,o.percent)),a=o.limited?"danger":"ok",i=`${t.t("card.reset.before")}${re(o.resetsAt)}${t.t("card.reset.after")}`;return`<div class="goq-row">
        <div class="goq-row-head">
          <span class="goq-label">${r(e)}</span>
          <span class="goq-status">
            <span class="goq-value" data-tone="${a}">${o.limited?t.t("card.limited"):H(o.percent)}</span>
            <span class="goq-dot" aria-hidden="true"></span>
            <span class="goq-reset">${r(i)}</span>
          </span>
        </div>
        <div class="goq-track"><div class="goq-fill" data-tone="${a}" style="width:${n}%"></div></div>
      </div>`},x=()=>{const e=l(),o=`<div class="goq-foot">
        <span>${r(`${t.t("card.updated")}${ie(m())}`)}</span>
        <a class="goq-link" data-act="open">${r(t.t("card.console"))}</a>
      </div>`,n=`<a class="goq-link" data-act="login">${r(t.t("login.action"))}</a>`;if(e.kind==="loading"){s.innerHTML=`<div class="goq-head"><span class="goq-title">${r(t.t("card.title"))}</span></div>
          <div class="goq-empty">…</div>${o}`;return}if(e.kind==="anon"){s.innerHTML=`<div class="goq-head"><span class="goq-title">${r(t.t("card.title"))}</span></div>
          <div class="goq-empty">${r(t.t("card.anon"))} ${n}</div>${o}`;return}if(e.kind==="error"){s.innerHTML=`<div class="goq-head"><span class="goq-title">${r(t.t("card.title"))}</span></div>
          <div class="goq-empty">${r(t.t("card.error"))} ${n}</div>${o}`;return}const a=e.info,i=a.go,p=a.workspace.name??a.workspace.id,b=`<span class="goq-badges">
          ${i?`<span class="goq-plan">${r(t.t("card.plan"))}</span>`:""}
          ${h?`<span class="goq-plan">${r(t.t("card.api"))}</span>`:""}
        </span>`,O=`<div class="goq-head">
          <span class="goq-title">${r(t.t("card.title"))}</span>
          ${b}
        </div>
        <div class="goq-ws">${r(p)}${w&&!h?`<span class="goq-ws-sub"> · ${r(ae(w))}</span>`:""}</div>`;if(!i){const u=a.budgets[0],me=u?`<div class="goq-row">
              <div class="goq-row-head">
                <span class="goq-label">${r(t.t("card.budget"))}</span>
                <span class="goq-value">$${u.spent.toFixed(2)} / $${u.limit.toFixed(2)}</span>
              </div>
              <div class="goq-track"><div class="goq-fill" style="width:${Math.min(100,u.spent/Math.max(u.limit,.01)*100)}%"></div></div>
            </div>`:`<div class="goq-empty">${r(t.t("card.noPlan"))}</div>`;s.innerHTML=`${O}<div class="goq-rows">${me}</div>${o}`;return}s.innerHTML=`${O}
        <div class="goq-rows">
          ${L(t.t("card.rolling"),i.rolling)}
          ${L(t.t("card.weekly"),i.weekly)}
          ${L(t.t("card.monthly"),i.monthly)}
        </div>${o}`};let g;const pe=()=>{g!==void 0&&(clearTimeout(g),g=void 0),s.dataset.open="true"},B=()=>{g===void 0&&(g=window.setTimeout(()=>{g=void 0,s.dataset.open="false"},300))};s.addEventListener("click",e=>{const o=e.target;if(o?.dataset.act==="login"){e.preventDefault(),z();return}o?.dataset.act==="open"&&(e.preventDefault(),t.system.openExternal(S()))});let v=null;const ge=()=>{if(v&&document.contains(v))return v;v=null;for(const e of document.querySelectorAll("[aria-label]"))if((e.getAttribute("aria-label")??"").startsWith(ye)){v=e;break}return v},ue=(e,o,n)=>o>=e.left&&o<=e.right&&n>=e.top&&n<=e.bottom;let q=0;const W=e=>{q||(q=requestAnimationFrame(()=>{q=0;const n=ge()?.getBoundingClientRect(),a=n?ue(n,e.clientX,e.clientY):!1;let i=!1;if(s.dataset.open==="true"){const p=s.getBoundingClientRect(),b=n?Math.min(p.top,n.top):p.top;i=e.clientX>=p.left&&e.clientX<=p.right&&e.clientY>=b&&e.clientY<=p.bottom}a||i?pe():B()}))};window.addEventListener("pointermove",W,{passive:!0});const A=()=>B();document.addEventListener("pointerleave",A),window.addEventListener("blur",A);const y=async()=>{const e=++$;try{if(h){const o=await K.fetch({apiKey:h});if(k||e!==$)return;const n=o.usage??o;!n.rolling&&!n.weekly&&!n.monthly?c({kind:"anon"}):c({kind:"ready",info:{workspace:{id:"api-key",name:t.t("card.apiWorkspace"),usageURL:T},go:{rolling:E(n.rolling),weekly:E(n.weekly),monthly:E(n.monthly)},budgets:[]}})}else{const o=await t.client.usage.limits(w?{location:{directory:w}}:void 0);if(k||e!==$)return;c(o.data?{kind:"ready",info:o.data}:{kind:"anon"})}}catch(o){if(k||e!==$)return;c({kind:"error",message:o instanceof Error?o.message:String(o)})}ee(Date.now()),x()};f.createKeyed(()=>t.sessions.current()?.directory,e=>{w=R??e??void 0,x(),y()});const fe=setInterval(()=>{y()},oe*1e3);let X=0;const Z=()=>{const e=Date.now();e-X<15e3||(X=e,y())};return window.addEventListener("focus",Z),()=>{k=!0,clearInterval(fe),clearInterval(ce),g!==void 0&&clearTimeout(g),q&&cancelAnimationFrame(q),window.removeEventListener("pointermove",W),document.removeEventListener("pointerleave",A),window.removeEventListener("blur",A),window.removeEventListener("focus",Z),d.remove(),s.remove(),C.remove()}}});exports.default=we;
