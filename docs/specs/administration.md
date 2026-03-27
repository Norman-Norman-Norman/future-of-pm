# Spec: Administration & Security

| Field | Value |
|-------|-------|
| Status | Existing (Partial) + Critical Security Gaps |
| Last Updated | March 10, 2026 |
| GitHub Issues | #1, #3, #5, #11, #38, #39, #40 |
| RICE Score | 15.0+ (security items) |

## Overview
Administration covers user authentication, authorization (RBAC), branch/HQ management, input validation, audit logging, accessibility, and the admin UI surface. Currently, auth is client-side only (no server protection), there's a critical XSS vulnerability, and API endpoints are completely unprotected.

## Current State

### API Endpoints
| Method | Route | File | Description |
|--------|-------|------|-------------|
| GET | /api/branches | `api/src/routes/branch.ts` | Returns all branches |
| GET | /api/branches/:id | `api/src/routes/branch.ts` | Get branch by branchId |
| POST | /api/branches | `api/src/routes/branch.ts` | Create branch |
| PUT | /api/branches/:id | `api/src/routes/branch.ts` | Replace branch |
| DELETE | /api/branches/:id | `api/src/routes/branch.ts` | Delete branch |
| GET | /api/headquarters | `api/src/routes/headquarters.ts` | Returns all HQ records |
| GET | /api/headquarters/:id | `api/src/routes/headquarters.ts` | Get HQ by headquartersId |
| POST | /api/headquarters | `api/src/routes/headquarters.ts` | Create HQ |
| PUT | /api/headquarters/:id | `api/src/routes/headquarters.ts` | Replace HQ |
| DELETE | /api/headquarters/:id | `api/src/routes/headquarters.ts` | Delete HQ |

### Data Models
| Model | File | Fields | Relationships |
|-------|------|--------|---------------|
| Branch | `api/src/models/branch.ts` | branchId, headquartersId, name, description, address, contactPerson, email, phone | belongs to Headquarters, has many Orders |
| Headquarters | `api/src/models/headquarters.ts` | headquartersId, name, description, address, contactPerson, email, phone | has many Branches |

### Frontend Components
| Component | File | Description |
|-----------|------|-------------|
| Login | `frontend/src/components/Login.tsx` | Email + password form. **XSS VULN: uses dangerouslySetInnerHTML with URL param** |
| AdminProducts | `frontend/src/components/admin/AdminProducts.tsx` | Admin product table. Client-side admin check only. |
| AuthContext | `frontend/src/context/AuthContext.tsx` | isLoggedIn, isAdmin (email ends with @github.com). **No real auth.** |

### Seed Data
- 1 headquarters: "CatTech Global HQ"
- 2 branches: "Meowtown Branch", "Tabby Terrace Branch"

## Gap Analysis

| Gap | Severity | Source |
|-----|----------|--------|
| **CRITICAL: XSS** in Login.tsx via dangerouslySetInnerHTML with URL param | **CRITICAL** | OWASP Top 10 — Issue #3 |
| **CRITICAL: No server-side auth** — all 40+ API endpoints publicly writable | **CRITICAL** | OWASP Top 10 — Issue #1 |
| No input validation on any API endpoint | **HIGH** | Issue #5 |
| No RBAC — admin is detected by email domain client-side | **HIGH** | Issue #11 |
| No admin UI for branches, HQ, orders, deliveries | **MEDIUM** | Issue #39 |
| No audit logging | **MEDIUM** | Issue #38 |
| No WCAG 2.1 AA accessibility compliance | **MEDIUM** | Issue #40 |

## Proposed Enhancements

| Priority | Enhancement | RICE Score | GitHub Issue |
|----------|-------------|------------|-------------|
| P0 | Fix XSS vulnerability in Login | 60.0 | #3 (PR #51) |
| P0 | Implement server-side authentication | 15.0 | #1 (PR #53) |
| P0 | Input validation on all API endpoints | 7.2 | #5 |
| P1 | RBAC — Users, roles, permissions | 5.0 | #11 |
| P2 | Admin UI for all entities | 3.0 | #39 |
| P2 | Audit logging | 3.6 | #38 |
| P2 | Accessibility audit & WCAG 2.1 AA | 4.1 | #40 |

## Acceptance Criteria
- [ ] Given the Login component, when rendering errors, then HTML is escaped (no dangerouslySetInnerHTML)
- [ ] Given any API endpoint, when a request is made without valid auth, then it returns 401
- [ ] Given a POST/PUT request, when invalid data is sent, then the API returns 400 with specific validation errors
- [ ] Given a user with "viewer" role, when they attempt to DELETE a product, then the API returns 403

## Technical Notes
- XSS fix: Replace `dangerouslySetInnerHTML` with safe text rendering
- Auth: JWT-based middleware; start with hardcoded users for demo, design for OAuth later
- Validation: Use Zod or Joi schemas for all request bodies
- RBAC: Define roles (admin, manager, viewer); middleware checks role per route

## References
- OWASP Top 10 — Injection, Broken Access Control, Security Misconfiguration
- NIST — Authentication and access control standards
