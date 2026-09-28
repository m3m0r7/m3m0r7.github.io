# Link Down

A Japanese desktop-first, first-person escape game in a two-story house. Diagnose the broken LAN connection, investigate documents and equipment, find a spare cable downstairs, then verify the restored interface. No mobile validation is currently promised.

## Run

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/game/engineer-escape/`. Native ES modules require no build step. Three.js 0.167.1 is pinned to its CDN and requires initial network access and WebGL 2. Local CSS, bootstrap and explicit import-map entries share a release suffix; bump all entries together after changes. Noto Sans JP is bundled with its SIL OFL license. Cat portraits reuse repository assets; the player portrait is the user-provided image stored locally as `assets/player.jpg`.

## Controls

| Action | Input |
| --- | --- |
| Walk | WASD; double-click floor or stairs; Shift for faster walking |
| Look | Drag; arrow keys; top-right pointer-lock button |
| Inspect / pet | Click a visible object; X or Space at the reticle |
| Dialogue | Click, X, Space or Esc: reveal the complete line, then advance |
| Object actions | Click the modeled part or action button; digits 1–9 |
| Leave observation / dialog | Esc after the visible dialogue has closed |
| Pause / resume | Esc during free exploration / in the pause menu; top-right pause button |
| Book / paper navigation | On-screen buttons or digits 1–2 |
| Inventory selection | Click a slot; digits 1–4 outside observation |
| Journal / conversation history | J / L or the corresponding HUD button |

The visible interaction prompt says X; the operation guide also documents Space. No projected plus-sign hotspots or directional wall signs expose clues. Small wires/plugs have larger invisible hit geometry, while occlusion remains enforced. Object clicks select immediately on pointer release. Distant visible targets use collision-aware approach paths. Manual walking, click walking and cats share the continuous staircase geometry.

## Puzzle and narrative

The game first opens an episode-selection screen. Episode 1 is playable; episodes 2 and 3 are disabled placeholders. Selecting episode 1 starts a fresh run or resumes existing progress, including completed/failed states. No intro runs before selection. Esc during free exploration opens pause; a return-to-top button saves progress and preserves the current session position. Top/pause freeze the timer and room simulation. Esc cannot dismiss the game top.

The opening starts at the workstation: “今日もシステムエンジニアの仕事だ…”. The physical monitor tries `i.mem.ooo`, fails, retries and fails again. Typewriter dialogue advances only on input. A separate mission dialog introduces exploration. The speaker is displayed as あなた. An optional control guide progresses through actual looking, walking and inspection; it contains no puzzle solution. Replay preserves progress.

The ordinary solution requires all of the following:

1. Open the bedside chest and take the physical server-room key.
2. Open the PC desk drawer and read Eru’s animal insurance card: born 2021-06-19. Only the month/day feed the code; the year, policy number and coverage period are realistic decoys. The card has ID-card proportions and a separate readable enlargement.
3. Open the hallway cardboard box and browse the mixed contracts to find Guri’s adoption document: born 2022-12-28. The adoption date (2023-04-08), microchip number and the other stacked documents’ dates are decoys.
4. In the upstairs PC file app, browse Home → Equipment / Construction and read the long server-room construction contract. Clause 9 sets the code to the cats’ birthdays **in adoption order**, two-digit months/days, and explicitly omits the number itself. The first-floor portraits reveal the adoption order: Eru, then Guri. This document is deliberately accessible before entering the locked room.
5. Enter the eight-digit code (`06191228`) in one field and insert the key. Either factor alone is insufficient. Incorrect input remains visible for correction.
6. Walk downstairs into the unlocked server room and open the stored cardboard boxes. Several contain unrelated parts or packaging. Box 04 contains ten mixed cables. Its action transfers the bundle onto a physical workbench at the rear of the server room, with a short moving-bundle animation. The box is then empty. Inspect the workbench and choose the extraction action to launch the fullscreen Three.js puzzle using the existing spaghetti game’s rope physics. An empty workbench cannot start the puzzle. Start the activity, drag any cable, and use the wheel to lift/lower it. Digit keys 1–9 and 0 select an endpoint (press again to switch ends); arrows move it, PageUp/PageDown lift/lower it, and Enter/Space release it. The longer cables lie on a gridded mat, surrounded by a modeled wooden desk, lamp, tools and packing. Contact markers and a settling meter explain progress. Separate the entire LAN cable, including its plugs, from the other nine cables anywhere on the desk, then release it. Segment distances cover crossings between sampled points. After 0.8 seconds of continuous clear, stationary checks, the cable is automatically awarded and saved; a dedicated success card returns to exploration. There is no tray, destination zone or time limit. Cancel/reset before success grants nothing; leaving the success screen keeps the awarded item. An optional LAN tester reports open conductors 3 and 6.
7. Replace the damaged upstairs LAN cable. Both ends must be connected, the workstation and router powered, and automatic IP/DNS enabled. Replacement alone does not complete the stage.
8. Run `icfg` in the workstation terminal while online. Other commands, reloads and DHCP renewal do not complete the stage. The command reference on top of the bedside chest explains the interface flags, address and carrier.

Books have reversible page turns. The separate network fundamentals book contains the topology diagram; the desk hint sheet is removed. The bookshelf holds varied technical volumes; the coffee-table book is a readable ordinary book without a password hint. Documents and notes are optional evidence, not hidden prerequisites for entering the correct code.

Three breaker circuits control the living/work room, kitchen/water rooms and equipment room. Partial outages are reversible. Turning all three off permanently fails the current run: the operating validation PC is damaged by the sudden complete outage. The failure survives reload; restart resets it.

Explicitly requested debugging shortcuts are available during free exploration: press D **22 separate times** while inside the first-floor bathroom to force a restored/cleared state, or inside the first-floor toilet to unlock the server room. Holding D does not count repeated keydown events. Leaving the room resets that room’s count. Modal text input and object observation do not trigger them. Debug transitions preserve save invariants; the forced-clear dialog identifies the debug path.

## Environment and presentation

The workstation includes detailed keyboard keys, a shaped mouse and headphones on a stand. There is no desk calendar. The router sits in an upstairs equipment rack with one PC LAN lead and a WAN uplink. The fiber termination and ONU are downstairs. The 6 mm LAN jacket stays above the floorboards, including interpolated bends; its two modeled 8P8C endpoints support independent unplug/insert/reseat actions.

The server room has two 19-inch racks with mounting rails, screw holes, drive handles, short patch leads, blank panels, UPS, overhead cable tray, commercial four-way ceiling cassette cooling, a wall thermostat and a temperature/humidity sensor. Eight opening boxes, a tools panel and component trays fill the storage area. Static rack parts are merged by material and inspection owner to reduce draw calls without removing interaction targets.

The expanded downstairs kitchen has an island sink, dishwasher, pull-out storage, rear cupboards, cups/plates and a wide silver refrigerator. The refrigerator contains distinct cartons, bottles, jars, eggs, produce and food containers. Separate closed doors lead to the washroom, toilet and bath; toiletries and hair appliances occupy shelves. Doors update collision/pathfinding and cannot close on the player’s threshold. A utility enclosure fills the space behind the breaker.

The bedroom has draped bedding, a bedside chest, a complete landing beside the bed and a cat tower. Window openings and curtains avoid the staircase. The visible wall clock and bedside alarm use the client’s current local time. Ceiling lights, windows, outdoor views, household fittings, equipment and storage have inspection entries/actions.

Eru is a blue-point bicolor Ragdoll; Guri is a gray Ragamuffin. Their displayed names have no breed suffix. The cats are scaled to half the preceding prototype, roam randomly between both floors, yield to nearby actors and react to petting. Two labeled automatic feeders and an adjacent fountain stand upstairs. The kitchen portraits show Eru on the left and Guri on the right when viewed from the front. Their inspection dialogue gives the lock ordering hint.

The HUD has a top-left minimap with stairs and position, and a right-side title, mission, persistent key guide and optional tutorial. Menu buttons share height/background. Black glass dialogue sits at the **bottom center**, with the portrait occupying the full rectangular left side. Dialogue overlays the fixed HUD without pushing inventory or controls upward. Clicking anywhere on the skit except its history control advances once. A new explicit action replaces the active line. Entering an observation or reopening a readable document replays its skit, even when the same text exists in saved history. Other repeated action messages retain their suppression. Each observation replay is recorded in chronological history without awarding duplicate clues/items. Esc advances visible dialogue before closing an observation or dialog; held-key repeats are ignored. History records full lines even when typing is interrupted. Item/note popovers appear only on acquisition/discovery.

The kitchen uses three everyday mugs on the open shelf, stacked dinner plates and small plates, nested bowls, lidded pots and canisters. Rear cabinets contain cookware and stacked food containers; a frying pan sits on the induction hob. The server-room workbench has a wood top, steel frame, mat, task light and an under-shelf parts tray. Its collision footprint is shared by player and cat navigation.

## PC and connectivity

Browser, files, network and terminal apps share one desktop height and a common SVG dock-icon size. The terminal starts without suggested commands. memoryOS file commands (`crt`, `lst`, `chgdir`, `read`, `more`, `head`, `grep`, `find`) read the same virtual files as the file app; diagnostics (`icfg`, `irt`, `p`, `nlp`), help/man, history and Ctrl+L are supported. Renamed commands reject their old names and alternate network aliases. `less` and `tail` are removed. In-world books and operating-system identifiers use memoryOS; only `icfg` can verify the repaired interface. Inputs never execute a host shell or access the real filesystem/network. Output is inserted as text. Live input and history use the same 12px/24px metrics and a one-character prompt gap; history retains the directory at submission time, including for `chgdir`. The scroll area reserves its scrollbar width.

The restored PC browser embeds the actual public `https://i.mem.ooo/`; real availability depends on the network. Its sandbox permits scripts, same-origin rendering and user-initiated external links, but no top-level navigation. The physical 3D monitor uses the bundled homepage screenshot captured on 2026-09-26 because a cross-origin webpage cannot directly become a live canvas texture. Simulation addresses are documentation-only example addresses.

