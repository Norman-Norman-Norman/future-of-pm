---
name: workiq-search
description: Search Microsoft 365 data (emails, meetings, documents, Teams messages) for OctoCAT Supply context using Work IQ MCP tools. Use this when asked to find workplace context, search emails, check meetings, find documents, or look up people related to OctoCAT Supply.
---

# Search Microsoft 365 for OctoCAT Supply Context via Work IQ

This skill uses [Microsoft Work IQ](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/workiq-overview) MCP tools to query Microsoft 365 data — emails, meetings, documents, Teams messages, and people — for information relevant to the OctoCAT Supply project. Work IQ exposes Microsoft 365 Copilot data through the Model Context Protocol, allowing Copilot in VS Code to access and reason over workplace information.

---

## Prerequisites

1. **Node.js** is installed on the machine.
2. **Microsoft 365 subscription** with a Copilot license is active.
3. **Admin consent** has been granted for the Work IQ application in the Microsoft Entra tenant.
4. **EULA accepted.** The user must have run `workiq accept-eula` at least once.
5. **Work IQ MCP server is configured.** Check for available Work IQ tools using `tool_search_tool_regex` with pattern `workiq`. If no tools are found, the MCP server is not configured — follow the Setup procedure below before proceeding.

---

## Setup (Only if Work IQ MCP tools are not available)

### Step 1: Verify Work IQ is installed

**Tool:** `run_in_terminal`

```
npx -y @microsoft/workiq version
```

**Decision logic:**
- If a version number is printed, Work IQ is installed. Proceed to Step 2.
- If the command fails, inform the user: "Work IQ is not installed. Install it globally with `npm install -g @microsoft/workiq` or use `npx -y @microsoft/workiq mcp` for on-demand usage."

### Step 2: Ensure the MCP server is configured in VS Code

The user's VS Code MCP settings must include the Work IQ server. The configuration should be:

```json
{
  "workiq": {
    "command": "npx",
    "args": ["-y", "@microsoft/workiq", "mcp"],
    "tools": ["*"]
  }
}
```

