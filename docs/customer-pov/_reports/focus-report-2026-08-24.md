# Focus report - 2026-08-24

Internal working report from Microsoft 365, public Slack, and GitHub signals gathered on 2026-08-24. This is a triage artifact; review customer and internal-confidential content before publishing or committing.

## Stack-ranked focus list

| Rank | Focus | Why it matters | Immediate next action |
|---|---|---|---|
| 1 | Failed CodeQL workflows in personal/demo repos | Three unread GitHub notification emails reported failed CodeQL runs on `MSFT-DEMOS/baseline-vs-code-extention`, `Norman-Norman-Norman/vscode-extension-template`, and `Norman-Norman-Norman/miniature-computing-machine` on Aug. 23/24. The shared root cause is that CodeQL analysis completes but SARIF upload fails because code scanning/code security is not enabled for the repositories. Enabling Code Security was blocked by enterprise/metered-usage policy, so the CodeQL workflows were disabled manually. | If CodeQL is still desired, ask an enterprise owner to enable Code Security; otherwise leave the workflows disabled so Dependabot PRs stop failing on SARIF upload. |
| 2 | Synopsys Cursor vs. GitHub Copilot follow-through | Highest-impact customer signal. The current ask is to produce a concise status summary covering assessment state, concerns, blockers, and Copilot-vs-Cursor findings ahead of customer interactions. | Send a one-page status update: current assessment, major concerns, blockers, side-by-side session logistics, and product signals. |
| 3 | Enterprise governance, billing, telemetry, and token visibility | Multiple FDE signals point to demand for usage attribution, cost controls, model entitlements, admin controls, and governance for MCPs/agents. | Build a consolidated evidence package for Enterprise, Governance, and Metrics/Analytics PMs. |
| 4 | S&P Global engagement transition | Active engagement is expected to move toward VP discussion and eventual sales handoff; token consumption/adoption evidence needs to be captured before closeout. | Prepare a VP-meeting prep note: adoption evidence, blockers, token trend, decision needed, and post-FDE owner. |
| 5 | Owned PR release queue | Several authored PRs are green but blocked on conflicts, review, failing targeted checks, or release sequencing. | Resolve dirty/failing PRs first, then request review/merge for clean PRs. |
| 6 | GitHub-Copilot-for-Jenkins P0 preview blockers | The Jenkins issue set contains customer-preview blockers around security findings, rollback/HPI, compatibility qualification, diagnostics, and bounded invocation behavior. | Treat P0 issues as release blockers before any P1 productionization work. |
| 7 | FDE closeout hygiene | FDE syncs are pushing active-engagement review, outcome documentation, and lesson publication. | Convert customer-specific outcomes into customer folders or private assessment tracking before closing engagements. |

## Source coverage

- Microsoft 365: WorkIQ found 28 recent items across email, Teams, and customer/FDE-related signals. A follow-up customer-specific WorkIQ query returned policy-restricted references but no additional summarizable body.
- Public Slack: Searches for customer/FDE/release terms and public mentions in the last 48 hours found no substantive public Slack items requiring action. Slack DMs/private channels were not read.
- GitHub: Authored open PRs and issues were queried with GitHub CLI under the active GitHub account.

## Open PR release triage

