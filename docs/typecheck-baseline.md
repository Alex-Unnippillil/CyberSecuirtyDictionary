# Typecheck Baseline (Stage 1)

This baseline was captured with `npm run typecheck` on April 26, 2026 after widening TypeScript coverage and enabling `strict` + `noImplicitAny`.

## Error categories

- **Import / module-resolution errors (TS2307, TS7016, TS2503, TS2304):** Missing framework or package types (for example `next/*`, `contentlayer/generated`, `react-router-dom`, `@types/*` for some packages, and browser globals). This is currently the largest error group.
- **Nullability / optionality errors (TS18047, TS18048, TS2322 where `undefined`/`null` appears):** Accessing maybe-undefined objects without guards and assigning nullable values into strict non-null types.
- **Boundary / API contract errors (TS2322, TS2345, TS2769):** Mismatched data at boundaries (URLSearchParams construction, crypto BufferSource expectations, ref target typing, external callback/status enums).
- **Typing gaps / implicit `any` errors (TS7006):** Unannotated callback params revealed by `noImplicitAny` through `strict`.

## Staged strictness rollout

1. **Stage 1 (this change):**
   - Expand `tsconfig` include to project globs.
   - Enable `strict` and `noImplicitAny`.
   - Keep `noUncheckedIndexedAccess` explicitly disabled while resolving baseline errors.
   - Add `npm run typecheck` and enforce it in CI.
2. **Stage 2 (next PR):**
   - Resolve import/module gaps by installing missing runtime/type dependencies and adding targeted module declarations where unavoidable.
   - Fix top-priority nullability and boundary errors in `app/**` and shared components.
3. **Stage 3 (follow-up PR):**
   - Turn on `noUncheckedIndexedAccess`.
   - Address indexed access fallout with guards, defaults, and narrowed helper types.

## Note on `next/server` and `next/image`

Custom `paths` aliases were removed. Local compatibility shims now use ambient module declarations in `types/` so TypeScript does not redirect imports through path mapping that can hide real resolution behavior.