**Action:** Inform the user to add this configuration to their MCP settings file, or use the one-click install links:
- [Install in VS Code](https://vscode.dev/redirect/mcp/install?name=workiq&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40microsoft%2Fworkiq%22%2C%22mcp%22%5D%7D)
- [Install in VS Code Insiders](https://insiders.vscode.dev/redirect/mcp/install?name=workiq&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40microsoft%2Fworkiq%22%2C%22mcp%22%5D%7D&quality=insiders)

After configuration, the user must reload VS Code for the MCP server to become available.

### Step 3: Accept the EULA (first-time only)

**Tool:** `run_in_terminal`

```
npx -y @microsoft/workiq accept-eula
```

---

## Procedure

### Step 1: Discover available Work IQ tools

**Tool:** `tool_search_tool_regex`

Search for Work IQ MCP tools:
```
pattern: "workiq"
```

**Decision logic:**
- If tools are found, note their names and proceed to Step 2.
- If no tools are found, follow the Setup procedure above, then return here.

### Step 2: Determine the search intent

Identify what the user wants to find. Map their request to one of these categories:

| Category | Example queries | OctoCAT Supply examples |
|---|---|---|
| **Emails** | "What did X say about Y?" | "What did the team say about the OctoCAT Supply product catalog?" |
| **Meetings** | "What was discussed in the meeting about X?" | "What decisions were made about OctoCAT Supply branch management?" |
| **Documents** | "Find documents about X" | "Find specs or requirements docs for OctoCAT Supply order management" |
| **Teams messages** | "Summarize messages about X" | "Summarize recent Teams messages about OctoCAT Supply deployment" |
| **People** | "Who is working on X?" | "Who is involved in OctoCAT Supply frontend development?" |

**Decision logic:**
- If the user's request is clear, proceed to Step 3.
- If ambiguous, ask one clarifying question: "Are you looking for emails, meeting notes, documents, Teams messages, or people related to OctoCAT Supply?"

### Step 3: Compose and execute the query

**Tool:** Call the appropriate Work IQ MCP tool discovered in Step 1.

Construct a natural language query that:
1. **Includes project-scoping terms** to focus results on this project. Use any combination of these synonyms and related terms:
   - Primary: **"OctoCAT Supply"**, **"OctoCAT"**
   - Project terms: **"supply chain management"**, **"B2B supply chain"**
   - Domain terms: **"branch management"**, **"orders"**, **"products"**, **"suppliers"**, **"deliveries"**, **"inventory"**
   - Technical terms: **"Express API"**, **"React frontend"**, **"Azure Container Apps"**
   - Use multiple terms with OR logic for broader coverage (e.g., "OctoCAT Supply OR supply chain management")
2. **Is specific** — include names, dates, or topics when the user provides them.
3. **Asks for actionable information** — requirements, decisions, feedback, action items.

**Example queries (note the varied scoping terms):**

```
"Find recent emails about OctoCAT Supply product pricing changes"
"What was discussed in meetings about supply chain management API architecture?"
"Find SharePoint documents about OctoCAT deployment to Azure Container Apps"
"Summarize Teams messages about B2B supply chain order management feature"
"Who has been involved in discussions about OctoCAT branch operations or inventory?"
"Find specs related to supply chain management or OctoCAT Supply"
```

**If the MCP tools aren't available**, fall back to the CLI:

**Tool:** `run_in_terminal`

```
npx -y @microsoft/workiq ask -q "<query>"
```

### Step 4: Process and present results

Review the results returned by Work IQ and:

1. **Summarize** the key findings in 3–5 bullet points.
2. **Highlight actionable items** — requirements, decisions, deadlines, or assigned tasks.
3. **Connect to code** — if the results mention features, routes, or components, cross-reference with the OctoCAT Supply codebase:
   - API routes in `api/src/routes/`
   - Models in `api/src/models/`
   - Frontend components in `frontend/src/components/`
   - Seed data in `api/src/seedData.ts`
4. **Cite sources** — mention the email subject, meeting name, document title, or channel name so the user can find the original.

**Decision logic:**
- If results are relevant and sufficient, present the summary and stop.
- If results are too broad, refine the query with more specific terms and re-run Step 3.
- If no results are found, suggest alternative search terms or a broader query.

### Step 5: Create GitHub issues from findings

When Work IQ results contain **actionable items** — requirements, feature requests, bug reports, decisions that need implementation, or assigned tasks — automatically create GitHub issues to track them.

**Tool:** `mcp_github_issue_write` (search with `tool_search_tool_regex` pattern `issue_write` if not yet loaded)

**Criteria for auto-creating issues:**
- A requirement or feature was discussed and is not yet tracked in GitHub
- A bug or problem was reported in emails, meetings, or Teams
- A decision was made that requires code changes
- An action item was assigned to someone on the team

**Issue creation rules:**
1. **Title:** Use the format `[WorkIQ] <concise description of the item>`
2. **Body:** Include:
   - Source: where the item was found (meeting name, email subject, document title)
   - Summary of the requirement or action item
   - Relevant codebase references (routes, models, components)
   - Link back to the original M365 content if available
3. **Labels:** Apply relevant labels (e.g., `enhancement`, `bug`, `documentation`)
4. **Repository:** Create on the upstream repo: `Norman-Norman-Norman/future-of-pm`

**Decision logic:**
- If 1–3 actionable items are found, create issues immediately and report them to the user.
- If more than 3 actionable items are found, list them all and ask the user which ones to create as issues.
- If no actionable items are found, skip this step.

### Step 6: Offer additional follow-up actions

Based on the results, suggest further steps beyond issue creation:

- "The spec document mentions a new API endpoint. Want me to scaffold the route?"
- "There's feedback about the product catalog UI. Want me to search the codebase for the relevant component?"
- "I found related discussions across multiple channels. Want me to consolidate them into a summary document?"

---

## Rules and Constraints

- **Always include project-scoping terms** in queries — use "OctoCAT Supply", "OctoCAT", "supply chain management", or domain terms to focus results.
- **Use multiple synonyms** when a single term returns no results — try "OctoCAT Supply OR supply chain" before reporting no data.
- **Never fabricate results.** If Work IQ returns no data, say so clearly.
- **Never store or log** Microsoft 365 data to files. Work IQ results are transient and should only be presented in conversation.
- **Always respect permissions.** Work IQ can only access data the authenticated user has permission to view.
- **Do not run Work IQ commands in the background.** Authentication may require browser interaction.
- **Always check for tool availability** before attempting to use Work IQ MCP tools.
- **Always report auth errors verbatim** — include the AADSTS error code and suggest the resolution from the troubleshooting table.
- **Auto-create GitHub issues** for actionable items found in Work IQ results (requirements, bugs, action items). Create on `Norman-Norman-Norman/future-of-pm`.

---

## Examples

### Example 1: Finding meeting context for a feature

**User:** "What did the team decide about OctoCAT Supply order tracking?"

**Agent action:**
1. Search for Work IQ tools via `tool_search_tool_regex`.
2. Call the Work IQ tool with query: "What decisions were made about OctoCAT Supply order tracking in recent meetings?"
3. Summarize results:
   - "In the March 5 standup, the team decided to add real-time delivery status to the order detail page."
   - "Sarah mentioned that the `orderDetailDelivery` model already supports tracking — see `api/src/models/orderDetailDelivery.ts`."
   - "Action item: Update the frontend `Products.tsx` component to show delivery status."

### Example 2: Finding specification documents

**User:** "Find any docs about the OctoCAT Supply API design"

**Agent action:**
1. Call Work IQ with query: "Find documents about OctoCAT Supply API design, REST endpoints, or architecture"
2. Present findings with links to SharePoint documents.
3. Cross-reference with existing routes in `api/src/routes/` to identify gaps.

### Example 3: CLI fallback when MCP is not configured

**User:** "Search my emails for OctoCAT Supply deployment issues"

**Agent action (MCP unavailable):**
```bash
npx -y @microsoft/workiq ask -q "Find emails about OctoCAT Supply deployment issues or errors with Azure Container Apps"
```

---

## Authentication Troubleshooting

Work IQ uses Microsoft Entra (Azure AD) for authentication. Browser interaction is required on first login and when tokens expire.

### Common auth issues and resolutions

| Symptom | Cause | Resolution |
|---|---|---|
| "Login required" or browser window opens | Token expired or first-time auth | Complete the browser login flow. Work IQ will cache the token for future use. |
| "AADSTS50076" or MFA prompt | Multi-factor authentication required | Complete MFA in the browser. If MFA keeps re-prompting, check conditional access policies with your admin. |
| "AADSTS65001" or "consent required" | Admin consent not granted | The Work IQ app needs admin consent in your Microsoft Entra tenant. Contact your IT admin and direct them to [admin consent docs](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/user-admin-consent-overview#admin-consent). |
| "AADSTS700016" or "application not found" | Work IQ app not registered in tenant | Your admin needs to register/consent the Work IQ application. See [Work IQ prerequisites](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/workiq-overview#prerequisites). |
| Timeout or no browser opens | Running in a headless/remote environment | Work IQ requires a browser for auth. If using SSH or a container, use device code flow: `workiq ask --tenant-id <your-tenant-id>` to get a device code to enter at https://microsoft.com/devicelogin. |
| "Insufficient privileges" | User lacks M365 Copilot license | Verify the user has an active Microsoft 365 Copilot license. Contact your M365 admin. |

### Auth recovery procedure

If authentication fails:
1. **Report the error verbatim** to the user — do not silently retry.
2. **Identify the error code** (AADSTS codes) and look it up in the table above.
3. **Suggest the resolution** from the table.
4. **If the error is not in the table**, direct the user to the [Work IQ GitHub Issues](https://github.com/microsoft/work-iq-mcp/issues) page to report it.
5. **Do not retry the same command more than once.** If it fails twice, stop and report.

---

## Anti-Patterns

- ❌ Querying without project scope ("Find recent meetings") → ✅ Scope with project terms ("Find recent meetings about OctoCAT Supply OR supply chain management")
- ❌ Using only one search term → ✅ Use multiple synonyms: "OctoCAT Supply", "OctoCAT", "supply chain management", "B2B supply chain"
- ❌ Saving Work IQ results to a file → ✅ Present results only in conversation; they are transient
- ❌ Assuming MCP tools are available without checking → ✅ Always run `tool_search_tool_regex` first
- ❌ Retrying authentication failures silently → ✅ Report the error, identify the AADSTS code, and suggest the fix
- ❌ Finding actionable items without tracking them → ✅ Auto-create GitHub issues for requirements, bugs, and action items
- ❌ Ignoring auth errors and moving on → ✅ Follow the auth recovery procedure and help the user resolve the issue
