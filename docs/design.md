# Tandem design

## Current direction: Worldbuilding playground

On 2026-10-12 Nicol requested a complete visual redesign of the existing Tandem project using the new `website-identity-builder` workflow. The scope covers Home, Explore, Create, Dashboard, shared navigation/footer, and the existing preview and wallet dialogs. Preserve the Tandem name, paired-loop mark, supported routes, draft persistence/migration, and wallet safety. Implementation and validation remain local.

The product truth is one idea developing into a website and a coin with a shared identity. The page should feel like a place for creative beginnings: expressive, tactile, and direct. The distinctive artifact is the paired loop, interpreted as a broad physical ribbon sculpture with code-built website/coin identity elements. It carries the same idea through the hero, process narrative, selected direction, and ownership scene. This is a visual explanation of the product; it does not imply generation, a launch, or a wallet transaction occurred.

### Committed system

- Palette: lilac `#d7cef4`, plum ink `#26232d`, tangerine `#f37848`, ivory `#f6f1e5`. The hero background may use the artwork's sampled edge near `#cdc8fc` and a gradual mask to avoid an arbitrary image rectangle. Keep functional contrast stronger than the image reference when necessary; dark ink on the orange action is preferable to low-contrast white.
- Type: the existing self-hosted Manrope, heavy display hierarchy, close deliberate tracking and comfortable text. Mono is reserved for real technical values. The hero's centered two-line “Ideas become / worlds.” is a compositional anchor, not a small heading above a conventional split.
- Surface: full lilac opening, broad ivory editorial sections, plum ownership/story contrast, and a decisive orange closing. Edges and cards have restrained geometry rather than pill shapes on every element. Maintain the palette and tactile identity below the hero.
- Composition: giant heading, wide sculpture, and central dark functional composer. The gallery uses large portrait artwork and a staggered desktop rhythm; mobile keeps previews legible and actions accessible without requiring sideways scrolling.
- Copy: short, optimistic, specific to a shared website/coin identity, entirely English. Keep local-draft and wallet states truthful. Existing scope does not add backend generation, launch, live activity, customer proof, or financial performance claims.
- Motion: requested scroll-aware navigation, staged process scenes and restrained word/card movement, as detailed in the Retikl adaptation below. Respect reduced motion and avoid scroll hijacking, decorative preloaders and video.

### Content sequence

1. Central hero: “Ideas become worlds.”, “A website. A coin. One shared identity.”, paired sculpture and usable idea composer.
2. Process: “One spark. Two expressions.”, explain idea, creative direction, and the shared website/coin identity through an open visual narrative.
3. Direction library: “Different by design.”, generous Signal, Lagoon, and Cobalt previews plus the existing full library and filtering.
4. Ownership: the existing portable identity/source message, presented as a contrasting paired composition without new technical promises.
5. Fees: working illustration with the confirmed 75% creator / 25% Tandem split and adjustable volume/rate.
6. Examples: twelve functional idea starters and the real local project index.
7. FAQ: clear editorial questions and real answers, accessible disclosure controls.
8. Closing and footer: a confident invitation to create a project, with useful navigation and the Tandem wordmark.

Explore, Create, Dashboard, and dialogs inherit the same type, palette, edges, and control language. Form fields, local saved state, error feedback, preview selection, keyboard focus, and wallet boundaries are first-class parts of the new design.

### References and current production assets

The hero and direction-library boards were generated before full implementation. They are references, never flattened website assets. Compare current desktop captures to the boards for type scale, sculpture prominence, foreground composer, artwork scale, surface treatment, and spacing. Mobile adapts the composition while preserving reading order and useful primary action.

| File | Role | Reference / status |
| --- | --- | --- |
| `work/tandem-assets/identity-redesign/refs/hero-board-v01.png` | Hero section reference | Selected and inspected |
| `work/tandem-assets/identity-redesign/refs/gallery-board-v01.png` | Gallery section reference | Selected and inspected |
| `public/assets/tandem-world-hero-v01.webp` | Wide hero sculpture, 1344 × 752, 57,464 bytes | Integrated and validated |
| `public/assets/look-signal-v02.webp` | Signal preview, mint sculptural rings/spheres | Integrated and validated |
| `public/assets/look-lagoon-v02.webp` | Lagoon preview, wire globe and teal water | Integrated and validated |
| `public/assets/look-cobalt-v02.webp` | Cobalt preview, angular blue sculpture | Integrated and validated |

