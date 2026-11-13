# REVO â€” Asset Provenance and License Register

This register is intentionally conservative. Unknown rights must remain unknown until verified.

## 1. Rules

- Record the creator/source and exact asset page or repository.
- Record the license name and link, not just a statement that an asset is "free".
- Record attribution requirements.
- Record whether commercial use, modification, redistribution, and derivative works are permitted.
- Keep original license/readme files when supplied.
- Mark anything unverified as `UNVERIFIED`.
- Do not assume a repository's software license applies to bundled art, audio, fonts, video, or logos.
- Do not assume NASA branding or third-party imagery can be used without following the relevant usage rules.

## 2. Current asset inventory to verify

| Asset/source | Known use | License status | Required action |
|---|---|---|---|
| `assets/revo.png` | REVO character sprite sheet | UNVERIFIED | Confirm creator and rights. |
| `assets/logo.png` | REVO logo | UNVERIFIED | Confirm team ownership or permission. |
| `assets/intro.mp4` | Intro video | UNVERIFIED | Verify all visuals, music, sound, and footage rights. |
| `assets/alpha.png` | Unused/unknown at baseline | UNVERIFIED | Identify source and decide whether to use. |
| PixelLab-generated assets | Character/environment/tileset assets | VERIFY PLAN TERMS | Save generation/source information and confirm the applicable tool-plan license. |
| `assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/` | Categorized original and extracted PNG assets with `Asset_Manifest.csv` | UNVERIFIED | Preserve both size folders and source sheets; confirm creator, generation records, and applicable PixelLab plan rights before redistribution. |
| Other downloaded assets | Depends on files | UNVERIFIED | Record source and license individually. |
| Fonts | UI/branding | UNVERIFIED | Record font license and include license file if required. |
| Audio | Music/SFX | UNVERIFIED | Verify license and attribution requirements. |

## 3. NASA data and imagery

For each NASA-derived asset or data extract, record the specific page/dataset and usage terms. Do not assume all NASA partner content, third-party imagery, or logos carry identical reuse terms. Preserve NASA/JPL/partner credit lines when provided.

## 4. Release gate

Before public release, no asset may remain in the shipped build with an unknown provenance unless the team has explicitly decided to replace it or obtained appropriate permission. The final report should list unresolved assets.
# Visual rebuild provenance gate (2026-11-12)

PixelLab may be used manually through its website only; automated API/MCP use and downloads are not approved. Prefer free tools, and do not require a paid plan. Treat generated output license/redistribution terms as `UNVERIFIED` until the exact plan terms and output provenance are recorded. The project owner must review and approve each proposed asset before integration. Record prompt, tool/version, generation date, source/reference rights, output hash, and applicable license evidence without storing credentials. See `visual-rebuild/PIXELLAB_ASSET_SPECIFICATIONS.md` and `visual-rebuild/ASSET_PRODUCTION_BACKLOG.md`.

# N.E.I.L. source pack — Stage 2D.3 (2026-11-12)

| Source | License status | Provenance note |
|---|---|---|
| `assets/source/NEIL_Sprite_Pack/` and copied runtime files under `public/assets/characters/neil/` | **UNVERIFIED** | Owner supplied/approved pack identity and integration. The supplied README/manifests attribute assets to PixelLab, but plan-specific commercial redistribution rights have not been established. The raw original sheet referred to by the manifest is missing; 24 delivered individual frames and four directional sheets are present. No license is inferred from delivery or approval. |