The desk phone also uses a genuine `i.mem.ooo` screenshot (`assets/homepage-phone.png`, captured on 2026-09-26), instead of a fabricated welcome page. Its canvas trims the desktop capture's blank side margins and preserves the content's aspect ratio inside the phone browser; this is a static capture, not a live mobile browser. Keep the 1440 × 1000 source dimensions or adjust the crop when replacing this asset. The phone uses simulated cellular service independently of the broken home LAN and continues to provide the existing phone clue.

The file app renders `.rtx` (Rich TeXt) as documents. Financial documents show recipient/issuer, issue date and number, subject, payment/validity fields, quantities, unit prices, line amounts, tax, total and status. The desk invoice and PC invoice share the same data. `.tdo` opens a grouped, editable checklist with progress; checks autosave and the terminal reads the same current state. Actual Markdown and photo extensions remain. No generic filing footer is appended. Names such as Nekoneko Corporation and Kusunoki Builders are fictional in-world labels without incorporated-company prefixes or invented tax registration numbers.

Eru's files and the household book describe a cool beauty who is picky about food, watches toys without chasing, hates the vet and growls angrily, and uses the owner's arm as a pillow at night. Guri is an energetic, large cat with paws roughly 1.5 times Eru's size, eats dropped objects, hates the vet and eagerly plays with toys. Birthdays remain in the separate insurance/adoption clues, not in these profile files.