| Priority | PR | Current status | Release action |
|---|---|---|---|
| P0 | `github/github-app#12271` - Reap idle CLIs under Windows commit pressure | Checks pass; merge state is conflicting; review required; linked to Windows commit-pressure issue work. | Resolve conflicts/rebase, rerun validation, request review, then update related Windows issue(s). |
| P0 | `github/copilot-agent-runtime#15540` - Runtime: Add OTel charge code attribution | Checks pass; merge state is conflicting; review required; POC framing still needs clarity. | Resolve conflicts, confirm POC vs. production intent, then request runtime owner review. |
| P0 | `github/otel-billcode#85` - Add organization usage reporting | Merged on Aug. 24. | Use as the now-landed base for the remaining organization-reporting stack. |
| P0 | `github/otel-billcode#83` - Add replay-safe operational usage metrics | Merged on Aug. 24. | Use as the now-landed base for durable event work. |
| P0 | `github/otel-billcode#80` - Retain exported traces with pinned Tempo | Open; merge state is conflicting; `test (22)` is failing. | Resolve conflicts and fix the Node 22 failure before review/merge. |
| P0 | `github/otel-billcode#84` - Add durable content-free OTLP events | Open; merge state is conflicting and `observability-shared` is failing. | Resolve conflicts and fix `observability-shared`, then re-evaluate. |
| P0 | `github/otel-billcode#86` - Authorize shared organization reporting | Merged on Aug. 24. | Use as the now-landed authorization base for Fleet work. |
| P0 | `github/otel-billcode#87` - Add authorized Fleet session explorer | Merged on Aug. 24. | Confirm downstream deploy/release expectations if #80 remains a declared dependency in historical PR text. |
| P0 | `github/GitHub-Copilot-for-Jenkins#65` - Make Copilot audit outcomes durable | Merged on Aug. 24. | Continue the P1 productionization slices after P0 preview blockers. |
| P1 | `github/github-app#10304` - Add CLI extension slash commands to app composers | Draft; dirty; review required. | Either revive and take out of draft with an owner, or close if superseded. |
| P1 | Older GitHub App PRs `#8044`, `#8022`, `#7976`, `#7954`, `#7949`, `#7754` | Mostly stale/dirty/review-required. | Decide revive vs. close so they stop obscuring the active release queue. |

## Open issue release triage

| Priority | Issue | Why it matters | Next action |
|---|---|---|---|
| P0 | `github/github-app#12117` | High-severity Windows commit-limit/performance bug; likely paired with PR #12271. | Land #12271 or update the issue with remaining repro/validation gaps. |
| P0 | `github/github-app#12784` | Related Windows Modern Standby/git-timeout unresponsiveness report. | Use it to validate whether #12271 also reduces suspended-timeout replay pressure, or split a separate fix. |
| P0 | `github/copilot-agent-runtime#15521` | Issue counterpart for charge-code attribution. | Keep aligned with PR #15540 and close/update after runtime decision. |
| P0 | `github/GitHub-Copilot-for-Jenkins#50` | Private security-review findings block customer preview. | Close before preview release. |
| P0 | `github/GitHub-Copilot-for-Jenkins#52` | Versioned customer-preview HPI and rollback are required for release. | Complete after security and rollback path are validated. |
| P0 | `github/GitHub-Copilot-for-Jenkins#54` | Controlled design-partner pilot is the evidence loop for preview. | Pair with one exact compatibility profile in #55. |
| P0 | `github/GitHub-Copilot-for-Jenkins#55` | Prevents overbroad customer-preview claims. | Define exact Jenkins/core/plugin/platform compatibility matrix. |
| P0 | `github/GitHub-Copilot-for-Jenkins#46-#49` | Diagnostics, bounded prompt/metering, audit, and setup are required to make preview supportable. | Close as customer-preview blockers before P1 productionization. |
| P1 | `Norman-Norman-Norman/future-of-pm#109` | High-priority analytics dashboard MVP in this repo. | Closed by merged PR `Norman-Norman-Norman/future-of-pm#110`. |

## Release sequencing recommendation

1. CodeQL workflow failures were mitigated by disabling the CodeQL workflow in the three affected repos after Code Security enablement was blocked by policy.
2. Resolve `github/github-app#12271` and use it to move Windows commit-pressure issues forward.
3. Resolve `github/copilot-agent-runtime#15540` conflicts and align it with `github/copilot-agent-runtime#15521`.
4. Clear the OTEL bill-code stack in order: #83, #85, #86, and #87 are merged; #80 needs conflict and Node 22 repair; #84 needs conflict and `observability-shared` repair.
5. For Jenkins, #65 is merged; continue the remaining productionization slices only after P0 preview blockers stay under control.
6. Convert stale/draft PRs into either active owner-backed work or closures.

## Notes and limits

- Slack search was limited to public Slack content. Direct messages and private channels require explicit confirmation before reading.
- Some customer/FDE WorkIQ references were policy-restricted, so this report avoids quoting or expanding restricted content.
- `Norman-Norman-Norman/future-of-pm` is a public repository; keep confidential customer details out of committed artifacts.
