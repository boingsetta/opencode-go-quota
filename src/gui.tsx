import { createSignal } from "solid-js"
import { Command, createKeyed, Plugin, TitlebarItem, type IconName } from "@opencode/plugin/gui"

const CONSOLE_URL = "https://opencode.ai/console"
const ANCHOR_PREFIX = "OpenCode Go"

interface Meter {
  readonly percent: number
  readonly limited: boolean
  readonly resetsAt: number
}

interface Info {
  readonly workspace: { readonly id: string; readonly name?: string; readonly usageURL: string }
  readonly go?: { readonly rolling: Meter; readonly weekly: Meter; readonly monthly: Meter }
  readonly budgets: ReadonlyArray<{ readonly limit: number; readonly spent: number }>
}

type State =
  | { kind: "loading" }
  | { kind: "anon" }
  | { kind: "ready"; info: Info }
  | { kind: "error"; message: string }

const CSS = `
.goq-card {
  position: fixed;
  top: 46px;
  right: 14px;
  width: 330px;
  z-index: 2147483000;
  padding: 14px 16px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: #15171c;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.55);
  color: #e8edf6;
  font: 12px/1.45 ui-sans-serif, "Segoe UI", system-ui, sans-serif;
  opacity: 0;
  transform: translateY(-6px) scale(0.985);
  pointer-events: none;
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.goq-card[data-open="true"] { opacity: 1; transform: none; pointer-events: auto; }
.goq-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.goq-title { font-size: 13px; font-weight: 600; letter-spacing: 0.1px; }
.goq-plan { font-size: 10px; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase;
  padding: 2px 7px; border-radius: 999px; color: #93c5fd; background: rgba(59, 130, 246, 0.16);
  border: 1px solid rgba(59, 130, 246, 0.35); }
.goq-ws { margin-top: 3px; font-size: 11px; color: #7d8aa3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.goq-ws-sub { color: #5b6779; }
.goq-rows { margin-top: 12px; display: grid; gap: 11px; }
.goq-row-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.goq-label { font-size: 11.5px; color: #a9b6cc; }
.goq-value { font-size: 11.5px; font-variant-numeric: tabular-nums; color: #dbe4f2; }
.goq-value[data-tone="warn"] { color: #fbbf24; }
.goq-value[data-tone="danger"] { color: #f87171; }
.goq-track { margin-top: 5px; height: 6px; border-radius: 999px; overflow: hidden;
  background: rgba(255, 255, 255, 0.07); }
.goq-fill { height: 100%; border-radius: 999px; transition: width 0.35s ease;
  background: linear-gradient(90deg, #2563eb, #60a5fa); }
.goq-fill[data-tone="warn"] { background: linear-gradient(90deg, #d97706, #fbbf24); }
.goq-fill[data-tone="danger"] { background: linear-gradient(90deg, #dc2626, #f87171); }
.goq-reset { margin-top: 4px; font-size: 10.5px; color: #6b788f; }
.goq-foot { margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.07);
  display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 10.5px; color: #6b788f; }
.goq-link { color: #7aa7f7; cursor: pointer; text-decoration: none; }
.goq-link:hover { text-decoration: underline; }
.goq-empty { margin-top: 10px; font-size: 11.5px; color: #9aa7bd; }
`

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string)

const tone = (percent: number) => (percent >= 90 ? "danger" : percent >= 70 ? "warn" : "ok")

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
      "unit.minute": "min",
      "unit.hour": "h",
      "unit.day": "d",
      "unit.now": "just now",
      "command.group": "OpenCode Go",
      "command.refresh": "Refresh OpenCode Go quota",
      "command.open": "Open OpenCode Go usage in Console",
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
      "unit.minute": "分钟",
      "unit.hour": "小时",
      "unit.day": "天",
      "unit.now": "刚刚",
      "command.group": "OpenCode Go",
      "command.refresh": "刷新 OpenCode Go 额度",
      "command.open": "在 Console 中查看 OpenCode Go 用量",
    },
  },
  setup(ctx) {
    const [state, setState] = createSignal<State>({ kind: "loading" })
    const [updatedAt, setUpdatedAt] = createSignal<number>(0)
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

    /* ---------- hover card ---------- */

    const style = document.createElement("style")
    style.dataset.plugin = "go-quota"
    style.textContent = CSS
    document.head.appendChild(style)

    const card = document.createElement("div")
    card.className = "goq-card"
    card.dataset.open = "false"
    document.body.appendChild(card)

    const bar = (label: string, meter: Meter) => {
      const value = Math.max(0, Math.min(100, meter.percent))
      const level = meter.limited ? "danger" : tone(meter.percent)
      return `<div class="goq-row">
        <div class="goq-row-head">
          <span class="goq-label">${escape(label)}</span>
          <span class="goq-value" data-tone="${level}">${meter.limited ? ctx.t("card.limited") : percent(meter.percent)}</span>
        </div>
        <div class="goq-track"><div class="goq-fill" data-tone="${level}" style="width:${value}%"></div></div>
        <div class="goq-reset">${escape(`${ctx.t("card.reset.before")}${relative(meter.resetsAt)}${ctx.t("card.reset.after")}`)}</div>
      </div>`
    }

    const render = () => {
      const current = state()
      const footer = `<div class="goq-foot">
        <span>${escape(`${ctx.t("card.updated")}${ago(updatedAt())}`)}</span>
        <a class="goq-link" data-act="open">${escape(ctx.t("card.console"))}</a>
      </div>`

      if (current.kind === "loading") {
        card.innerHTML = `<div class="goq-head"><span class="goq-title">${escape(ctx.t("card.title"))}</span></div>
          <div class="goq-empty">…</div>${footer}`
        return
      }
      if (current.kind === "anon") {
        card.innerHTML = `<div class="goq-head"><span class="goq-title">${escape(ctx.t("card.title"))}</span></div>
          <div class="goq-empty">${escape(ctx.t("card.anon"))}</div>${footer}`
        return
      }
      if (current.kind === "error") {
        card.innerHTML = `<div class="goq-head"><span class="goq-title">${escape(ctx.t("card.title"))}</span></div>
          <div class="goq-empty">${escape(ctx.t("card.error"))}</div>${footer}`
        return
      }

      const info = current.info
      const go = info.go
      const workspace = info.workspace.name ?? info.workspace.id
      const header = `<div class="goq-head">
          <span class="goq-title">${escape(ctx.t("card.title"))}</span>
          ${go ? `<span class="goq-plan">${escape(ctx.t("card.plan"))}</span>` : ""}
        </div>
        <div class="goq-ws">${escape(workspace)}${directory ? `<span class="goq-ws-sub"> · ${escape(projectName(directory))}</span>` : ""}</div>`

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
        card.innerHTML = `${header}<div class="goq-rows">${budgetRow}</div>${footer}`
        return
      }

      card.innerHTML = `${header}
        <div class="goq-rows">
          ${bar(ctx.t("card.rolling"), go.rolling)}
          ${bar(ctx.t("card.weekly"), go.weekly)}
          ${bar(ctx.t("card.monthly"), go.monthly)}
        </div>${footer}`
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
      if (target?.dataset.act === "open") {
        event.preventDefault()
        ctx.system.openExternal(usageURL())
      }
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
        const out = await ctx.client.usage.limits(directory ? { location: { directory } } : undefined)
        if (disposed || ticket !== sequence) return
        setState(out.data ? { kind: "ready", info: out.data as Info } : { kind: "anon" })
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
      if (closeTimer !== undefined) clearTimeout(closeTimer)
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
      window.removeEventListener("focus", onFocus)
      card.remove()
      style.remove()
    }
  },
})
