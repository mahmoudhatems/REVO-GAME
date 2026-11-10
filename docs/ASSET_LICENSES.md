# REVO — Asset Provenance and License Register

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
| Other downloaded assets | Depends on files | UNVERIFIED | Record source and license individually. |
| Fonts | UI/branding | UNVERIFIED | Record font license and include license file if required. |
| Audio | Music/SFX | UNVERIFIED | Verify license and attribution requirements. |

## 3. NASA data and imagery

For each NASA-derived asset or data extract, record the specific page/dataset and usage terms. Do not assume all NASA partner content, third-party imagery, or logos carry identical reuse terms. Preserve NASA/JPL/partner credit lines when provided.

## 4. Release gate

Before public release, no asset may remain in the shipped build with an unknown provenance unless the team has explicitly decided to replace it or obtained appropriate permission. The final report should list unresolved assets.
