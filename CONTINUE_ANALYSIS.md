# Continue last analysis — what to save and how

Analysis is **not** stored after leaving the page today. Only column mapping is remembered via `localStorage` (`src/utils/column-memory.ts`). That is why **Continue last analysis** on the Dashboard is still a TODO.

## Phase 1 — Resume setup (fast MVP)

Enough to make Continue useful **without** storing Excel payloads.

| What | Why |
| --- | --- |
| `workspace` (`gl` / `reversal` / `reversal-reclass`) | Where the button should navigate |
| `step` | Where the user left off |
| `fileNames` (GL, CoA, dictionary) | Show what was last used |
| `selectedHeaders` | Column mapping (partially already in column-memory) |
| `hierarchyData` | Levels for Process Analysis |
| `updatedAt` | Sort Recent list |

**Do not save in Phase 1:** `glData`, `tableData`, `overviewTableData` (tens of thousands of rows → IndexedDB/server size, privacy, quotas).

**Continue behaviour:** open the workspace, restore mapping + step, ask the user to re-drop the same files (“Re-drop GL za import.xlsx”).

## Phase 2 — Real continue of results

After Analyze, keep enough to reopen without remapping from scratch.

| Option | Pros | Cons |
| --- | --- | --- |
| **A. IndexedDB** (file buffers + result locally) | Fast, offline | That browser only |
| **B. Supabase Storage** (xlsx) + metadata in DB | Multi-device | Cost, retention, policy |
| **C. Result snapshot only** (overview + summary) | Smaller | Cannot fully re-filter without GL |

**Recommendation:** **A for MVP**, **B later** if sync across devices is required.

## Phase 3 — Projects

Named sessions, multiple Recent items, sharing, licence ↔ data retention.

---

## How to implement

### 1. Session model

```ts
type AnalysisSession = {
  id: string;
  workspace: "gl" | "reversal" | "reversal-reclass";
  step: number;
  files: { gl?: string; coa?: string; dictionary?: string };
  selectedHeaders: SelectedHeaders;
  hierarchyData?: HierarchyItem[];
  updatedAt: string;
  // Phase 2:
  // resultRef?: { kind: "idb" | "storage"; key: string }
};
```

### 2. Where to store

- **Phase 1:** `localStorage` key e.g. `gl-wizard-sessions` (list, max ~5)
- **Phase 2:** IndexedDB (`idb` / Dexie) for `ArrayBuffer` + result JSON
- **Later:** `analysis_sessions` table + Storage bucket

### 3. When to write

- After successful mapping / Analyze / meaningful Undo (debounce)
- Not on every scroll or filter change

### 4. Dashboard wiring

- Recent list from storage
- Click → `/general-analysis?resume=<id>` (or equivalent for reversal)
- On mount, model reads session, fills headers/step
- If file buffer missing in IDB → UI: “Drop the same GL again”

### 5. Safety

- Do not upload ledgers to the server until retention/privacy policy is clear
- Clear local sessions on logout (at least)
- Size limit (e.g. refuse > 50MB in IndexedDB)

---

## Suggested order of work

1. **Now:** Phase 1 (metadata + mapping) → Continue opens the right workspace with restore  
2. **Next:** IndexedDB for last GL/CoA buffers → real Continue without re-drop  
3. **Later:** server sync only if another device / audit is required  

Phase 1 is small and makes the Dashboard button useful immediately. Phase 2 is larger because it touches upload memory and lifecycle.

---

## Current related code

- Column recall: `src/utils/column-memory.ts`
- GL session state: `src/components/pages/general-analysis/general-analysis-model.ts`
- Dashboard TODO entry: `src/components/pages/main-menu/main-menu.tsx`