The game title is **リンクダウン (Link Down)** on the top screen, browser tab, site works card and X sharing. The public URL remains unchanged. The stage-clear dialog includes an X share link with the episode title, the same saved `MM:SS` exploration time displayed in the dialog, and `https://i.mem.ooo/game/engineer-escape/`. Like THE SHREDDER, it opens the X post composer in another tab; it never posts automatically. Reopening a completed save uses the stored completion time, and local preview addresses/cache queries are not shared.

## Persistence

Progress uses `engineer-escape:stage1:v3`; previous v1/v2 data remains untouched. Inventory, clues, lock factors, desk/chest/box states, network settings, breakers, interface verification, completion, failure and elapsed time persist. The cable-bundle transfer (`cablesOnBench`) and task-checkbox overrides (`taskChecks`) also persist. Older v3 saves default to an empty task override map and infer the workbench transfer from cable ownership, so a previously obtained cable remains usable. Invalid present values are rejected. Camera position resets safely upstairs. Invalid saves show a notification; unavailable storage does not prevent play. Other household fixture states, terminal working directory/scrollback and cat positions are session-local.

Dialogue separately stores the latest 240 validated full lines in `engineer-escape:dialogue:v2`. Restart clears current progress and history. Replay appends opening lines without changing puzzle progress. A retired calendar journal entry remains readable in existing v3 saves even though its model is removed.

## Implementation map

- `state.mjs`, `debug-sequence.mjs`: transitions, validation, save invariants and room-specific debug input.
- `movement.mjs`, `home-layout.mjs`, `navigation.mjs`: shared collision, rooms, stairs, pathfinding and cat wandering.
- `house.js`, `architecture.js`, `domestic.js`, `house-fixtures.js`: building, architecture, fixtures, clock, breaker and document locations.
- `equipment-racks.js`, `network-cable.js`, `desk-accessories.js`: equipment, wiring and workstation details.
- `kitchen.js`, `fridge-food.js`, `care-items.js`, `bedroom.js`, `library.js`, `insurance-card.js`: household models and readable assets.
- `documents.mjs`, `financial-documents.mjs`, `todo-documents.mjs`, `document-format.mjs`, `readers.js`, `shell-files.mjs`, `terminal.mjs`, `terminal-view.mjs`: shared virtual documents, readers and deterministic shell.
- `room.js`, `inspection.mjs`, `minimap.js`: scene lifecycle, camera/input, observation and map.
- `game.js`, `typewriter.js`, `conversation.mjs`: UI, narrative, acquisition and dialogue history.
- `models.js`, `surfaces.js`, `cats.js`, `monitor.js`: reusable geometry/materials, cats and the monitor texture.