All six new images use Higgsfield `gpt_image_2_5`, variant `sunburst`, quality `high`, resolution `1k`, opaque background, one image per request. Each had its own exact preflight of **1.5 credits**, including references where present, for **9 estimated credits**. The estimate is not a final billing receipt. Job IDs, full prompts, reference relationships, and paths are in `work/tandem-assets/identity-redesign/generations.json`. The hero derives from the selected hero board; the three independent gallery images derive from the selected gallery board. No retry or video generation was performed. Old sources and SVG previews are preserved.

### Verification record

Initial and final live views were captured. Lint and the final build passed. The executor checked Home, Explore, Create and Dashboard at 320/768/1024 px and exercised composer, filters, preview, saving and reopening drafts. Main-thread captures at 1440x960 and 390x844 on the original 127.0.0.1:5173 origin show no global overflow or broken images; the two existing drafts remain visible. Missing Phantom, Escape and focus restoration were verified without requesting a real wallet account. A fresh visual review confirmed the corrected hero seam, gallery rhythm and mobile continuation. The final placeholder contrast was corrected to 5.59:1 and build rerun successfully. Real wallet connection remains untested. Final evidence is in docs/captures/identity-*.jpg. No remote publishing occurred.

## Retikl sections and motion adaptation — 2026-10-12

Nicol approved the current Worldbuilding identity and requested the complete section sequence and effects of https://retikl.fun/. The live reference was inspected through its actual browser interface. Its header translates out while scrolling down and returns on upward movement; a fixed right-hand section index tracks eight chapters. Other useful references are staged process scenes, word entrances, the complete nine-look library, a three-node ownership story, a volume-based fee calculator, twelve example ideas in a horizontal rail, a project table, expanded FAQ, and the final invitation.

Preserve the approved type, lilac opening, sculpture, dark composer, orange/ivory artwork and route design. Translate the reference's interaction patterns into Tandem's visual language rather than restoring its drafting-grid identity. No new generated media or animation dependency is required.

### Complete page and behavior

1. `hero`: ideas, website/coin identity and functional composer. Slight desktop-only sculpture depth movement; composition and controls remain stable.
2. `how-it-works`: Describe, Choose, Refine, Save, with a sticky visual stage following four desktop steps. Mobile uses a short static reading sequence. These steps match the frontend's actual capabilities.
3. `looks`: all nine directions on Home. Retain the three large selected portraits and add six compact previews with accessible direction dialogs. Explore filtering remains intact.
4. `ownership`: portable source, independent hosting, and shared coin identity. The paired-loop scene continues into three clear milestones; no fabricated repository, production URL, mint or integration status.
5. `fees`: creator/platform model confirmed directly by Nicol: **75% creator / 25% Tandem**. Interactive volume and assumed creator-fee rate determine a fee pool and the two shares. Initial illustration: $100,000 volume × 0.30% = $300; creator $225, Tandem $75. The adjustable example rate is not an assertion of a launch venue's current fees, a forecast, or a working collection contract.
6. `examples`: twelve original example ideas, native horizontal scrolling and previous/next controls. Each opens a Create project with its idea filled in. A project table reads real local drafts and opens the corresponding saved draft; it does not substitute invented market data for Retikl's live on-chain table.
7. `faq`: twelve relevant questions, including the fee split, rate, persistence, wallet boundary, ownership, hosting and launch capability. Semantic disclosures remain keyboard usable.
8. `start`: original orange closing, Create action and real footer links to all relevant chapters/routes.

Shared header behavior: scroll down hides, scroll up reveals; opening the mobile menu or keyboard focus keeps it available. Section navigation highlights the current chapter and reports page progress. Keep chapter links useful from the other routes without interfering with the hash router. Mobile navigation stays compact and must not cover content or actions.

### Motion and verification criteria

