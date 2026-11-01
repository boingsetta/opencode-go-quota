# go-quota

An OpenCode Desktop GUI plugin. A globe pill sits in the window titlebar (top right).
Hover it to open a card with three usage bars for your OpenCode Go allowance; click it to
open the Console usage page.

![hover card](docs/placement.png)

## Whose quota is it?

The numbers come from `GET /api/experimental/usage/limits`, which answers one question:
*for this location, which Console workspace is signed in, and what is its Go allowance?*

Resolution order:

1. **Location** — the directory of the session you are looking at. The plugin passes
   `location.directory` on every request, so the answer follows the project you switched to.
   You can pin it with the `location` option instead.
2. **Credential** — the server's active credential for the `opencode` integration (the
   Console login). A machine has one active Console account at a time; the server stores it,
   the plugin never touches the secret.
3. **Workspace** — the Console workspace that credential belongs to. The card shows its
   name (`Default` here) and the project directory the answer was resolved from.

So the card is not hardcoded to an account: it describes whatever workspace the current
location resolves to, and it degrades cleanly when that is nothing.

| Server answer | Pill | Card |
|---|---|---|
| workspace + Go meters | `OpenCode Go · 21%` | three bars |
| workspace, no Go plan | `OpenCode Go · 未订阅` | Console budget bar, or a "no plan" note |
| `data: null` (no Console login) | lock icon | 未登录 |
| request failed | x icon | 获取失败 |

## The card

```
OpenCode Go                              GO
Default · zcodeplayground
滚动 5 小时                          3.0%
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
4 小时后重置
本周                                  1.0%
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
5 天后重置
本月                                  0%
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
30 天后重置
更新于 刚刚                            打开 Console
```

- Bars turn amber from 70% and red from 90%; a reached monthly limit turns the pill into a
  ban icon and the card says 已达上限.
- Percentages below 1% keep two decimals (`0.03%`), so light usage is visible.
- Refreshes every `refreshSeconds`, when the active session changes, and when the window
  regains focus (at most once every 15 s).

## Options

All optional, set on the plugin entry:

```jsonc
{
  "plugins": [
    {
      "package": "D:\\software\\opencode-go-usage",
      "options": {
        "refreshSeconds": 60,
        "location": "D:\\work\\client-a",
        "openUrl": "https://opencode.ai/console"
      }
    }
  ]
}
```

| Option | Default | Meaning |
|---|---|---|
| `refreshSeconds` | `60` | Poll interval, clamped to 15–3600. |
| `location` | active session directory | Directory used to resolve the Console workspace. Pin it when one machine should always report one account. |
| `openUrl` | Console root | Fallback link when the server returns no `usageURL`. |

## Data source

`ctx.client.usage.limits({ location: { directory } })` → `GET /api/experimental/usage/limits`.
No API key, no separate login, no credential access.

```jsonc
{ "workspace": { "name": "Default", "usageURL": "…" },
  "go": { "rolling": { "percent": 3.0, "limited": false, "resetsAt": 1793160000000 },
          "weekly": { … }, "monthly": { … } },
  "budgets": [] }
```

## What the user must sign in to

The plugin ships no credentials and has no login of its own. It asks the local OpenCode
server, which uses the Console session the app already holds.

Each user therefore needs, once:

1. OpenCode Desktop 2.x.
2. A signed-in OpenCode Console account — **Account** in the app, or `/connect` → **OpenCode
   Console** in the TUI.
3. A Go or Go Plus subscription (or Console credit) if they want bars rather than a budget.

That is all. There is no API key field, no token to paste, and nothing stored by the plugin.
`usage.limits` returns `data: null` for a location with no Console sign-in, and the card shows
**未登录** with a link to the Console instead of failing.

Switching accounts also happens in OpenCode, not in the card: the card always describes the
account currently active for the location.

## Install

### From the release zip (no Node, no npm)

1. Extract so the folder ends up at `%USERPROFILE%\.config\opencode\plugins\go-quota\`.
   It must contain `package.json` and `dist/gui-experimental.cjs` directly.
2. Start or restart OpenCode Desktop.

Nothing else — package directories under `~/.config/opencode/plugins/` are discovered
automatically, so the config stays untouched.

If the pill does not appear, check **Settings › Extensions › Plugins** for `go-quota`, and
`~/.local/share/opencode/log/opencode.log` for a `loading plugin` line.

### From an arbitrary folder

Extract anywhere permanent and point the global config at the directory:

```jsonc
{
  "plugins": ["D:\\tools\\go-quota"]
}
```

Relative paths resolve from the config file; a path to a single file is skipped.

### From npm or git

```powershell
npm publish --access public        # after renaming to a free, e.g. @you/opencode-go-quota
opencode plugin add @you/opencode-go-quota
```

`opencode plugin add` also accepts npm-compatible git targets, so `github:you/go-quota` works
if `dist/gui-experimental.cjs` is committed.

### From source

```powershell
cd D:\software\opencode-go-usage
npm install
npx vite build
```

The desktop app reloads plugins when the config or the bundle changes, so no restart is needed.

## How the hover works

`TitlebarItem` only renders an icon and a text label, so the card is drawn by the plugin:

- one fixed-position element under `body`, 14 px from the window's right edge;
- `pointermove` finds the pill through its accessible name (`aria-label` starting with
  `OpenCode Go`) and compares rectangles, so window moves, resizes and DPI changes do not
  matter;
- the column from the pill down to the card counts as one hover surface, with a 300 ms
  grace period, so the pointer can cross the gap;
- `pointerleave` and window `blur` close it; a hidden card is `pointer-events: none`.

## Develop

```powershell
npx vite build --watch
```

Each rebuild reloads the GUI in every window. The bundle must stay one CommonJS file, which
the `gui()` Vite preset guarantees.

## Uninstall

Remove the `plugins` entry, or turn the GUI off in **Settings › Extensions › Plugins**.

## Notes and limits

- The GUI plugin API is experimental (`./gui-experimental`); a future OpenCode release may
  need changes.
- The endpoint reports one workspace per location. Multiple Console accounts on one machine
  are switched in OpenCode itself, not from this card — the credential API returns secrets,
  so the plugin deliberately does not read it.
- Requires OpenCode Desktop 2.x with a signed-in Console account for `usage.limits` to return data.