Rendering uses Three.js, shadow mapping, restrained bloom and output color conversion. Floorboards are instanced. Geometry/material helpers cache reusable resources; pixel density is capped at 1.7. The player portrait uses `assets/player.jpg`; cat photos reuse `assets/cats/2.jpg` and `6.jpg`. No proprietary 3D asset is bundled. Static model parts are batched per parent/material while retaining moving flaps, food groups, display planes and louvers.

## Verification

```sh
node --test game/engineer-escape/tests/*.test.mjs
```

Tests cover eight-digit lock ordering, cable segment/plug proximity, release/settling/reset conditions, extraction proof, item prerequisites/idempotency, endpoint connectivity, the icfg completion gate, blackout failure, save validation, virtual shell behavior, debug boundaries, walls/doors/stairs, automatic routes, cat movement/avoidance and encoded X share contents.

Browser QA must use real movement/clicks to collect and read clues, unlock, repair and run icfg; compare UI against saved values and inspect console/server errors. Also verify both debug room sequences, blackout/reload/restart, centered overlays at desktop sizes, stable app heights, page turns, storage, petting, model placement and actual homepage embedding. Evidence and execution logs belong under `tmp/`.

## Landscape artwork

`assets/river-painting.png` was generated with the built-in image generation tool in generate mode on 2026-09-26, then used directly as a painting texture. The model supplies the wooden frame, mat and back fasteners.

Prompt: “Use case: stylized-concept. Asset type: a landscape oil painting texture for a framed painting in an ordinary cozy Japanese home in a 3D game. Create ONLY the artwork, straight-on, edge to edge, landscape aspect ratio 3:2. A quiet countryside river with willow trees, a small footbridge and distant blue-green hills under soft late afternoon light. Tasteful traditional impressionist oil painting with convincing visible brush strokes, restrained sage green, ochre, muted blue and warm cream colors. Familiar domestic wall art, gentle and natural, detailed enough to view close up. No writing, no text, no typography, no geometric poster graphics, no frame, no room, no border, no watermark. Original composition.”


## Still-life artwork

`assets/still-life.png` was generated with the built-in image generation tool in generate mode on 2026-09-27 and used directly as a framed painting texture.

Prompt: “Use case: stylized-concept. Asset type: original oil painting texture displayed in a wood frame in an ordinary lived-in home, landscape aspect ratio 4:3. Only the artwork, straight-on edge to edge: a simple cream ceramic pitcher, two ripe pears and a short stem of olive leaves on a worn wooden table beside a softly lit window. Quiet traditional still-life oil painting, visible restrained brushwork, muted umber, warm cream, olive green and ochre. Believable tasteful domestic artwork, modest, natural, not a graphic design. No writing, letters, typography, poster elements, logo, frame, room scene, border or watermark.”

## Additional assets and references

- Player image supplied by the user: https://pbs.twimg.com/profile_images/2096575976876699648/OjM2Zhts_400x400.jpg (downloaded unchanged as `assets/player.jpg`).
- Invoice layout reference: [NTT Finance sample and field explanation](https://www.ntt-finance.co.jp/billing/usersupport/bill/ntt.html). The game uses a fictional issuer and original canvas/HTML layout with matching totals (4,800 JPY before tax, 480 JPY tax, 5,280 JPY paid). No NTT logo or real account information is used.
- `cable-search.js` handles the workbench activity/HUD and imports the existing `game/spaghetti-code/js/rope-physics.js`; `cable-workbench.js` models the desk/props/plugs, and `cable-layout.mjs` defines the deterministic starting cables. The original spaghetti game files are unchanged. `supply-search.mjs` measures segment separation and settling, and validates extraction before inventory transitions. `share.mjs` builds the stage-clear X composer URL. The obscured room rendering is frozen while the workbench is open.
- `server-storage.js`, `climate.js`, `sofa-details.js`, `pet-station.js`, `invoice.js` and `mesh-batching.js` own the new models and local display data.
- A dedicated clear dialog appears after normal icfg verification or the existing explicit bathroom debug shortcut. Completed players can reopen it from the menu.

## Document layout references

- NTT Finance, [bill layout guide](https://www.ntt-finance.co.jp/billing/usersupport/bill/) and [charge breakdown guide](https://www.ntt-finance.co.jp/billing/usersupport/amountbilled/breakdown.html): hierarchy of account, billing period, payment status and charge detail.
- Money Forward, [estimate format guide](https://biz.moneyforward.com/invoice/basic/48510/): estimate number/date, recipient, validity, itemized pricing, tax and notes.

The game uses original fictional data and styling; reference-company logos and real customer identifiers are not reproduced.