Use short word/card entrances, restrained artifact movement, meaningful process transitions and ownership connectors. Content is visible before enhancement initializes; motion must never make controls or accessible text unavailable. Use passive listeners and one requestAnimationFrame batch for scroll values, IntersectionObserver for viewport entrances, direct CSS variables for frame updates, and React state only when the active chapter changes. Clean up listeners/observers and react to reduced-motion preference changes. Reduced motion keeps every chapter readable, removes parallax and animated entrances, and uses immediate scrolling.

Acceptance: correct eight-section order; all nine looks and twelve idea actions; navbar hides and reappears with direction, active chapter follows scrolling; default fee calculation and an adjusted rate/volume are accurate; existing draft IDs/store/migration and wallet safety survive; desktop/mobile/intermediate widths have no global overflow or covered controls. Run lint/build and inspect real scroll stages, keyboard, rail, menu, dialogs and route navigation. Record completed checks after implementation.

### Retikl adaptation verification

2026-10-12: eight chapters confirmed in the rendered Home, with all nine looks, twelve example ideas, twelve FAQ disclosures and the two existing saved drafts. The design remains Worldbuilding playground. No new generated assets, media requests, animation packages or remote deployment were used.

- Lint passed after the final application changes. The final production build after the keyboard-focus correction passed: Vite 7.3.7, 4,572 modules, JavaScript 291.39 kB / 88.13 kB gzip, CSS 58.98 kB / 14.97 kB gzip.
- Actual browser checks at 320×844, 390×844, 768×1024, 1024×900 and 1440×960: no global horizontal overflow or broken images. The clipped process word at 320 was corrected and its rendered bounds rechecked. The connected fee bar measures exactly 75/25 at all four matrix widths.
- The shared header hides on downward scrolling and returns upward; real hidden bounds were measured near -82 px desktop and -74 px mobile. The section index correctly tracks How and Fees after the final geometry update. The process stage remains at 104 px while its active scene changes, and the current narrative stays visible at opacity 1.
- Mobile uses the header menu for chapter navigation, without a bottom overlay. The menu exposes all chapter links, is height-limited and scrollable, and closes with Escape. Independent visual recheck confirmed free calculator controls, example titles and hero artwork, plus legible desktop narrative.
- Calculator verified: $100,000 × 0.30% gives a $300 pool, $225 creator, $75 Tandem. A 0.40% rate gives $400/$300/$100; $10 million volume gives $40,000/$30,000/$10,000. Invalid 99% displays no misleading result and normalizes to 10% on blur. Keyboard focus on the fee input has a visible orange 3 px ring.
- The rail begins with Previous disabled and advances on Next (mobile scrollLeft 0→361). Model Meter opens Create with its actual idea and Cobalt direction. Explore→Fees returns to Home at the Fees chapter. Archive's new Home preview opens; Escape closes it and restores focus to its button. The split FAQ disclosure opens correctly.
- Wallet absence was verified with Phantom, then Escape restored Connect wallet focus. No installed provider, signature or transaction was requested. A read-only comparison confirmed unchanged wallet, draft validation, persistence/migration and save/update behavior; the new openDraft helper reproduces the existing sequence. The original origin retains two drafts. Real wallet connection remains untested.
- Final preview console read returned no warnings or errors. Reduced-motion handling was reviewed in code/CSS; the operating-system preference was not changed or emulated.

Final captures: `docs/captures/polish-desktop.jpg`, `polish-mobile.jpg`, `polish-process-desktop.jpg`, `polish-fees-desktop.jpg`, `polish-fees-mobile.jpg`, `polish-calculator-mobile.jpg`, and `polish-examples-mobile.jpg`. Previous code remains in `work/tandem-assets/retikl-polish/before-src/`.

