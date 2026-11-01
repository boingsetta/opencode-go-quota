import { createSignal } from "solid-js"
import { Schema } from "effect"
import { Command, createKeyed, Ipc, Plugin, TitlebarItem, type IconName } from "@opencode/plugin/gui"

const CONSOLE_URL = "https://opencode.ai/console"
const USAGE_URL = "https://opencode.ai/zen/go/v1/usage"
const API_KEY_STORAGE = "go-quota.apiKey"
const ANCHOR_PREFIX = "OpenCode Go"

interface Meter {
  readonly percent: number
  readonly limited: boolean
  readonly resetsAt: number
}

interface ApiMeter {
  readonly status?: string
  readonly percent?: number
  readonly resetsAt?: string
}

interface ApiUsage {
  readonly rolling?: ApiMeter
  readonly weekly?: ApiMeter
  readonly monthly?: ApiMeter
}

interface Info {
  readonly workspace: { readonly id: string; readonly name?: string; readonly usageURL: string }
  readonly go?: { readonly rolling: Meter; readonly weekly: Meter; readonly monthly: Meter }
  readonly budgets: ReadonlyArray<{ readonly limit: number; readonly spent: number }>
}

const toMeter = (meter: ApiMeter | undefined): Meter => {
  const percent = Number(meter?.percent ?? 0)
  const reset = meter?.resetsAt ? Date.parse(meter.resetsAt) : 0
  return {
    percent: Number.isFinite(percent) ? percent : 0,
    limited: meter?.status === "limited" || meter?.status === "limit_reached",
    resetsAt: Number.isFinite(reset) ? reset : 0,
  }
}

// The usage endpoint cannot be called from the window: its CORS preflight rejects
// the Authorization header. The main process fetches it and hands the JSON back.
const usageIpc = (id: string) =>
  Ipc.define({
    id: `${id}.usage`,
    methods: {
      fetch: {
        input: Schema.Struct({ apiKey: Schema.String }),
        output: Schema.Unknown,
      },
    },
  })

type State =
  | { kind: "loading" }
  | { kind: "anon" }
  | { kind: "ready"; info: Info }
  | { kind: "error"; message: string }

const CSS = `.goq-card {
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
`

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string)

