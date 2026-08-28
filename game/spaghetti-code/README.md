# Spaghetti / Code

A static, browser-based 3D cable-untangling game that can be deployed directly with GitHub Pages.

## Gameplay contract

- The six levels contain 3, 6, 9, 12, 15, and 18 cable products.
- A case always contains at least one wired-earphone product, one power cable, and one power strip.
- A case is cleared when no simulated contact remains between different cable products for 650 ms.
- A cable may remain curved, lifted, non-parallel, or in contact with another strand from the same product.
- There are no hints, automatic alignment, highlighted crossings, undo, or solve actions.
- Empty-space dragging orbits the camera. Cable dragging grabs the nearest simulated point. The wheel changes grab depth while holding.
- `Shift` + wheel pans the view across the table, and `+` / `-` zoom. Wheel deltas are normalized across pixel, line, and page modes; a browser-remapped horizontal mouse-wheel event is restored to forward/back movement, while two-axis trackpads retain both axes. The wheel listener covers the whole game shell, including HUD areas. One-finger drag rotates on touch devices, while two-finger pan and pinch zoom remain available.
- Starting a case runs a `3`, `2`, `1`, `GO` countdown. Simulation and score timing begin after `GO`, and all four timer-HUD actions remain natively disabled until then.
- The start menu has two phases: choosing an unlocked difficulty opens that difficulty's local top-five ranking in a black-and-lime instrument panel, and the ranking screen owns the `START` action. `BACK` or `Escape` returns to difficulty selection.
- The difficulty phase uses a 3-by-2 case-card grid beneath an SVG plate piled with cable products, a single-silhouette four-tine fork, and a spoon. Its wordmark carries the operation line `OPERATION: REFACTOR THE CODE`. The shared interface shows `Ver 1.0.0` at lower left; the menu alone shows the linked copyright at lower right.
- After `GO` finishes and play begins, an author skit slides above the version badge. It presents `assets/aa.me.x2.svg` in its original colors on white, labels the speaker `OPERATOR`, shows a difficulty-specific message, and dismisses itself after 5.2 seconds.
- Clear times are stored per difficulty in `localStorage["spaghetti-code:scores:v1"]`, sorted fastest first, and capped at five entries. The reader also migrates the earlier `best` / `recent` score shape.
- The timer HUD provides Font Awesome quick actions for help, retry, pause, and fullscreen. Retry always requires confirmation and preserves the current state when cancelled.
- `Escape` pauses both physics and the timer. The pause dialog can resume, request a confirmed retry of the same case, or return to level selection.
- `?` opens a modal help screen that explains the contact-free clear condition and camera-and-pulling strategy. Its backdrop uses the same strong blur and darkening as Pause so it cannot expose cable crossings.
- Landscape phone layouts compact the timer actions and HOW TO PLAY controls without covering the play field. Fullscreen uses the standard or WebKit-prefixed API when exposed; unsupported environments receive an in-game home-screen guidance message, and standalone iOS web-app metadata is enabled.
- The `CLEAR!` dialog offers X sharing, a primary next-difficulty action, a replay action, and a text action back to the start screen. The next-difficulty action starts a fresh case with the normal countdown and is hidden after UNKNOWN.
- EASY, NORMAL, and HARD are initially available. Clearing HARD unlocks EXTREAM, clearing EXTREAM unlocks ULTIMATE, and clearing ULTIMATE unlocks UNKNOWN. Progress is stored locally in the browser.
- Pressing `d` eleven times enables a session-only debug mode that unlocks every difficulty without changing stored progress.

## Author skit

The opening transmission uses the following fixed copy.

| Difficulty | Message |
|---|---|
| EASY | `ハヤク コード カタヅケロ。セッショク シテイタラ アカンデ。` |
| NORMAL | `コード カタヅケル ノ タノシイダロ` |
| HARD | `コード タチ ナイテイマス。ハヤク スクッテ アゲロ。` |
| EXTREAM | `ズポッ コレハ スパゲッティ コード` |
| ULTIMATE | `モウ ナニガ ナンダカ ワカラナイ ヨ` |
| UNKNOWN | `ウワー ムジュウリョク デ コード カタヅケル ノ ユメミタイダ` |

## Difficulty surfaces

Each difficulty changes both the floor material and the surrounding scene color.

| Difficulty | Surface |
|---|---|
| EASY | Woven tatami mats |
| NORMAL | Gray carpet |
| HARD | Wooden flooring |
| EXTREAM | Light marble |
| ULTIMATE | Dark server-room raised floor panels |
| UNKNOWN | White cyber floor in an animated, zero-gravity space |