Learning: runtime captures caught broken sticky containment, StrictMode cancellation, an animated class erased by React, percentage root margins tied to width ([IntersectionObserver specification](https://w3c.github.io/IntersectionObserver/#dom-intersectionobserver-rootmargin)), and a mobile overlay. Geometry updates use viewport height in one requestAnimationFrame batch; narrative cards keep their text visible. Automated builds alone did not reveal these issues.


## Website examples and navigation transitions — 2026-10-12

Nicol requested examples that visibly show each style, like Retikl, and a transition when changing tabs/pages. The live reference contains real website compositions, distinct type and palettes, and a viewport-sized ink wipe. Inspection captured its `.on-screen` curtain with opacity 1 and clip-path near `inset(0.5357% 0% 0%)` during Explore → How it works. Preserve Tandem's approved identity and translate these patterns into its own paired-loop language.

Scope: the Examples section, its nine style tabs and twelve idea previews, navigation transitions for Home, Explore, Create and Dashboard, and the existing Ownership chapter following Nicol's additional request. The other chapters and approved artwork/gallery remain intact. Use real HTML/CSS website miniatures with specific headlines and layouts, existing assets, and local/system fonts. Show a large selected browser frame with a project/context/action panel, then twelve idea cards with distinct miniature previews. A visitor should recognize the visual direction through typography, layout and surfaces as well as color. Miniatures are read-only visual previews; working style and project actions sit outside them. The saved-project table continues to use real drafts.

The ownership heading is now "Everything ships in your name." Use three clear, connected panels for editable source, the creator's hosting account/domain, and the shared coin identity with the confirmed 75/25 model. Adapt the reference's ownership diagram to Tandem's palette and paired-loop hub. Preserve the ownership ID and eight-chapter navigation; do not add a duplicate chapter. Show ownership and destination concepts without fabricated production URLs, mint addresses, commits, deployed statuses or claims of functioning integrations. Desktop uses three columns; mobile keeps a legible vertical sequence.

Style selection uses semantic tabs, arrow/Home/End keys and a short fade/translation. Page navigation uses a short full-screen plum curtain carrying the Tandem mark and destination, covers the swap, then reveals the new page. Keep header, footer and wallet outside the route content. Do not transform persistent main ancestors, which would affect fixed navigation and sticky scenes. No initial preloader, new animation dependency, remote generation, hosting or product backend is needed.

Acceptance: all nine styles look distinct; all twelve ideas select/use the correct direction; desktop and 320 px mobile retain readable previews and actions. Tabs retain focus and the correct ARIA selection. Global navigation resolves the latest request during rapid clicks and browser history changes, cleans up under StrictMode, preserves Create's same-route reset and draft IDs, and consumes a pending Home chapter only after Home mounts. Reduced motion removes the transition promptly with no hidden or inert content left behind. Validate affected routes, keyboard, rapid navigation, chapter jumps, console, lint and build, then record actual captures/checks here and in the matching project note.

### Examples, ownership and route verification

2026-10-12: completed in the actual local repository. Examples has nine semantic style tabs, a large HTML/CSS browser preview, and twelve concept cards with specific copy, direction labels and real Create actions. The existing ownership chapter now reads "Everything ships in your name." and connects the project hub to editable source, hosting and coin identity panels. Its desktop columns become a vertical mobile sequence. Existing artwork, routes and two saved drafts remain available; no new media, dependencies or remote publishing was used.

- Final executor lint and production build passed after the responsive and navigation corrections.
- Real browser inspection: desktop at 1440 pixels wide, mobile at 390×844, and all nine selected previews at 320×844. No global horizontal overflow; the nine previews showed distinct typography, palette and composition. Selected Lagoon is circular, Monument has explicit vertical rows, and compact Pulse text retains its own smaller scale. The desktop showcase reserves space for the fixed chapter index.
- ArrowRight, Home and End changed the selected style and kept focus on the corresponding tab. The selected preview uses a short fade/translation; reduced motion removes it through CSS.
- The selected Pulse action opened Create with Coinflip Club's actual idea and Pulse direction. Dashboard still showed Good Company and Open Field. Reopening Good Company restored its idea, name, ticker and Cobalt direction without saving or changing the drafts. Same-route Create reset the idea. Explore/Dashboard navigation, browser Back/Forward, main focus and a Create→Examples chapter jump were exercised; settled views had an idle curtain and no inert main.
- A read-only controller audit checked latest-request tokens, timer/listener cleanup, StrictMode, dynamic reduced motion and editing IDs. It found and verified the correction for a pending Home chapter surviving a cancelled route. Route swaps scroll instantly under the curtain; requested chapter scrolling remains smooth. Rapid sub-190ms navigation and OS reduced-motion changes were reviewed in code, not browser-emulated.
- Independent visual review confirmed the distinct previews, mobile reading order and connected ownership composition. Its material desktop overlap finding was corrected and rechecked in the affected showcase. Final preview console contained no warnings or errors, and example images were complete.

Evidence: `docs/captures/styles-*.jpg`; source backup: `work/tandem-assets/style-examples/before-src/`. Useful lesson: percentage heights in an automatic grid can flatten artwork, and style overrides can accidentally enlarge compact text. Verify actual child bounds and reserve space for fixed navigation, including its label, before handoff.
## Example artwork correction — 2026-10-12

Nicol reported that example previews looked cluttered because artwork layers overlapped. The rendered Cobalt preview and shared MiniWebsite markup confirm the cause: every existing image receives an additional orbit and opaque fake panel. These generic decorations obscure the image's own composition and are not needed to demonstrate a direction.

Keep the nine direction identities, twelve concept starters, tabs/keyboard/transitions, actual Create actions and real saved-project table. Each miniature gets one unobstructed existing artwork, with image fitting that respects the three portrait WebP files and six 720×460 SVGs. Separate copy and image in explicit layout regions. Scale type and spacing against the preview's own width rather than the full viewport, so compact and mobile versions remain readable. Remove unnecessary rotations and masks where they clip or distort content. Preserve the rest of the approved website and Vercel configuration; no new media or dependencies are required.

Acceptance: no arbitrary orbit/panel over the artwork, no image/copy/nav/footer collisions, no clipped headlines or horizontal overflow; recognizably different directions in the featured browser and compact cards at desktop, tablet and 320/390 px mobile. Inspect real captures and affected interactions, run lint/build, and record completed evidence after implementation.
### Artwork correction verification

2026-10-12: the shared MiniWebsite now renders one existing image with contain fitting, without the generic orbit, opaque panel, blend or arbitrary rotation. The artwork has a bounded grid region, separate from copy and the miniature navigation/footer. Container-relative type and spacing serve both the featured browser and compact previews. Featured copy between 781 and 1280 px uses a smaller scale so long headlines fit. Desktop Examples wrappers and the horizontal rail reserve space for the fixed chapter index; its label no longer obscures text, project actions or carousel controls.

- Executor lint and final TypeScript/Vite build passed after the last CSS change. No new assets or dependencies were introduced; Vercel configuration remains intact.
- Actual browser geometry checked all nine directions at 320, 390, 768, 1024, 1101, 1102, 1200, 1280 and 1440 px as relevant. The final intermediate-width sweep covered 45 states with no text/navigation/footer collision, artwork outside its region or global overflow. Twelve compact previews were checked at desktop and 320 px. The small Signal copy box extends into its padding allocation, but its actual label and headline remain below navigation, with a measured nine-pixel label gap.
- Live UI shows zero orbit/panel overlays and one image per miniature. The twelve compact images load correctly; existing two drafts remain visible. ArrowRight changes the selected style while retaining focus. Preview Repository Market selects Index. The final desktop rail advances from 0 to 816 px on Next; its right edge is 1233 px, before the index label at 1293.66 px. Project actions are inside the reserved column.
- Independent bounded visual review found no material overlap in desktop, mobile Pulse or the compact rail. Final preview console had no warnings or errors. The local Vite server was restored on the existing 127.0.0.1:5173 origin after the previous process had stopped; a fresh browser tab loaded the actual corrected source. No browser data or drafts were saved or removed.

Evidence: `docs/captures/examples-fix-before-desktop.jpg`, `examples-fix-desktop.jpg`, `examples-fix-mobile.jpg` and `examples-fix-miniatures-desktop.jpg`. Lesson: existing artwork already carries a composition. Additional generic shapes can obscure it; a single contained image and type scaled to the miniature give a clearer preview. Validate intrinsic image sizing and fixed navigation hit areas as well as a passing build.

## Route transition choreography — 2026-10-12

Nicol reported that the existing 480 ms route curtain was too brief to notice and lacked distinctive motion. This request supersedes its earlier short-duration target. The new route sequence should last about 1.6 seconds: a 420 ms cover, a 640 ms fully covered hold, and a 540 ms reveal. Swap content beneath the fully covered layer; keep the current page inactive until the new page is revealed, then restore focus.

Use Tandem's existing plum, orange, ivory and paired-loop language. Two loops enter from opposing directions, rotate into their joined position with restrained overshoot, and settle while the destination title reveals word by word. The loops occupy the middle of the curtain; the English destination heading sits below them, with clear separation at desktop and 320 px mobile. The cover/reveal remain a directional wipe. This is navigation choreography, not backend loading: do not add invented loading metrics or generated media.

Retain latest-request handling, browser history, same-route Create reset, pending Home chapter behavior, draft IDs, StrictMode cleanup and immediate initial/dynamic reduced motion. Restart only the curtain's interior for a new navigation intent; keep its outer node stable. Prevent pointer input from reaching covered controls. Do not transform persistent content ancestors, add an initial preloader, alter the page identities, or extend this route animation to every style/anchor click. No new dependencies or assets are required.

Acceptance: observe real cover/hold/reveal states, perceptible loop and title motion, readable mobile composition, final focus and no inert content left behind. Exercise all four routes and browser history; inspect cancellation paths and reduced motion in code, and run lint/build. Record only runtime states and captures actually observed.
### Verified route motion

- Final executor checks: `npm.cmd run lint` and `npm.cmd run build` PASS; 4,572 modules, CSS 74.86 kB / 18.35 gzip and JS 299.01 kB / 90.35 gzip. No dependencies, assets or Vercel configuration changed.
- Real browser observations confirmed covering, holding, revealing and idle. The Dashboard sequence was observed fully covered at about 462 ms, revealing at 1,132 ms and idle at 1,692 ms; these are automation observations rather than exact frame timings. The configured sequence is 420 + 640 + 540 = 1,600 ms. The loops changed rotation/position and the destination words appeared during the covered stage.
- All four routes reached their intended content. The current and newly mounted main remained inert during the three active phases, then became interactive with focus on main. A newer request during cover cancelled back to the mounted route; a request during hold replaced the destination while retaining the curtain. The latest destination won and no inert attribute remained.
- Dashboard still displayed the two existing drafts. Dashboard to Fees reached the Home chapter at 118 px from the viewport top, with final main focus and an idle curtain. No drafts were saved or removed and no wallet flow was invoked.
- Mobile at 320 x 568 showed the loops above the legible two-line Create title, with about 75 px between their bounding regions. Initial desktop checks revealed a collision on low windows and just above the first height cutoff. The final continuous desktop vh sizing passed at 1280 x 600, 1440 x 780 and 1440 x 960, with approximately 42 / 90 / 149 px between loop bounds and heading. Mobile rules remain unchanged by that correction.
- Independent static review found no material issue in latest-request tokens, same-route cancellation, hash history handling, pending Home chapters, newly mounted main inertness, final focus, StrictMode cleanup or initial/dynamic reduced motion. Reduced motion and Back/Forward were reviewed in code for this change; the attempted browser history automation did not complete, so no new runtime history result is claimed. Final preview console had no warnings or errors, viewport override was reset and Home was left interactive.

Evidence: `docs/captures/route-motion-desktop.jpg`, `route-motion-mobile.jpg` and `route-motion-short-desktop.jpg`. Lesson: size navigation artwork against viewport height as well as width; an arbitrary height breakpoint can reintroduce a collision immediately above its cutoff.
## Historical direction and asset ledger

The material below records the previous Tandem direction and its earlier assets. Its appearance guidance is superseded by the current complete redesign above; its product and safety boundaries remain relevant.

# Previous Tandem design

Reference: https://retikl.fun/, visually inspected on 2026-10-12. Its distinctive elements are a light drafting grid, large dark sans-serif typography, mint accents, technical mono labels, an idea composer, and a dark contour-map viewfinder.

The first iteration used the reference's instrument character. On 2026-10-12 Nicol requested a new design, name and branding. The current direction is Tandem: one idea, a website and a coin moving together through one shared identity. The primary action remains writing an idea; Connect Wallet is a separate explicit action.

## Visual decisions

- Direction: open creative studio, expressive product, a paired-loop mark and tactile illustration.
- Design variance 7, motion intensity 4, visual density 4. Clear product actions and contrasting compositions replace the old drafting grid and instrumentation.
- Palette: warm orange `#ea6b3f`, charcoal ink `#202529`, clear white `#fafaf8`, pale blue-gray `#e9eef1`. Template art retains its own design-direction colors.
- Typography: self-hosted Manrope with IBM Plex Mono only for actual technical values. Strong large headings and comfortable body text.
- Rounded controls, 18–20 px surfaces, airy gaps, restrained shadows. Mobile preserves the composer before the artwork.
- Hero message: “Good ideas move together.” Two code-built product cards connect the illustration to a website and a coin.
- Motion is limited to interface feedback and brief illustration movement. Reduced-motion preference disables the hero animation and smooth route scrolling.

## Pages and boundaries

Home contains the idea composer, process, template gallery, ownership, FAQ, and final CTA. Explore filters and previews templates. Create holds local idea and identity fields plus a selected look. Dashboard lists locally saved drafts and a useful empty state. No backend generation, deployment, coin creation, market data, or transaction execution is part of this deliverable.

Wallet selection may connect to installed browser providers only after visitor action. Display only the actual returned account. Never request signatures or transactions. Missing-wallet and rejection messages describe the immediate action, without demo or test framing.

## Asset ledger

The nine visual-library assets remain original SVG, built locally in code. New branding adds three local SVGs and one purpose-made hero image through Higgsfield. Unused topography and Retikl favicon are historical sources rather than current branding. No video was generated.

| File | Purpose | Composition and palette | State |
| --- | --- | --- | --- |
| `public/assets/look-signal.svg` | Signal design preview | 720 × 460 mint target diagram, right-weighted focal point, left copy space | Created |
| `public/assets/look-lagoon.svg` | Lagoon design preview | 720 × 460 teal longitude/latitude globe, right focal point | Created |
| `public/assets/look-cobalt.svg` | Cobalt design preview | 720 × 460 blue angular volume and grid, right focal point | Created |
| `public/assets/look-monument.svg` | Monument design preview | 720 × 460 stone neutral stacked silhouette | Created |
| `public/assets/look-index.svg` | Index design preview | 720 × 460 charcoal and apricot ordered bars | Created |
| `public/assets/look-drift.svg` | Drift design preview | 720 × 460 muted lavender curved ribbons | Created |
| `public/assets/look-field.svg` | Field design preview | 720 × 460 olive organic line field | Created |
| `public/assets/look-archive.svg` | Archive design preview | 720 × 460 paper-colored woven line engraving | Created |
| `public/assets/look-pulse.svg` | Pulse design preview | 720 × 460 coral rotating loops | Created |
| `public/assets/tandem-mark.svg` | Tandem brand mark | Paired diagonal loops, orange and charcoal, transparent | Created |
| `public/assets/tandem-favicon.svg` | Browser identity | Paired loops on rounded white ground | Created |
| `public/assets/tandem-identity.svg` | Ownership spread | 900 × 620 identity card and coin illustration, orange/charcoal/blue-gray | Created |
| `public/assets/tandem-hero.webp` | Hero illustration | 896 × 1120 paired orange lacquer and ivory ceramic loops, pale blue-gray studio background | Generated, inspected and optimized |

SVGs and the hero image contain decorative geometry only; functional copy and controls stay in React. They are local assets with no external runtime requests.

The former topographic hero and reticle favicon are preserved as historical sources outside the served assets. The repository directory is now `Tandem`; existing local drafts migrate from the earlier store without deleting the original records.

Hero generation: Higgsfield, `gpt_image_2_5`, variant `sunburst`, quality `medium`, resolution `1k`, aspect ratio `4:5`, opaque background, count one, no references. Job `995d2a51-0fc2-4450-9cd1-d25ce76773c2` completed. Current preflight estimate was **0.5 credits exact**, below the per-image ceiling of 3; this is an estimate, not a final billing receipt. Prompt described two separate broad interlocking orange/ivory ribbon loops, soft daylight, cool pale background, generous margins and no text/UI. Original source, full prompt and job metadata are in `work/tandem-assets/`, outside production assets. Validation captures are in `docs/captures/`. The optimized WebP is 26,396 bytes.