export default Plugin.define({
  i18n: {
    en: {
      "pill.head": "OpenCode Go",
      "pill.loading": "OpenCode Go · …",
      "pill.anon": "OpenCode Go · not signed in",
      "pill.error": "OpenCode Go · unavailable",
      "pill.noPlan": "OpenCode Go · no plan",
      "pill.limited": "OpenCode Go · limit reached",
      "card.title": "OpenCode Go",
      "card.plan": "Go",
      "card.rolling": "Rolling 5 hours",
      "card.weekly": "This week",
      "card.monthly": "This month",
      "card.reset.before": "resets in ",
      "card.reset.after": "",
      "card.limited": "Limit reached",
      "card.anon": "Not signed in to the OpenCode Console.",
      "card.error": "Could not read usage from the server.",
      "card.noPlan": "No active Go plan on this workspace.",
      "card.budget": "Console budget",
      "card.console": "Open Console",
      "card.updated": "updated ",
      "card.api": "API",
      "card.apiWorkspace": "API key",
      "unit.minute": "min",
      "unit.hour": "h",
      "unit.day": "d",
      "unit.now": "just now",
      "login.action": "Use API key",
      "login.submit": "Sign in",
      "login.signOut": "Sign out",
      "login.title": "OpenCode Go API key",
      "login.description": "Paste your OpenCode Go API key. It is stored locally in plain text.",
      "login.placeholder": "sk-...",
      "login.saved": "API key saved",
      "login.removed": "API key removed",
      "login.invalid": "API key rejected",
      "login.configured": "API key is configured in opencode.json",
      "command.group": "OpenCode Go",
      "command.refresh": "Refresh OpenCode Go quota",
      "command.open": "Open OpenCode Go usage in Console",
      "command.login": "Set OpenCode Go API key",
      "command.logout": "Forget OpenCode Go API key",
    },
    zh: {
      "pill.head": "OpenCode Go",
      "pill.loading": "OpenCode Go · …",
      "pill.anon": "OpenCode Go · 未登录",
      "pill.error": "OpenCode Go · 获取失败",
      "pill.noPlan": "OpenCode Go · 未订阅",
      "pill.limited": "OpenCode Go · 已达上限",
      "card.title": "OpenCode Go",
      "card.plan": "Go",
      "card.rolling": "滚动 5 小时",
      "card.weekly": "本周",
      "card.monthly": "本月",
      "card.reset.before": "",
      "card.reset.after": "后重置",
      "card.limited": "已达上限",
      "card.anon": "尚未登录 OpenCode Console。",
      "card.error": "无法从服务端读取用量。",
      "card.noPlan": "当前工作区没有生效的 Go 订阅。",
      "card.budget": "Console 预算",
      "card.console": "打开 Console",
      "card.updated": "更新于 ",
      "card.api": "API",
      "card.apiWorkspace": "API 密钥",
      "unit.minute": "分钟",
      "unit.hour": "小时",
      "unit.day": "天",
      "unit.now": "刚刚",
      "login.action": "使用 API Key",
      "login.submit": "登录",
      "login.signOut": "退出 API Key",
      "login.title": "OpenCode Go API Key",
      "login.description": "粘贴你的 OpenCode Go API Key。它会以明文保存在本地。",
      "login.placeholder": "sk-...",
      "login.saved": "API Key 已保存",
      "login.removed": "API Key 已清除",
      "login.invalid": "API Key 无效",
      "login.configured": "API Key 已在 opencode.json 中配置",
      "command.group": "OpenCode Go",
      "command.refresh": "刷新 OpenCode Go 额度",
      "command.open": "在 Console 中查看 OpenCode Go 用量",
      "command.login": "设置 OpenCode Go API Key",
      "command.logout": "清除 OpenCode Go API Key",
    },
  },
  main(ctx) {
    const usage = usageIpc(ctx.id)
    ctx.provide(usage, {
      fetch: async ({ apiKey }) => {
        const response = await fetch(USAGE_URL, {
          headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
          signal: AbortSignal.timeout(15_000),
        })
        if (!response.ok) {
          throw new Error(response.status === 401 ? "invalid api key" : `HTTP ${response.status}`)
        }
        return await response.json()
      },
    })
  },
  setup(ctx) {
    const [state, setState] = createSignal<State>({ kind: "loading" })
    const [updatedAt, setUpdatedAt] = createSignal<number>(0)
    const [showLogin, setShowLogin] = createSignal(false)
    const [loginError, setLoginError] = createSignal<string | undefined>()
    const usage = ctx.main(usageIpc(ctx.id))
    let disposed = false

    // ---- options (all optional, so the plugin works for any account/setup) ----
    const readNumber = (value: unknown, fallback: number, min: number, max: number) => {
      const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN
      return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback
    }
    const readString = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined)

    const refreshSeconds = readNumber(ctx.options.refreshSeconds, 60, 15, 3600)
    const fixedLocation = readString(ctx.options.location)
    const openURL = readString(ctx.options.openUrl) ?? CONSOLE_URL

    const readStoredApiKey = () => {
      try {
        return localStorage.getItem(API_KEY_STORAGE)?.trim() || undefined
      } catch {
        return undefined
      }
    }
    const configuredApiKey = readString(ctx.options.apiKey)
    let apiKey = configuredApiKey ?? readStoredApiKey()

    // The usage endpoint resolves the Console workspace from a location (a project
    // directory). Follow the active session, so the numbers always describe the
    // account signed in for the project the user is looking at.
    let directory: string | undefined = fixedLocation
    let sequence = 0

    const projectName = (path: string) => {
      const parts = path.replace(/[\\/]+$/, "").split(/[\\/]/)
      return parts[parts.length - 1] || path
    }

    const percent = (value: number) => {
      if (!Number.isFinite(value) || value <= 0) return "0%"
      if (value < 1) return `${value.toFixed(2)}%`
      if (value < 10) return `${value.toFixed(1)}%`
      return `${Math.round(value)}%`
    }

    const relative = (target: number) => {
      const delta = target - Date.now()
      if (!Number.isFinite(delta) || delta <= 0) return `0 ${ctx.t("unit.minute")}`
      const minutes = Math.round(delta / 60_000)
      if (minutes < 60) return `${minutes} ${ctx.t("unit.minute")}`
      const hours = Math.round(minutes / 60)
      if (hours < 48) return `${hours} ${ctx.t("unit.hour")}`
      return `${Math.round(hours / 24)} ${ctx.t("unit.day")}`
    }

    const ago = (stamp: number) => {
      const delta = Date.now() - stamp
      if (!Number.isFinite(delta) || delta < 60_000) return ctx.t("unit.now")
      const minutes = Math.round(delta / 60_000)
      if (minutes < 60) return `${minutes} ${ctx.t("unit.minute")}`
      const hours = Math.round(minutes / 60)
      if (hours < 48) return `${hours} ${ctx.t("unit.hour")}`
      return `${Math.round(hours / 24)} ${ctx.t("unit.day")}`
    }

    const usageURL = () => {
      const current = state()
      return current.kind === "ready" ? current.info.workspace.usageURL : openURL
    }

    /* ---------- API key login ---------- */

    const showInlineError = (message: string) => {
      const element = document.querySelector<HTMLElement>('.goq-card [data-role="login-error"]')
      if (element) element.textContent = message
    }

    const saveKey = async (input: string, inline = false) => {
      const next = input.trim()
      if (!next) return
      setLoginError(undefined)
      showInlineError("")

      try {
        await usage.fetch({ apiKey: next })
      } catch {
        const message = ctx.t("login.invalid")
        setLoginError(message)
        if (inline) showInlineError(message)
        else {
          setShowLogin(true)
          render()
        }
        ctx.toast.show({ variant: "error", title: message })
        return
      }

      apiKey = next
      try {
        localStorage.setItem(API_KEY_STORAGE, next)
      } catch {
        // Storage can be unavailable in restricted windows; the key still works for this session.
      }
      setShowLogin(false)
      setLoginError(undefined)
      setState({ kind: "loading" })
      render()
      void load()
      ctx.toast.show({ variant: "success", title: ctx.t("login.saved") })
    }

    const login = async () => {
      const key = await ctx.dialogs.prompt({
        title: ctx.t("login.title"),
        description: ctx.t("login.description"),
        placeholder: ctx.t("login.placeholder"),
        secret: true,
      })
      if (key) await saveKey(key, false)
    }

    const logout = () => {
      if (configuredApiKey) {
        ctx.toast.show({ variant: "error", title: ctx.t("login.configured") })
        return
      }
      apiKey = undefined
      try {
        localStorage.removeItem(API_KEY_STORAGE)
      } catch {
        // Ignore storage failures; the in-memory key is already cleared.
      }
      setShowLogin(false)
      setLoginError(undefined)
      setState({ kind: "loading" })
      render()
      void load()
      ctx.toast.show({ variant: "success", title: ctx.t("login.removed") })
    }

    /* ---------- pill (native titlebar item) ---------- */

    const pillLabel = () => {
      const current = state()
      if (current.kind === "loading") return ctx.t("pill.loading")
      if (current.kind === "anon") return ctx.t("pill.anon")
      if (current.kind === "error") return ctx.t("pill.error")
      const go = current.info.go
      if (!go) return ctx.t("pill.noPlan")
      if (go.monthly.limited) return ctx.t("pill.limited")
      return `${ctx.t("pill.head")} · ${percent(go.monthly.percent)}`
    }

    const icon = (): IconName => {
      const current = state()
      if (current.kind === "error") return "circle-x"
      if (current.kind === "anon") return "lock"
      if (current.kind !== "ready") return "globe"
      const go = current.info.go
      if (!go) return "globe"
      if (go.monthly.limited) return "circle-ban-sign"
      if ([go.rolling.percent, go.weekly.percent, go.monthly.percent].some((value) => value >= 90))
        return "circle-exclamation"
      return "globe"
    }

    ctx.add(TitlebarItem, (): TitlebarItem => ({
      id: "quota",
      icon: icon(),
      label: pillLabel(),
      title: pillLabel(),
      busy: state().kind === "loading",
      run: () => ctx.system.openExternal(usageURL()),
    }))

    ctx.add(Command, (): Command => ({
      id: "quota.refresh",
      title: ctx.t("command.refresh"),
      group: ctx.t("command.group"),
      keywords: "opencode go quota usage limit 额度 用量",
      run: () => void load(),
    }))

    ctx.add(Command, (): Command => ({
      id: "quota.open",
      title: ctx.t("command.open"),
      group: ctx.t("command.group"),
      keywords: "opencode go console usage 额度 用量",
      run: () => ctx.system.openExternal(usageURL()),
    }))

    ctx.add(Command, (): Command => ({
      id: "quota.login",
      title: ctx.t("command.login"),
      group: ctx.t("command.group"),
      keywords: "opencode go api key login 登录 密钥",
      run: () => void login(),
    }))

    ctx.add(Command, (): Command => ({
      id: "quota.logout",
      title: ctx.t("command.logout"),
      group: ctx.t("command.group"),
      keywords: "opencode go api key logout 清除 密钥",
      run: () => logout(),
    }))

    /* ---------- hover card ---------- */

    const style = document.createElement("style")
    style.dataset.plugin = "go-quota"
    style.textContent = CSS
    document.head.appendChild(style)

    const card = document.createElement("div")
    card.className = "goq-card"
    card.dataset.open = "false"
    document.body.appendChild(card)

    /* ---------- ring icon (the titlebar only accepts built-in icon names) ---------- */

    const SVG_NS = "http://www.w3.org/2000/svg"
    const ring = document.createElementNS(SVG_NS, "svg") as SVGSVGElement
    ring.setAttribute("viewBox", "0 0 24 24")
    ring.setAttribute("class", "goq-ring")
    ring.setAttribute("aria-hidden", "true")
    ring.innerHTML =
      '<circle class="goq-track" cx="12" cy="12" r="9.4"/>' +
      '<circle class="goq-arc goq-month" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/>' +
      '<circle class="goq-arc goq-week" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/>' +
      '<circle class="goq-arc goq-roll" cx="12" cy="12" r="9.4" transform="rotate(-90 12 12)"/>' +
      '<g class="goq-logo" transform="translate(5.7 5.7) scale(0.7875)">' +
      '<g transform="translate(1.2 1.2) scale(0.85)">' +
      '<path opacity="0.2" d="M11.1999 12.8H4.79993V6.40002H11.1999V12.8Z"/>' +
      '<path d="M11.2 3.2H4.79998V12.8H11.2V3.2ZM14.4 16H1.59998V0H14.4V16Z"/>' +
      "</g></g>"

    const monthArc = ring.querySelector<SVGCircleElement>(".goq-month")!
    const weekArc = ring.querySelector<SVGCircleElement>(".goq-week")!
    const rollArc = ring.querySelector<SVGCircleElement>(".goq-roll")!
    for (const circle of [monthArc, weekArc, rollArc]) circle.setAttribute("pathLength", "100")

    const ringHost = (): HTMLElement | null => {
      const items = document.querySelectorAll<HTMLElement>('[data-slot="titlebar-update"]')
      for (const item of items) {
        if (item.classList.contains("self-start")) continue
        const button = item.querySelector<HTMLElement>('button[aria-label^="OpenCode Go"]')
        if (!button) continue
        for (const child of Array.from(button.children)) {
          if (child.tagName === "SPAN" && !child.hasAttribute("data-slot")) return child as HTMLElement
        }
      }
      return null
    }

    const setArc = (circle: SVGCircleElement, value: number) => {
      const pct = Math.max(0, Math.min(100, Number(value) || 0))
      circle.setAttribute("stroke-dasharray", `${pct} ${100 - pct}`)
      circle.style.opacity = pct > 0 ? "1" : "0"
    }

    const meterPercent = (meter: Meter | undefined) => {
      const value = meter ? Number(meter.percent) : 0
      return Number.isFinite(value) ? value : 0
    }

    let lastRingSignature = ""
    const paintRing = () => {
      const host = ringHost()
      if (!host) return
      if (ring.parentNode !== host) host.appendChild(ring)

      const current = state()
      const go = current.kind === "ready" ? current.info.go : undefined
      const monthly = meterPercent(go?.monthly)
      const weekly = meterPercent(go?.weekly)
      const rolling = meterPercent(go?.rolling)
      const limited = !!go && (go.monthly.limited || go.weekly.limited || go.rolling.limited)
      const loading = current.kind === "loading"
      const signature = `${current.kind}|${monthly}|${weekly}|${rolling}|${limited}`
      if (signature === lastRingSignature) return
      lastRingSignature = signature

      setArc(monthArc, monthly)
      setArc(weekArc, weekly)
      setArc(rollArc, rolling)
      ring.style.display = loading ? "none" : "block"
      ring.classList.toggle("goq-limited", limited)
      ring.style.opacity = current.kind === "ready" && go ? "1" : "0.55"
    }

    paintRing()
    const ringTimer = setInterval(paintRing, 500)

    const bar = (label: string, meter: Meter) => {
      const value = Math.max(0, Math.min(100, meter.percent))
      const level = meter.limited ? "danger" : "ok"
      const reset = `${ctx.t("card.reset.before")}${relative(meter.resetsAt)}${ctx.t("card.reset.after")}`
      return `<div class="goq-row">
        <div class="goq-row-head">
          <span class="goq-label">${escape(label)}</span>
          <span class="goq-status">
            <span class="goq-value" data-tone="${level}">${meter.limited ? ctx.t("card.limited") : percent(meter.percent)}</span>
            <span class="goq-dot" aria-hidden="true"></span>
            <span class="goq-reset">${escape(reset)}</span>
          </span>
        </div>
        <div class="goq-track"><div class="goq-fill" data-tone="${level}" style="width:${value}%"></div></div>
      </div>`
    }

    const render = () => {
      const current = state()
      const error = loginError()
      const loginForm = `<div class="goq-login">
        <input class="goq-input" data-role="api-key" type="password" placeholder="${escape(ctx.t("login.placeholder"))}" autocomplete="off" spellcheck="false" />
        <button class="goq-btn" data-act="save-key">${escape(ctx.t("login.submit"))}</button>
        <div class="goq-error" data-role="login-error">${error ? escape(error) : ""}</div>
      </div>`
      const footer = `<div class="goq-foot">
        <span>${escape(`${ctx.t("card.updated")}${ago(updatedAt())}`)}</span>
        <span class="goq-foot-links">
          ${current.kind === "ready" && !showLogin()
            ? apiKey
              ? `<a class="goq-link" data-act="logout">${escape(ctx.t("login.signOut"))}</a>`
              : `<a class="goq-link" data-act="toggle-login">${escape(ctx.t("login.action"))}</a>`
            : ""}
          <a class="goq-link" data-act="open">${escape(ctx.t("card.console"))}</a>
        </span>
      </div>`

      if (current.kind === "loading") {
        card.innerHTML = `<div class="goq-head"><span class="goq-title">${escape(ctx.t("card.title"))}</span></div>
          <div class="goq-empty">…</div>${footer}`
        return
      }
      if (current.kind === "anon") {
        card.innerHTML = `<div class="goq-head"><span class="goq-title">${escape(ctx.t("card.title"))}</span></div>
          <div class="goq-empty">${escape(ctx.t("card.anon"))}</div>${loginForm}${footer}`
        return
      }
      if (current.kind === "error") {
        card.innerHTML = `<div class="goq-head"><span class="goq-title">${escape(ctx.t("card.title"))}</span></div>
          <div class="goq-empty">${escape(ctx.t("card.error"))}</div>${loginForm}${footer}`
        return
      }

      const info = current.info
      const go = info.go
      const workspace = info.workspace.name ?? info.workspace.id
      const badges = `<span class="goq-badges">
          ${go ? `<span class="goq-plan">${escape(ctx.t("card.plan"))}</span>` : ""}
          ${apiKey ? `<span class="goq-plan">${escape(ctx.t("card.api"))}</span>` : ""}
        </span>`
      const header = `<div class="goq-head">
          <span class="goq-title">${escape(ctx.t("card.title"))}</span>
          ${badges}
        </div>
        <div class="goq-ws">${escape(workspace)}${directory && !apiKey ? `<span class="goq-ws-sub"> · ${escape(projectName(directory))}</span>` : ""}</div>`

      if (!go) {
        const budget = info.budgets[0]
        const budgetRow = budget
          ? `<div class="goq-row">
              <div class="goq-row-head">
                <span class="goq-label">${escape(ctx.t("card.budget"))}</span>
                <span class="goq-value">$${budget.spent.toFixed(2)} / $${budget.limit.toFixed(2)}</span>
              </div>
              <div class="goq-track"><div class="goq-fill" style="width:${Math.min(100, (budget.spent / Math.max(budget.limit, 0.01)) * 100)}%"></div></div>
            </div>`
          : `<div class="goq-empty">${escape(ctx.t("card.noPlan"))}</div>`
        card.innerHTML = `${header}<div class="goq-rows">${budgetRow}</div>${showLogin() ? loginForm : ""}${footer}`
        return
      }

      card.innerHTML = `${header}
        <div class="goq-rows">
          ${bar(ctx.t("card.rolling"), go.rolling)}
          ${bar(ctx.t("card.weekly"), go.weekly)}
          ${bar(ctx.t("card.monthly"), go.monthly)}
        </div>${showLogin() ? loginForm : ""}${footer}`
    }

    // A short close delay lets the pointer cross the gap between the pill and the card.
    let closeTimer: number | undefined
    const open = () => {
      if (closeTimer !== undefined) {
        clearTimeout(closeTimer)
        closeTimer = undefined
      }
      card.dataset.open = "true"
    }
    const closeSoon = () => {
      if (closeTimer !== undefined) return
      closeTimer = window.setTimeout(() => {
        closeTimer = undefined
        card.dataset.open = "false"
      }, 300)
    }

    card.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null
      const action = target?.dataset.act
      if (action === "toggle-login") {
        event.preventDefault()
        setShowLogin(!showLogin())
        setLoginError(undefined)
        render()
        return
      }
      if (action === "save-key") {
        event.preventDefault()
        const input = card.querySelector<HTMLInputElement>('[data-role="api-key"]')
        if (input) void saveKey(input.value, true)
        return
      }
      if (action === "logout") {
        event.preventDefault()
        logout()
        return
      }
      if (action === "open") {
        event.preventDefault()
        ctx.system.openExternal(usageURL())
      }
    })

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return
      const target = event.target as HTMLInputElement | null
      if (target?.dataset.role !== "api-key") return
      event.preventDefault()
      void saveKey(target.value, true)
    })

    card.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement | null
      if (target?.dataset.role !== "api-key") return
      const error = card.querySelector<HTMLElement>('[data-role="login-error"]')
      if (error) error.textContent = ""
      setLoginError(undefined)
    })

    let pill: HTMLElement | null = null
    const findPill = () => {
      if (pill && document.contains(pill)) return pill
      pill = null
      for (const element of document.querySelectorAll<HTMLElement>("[aria-label]")) {
        const name = element.getAttribute("aria-label") ?? ""
        if (name.startsWith(ANCHOR_PREFIX)) {
          pill = element
          break
        }
      }
      return pill
    }

    const inside = (rect: DOMRect, x: number, y: number) =>
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom

    let frame = 0
    const onMove = (event: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const target = findPill()
        const pillRect = target?.getBoundingClientRect()
        const overPill = pillRect ? inside(pillRect, event.clientX, event.clientY) : false

        // Treat the column from the pill down to the card as one hover surface, so the
        // pointer can cross the gap without the card closing under it.
        let overCard = false
        if (card.dataset.open === "true") {
          const cardRect = card.getBoundingClientRect()
          const top = pillRect ? Math.min(cardRect.top, pillRect.top) : cardRect.top
          overCard =
            event.clientX >= cardRect.left &&
            event.clientX <= cardRect.right &&
            event.clientY >= top &&
            event.clientY <= cardRect.bottom
        }

        if (overPill || overCard) open()
        else closeSoon()
      })
    }

    window.addEventListener("pointermove", onMove, { passive: true })

    // pointermove only fires inside the window, so close when the pointer leaves the document or the window blurs
    const onLeave = () => closeSoon()
    document.addEventListener("pointerleave", onLeave)
    window.addEventListener("blur", onLeave)

    /* ---------- data ---------- */

    const load = async () => {
      const ticket = ++sequence
      try {
        if (apiKey) {
          const body = (await usage.fetch({ apiKey })) as { usage?: ApiUsage } & ApiUsage
          if (disposed || ticket !== sequence) return
          const apiUsage = body.usage ?? body
          if (!apiUsage.rolling && !apiUsage.weekly && !apiUsage.monthly) {
            setState({ kind: "anon" })
          } else {
            setState({
              kind: "ready",
              info: {
                workspace: { id: "api-key", name: ctx.t("card.apiWorkspace"), usageURL: openURL },
                go: {
                  rolling: toMeter(apiUsage.rolling),
                  weekly: toMeter(apiUsage.weekly),
                  monthly: toMeter(apiUsage.monthly),
                },
                budgets: [],
              },
            })
          }
        } else {
          const out = await ctx.client.usage.limits(directory ? { location: { directory } } : undefined)
          if (disposed || ticket !== sequence) return
          setState(out.data ? { kind: "ready", info: out.data as Info } : { kind: "anon" })
        }
      } catch (error) {
        if (disposed || ticket !== sequence) return
        setState({ kind: "error", message: error instanceof Error ? error.message : String(error) })
      }
      setUpdatedAt(Date.now())
      render()
    }

    // Follow the active session: its directory decides which location the server
    // resolves the Console workspace from. Re-runs when the user switches sessions.
    createKeyed(
      () => ctx.sessions.current()?.directory,
      (next) => {
        directory = fixedLocation ?? next ?? undefined
        render()
        void load()
      },
    )

    const timer = setInterval(() => void load(), refreshSeconds * 1000)

    // Coming back to the window is a good moment to refresh, but not more than once every 15s.
    let lastFocus = 0
    const onFocus = () => {
      const now = Date.now()
      if (now - lastFocus < 15_000) return
      lastFocus = now
      void load()
    }
    window.addEventListener("focus", onFocus)

    return () => {
      disposed = true
      clearInterval(timer)
      clearInterval(ringTimer)
      if (closeTimer !== undefined) clearTimeout(closeTimer)
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
      window.removeEventListener("focus", onFocus)
      ring.remove()
      card.remove()
      style.remove()
    }
  },
})