The EASY floor and menu backdrop use a six-mat domino layout. Every individual tatami unit has a physical 2:1 aspect ratio before camera perspective is applied.

## Cable products

Generation uses weighted random selection. Common consumer cables have larger weights than uncommon female-to-female variants.

| Key | Product | Weight |
|---|---|---:|
| `earphones` | Y-shaped wired earphones in white, blue, pink, or red | 13 |
| `power-c7` | two-prong power plug to IEC C7 female | 13 |
| `power-brick` | two-prong power plug through an inline power brick to IEC C7 female | 9 |
| `power-strip` | two-prong power lead to a three-outlet strip | 8 |
| `hdmi-mm` | HDMI male to HDMI male | 10 |
| `hdmi-mf` | HDMI male to HDMI female | 6 |
| `usb-c-ff` | USB Type-C female to female | 3 |
| `usb-c-mf` | USB Type-C male to female | 8 |
| `usb-c-mm` | USB Type-C male to male | 11 |
| `usb-a-ff` | USB Type-A female to female | 3 |
| `usb-a-mf` | USB Type-A male to female | 7 |
| `usb-a-mm` | USB Type-A male to male | 9 |

Wired earphones are one cable product backed by three physical strands. A shorter lower lead runs from the audio jack to a visible splitter, then two upper wires diverge gradually to separate earbuds. Each upper wire is roughly one third as long as the lower lead. Contacts between those three strands are self-contact and do not block completion.

## Physical model

Each strand is a position-based particle chain with distance and bend constraints, gravity, table friction, workspace bounds, inter-product collision, non-adjacent self-collision, and tangential contact friction. UNKNOWN sets gravity to zero. A contact-free held point follows quickly with little weight penalty. Contact load is aggregated across the entire held cable, so tension reaching a remote crossing slows the pull. While dragging, collision constraints run on every solver iteration and use stronger tangential coupling for the held cable, transferring motion into the snagged product instead of letting one cable tunnel or slide through it.

Generated piles are relaxed synchronously before the countdown, so the player does not see the products dropped from above. Constraint, boundary, and contact corrections do not become artificial next-frame velocity, and unheld friction is symmetric across collision pairs. The settled pile sleeps until the first grab. After release, normal-gravity surfaces retain a short settling window for falling and contact transfer before sleeping again; UNKNOWN keeps only a brief zero-gravity release inertia. This prevents dense cases from moving without player input while preserving local snag transfer during a pull.

Power plugs, power strips, and inline bricks enlarge the collision radius at their attached particles. Heavy products also retain less velocity and move more slowly under the same grab constraint.

Cable jackets use a dielectric clear-coat material with low roughness. Warm key light and a cool opposing rim light create moving highlights that expose tube curvature and vertical order at black-on-black crossings. Rendering samples a centripetal Catmull–Rom curve at three times the physics-node density and uses 9–11 radial sides, removing the articulated-toy silhouette without changing collision cost or behavior.

All six levels use the same full collision and rendering quality. Spatial hashing and the early contact-count path keep contact checks responsive without changing the clear rules.

## Files

- `index.html`: document structure and game HUD
- `assets/aa.me.x2.svg`: author avatar used by the opening skit
- `css/game.css`: responsive visual system
- `js/levels.js`: shared difficulty order and metadata
- `js/config.js`: product catalog, weighted selection, and tangle generation
- `js/score-storage.js`: validated local ranking migration, sorting, and persistence
- `js/cable-visuals.js`: connector, earbud, power-strip, and inline-brick primitives
- `js/rope-physics.js`: strand rendering, Y-junctions, collision, friction, and clear metrics
- `js/surface-themes.js`: procedural tatami, carpet, wood, marble, server-floor, and white cyber-floor materials
- `js/game.js`: scene, input, camera, state, sound, and clear flow

## Research references

- MIT News, “Untangling the mechanics of knots” (2015): <https://news.mit.edu/2015/untangling-mechanics-knots-0908>
- Grannen et al., “Untangling Dense Knots by Learning Task-Relevant Keypoints” (2020): <https://arxiv.org/abs/2011.04999>
- Viswanath et al., “Disentangling Dense Multi-Cable Knots” (2021): <https://arxiv.org/abs/2106.02252>
- Sundaresan et al., “Untangling Dense Non-Planar Knots by Learning Manipulation Features and Recovery Policies” (2021): <https://arxiv.org/abs/2107.08942>
