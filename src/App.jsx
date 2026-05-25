import { useState, useEffect } from "react";

// Supabase is optional — app works fully in solo mode without it.
// To enable sessions: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
let supabase = null;
const _sbUrl = import.meta.env.VITE_SUPABASE_URL;
const _sbKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (_sbUrl && _sbUrl.startsWith('https://') && _sbKey && _sbKey.length > 20) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(_sbUrl, _sbKey);
  } catch (e) {
    console.warn('Supabase not configured — running in solo mode only.');
  }
}

const C = {
  bg: "#060810", panel: "#0c0f1a", border: "#1e2235",
  accent: "#00e5ff", green: "#00ff88", red: "#ff3a3a",
  yellow: "#ffd600", orange: "#ff6b00", pink: "#ff00aa",
  purple: "#9b00ff", text: "#e0e6f0", muted: "#5a6280", subtle: "#1a1f35",
};

const MAPS_CONFIG = [
  { id: "shadows", name: "SHADOWS OF EVIL", subtitle: "Morg City · BO3 Base Game", eeName: "The Beginning of the End", difficulty: 8, players: "1-4 (Solo viable)", time: "2-3 hours", color: "#9b00ff", icon: "👁️", tag: "COMPLEX", tagline: "A 1940s noir city crawling with evil. Complete four district rituals using Beast Mode and seal the Rift." },
  { id: "ascension", name: "ASCENSION", subtitle: "Soviet Space Facility · Zombies Chronicles", eeName: "Casimir Mechanism", difficulty: 3, players: "Solo or 1-4", time: "45-90 min", color: "#00e5ff", icon: "🚀", tag: "BEGINNER FRIENDLY", tagline: "Free a trapped scientist using black hole grenades across three waves of Space Monkeys." },
  { id: "shangrila", name: "SHANGRI-LA", subtitle: "Ancient Temple · Zombies Chronicles", eeName: "Stand-In", difficulty: 7, players: "2-4 REQUIRED", time: "1.5-2.5 hours", color: "#ff6b00", icon: "🏛️", tag: "REQUIRES 2 PLAYERS", tagline: "Trigger eclipse events and complete timed co-op rituals in a cursed ancient jungle temple." },
  { id: "moon", name: "MOON", subtitle: "Lunar Surface · Zombies Chronicles", eeName: "Cryogenic Slumber Party", difficulty: 6, players: "1-4 (2 recommended)", time: "1-2 hours", color: "#aaccff", icon: "🌕", tag: "INTERMEDIATE", tagline: "Hack Soviet equipment, survive low gravity, and complete Richtofen's soul transfer to the MPD." },
  { id: "origins", name: "ORIGINS", subtitle: "WWI France · Zombies Chronicles", eeName: "Little Lost Girl", difficulty: 9, players: "1-4 (2-3 ideal)", time: "2-4 hours", color: "#ffd600", icon: "⚙️", tag: "HARDEST", tagline: "Build and upgrade four elemental staffs, activate three giant robots, and complete an ancient ritual." },
];

// ═══ SHADOWS DATA ═══
const SHADOWS_DATA = {
  overview: {
    summary: "Morg City is divided into four districts. Each district has an altar where you complete a ritual using Beast Mode — a temporary transformation. Complete all four to collect Gateworms, then enter the Rift to finish.",
    phases: [
      { label: "SETUP", desc: "Unlock the map, get perks, craft the Apothicon Servant wonder weapon." },
      { label: "RITUALS", desc: "Complete one ritual in each of the 4 districts by charging altars in Beast Mode." },
      { label: "THE RIFT", desc: "Enter the Rift and place all 4 Gateworms in their pedestals." },
      { label: "SEAL IT", desc: "Defeat the Shadowman encounter and seal the Rift with the Summoning Key." },
    ],
    mustHave: [
      "Apothicon Servant — the wonder weapon, essential for crowd control",
      "Juggernog — Canal District near the waterways, buy immediately",
      "At least 2 players recommended — Margwas in the Rift are brutal solo",
      "Understand Beast Mode — used for rituals and Pack-a-Punch access",
    ],
  },
  steps: [
    { phase: "SETUP", icon: "🔓", title: "Unlock the Map and Beast Mode", color: "#9b00ff",
      location: "Junction — the central hub connecting all four districts",
      locationDetail: "Spawn is in Junction. Buy doors to access Footlight (boxing/jazz), Canal (waterways), Waterfront (docks), and the Rift gateway. Beast Mode transforms you to smash orange-cracked walls, charge portal mouths, and access Pack-a-Punch.",
      steps: ["Buy doors from spawn to access all 4 districts. Budget around 10,000 points.", "Locate Juggernog in the Canal District near the waterway bridges — buy it first.", "Beast Mode: find a glowing Beast altar. Transform to smash orange walls, charge blue portal mouths, and raise the Pack-a-Punch platform.", "Craft the Apothicon Servant at any workbench (see Weapons tab)."],
      tip: "Play a few rounds before the EE. You need perks and points. Juggernog is the #1 priority always.", warning: null },
    { phase: "RITUAL", icon: "🕯️", title: "Complete All 4 District Rituals", color: "#9b00ff",
      location: "Footlight (boxing area), Canal (waterways), Waterfront (docks), Junction (central)",
      locationDetail: "Each district has a ritual altar. Find the ritual item in that district, place it on the altar, kill zombies near it to charge, then use Beast Mode to hold action at the blue portal mouth in that district. A Gateworm appears — collect it. Repeat for all 4 districts.",
      steps: ["Find ritual item per district — glows, check surfaces near the district landmark.", "Place item on the altar. Kill zombies near it to fill the charge bar.", "Enter Beast Mode and hold action at the blue portal mouth in that district.", "Collect the Gateworm that appears. Repeat for all 4 districts.", "Margwas spawn more often after each completed ritual — kill them immediately."],
      tip: "Order: Footlight → Canal → Waterfront → Junction. This routing minimizes backtracking.", warning: "If you die mid-ritual the progress resets. Stay alive during the charging phase." },
    { phase: "RIFT", icon: "🌀", title: "Enter the Rift and Place Gateworms", color: "#ff00aa",
      location: "The Rift Gateway — large glowing portal in the center of Junction",
      locationDetail: "After all 4 rituals, the Rift portal fully opens in Junction. Inside is a multi-level dimension with 4 pedestals. Enemies spawn aggressively inside — enter with full health, full ammo, and Juggernog.",
      steps: ["With all 4 Gateworms, enter the Rift via the large portal in Junction.", "Find the 4 pedestals inside — they glow corresponding to each district.", "Place each Gateworm on its matching pedestal while fighting off Margwas and Keepers.", "After all 4 are placed the Shadowman confrontation begins."],
      tip: "Upgraded Apothicon Servant destroys enemies in the Rift. Upgrade before entering.", warning: "The Rift is NOT a safe zone. Enemies spawn aggressively." },
    { phase: "COMPLETION", icon: "✅", title: "Seal the Rift", color: "#00ff88",
      location: "Inside the Rift — central platform",
      locationDetail: "After placing all Gateworms, the Shadowman encounter triggers. Use the Summoning Key on the central platform when prompted. Survive the final wave and complete the interaction.",
      steps: ["After all 4 Gateworms are placed, follow the on-screen prompts.", "Use the Summoning Key on the central platform.", "Survive the final enemy wave during the interaction.", "Ending cutscene plays — The Beginning of the End complete."],
      tip: "The final prompt is very clear on screen. Follow it and keep shooting.", warning: null },
  ],
  weapons: [
    { name: "Apothicon Servant", type: "CRAFTABLE", icon: "🐙", color: "#9b00ff",
      description: "A tentacle-void weapon that sucks in and destroys multiple zombies at once. Near-essential for the Rift sequence.",
      acquisition: "Craft from 3 parts found across the 4 districts. Assemble at any workbench.",
      parts: [
        { name: "Worm Part 1", location: "Footlight District — on a surface near the jazz club or boxing area." },
        { name: "Worm Part 2", location: "Canal District — near the waterway bridges." },
        { name: "Worm Part 3", location: "Waterfront or Junction area — check rooftops and side alleyways." },
      ],
      upgradeNote: "Pack-a-Punch upgrades it further. Highly recommended before entering the Rift.",
      eeRelevance: "Not strictly required but makes the Rift dramatically more survivable. Near-essential for solo." },
    { name: "Summoning Key", type: "STORY ITEM", icon: "🔑", color: "#ffd600",
      description: "A glowing golden artifact central to the BO3 Zombies storyline. Becomes usable automatically as you complete ritual steps.",
      acquisition: "Story-driven — appears as you complete the ritual steps. Cannot miss it.",
      parts: [], upgradeNote: null,
      eeRelevance: "Required for the final Rift sealing step. Unlocks automatically through EE progression." },
  ],
  enemies: [
    { name: "Margwa", icon: "👹", threat: 5, color: "#ff3a3a",
      description: "A massive 3-headed monster. Each head must be shot when its glowing yellow mouth opens.",
      identify: "Huge, slow-moving creature with 3 glowing heads. Loud roar on spawn.",
      handle: "Wait for a head's mouth to glow/open, dump ammo into it. Apothicon Servant deals heavy damage. Never stand directly in front of it.",
      eeRelevance: "Spawn aggressively in the Rift. Expect 2-3 simultaneously during Gateworm placement." },
    { name: "Parasites", icon: "🦟", threat: 3, color: "#ff6b00",
      description: "Small fast flying creatures that swarm in groups. Don't hit hard individually but numbers are dangerous.",
      identify: "Flying glowing creatures in groups. Distinct buzzing/hissing sound.",
      handle: "Shotguns and Apothicon Servant most effective. Use a Gobblegum or explosive if 3+ are on you.",
      eeRelevance: "Spawn during ritual charging phases. Don't let them interrupt your altar progress." },
    { name: "Keeper", icon: "💀", threat: 4, color: "#9b00ff",
      description: "Powerful hooded entities in the Rift and Shadow Realm. Much tankier than normal zombies. Ranged energy attacks.",
      identify: "Tall robed figures with glowing eyes. Only appear in the Rift — not the main map.",
      handle: "High-damage weapons only. Pack-a-Punched gun or Apothicon Servant. Don't get surrounded.",
      eeRelevance: "Spawn inside the Rift during Gateworm placement. Expect them alongside Margwas." },
  ],
  mapNodes: [
    { id: "junction", x: 50, y: 50, label: "JUNCTION", color: "#9b00ff", type: "area", desc: "Central hub — spawn point, connects all 4 districts. Rift gateway is here. Workbench for Apothicon Servant." },
    { id: "footlight", x: 20, y: 25, label: "FOOTLIGHT", color: "#ff6b00", type: "area", desc: "Boxing gym and jazz club district. Ritual 1. Apothicon Servant part here." },
    { id: "canal", x: 80, y: 25, label: "CANAL", color: "#3399ff", type: "area", desc: "Waterway and bridge district. Ritual 2. Juggernog is here." },
    { id: "waterfront", x: 80, y: 75, label: "WATERFRONT", color: "#00ff88", type: "area", desc: "Docks and shipping district. Ritual 3. Apothicon Servant part here." },
    { id: "rift", x: 50, y: 28, label: "THE RIFT", color: "#ff00aa", type: "key", desc: "Final EE destination. Enter after collecting all 4 Gateworms. Full of Margwas and Keepers." },
    { id: "jugg", x: 72, y: 32, label: "JUGGERNOG", color: "#ff3a3a", type: "perk", fixed: true, desc: "FIXED — Canal District near the waterway bridges. Buy this first." },
    { id: "speed", x: 28, y: 32, label: "SPEED COLA", color: "#00e5ff", type: "perk", fixed: true, desc: "FIXED — Footlight District. Faster reloads." },
    { id: "doubletap", x: 50, y: 72, label: "DOUBLE TAP", color: "#ffd600", type: "perk", fixed: true, desc: "FIXED — near the Waterfront/Junction border." },
    { id: "stamin", x: 65, y: 68, label: "STAMIN-UP", color: "#00ff88", type: "perk", fixed: true, desc: "FIXED — Waterfront area." },
    { id: "pap", x: 50, y: 40, label: "PACK-A-PUNCH", color: "#ffd600", type: "key", desc: "Floating platform in Junction. Access via Beast Mode — charge the glowing symbol near Junction center." },
    { id: "box1", x: 35, y: 55, label: "BOX SPAWN", color: "#888", type: "box", desc: "Possible Mystery Box location — moves after several uses. Follow the blue beam." },
    { id: "box2", x: 22, y: 60, label: "BOX SPAWN", color: "#888", type: "box", desc: "Possible Mystery Box location near Footlight lower area." },
  ],
  mapEdges: [["junction","footlight"],["junction","canal"],["junction","waterfront"],["junction","rift"],["canal","jugg"],["footlight","speed"],["waterfront","stamin"],["junction","doubletap"],["junction","pap"]],
  mapPhoto: "https://static.wikia.nocookie.net/callofduty/images/thumb/Shadows_of_Evil_map.png",
  mapOrientation: { north: "Rift Portal (top)", south: "Spawn / Junction (center)", east: "Canal District (right)", west: "Footlight District (left)" },
  tips: [
    { icon: "👾", title: "Beast Mode Priority", body: "In Beast Mode: smash orange-cracked walls first to open shortcuts, then charge the blue portal mouth for your ritual, then charge Pack-a-Punch if needed. Your Beast time is limited — plan before transforming." },
    { icon: "🏃", title: "Margwa Priority", body: "When a Margwa spawns, drop everything and focus it. Shoot glowing open mouths only. Never let 2 Margwas be active simultaneously." },
    { icon: "🔫", title: "Pack-a-Punch Access", body: "PaP is on a floating platform. In Beast Mode, charge the glowing symbol near Junction center to raise it. Upgrade before entering the Rift." },
    { icon: "🎯", title: "Apothicon Servant Aim", body: "Shoot the AS at the ground in front of a horde, not directly at one zombie. Save ammo for Margwa fights and the Rift." },
    { icon: "📍", title: "Ritual Items", body: "Ritual items spawn in 2-3 fixed spots per district. They glow faintly. Check countertops, ledges, tables near each district landmark." },
    { icon: "💊", title: "Perk Priority", body: "Juggernog (Canal) first. Then Speed Cola (Footlight). Then Stamin-Up. You need health and reload speed for the Rift." },
  ],
};

// ═══ ASCENSION DATA ═══
const ASCENSION_DATA = {
  overview: {
    summary: "A Soviet-era rocket facility. Free trapped scientist Dr. Gersch by using the Gersch Device (black hole grenade) at three lander locations across three Space Monkey attack waves.",
    phases: [
      { label: "SETUP", desc: "Power on, ride all 3 lunar landers, get the Gersch Device from the Mystery Box." },
      { label: "FREE GERSCH", desc: "Throw a Gersch Device at the rocket base to start the Easter egg." },
      { label: "MONKEY ROUNDS", desc: "In 3 Space Monkey rounds, throw Gersch Devices near all 3 landers each time." },
      { label: "COMPLETION", desc: "After the third monkey round, audio plays — Casimir Mechanism complete." },
    ],
    mustHave: [
      "Juggernog — just past spawn on the left wall, buy immediately after power",
      "Gersch Device — the wonder weapon from Mystery Box, required for every EE step",
      "PhD Flopper — near Lander C, prevents fall damage, great solo perk",
      "At least 3 Gersch Devices saved before each Space Monkey round",
    ],
  },
  steps: [
    { phase: "SETUP", icon: "⚡", title: "Turn On the Power", color: "#00ff88",
      location: "Centrifuge Room — large circular room with a spinning centrifuge near the rocket",
      locationDetail: "From spawn, buy 2 doors (~750 pts each) and head toward the large circular room with a giant centrifuge spinning in the center. The power switch is a large red lever on the right side of this room before the path up to the launch pad.",
      steps: ["Buy 2 doors from spawn and head toward the Centrifuge Room.", "Enter the large circular room — the centrifuge spins in the center.", "Find and hold Square/X on the red lever. Map fully lights up.", "Immediately return to spawn area and buy Juggernog — it is on the wall just past spawn."],
      tip: "After Juggernog, head toward PhD Flopper near Lander C. Prevents fall damage and is great solo.", warning: null },
    { phase: "SETUP", icon: "🚀", title: "Ride All 3 Lunar Landers", color: "#00e5ff",
      location: "Three locations — near Stamin-Up (upper-left), Speed Cola (upper-right), PhD Flopper (lower area)",
      locationDetail: "Each lander sits right next to a perk machine. Lander A is upper-left near Stamin-Up. Lander B is upper-right near Speed Cola. Lander C is in the lower area near PhD Flopper.",
      steps: ["Lander A: From Centrifuge, go left to Stamin-Up. Yellow pad is right next to it. Stand on it and hold Square/X.", "Lander B: From Centrifuge, go right to Speed Cola. Stand on pad and ride.", "Lander C: Head lower toward PhD Flopper. Third lander is beside it.", "Each lander teleports you back near the Centrifuge Room — that is normal."],
      tip: "Open doors on your route to each lander. Full map access is required for the EE.", warning: "You MUST ride all 3 before EE steps will work. Do not skip this." },
    { phase: "SETUP", icon: "🌀", title: "Get the Gersch Device", color: "#ff6b00",
      location: "Mystery Box — look for the blue vertical light beam anywhere on the map",
      locationDetail: "Box starts random each game. Common spots: near Centrifuge Room, near Speed Cola, and near PhD Flopper in the lower areas. Look for a tall blue/white light beam shooting straight up.",
      steps: ["Find the Mystery Box by looking for its vertical blue light beam.", "Spin the box (950 pts per spin). The Gersch Device looks like a dark grenade with a glowing void core.", "Box gives you 2 when obtained. You need at least 3-4 total before the first monkey round.", "Keep spinning between rounds. If box moves, find the new beam."],
      tip: "Do NOT use Gersch Devices on regular zombie rounds. Save every single one.", warning: "Gersch Device is 100% required. There is no substitute." },
    { phase: "EASTER EGG", icon: "🎯", title: "Free Gersch — Throw at the Rocket", color: "#ff00aa",
      location: "Main Rocket Launch Pad — top of the map, above the Centrifuge Room",
      locationDetail: "From the Centrifuge Room, take the upward path toward the big rocket. The launch pad is at the very top — a wide open area with the giant rocket. Stand at the base/foot of the rocket as close as you can get.",
      steps: ["Navigate up to the rocket launch pad at the top of the map.", "Stand at the very base/foot of the rocket.", "Cook and throw a Gersch Device directly at the rocket base.", "You will hear Dr. Gersch speak in a distorted voice — Easter egg has officially started."],
      tip: "Do this between rounds or very early in a round for breathing room.", warning: "If you do not hear Gersch speak, wrong spot. Try again right at the foot of the rocket." },
    { phase: "EASTER EGG", icon: "🐒", title: "Space Monkey Round — Phase 1", color: "#ffd600",
      location: "All 3 lander locations — Stamin-Up (A), Speed Cola (B), PhD Flopper (C)",
      locationDetail: "Space Monkeys first appear around rounds 6-8. Distinct screeching sound and different music. Throw a Gersch Device near each lander while monkeys are active in that area.",
      steps: ["When monkey round starts, stay calm. Let them come to you.", "Head to Lander A (Stamin-Up, upper-left). Wait for monkeys near it, throw Gersch Device at the lander pad area.", "Rush to Lander B (Speed Cola, upper-right). Gersch Device near the lander while monkeys present.", "Rush to Lander C (PhD Flopper, lower area). Gersch Device near the lander.", "All 3 in the SAME monkey round. Audio cue after confirms progress."],
      tip: "Start at the farthest lander and run back toward spawn. Better routing.", warning: "Miss a lander? Wait for next Space Monkey round (~every 4-5 rounds) to complete it." },
    { phase: "EASTER EGG", icon: "🐒", title: "Space Monkey Round — Phase 2", color: "#ffd600",
      location: "Same locations — Lander A, B, and C",
      locationDetail: "Monkey rounds recur every 4-5 rounds. Restock Gersch Devices from the box between rounds. Need at least 3.",
      steps: ["Survive to next Space Monkey round. Restock Gersch Devices between rounds.", "Repeat: Gersch Device near Lander A, B, and C while monkeys are active.", "Audio cue from Gersch after the round confirms phase 2 complete."],
      tip: "By now you should have solid perks. Monkey rounds get slightly harder — stay mobile.", warning: null },
    { phase: "EASTER EGG", icon: "✅", title: "Space Monkey Round — Phase 3 & Completion", color: "#00ff88",
      location: "Final time — all 3 lander locations",
      locationDetail: "Third and final monkey round. Same execution as phases 1 and 2. After completing all 3 lander throws this final round, Gersch delivers his final transmission.",
      steps: ["Restock Gersch Devices if needed before this round.", "Third monkey round: Gersch Device near all 3 landers while monkeys are active.", "After round ends with all 3 landers hit, Gersch delivers a final audio transmission.", "Radio message plays — Casimir Mechanism complete."],
      tip: "Play it safe. Solo means no revive. Stay near exits.", warning: "Ending is an audio clip only — no cutscene. The payoff is in the hunt." },
  ],
  weapons: [
    { name: "Gersch Device", type: "MYSTERY BOX", icon: "🌀", color: "#00e5ff",
      description: "A throwable grenade creating a black hole that pulls in all nearby enemies for 5 seconds then explodes. Extremely effective against Space Monkeys.",
      acquisition: "Mystery Box only. Box gives 2 when obtained.",
      parts: [],
      upgradeNote: "Pack-a-Punch — larger, longer-lasting black hole. Recommended if you have spare points.",
      eeRelevance: "100% required. EVERY single Easter egg step uses the Gersch Device." },
    { name: "Matryoshka Dolls", type: "MYSTERY BOX", icon: "🪆", color: "#ff6b00",
      description: "A throwable cluster grenade. Great for clearing monkey rounds if low on Gersch Devices.",
      acquisition: "Mystery Box only. Random drop.",
      parts: [], upgradeNote: null,
      eeRelevance: "Not EE-required. Useful backup for general monkey round survival." },
  ],
  enemies: [
    { name: "Space Monkeys", icon: "🐒", threat: 3, color: "#ffd600",
      description: "Agile monkeys in special rounds starting around round 6. Run directly to your perk machines and steal perks if they interact with the machine too long.",
      identify: "Distinct screeching sound and different round music. Move fast and erratically.",
      handle: "Train them near lander locations. Use Gersch Devices to suck them in near landers. Kill them immediately if actively on a perk machine.",
      eeRelevance: "The entire Easter egg revolves around 3 Space Monkey rounds. Do not end the round too quickly." },
  ],
  mapNodes: [
    { id: "spawn", x: 50, y: 62, label: "SPAWN", color: "#00ff88", type: "area", desc: "Starting room. Juggernog is on the wall just outside spawn — buy it immediately after power." },
    { id: "centrifuge", x: 50, y: 42, label: "CENTRIFUGE ROOM", color: "#00e5ff", type: "area", desc: "Large circular room with spinning centrifuge. Power switch is here. Central navigation landmark." },
    { id: "rocket", x: 50, y: 12, label: "ROCKET / LAUNCH PAD", color: "#ff6b00", type: "key", desc: "Top of map (NORTH). EE Step 4: throw Gersch Device at the rocket base to free Gersch." },
    { id: "lander_a", x: 18, y: 30, label: "LANDER A", color: "#ffd600", type: "lander", desc: "WEST upper area near Stamin-Up. Ride to unlock. Gersch throw location during all 3 monkey rounds." },
    { id: "lander_b", x: 82, y: 30, label: "LANDER B", color: "#ffd600", type: "lander", desc: "EAST upper area near Speed Cola. Ride to unlock. Gersch throw location during all 3 monkey rounds." },
    { id: "lander_c", x: 50, y: 80, label: "LANDER C", color: "#ffd600", type: "lander", desc: "SOUTH lower area near PhD Flopper. Ride to unlock. Gersch throw location during all 3 monkey rounds." },
    { id: "jugg", x: 38, y: 62, label: "JUGGERNOG", color: "#ff3a3a", type: "perk", fixed: true, desc: "FIXED — just past spawn on the left wall. First purchase after power. Never skip this." },
    { id: "stamina", x: 20, y: 44, label: "STAMIN-UP", color: "#00ff88", type: "perk", fixed: true, desc: "FIXED — near Lander A, upper-west. Sprint speed boost." },
    { id: "speed", x: 80, y: 44, label: "SPEED COLA", color: "#00e5ff", type: "perk", fixed: true, desc: "FIXED — near Lander B, upper-east. Faster reloads." },
    { id: "phd", x: 62, y: 80, label: "PHD FLOPPER", color: "#ff00aa", type: "perk", fixed: true, desc: "FIXED — near Lander C, south. Prevents fall damage. Great solo perk." },
    { id: "doubletap", x: 50, y: 92, label: "DOUBLE TAP", color: "#ff6b00", type: "perk", fixed: true, desc: "FIXED — far south. Increases fire rate. Lower priority." },
    { id: "power", x: 60, y: 38, label: "POWER SWITCH", color: "#ffd600", type: "key", desc: "Red lever in the Centrifuge Room. Very first thing you do." },
    { id: "box1", x: 30, y: 70, label: "BOX SPAWN", color: "#888", type: "box", desc: "Possible box spawn — south area near PhD Flopper path." },
    { id: "box2", x: 68, y: 52, label: "BOX SPAWN", color: "#888", type: "box", desc: "Possible box spawn — near Centrifuge Room upper areas." },
  ],
  mapEdges: [["spawn","centrifuge"],["spawn","lander_c"],["centrifuge","rocket"],["centrifuge","lander_a"],["centrifuge","lander_b"],["lander_c","phd"],["lander_a","stamina"],["lander_b","speed"],["spawn","jugg"],["lander_c","doubletap"],["centrifuge","power"]],
  mapPhoto: "https://static.wikia.nocookie.net/callofduty/images/Ascension_map_layout.png",
  mapOrientation: { north: "Rocket Launch Pad (top)", south: "Lander C / PhD Flopper (bottom)", east: "Lander B / Speed Cola (right)", west: "Lander A / Stamin-Up (left)" },
  tips: [
    { icon: "🎯", title: "Perk Priority", body: "Juggernog first always. Then PhD Flopper (Lander C area). Speed Cola third. Stamin-Up is helpful but optional. Protect Juggernog during monkey rounds — monkeys target it." },
    { icon: "📦", title: "Mystery Box Hunting", body: "Follow the blue light beam. Common early spawns near Centrifuge Room and lower map near PhD Flopper. Box moves after several uses — teddy bear means it relocated." },
    { icon: "🐒", title: "Surviving Monkey Rounds", body: "Monkeys go for perks not directly for you. Let them swarm near landers. Train them near a lander then Gersch Device. Do not waste Gersch Devices on random monkeys away from landers." },
    { icon: "🌀", title: "Gersch Device Mechanics", body: "Throw it on the ground near the lander pad. The black hole appears and sucks in anything nearby for 5 seconds. You do not need to kill monkeys with it — just need the black hole near the lander while monkeys are active." },
    { icon: "🔄", title: "Missed a Step?", body: "Monkey rounds return every 4-5 rounds. Miss a lander? Survive and retry next monkey round. Stock Gersch Devices in the meantime." },
    { icon: "💰", title: "Point Management", body: "Budget ~12,000 pts for full setup: doors (2x750), Juggernog (2500), box spins (950 each). Knife zombies in early rounds for max points." },
  ],
};

// ═══ SHANGRI-LA DATA ═══
const SHANGRILA_DATA = {
  overview: {
    summary: "An ancient jungle temple cursed to loop in time. Two players are required — several steps demand simultaneous button presses impossible to do alone. Involves triggering eclipse events and completing timed challenges within each eclipse window.",
    phases: [
      { label: "SETUP", desc: "Turn on power, open the map, get perks and the Shrink Ray wonder weapon." },
      { label: "ECLIPSE 1", desc: "Trigger the eclipse and complete the first simultaneous switch puzzle." },
      { label: "ECLIPSES 2-4", desc: "Each eclipse cycle has a unique challenge — Shrink Ray, Matryoshka Dolls, waterfall interaction." },
      { label: "COMPLETION", desc: "After all 4 eclipse challenges, the Focusing Stone appears in the temple." },
    ],
    mustHave: [
      "2 PLAYERS MINIMUM — simultaneous steps are literally impossible solo",
      "Juggernog — main temple courtyard area",
      "31-79 JGb215 Shrink Ray — required for Eclipse Challenge 2",
      "Matryoshka Dolls — required for Eclipse Challenge 3, get before triggering Eclipse 3",
      "Voice chat — timed simultaneous steps require real coordination",
    ],
  },
  steps: [
    { phase: "SETUP", icon: "⚡", title: "Turn On the Power", color: "#00ff88",
      location: "Tunnel system below the temple",
      locationDetail: "From spawn, buy doors to push through jungle paths into the temple structure. The power switch is in the underground tunnel/cave system beneath the main temple. The map is a circular loop — keep pushing in one direction.",
      steps: ["Buy doors from spawn and push through the jungle path toward the temple.", "Enter the underground tunnel system beneath the main temple.", "Find and activate the power switch on the tunnel wall.", "Secure Juggernog immediately in the main temple courtyard area."],
      tip: "The map is a circular loop — if you keep going you come back. Use this for training zombie hordes.", warning: null },
    { phase: "SETUP", icon: "🔫", title: "Get the Shrink Ray and Matryoshka Dolls", color: "#ff6b00",
      location: "Mystery Box — follow the blue beam on the circular map",
      locationDetail: "The Shrink Ray (31-79 JGb215) fires a beam that temporarily shrinks zombies. Box spawns in several locations around the circular map — often near the waterfall, power switch area, or temple interior.",
      steps: ["Hunt the Mystery Box for the Shrink Ray. It fires a continuous shrink beam.", "Shrunken zombies are harmless and can be stomped for 130 pts each.", "Also hunt for Matryoshka Dolls — you NEED them before Eclipse 3.", "Both players should have solid weapons before triggering Eclipse 1."],
      tip: "Shrink Ray stomp farming in early rounds is excellent for building points.", warning: "Get Matryoshka Dolls BEFORE triggering Eclipse 3 or you waste the eclipse cycle." },
    { phase: "EASTER EGG", icon: "🌑", title: "Eclipse Challenge 1 — Simultaneous Switches", color: "#ffd600",
      location: "Eclipse trigger: mine cart area near waterfall. Switches: left and right sides of temple courtyard.",
      locationDetail: "The eclipse is triggered by a switch in the mine cart area. When triggered, sky goes dark, a timer starts. Both players must press the two courtyard switches simultaneously. Communicate and countdown.",
      steps: ["Both players navigate to the eclipse trigger switch in the mine cart area.", "Confirm both players are at their assigned courtyard switches BEFORE triggering.", "One player triggers the eclipse. Sky goes dark.", "Both players simultaneously press their courtyard switches. Use verbal countdown: 3-2-1-press.", "Audio cue confirms success before the eclipse ends."],
      tip: "Scout the switch locations BEFORE triggering the eclipse. The window is short.", warning: "If eclipse ends before completion, trigger again next round. Unlimited retries — do not panic." },
    { phase: "EASTER EGG", icon: "🌑", title: "Eclipse Challenge 2 — Shrink Ray", color: "#ffd600",
      location: "Waterfall area — specific spot near the water feature",
      locationDetail: "Re-trigger eclipse. For Challenge 2, use the Shrink Ray on a specific glowing target near the waterfall area during the eclipse window.",
      steps: ["Re-trigger eclipse from mine cart switch when ready.", "One player with the Shrink Ray heads to the waterfall area.", "Fire the Shrink Ray at the glowing interactive target near the waterfall during the eclipse.", "Audio cue confirms success."],
      tip: "The target is near the main water feature — look for something glowing that was not there before eclipse.", warning: null },
    { phase: "EASTER EGG", icon: "🌑", title: "Eclipse Challenge 3 — Matryoshka Dolls", color: "#ffd600",
      location: "Specific altar location in the temple interior",
      locationDetail: "Both players must throw Matryoshka Dolls at a specific altar during the eclipse. The altar glows during the eclipse window and is in the main temple interior.",
      steps: ["Ensure both players have Matryoshka Dolls BEFORE triggering this eclipse.", "Trigger eclipse from mine cart switch.", "Both players throw Matryoshka Dolls at the glowing altar in the temple interior.", "Timing needs to be close but not necessarily simultaneous."],
      tip: "If you do not have Matryoshka Dolls, do NOT trigger this eclipse. Get them from the box first.", warning: "Matryoshka Dolls are REQUIRED for this challenge. Missing them wastes the eclipse window." },
    { phase: "COMPLETION", icon: "✅", title: "Eclipse Challenge 4 and Focusing Stone", color: "#00ff88",
      location: "Waterfall/water mechanism area — then temple courtyard for collection",
      locationDetail: "Challenge 4 involves interacting with a water-related mechanism during the eclipse. After completing all 4 challenges, the Focusing Stone materializes in the main temple courtyard.",
      steps: ["Trigger eclipse for the 4th time.", "Interact with the water mechanism near the waterfall when prompted during eclipse.", "After successful completion, navigate to the main temple courtyard.", "The Focusing Stone glows brightly — hold Square/X to collect.", "Audio plays — Stand-In complete."],
      tip: "After collecting the Focusing Stone, both players hear the ending audio. That is full completion.", warning: null },
  ],
  weapons: [
    { name: "31-79 JGb215 (Shrink Ray)", type: "MYSTERY BOX", icon: "🔫", color: "#ff6b00",
      description: "Fires a beam that temporarily shrinks zombies. Shrunken zombies can be instantly killed by stomping. Excellent for crowd control and earning points.",
      acquisition: "Mystery Box only. Both players should try to get one.",
      parts: [],
      upgradeNote: "Pack-a-Punch into the Fractalizer. Better range and freeze effects.",
      eeRelevance: "Required for Eclipse Challenge 2." },
    { name: "Matryoshka Dolls", type: "MYSTERY BOX", icon: "🪆", color: "#ffd600",
      description: "Throwable cluster grenade. Excellent for clearing the Napalm and Shrieker enemies.",
      acquisition: "Mystery Box only. Obtain BEFORE triggering Eclipse Challenge 3.",
      parts: [], upgradeNote: null,
      eeRelevance: "Required for Eclipse Challenge 3." },
  ],
  enemies: [
    { name: "Napalm Zombie", icon: "🔥", threat: 4, color: "#ff3a3a",
      description: "A burning zombie wrapped in flames. Moves slowly but death explosion deals massive damage in a large radius.",
      identify: "Glowing orange-red aura, clearly on fire, moves slower than regular zombies.",
      handle: "Keep extreme distance. Shrink Ray to shrink it, then stomp from behind. Never let it die near you.",
      eeRelevance: "Spawns regularly from mid-rounds. Appears during eclipse cycles — prioritize immediately on spawn." },
    { name: "Shrieker Zombie", icon: "👻", threat: 3, color: "#9b00ff",
      description: "A ghost-like zombie that emits a loud screech causing screen distortion. Can phase through certain areas.",
      identify: "Pale/translucent appearance, floats slightly. Loud shrieking sound when nearby.",
      handle: "Shoot it before it can scream. Shrink Ray is effective. Push through disorientation and keep moving.",
      eeRelevance: "Primarily a nuisance that disrupts eclipse step timing. Kill on sight." },
  ],
  mapNodes: [
    { id: "spawn", x: 50, y: 88, label: "SPAWN", color: "#00ff88", type: "area", desc: "Starting area — SOUTH. Buy doors to push into the jungle paths toward the temple." },
    { id: "temple", x: 50, y: 45, label: "MAIN TEMPLE", color: "#ff6b00", type: "area", desc: "Central hub. Juggernog here. Focusing Stone appears here after all 4 eclipses." },
    { id: "tunnels", x: 50, y: 68, label: "TUNNELS", color: "#00e5ff", type: "area", desc: "Underground cave system below temple. Power switch is here." },
    { id: "waterfall", x: 22, y: 45, label: "WATERFALL AREA", color: "#3399ff", type: "key", desc: "WEST side. Eclipse trigger switch nearby. Eclipse challenges 2 and 4 involve this area." },
    { id: "eclipse_switch", x: 30, y: 56, label: "ECLIPSE TRIGGER", color: "#ffd600", type: "key", desc: "Mine cart area near waterfall — WEST. Use to trigger each eclipse cycle. Both players must be ready first." },
    { id: "switch_l", x: 16, y: 42, label: "ECLIPSE SW (WEST)", color: "#ff00aa", type: "key", desc: "West courtyard simultaneous switch for Eclipse Challenge 1." },
    { id: "switch_r", x: 82, y: 42, label: "ECLIPSE SW (EAST)", color: "#ff00aa", type: "key", desc: "East courtyard simultaneous switch for Eclipse Challenge 1." },
    { id: "jugg", x: 55, y: 38, label: "JUGGERNOG", color: "#ff3a3a", type: "perk", fixed: true, desc: "FIXED — main temple courtyard. Buy immediately after power." },
    { id: "speed", x: 72, y: 55, label: "SPEED COLA", color: "#00e5ff", type: "perk", fixed: true, desc: "FIXED — east side near jungle/temple border." },
    { id: "doubletap", x: 28, y: 70, label: "DOUBLE TAP", color: "#ffd600", type: "perk", fixed: true, desc: "FIXED — west path below waterfall section." },
    { id: "phd", x: 35, y: 30, label: "PHD FLOPPER", color: "#ff00aa", type: "perk", fixed: true, desc: "FIXED — north upper temple area." },
    { id: "power", x: 50, y: 72, label: "POWER SWITCH", color: "#ffd600", type: "key", desc: "Tunnel system below the temple. First priority." },
    { id: "box1", x: 65, y: 35, label: "BOX SPAWN", color: "#888", type: "box", desc: "Possible box location in upper temple area." },
  ],
  mapEdges: [["spawn","tunnels"],["tunnels","temple"],["temple","waterfall"],["waterfall","eclipse_switch"],["temple","switch_l"],["temple","switch_r"],["temple","jugg"],["temple","phd"],["waterfall","doubletap"],["tunnels","power"],["temple","speed"]],
  mapPhoto: "https://static.wikia.nocookie.net/callofduty/images/Shangri-La_map_layout.png",
  mapOrientation: { north: "PHD Flopper / Upper Temple (top)", south: "Spawn (bottom)", east: "Speed Cola / Eclipse Switch East (right)", west: "Waterfall / Eclipse Trigger (left)" },
  tips: [
    { icon: "🗣️", title: "Communication is Everything", body: "Shangri-La requires real-time coordination. Use voice chat. For every simultaneous step use a verbal countdown: 3-2-1-press." },
    { icon: "🌑", title: "Short Eclipse Window", body: "Once triggered the eclipse lasts about 30 seconds. Know exactly where you are going BEFORE triggering. Scout locations beforehand." },
    { icon: "🔥", title: "Napalm Zombie Priority", body: "When Napalm spawns, call it out to your partner. One player handles it while the other maintains crowd control. Never let it wander into a horde." },
    { icon: "🎯", title: "Shrink Ray Stomp Farming", body: "In early rounds use Shrink Ray on zombies and stomp them. Each stomp gives 130 pts. Great for building points toward the Mystery Box." },
    { icon: "📦", title: "Box Priority", body: "Hunt in order: Shrink Ray first, Matryoshka Dolls second. Do not burn all money on box before getting Juggernog." },
    { icon: "🔄", title: "Failed Eclipse?", body: "Just trigger it again next round. Unlimited retries. Stay calm, reset, confirm both players are in position before next trigger." },
  ],
};

// ═══ MOON DATA ═══
const MOON_DATA = {
  overview: {
    summary: "Starting on Earth (Groom Lake facility) and transitioning to the Moon surface. Acquire the Hacker device, complete hacking sequences, obtain the Focusing Stone, and complete Richtofen's soul transfer to the MPD on the lunar surface.",
    phases: [
      { label: "SETUP", desc: "Get Hacker from Receiving Bay. Activate power on both Earth and Moon sides. Get Wave Gun." },
      { label: "HACK", desc: "Use the Hacker on terminals and panels across both Earth and Moon sides." },
      { label: "FOCUSING STONE", desc: "Complete the hacking sequence to access the Focusing Stone near the MPD." },
      { label: "MPD RITUAL", desc: "Complete the final soul transfer sequence at the MPD pyramid on the Moon." },
    ],
    mustHave: [
      "Hacker device — fixed spawn in Receiving Bay, required for EVERY EE step",
      "Wave Gun / QED — wonder weapon from Mystery Box, essential for Moon survival",
      "Juggernog — Earth-side labs area near the corridors",
      "Monitor excavator warnings — hack panels immediately to prevent perk loss",
    ],
  },
  steps: [
    { phase: "SETUP", icon: "⚡", title: "Activate Power on Both Sides", color: "#00ff88",
      location: "Earth side: lab corridor. Moon side: excavation control building.",
      locationDetail: "Moon has two areas: Earth side (Groom Lake underground facility) and Moon surface via teleporter. Earth side power switch is in the lab corridor near the teleporter room. Moon side power is in the excavation control building.",
      steps: ["From spawn (Receiving Bay), push into the labs and find the Earth-side power switch in the corridor.", "Activate it. Buy Juggernog in the labs immediately after.", "Use the teleporter to reach the Moon surface.", "On the Moon, navigate to the excavation control building and activate lunar power switch."],
      tip: "On the Moon surface movement has lower gravity. Get used to it before combat.", warning: "Cosmonaut zombie spawns on Moon side around round 8. It steals perks — kill it immediately on sight." },
    { phase: "SETUP", icon: "🔧", title: "Find the Hacker Device", color: "#00e5ff",
      location: "Receiving Bay — Earth side, one of 3 fixed spots: desk, shelf, or floor near equipment",
      locationDetail: "The Hacker is a small electronic device in the Receiving Bay. It spawns in one of 3 fixed spots: on the main desk along the windowed wall, on a shelf along the right side, or on the ground near equipment crates at the back.",
      steps: ["Stay in Receiving Bay first round and check all 3 spawn locations.", "Spawn 1: Main desk/counter along the wall with windows.", "Spawn 2: Shelf or rack along the right side of the bay.", "Spawn 3: Ground near equipment crates at the back.", "Hold Square/X to pick it up."],
      tip: "Pick it up first round before enemies crowd the area.", warning: "Cannot do the Easter egg without the Hacker. Find it before starting EE steps." },
    { phase: "SETUP", icon: "🔫", title: "Get the Wave Gun / QED", color: "#ffd600",
      location: "Mystery Box — follow the blue beam on either side of the map",
      locationDetail: "The Wave Gun fires a continuous electrical beam that rapidly ages and kills zombies. Box spawns on both Earth and Moon sides.",
      steps: ["Hunt the Mystery Box for the Wave Gun — fires a continuous beam.", "The Wave Gun can be split into two Zap Guns by Pack-a-Punching it.", "Secure Wave Gun for survivability on Moon surface."],
      tip: "Wave Gun is exceptionally strong on the Moon where zombie movement is slower.", warning: null },
    { phase: "EASTER EGG", icon: "💻", title: "Hack the Computer Panels", color: "#ff00aa",
      location: "Lab terminals on Earth side. Excavation control panels on Moon side.",
      locationDetail: "With Hacker equipped, hold Square on specific terminals in a set sequence. Earth-side terminals in the lab corridors. Moon-side panels in the excavation control building.",
      steps: ["Equip the Hacker device. Hold Square on terminals and panels to hack.", "Hack the data terminals in the Earth-side lab/computer room area.", "Teleport to the Moon side and hack the control panels in the excavation building.", "A specific sequence on the Moon panels must be hacked in order — listen for audio cues.", "Watch for Excavator warnings — hack excavator panels immediately if triggered."],
      tip: "Keep one player on zombie duty while the Hacker player works. Hacking animation leaves you vulnerable.", warning: "Excavators can deactivate perk machines. When a red Excavator warning appears, rush and hack the matching panel immediately." },
    { phase: "EASTER EGG", icon: "💎", title: "Acquire the Focusing Stone", color: "#ffd600",
      location: "Moon surface — near the MPD pyramid area, accessible after hacking sequence",
      locationDetail: "After all required panels are hacked, the Focusing Stone becomes accessible on the Moon surface near the MPD area. It glows visibly.",
      steps: ["After completing the hacking sequence, teleport to the Moon surface.", "Navigate to the MPD area — the large black pyramid structure at the far end.", "The Focusing Stone glows near the MPD. Hold Square/X to collect.", "Audio cue from Richtofen confirms acquisition."],
      tip: "Manage your ammo before this — the MPD area is exposed and open to zombie attacks.", warning: null },
    { phase: "COMPLETION", icon: "✅", title: "Complete the MPD Ritual", color: "#00ff88",
      location: "The MPD — large black pyramid at the far end of the Moon surface (NORTH)",
      locationDetail: "The MPD is the most visually distinct object on the Moon — a large black pyramid at the far end. With the Focusing Stone, interact with the MPD to initiate the final ritual.",
      steps: ["With Focusing Stone, go to the MPD pyramid on the Moon surface.", "Interact with the MPD as prompted — Richtofen will speak throughout.", "Complete the final button sequence at the MPD.", "Richtofen's soul transfers into the MPD — cutscene triggers. Cryogenic Slumber Party complete."],
      tip: "Stock ammo and make sure Juggernog is active before initiating the final MPD interaction.", warning: "Kill the Cosmonaut before starting the final ritual. It will disrupt the sequence if active." },
  ],
  weapons: [
    { name: "Hacker Device", type: "FIXED SPAWN", icon: "💻", color: "#00e5ff",
      description: "An electronic tool that hacks terminals, panels, and even the Mystery Box. Hacking the box gives a free random weapon.",
      acquisition: "Fixed spawn in Receiving Bay. 3 possible locations — check desk, shelf, and floor near equipment crates.",
      parts: [],
      upgradeNote: "Cannot be Pack-a-Punched. Hacking the Mystery Box with it gives a free random weapon.",
      eeRelevance: "Absolutely required. Every EE step uses the Hacker device. Find it first round." },
    { name: "Wave Gun", type: "MYSTERY BOX", icon: "⚡", color: "#ffd600",
      description: "Fires a continuous electrical beam that rapidly ages and kills zombies. Can be PaP'd to split into the Zap Gun Dual Wield.",
      acquisition: "Mystery Box only.",
      parts: [],
      upgradeNote: "Pack-a-Punch splits it into Zap Gun Dual Wield. Single Wave Gun generally better for high rounds.",
      eeRelevance: "Not strictly required but essential for surviving the Moon surface." },
    { name: "QED (Quantum Entanglement Device)", type: "MYSTERY BOX", icon: "🎲", color: "#9b00ff",
      description: "Throwable with completely random effects — can spawn Max Ammo, launch zombies, create a black hole, or do nothing useful.",
      acquisition: "Mystery Box only.",
      parts: [], upgradeNote: null,
      eeRelevance: "Not required for EE. Unpredictable — do not rely on it for EE steps." },
  ],
  enemies: [
    { name: "Cosmonaut Zombie", icon: "👨‍🚀", threat: 4, color: "#ffd600",
      description: "A spacesuit-wearing zombie on the Moon side starting around round 8. If it grabs you, it teleports you to a random location AND steals a perk.",
      identify: "Full white spacesuit. Moves slowly but very high health. Only on the Moon surface.",
      handle: "Shoot continuously from distance. Never let it reach grab range. Prioritize it over all enemies the moment it spawns. Wave Gun shreds it.",
      eeRelevance: "Will disrupt EE steps by teleporting you and stealing perks mid-ritual. Kill on sight every time." },
    { name: "Excavator (Environmental)", icon: "⚠️", threat: 3, color: "#ff6b00",
      description: "Automated drilling machines on the Moon that periodically activate. If an excavator breaches a tunnel zone, it removes the perk machine in that zone.",
      identify: "Red warning text: Excavator PHI/LAMBDA is drilling.",
      handle: "Rush to the excavation control building and hack the panel matching the alert zone before breach completes.",
      eeRelevance: "Losing perks mid-EE is catastrophic. Always hack immediately when the warning appears." },
  ],
  mapNodes: [
    { id: "receiving", x: 50, y: 88, label: "RECEIVING BAY", color: "#00ff88", type: "area", desc: "SOUTH — Starting area on Earth side. Hacker device spawns here in one of 3 spots." },
    { id: "labs", x: 50, y: 68, label: "LABS / CORRIDORS", color: "#00e5ff", type: "area", desc: "Earth-side lab corridors. Computer terminals for hacking here. Earth power switch here." },
    { id: "teleporter", x: 50, y: 48, label: "TELEPORTER", color: "#ffd600", type: "key", desc: "CENTER — Hold Square on the pad to teleport to the Moon. Main Earth/Moon connection." },
    { id: "moon", x: 50, y: 22, label: "MOON SURFACE", color: "#aaccff", type: "area", desc: "NORTH — Low gravity zone. Cosmonaut spawns here. MPD at the far north end." },
    { id: "mpd", x: 50, y: 8, label: "THE MPD", color: "#ff00aa", type: "key", desc: "FAR NORTH — Large black pyramid on the Moon. Final EE location." },
    { id: "excavation", x: 28, y: 18, label: "EXCAVATION CONTROL", color: "#ff6b00", type: "key", desc: "NORTHWEST — Moon-side control building. Power switch and hackable excavator panels here." },
    { id: "jugg", x: 62, y: 72, label: "JUGGERNOG", color: "#ff3a3a", type: "perk", fixed: true, desc: "FIXED — Earth-side labs. Buy after power is on." },
    { id: "speed", x: 38, y: 72, label: "SPEED COLA", color: "#00e5ff", type: "perk", fixed: true, desc: "FIXED — Earth-side labs. Faster reloads." },
    { id: "phd", x: 35, y: 26, label: "PHD FLOPPER", color: "#ff00aa", type: "perk", fixed: true, desc: "FIXED — Moon surface west side. Prevents fall damage from low gravity jumps." },
    { id: "stamin", x: 65, y: 26, label: "STAMIN-UP", color: "#00ff88", type: "perk", fixed: true, desc: "FIXED — Moon surface east side near excavation area." },
    { id: "power_e", x: 40, y: 55, label: "POWER (EARTH)", color: "#ffd600", type: "key", desc: "Earth-side power switch in lab corridor." },
    { id: "power_m", x: 28, y: 22, label: "POWER (MOON)", color: "#ffd600", type: "key", desc: "Moon-side power in excavation control building." },
    { id: "box1", x: 68, y: 58, label: "BOX SPAWN", color: "#888", type: "box", desc: "Possible box — Earth-side labs." },
    { id: "box2", x: 62, y: 18, label: "BOX SPAWN", color: "#888", type: "box", desc: "Possible box — Moon surface near teleporter arrival." },
  ],
  mapEdges: [["receiving","labs"],["labs","teleporter"],["teleporter","moon"],["moon","mpd"],["moon","excavation"],["labs","jugg"],["labs","speed"],["labs","power_e"],["moon","phd"],["moon","stamin"],["excavation","power_m"]],
  mapPhoto: "https://static.wikia.nocookie.net/callofduty/images/Moon_map_layout.png",
  mapOrientation: { north: "MPD Pyramid / Moon Far End (top)", south: "Receiving Bay / Earth Spawn (bottom)", east: "Stamin-Up / Moon East (right)", west: "Excavation Control / Moon West (left)" },
  tips: [
    { icon: "👨‍🚀", title: "Cosmonaut Priority", body: "The moment you see the Cosmonaut, drop everything and kill it. Wave Gun is highly effective against it." },
    { icon: "⚠️", title: "Monitor Excavators", body: "Watch top-right of screen for Excavator warnings. Rush to excavation control and hack the matching panel immediately." },
    { icon: "🌕", title: "Moon Gravity", body: "Lower gravity on the surface. Dodge zombies with big jumps. Stay in open areas, not tunnels." },
    { icon: "💻", title: "Hacker Bonus Uses", body: "Hack the Mystery Box for a free random weapon. Hack zombie drops to multiply point values." },
    { icon: "🔋", title: "Both Power Switches", body: "You need power on BOTH sides. Earth first, then teleport and activate Moon side." },
    { icon: "📺", title: "Use Video for Panel Order", body: "Moon has precise hacking sequences where panel order matters. The YouTube link on each step will show exact panel locations far better than text can." },
  ],
};

// ═══ ORIGINS DATA ═══
const ORIGINS_DATA = {
  overview: {
    summary: "WWI-era France with a supernatural twist. Four elemental staffs must be built and upgraded. Giant robots walk the battlefield. The most complex Easter egg in Zombies Chronicles — a genuine 2-4 hour commitment.",
    phases: [
      { label: "SETUP", desc: "Collect the Gramophone and 4 colored records. Gather parts to build all 4 elemental staffs." },
      { label: "BUILD STAFFS", desc: "Use records to open portals. Build all 4 staffs at pedestals in the Crazy Place." },
      { label: "UPGRADE STAFFS", desc: "Complete upgrade challenges in the Crazy Place for each of the 4 staffs." },
      { label: "RITUAL", desc: "Place upgraded staffs in final pedestals, charge 3 generators, complete the Crazy Place finale." },
    ],
    mustHave: [
      "Juggernog — excavation site area, buy ASAP",
      "Gramophone — found near spawn/church, needed to open all portals",
      "All 4 colored records — each opens a specific Crazy Place portal",
      "Mule Kick perk — allows carrying 3 weapons, useful for holding multiple staffs",
      "Patience — this EE is a 2-4 hour commitment",
    ],
  },
  steps: [
    { phase: "SETUP", icon: "🎵", title: "Get the Gramophone and All 4 Records", color: "#ffd600",
      location: "Gramophone: church near spawn. Records: fixed locations across the map.",
      locationDetail: "The Gramophone is a small brass music device in the church near spawn. Each colored record opens the corresponding Crazy Place portal when placed on the Gramophone at a portal entrance.",
      steps: ["Find the Gramophone in the church near spawn — small bronze device, on a table or ledge.", "Red Record: near Generator 6 area or church interior.", "Yellow Record: near Tank Station or in the right-side trenches.", "Blue Record: near spawn area excavation site or No Mans Land area.", "Purple/Green Record: in the excavation pit area near the staffs workbench.", "Only ONE record can be active at a time. Carry all 4."],
      tip: "Records glow faintly. If you cannot find one check surfaces — floor, tables, ledges in that specific area.", warning: "Without the Gramophone you cannot open any Crazy Place portals and cannot build staffs." },
    { phase: "SETUP", icon: "🤖", title: "Learn the Giant Robots", color: "#ff6b00",
      location: "Robots walk fixed paths across the map — observe them in the first 2 rounds",
      locationDetail: "Three giant robots walk predictable paths across the battlefield. To enter, stand in a glowing purple circle on the ground along the robot's walking path — you get sucked inside as the foot comes down. Collect the staff part from the interior pedestal.",
      steps: ["Watch robots in round 1-2 to learn their paths. They are slow and predictable.", "Each robot has a colored rune on its leg — shoot it to get a free perk.", "To enter: find the glowing purple circle on the ground along the robot's path. Stand in it as the foot descends.", "Collect the staff part from the glowing interior pedestal. Exit via the portal inside.", "Wind Staff does NOT use robots — it uses the sky orb method (see Weapons tab)."],
      tip: "Getting inside robots is safe once you understand the timing. The purple circle is your entry point.", warning: "Standing under a robot foot OUTSIDE the purple circle will crush and instantly down you." },
    { phase: "SETUP", icon: "🔩", title: "Collect All Staff Parts", color: "#ffd600",
      location: "Parts on map surface: fixed locations near each element zone. Third part: inside matching robot.",
      locationDetail: "Each staff needs 3 parts. Parts on the surface glow faintly. In a group, assign one staff per player to avoid duplicate collecting.",
      steps: ["Staff of Fire: 2 parts near Gen 6 area and church/spawn zone. Third part from inside the fire robot.", "Staff of Ice: 2 parts near excavation dig site and lower trenches. Third part from inside ice robot.", "Staff of Lightning: 2 parts near Tank Station and upper trenches. Third part from inside lightning robot.", "Staff of Wind: 2 parts near spawn and church/No Mans Land. Third part by shooting 3 glowing sky orbs.", "Assign staffs per player before starting to avoid wasted trips."],
      tip: "Collect all parts for one staff before moving to the next. Efficiency is critical in this long EE.", warning: "Staff parts can only be picked up by one player. Designate who builds which staff in advance." },
    { phase: "BUILD", icon: "⚙️", title: "Open Portals and Build Staffs in the Crazy Place", color: "#ff00aa",
      location: "Portal entrances around the map — each matches a record color. Crazy Place is underground.",
      locationDetail: "Bring the Gramophone to the matching portal entrance. Red portal near Generator 6. Yellow near Tank Station. Blue near excavation site. Purple/Green near spawn/church. Place the matching record on the Gramophone to open the portal. Enter and build the staff at its matching pedestal.",
      steps: ["Match each record to its portal: Red near Gen 6, Yellow near Tank Station, Blue near excavation, Green near spawn/church.", "Place matching record on Gramophone at the portal entrance to open it.", "Enter Crazy Place. Navigate to the matching elemental pedestal. Hold Square to build the staff.", "Repeat for all 4 staffs.", "Build all 4 BEFORE upgrading any — far more efficient."],
      tip: "Leave the Gramophone at a portal entrance — it does not disappear. Collect it again for the next portal.", warning: "Crazy Place has Panzer Soldats. Enter with solid health and ammo." },
    { phase: "UPGRADE", icon: "⬆️", title: "Upgrade All 4 Staffs", color: "#ff6b00",
      location: "Crazy Place — each staff has a unique upgrade challenge inside",
      locationDetail: "Each staff must be upgraded in the Crazy Place via a specific challenge: Fire staff — kill zombies while standing in fire circles. Ice staff — freeze and shatter specific targets. Lightning staff — channel electricity through targets. Wind staff — hit specific points during a gust challenge.",
      steps: ["Enter the Crazy Place with a built staff equipped.", "Find the upgrade pedestal for that staff — approach it to reveal the challenge.", "Complete the combat or interaction challenge for that staff element.", "Upgraded staff glows brighter and deals significantly more damage.", "Repeat for all 4 staffs. Expect 30-60 minutes for all upgrades."],
      tip: "For exact upgrade challenge instructions, the YouTube link on this step is essential.", warning: null },
    { phase: "RITUAL", icon: "✅", title: "Final Ritual and Completion", color: "#00ff88",
      location: "Crazy Place central chamber for staff placement. Surface map for generator charging.",
      locationDetail: "With all 4 staffs upgraded, place each in its final designated pedestal in the Crazy Place main chamber. Then exit and charge Generators 1, 2, and 6 by killing zombies near them. Return to the Crazy Place for the final sequence.",
      steps: ["Place all 4 upgraded staffs in their final Crazy Place pedestals.", "Exit to surface and charge Generators 1, 2, and 6 by killing zombies near each.", "Return to the Crazy Place once all 3 generators are fully charged.", "Final enemy wave triggers — survive it.", "Completion ritual plays — stunning cinematic cutscene. Little Lost Girl complete."],
      tip: "The ending cutscene for Origins recontextualizes the entire Zombies storyline. Worth every minute.", warning: "Final wave before completion is intense. All players need upgraded staffs, full ammo, and all perks." },
  ],
  weapons: [
    { name: "Staff of Fire", type: "CRAFTABLE", icon: "🔥", color: "#ff3a3a",
      description: "Fires explosive fireballs that ignite zombies. Charged shot creates a massive explosion. Excellent for crowd control.",
      acquisition: "Craft in the Crazy Place at the fire pedestal after collecting 3 parts.",
      parts: [
        { name: "Fire Part 1", location: "Near Generator 6 area — on the ground or surface in the lower trench." },
        { name: "Fire Part 2", location: "Church or spawn building interior — check on or near the pews." },
        { name: "Fire Part 3 (Robot)", location: "Inside the fire giant robot. Stand in the purple glowing circle on its path to be sucked inside." },
      ],
      upgradeNote: "Upgrade via Crazy Place fire pedestal challenge. Upgraded form deals area-of-effect incineration.",
      eeRelevance: "Required for final ritual. All 4 staffs must be built and upgraded." },
    { name: "Staff of Ice", type: "CRAFTABLE", icon: "❄️", color: "#88ccff",
      description: "Fires a freeze beam encasing zombies in ice. Frozen zombies shatter when shot or melee'd.",
      acquisition: "Craft in the Crazy Place at the ice pedestal after collecting 3 parts.",
      parts: [
        { name: "Ice Part 1", location: "Excavation pit area — in or near the dig site. Check trenches and ledges." },
        { name: "Ice Part 2", location: "Lower trench area on the left side near the excavation site." },
        { name: "Ice Part 3 (Robot)", location: "Inside the ice giant robot — purple circle method." },
      ],
      upgradeNote: "Upgrade via Crazy Place ice pedestal. Upgraded form creates large ice blasts.",
      eeRelevance: "Required for final ritual. Also effective against Panzer Soldat — freeze it then shatter." },
    { name: "Staff of Lightning", type: "CRAFTABLE", icon: "⚡", color: "#ffd600",
      description: "Fires electrical arcs that chain between multiple enemies. Best staff for clearing large grouped hordes.",
      acquisition: "Craft in the Crazy Place at the lightning pedestal after collecting 3 parts.",
      parts: [
        { name: "Lightning Part 1", location: "Tank Station area — near the tank or on surfaces in the upper trench." },
        { name: "Lightning Part 2", location: "Upper trench area on the right side near the tank route." },
        { name: "Lightning Part 3 (Robot)", location: "Inside the lightning giant robot — purple circle method." },
      ],
      upgradeNote: "Upgrade via Crazy Place lightning pedestal. Upgraded form electrifies an entire area.",
      eeRelevance: "Required for final ritual." },
    { name: "Staff of Wind", type: "CRAFTABLE", icon: "💨", color: "#00ff88",
      description: "Fires a gust that launches zombies into the air. Best defensive staff. Excellent for buying time during the final ritual wave.",
      acquisition: "Craft in the Crazy Place at the wind pedestal. Third part via sky orb shooting method.",
      parts: [
        { name: "Wind Part 1", location: "Spawn or church area — near the church entrance or No Mans Land path." },
        { name: "Wind Part 2", location: "No Mans Land area between spawn and the main map." },
        { name: "Wind Part 3 (Sky Orbs)", location: "Three glowing orbs float in the sky at random intervals. Shoot all 3 to knock them down. Locations: near spawn, above tank path, and near Generator 6. Must shoot all 3 in a single round. HIGHLY recommend a video for this step." },
      ],
      upgradeNote: "Upgrade via Crazy Place wind pedestal. Upgraded form creates a sustained tornado.",
      eeRelevance: "Required for final ritual. Sky orb step for Part 3 is unique — use the YouTube link." },
  ],
  enemies: [
    { name: "Panzer Soldat", icon: "🦾", threat: 5, color: "#ff3a3a",
      description: "A heavily armored super zombie. Has a claw arm that grabs and incapacitates you and a flamethrower. Extremely high health. Appears starting round 8.",
      identify: "Massive clunking metal figure. Glowing orange chest piece. Loud mechanical sounds.",
      handle: "Shoot the faceplate/helmet first to expose the head then dump ammo into it. Ice Staff freeze then shatter is extremely effective. Never let it reach claw range.",
      eeRelevance: "Spawns in the Crazy Place during upgrade challenges and in the final ritual wave. Must be handled every single time." },
    { name: "Giant Robots (Environmental)", icon: "🤖", threat: 3, color: "#ff6b00",
      description: "Three enormous robots that walk fixed paths. Not enemies you fight — you interact with them to get staff parts. Can crush you if outside the purple circle.",
      identify: "Massive bipedal machines visible from anywhere on the map. Each has a colored rune on its leg.",
      handle: "Learn their paths in round 1. Shoot leg rune for free perk. Enter via purple circle for staff parts. NEVER stand under a foot unless in the purple circle.",
      eeRelevance: "Staff Parts 3 for Fire, Ice, and Lightning are inside the 3 robots. You must enter all 3." },
  ],
  mapNodes: [
    { id: "spawn", x: 50, y: 85, label: "SPAWN / CHURCH", color: "#00ff88", type: "area", desc: "SOUTH — Starting area. Gramophone found here. Wind staff parts nearby. No Mans Land path leads out." },
    { id: "excavation", x: 50, y: 55, label: "EXCAVATION SITE", color: "#ffd600", type: "area", desc: "CENTER — Main dig area. Juggernog here. Ice staff parts nearby. Main workbench area." },
    { id: "gen6", x: 18, y: 35, label: "GENERATOR 6", color: "#ff6b00", type: "key", desc: "WEST — Fire staff parts here. One of 3 generators to charge for final ritual. Red portal nearby." },
    { id: "tank", x: 82, y: 35, label: "TANK STATION", color: "#00e5ff", type: "key", desc: "EAST — Lightning staff parts here. Tank fast-travels around map. Yellow portal nearby." },
    { id: "crazy", x: 50, y: 30, label: "CRAZY PLACE", color: "#ff00aa", type: "key", desc: "NORTH CENTER — Underground dimension via colored portals. Build and upgrade all 4 staffs here." },
    { id: "robot_fire", x: 16, y: 55, label: "FIRE ROBOT PATH", color: "#ff3a3a", type: "key", desc: "WEST — Path of fire giant robot. Purple circle for entry here." },
    { id: "robot_ice", x: 84, y: 55, label: "ICE ROBOT PATH", color: "#88ccff", type: "key", desc: "EAST — Path of ice giant robot. Purple circle for entry here." },
    { id: "robot_light", x: 50, y: 14, label: "LIGHTNING ROBOT", color: "#ffd600", type: "key", desc: "NORTH — Path of lightning robot across upper map area." },
    { id: "jugg", x: 58, y: 60, label: "JUGGERNOG", color: "#ff3a3a", type: "perk", fixed: true, desc: "FIXED — excavation site area near the dig. Buy ASAP." },
    { id: "speed", x: 33, y: 45, label: "SPEED COLA", color: "#00e5ff", type: "perk", fixed: true, desc: "FIXED — west side near Generator 6 path." },
    { id: "doubletap", x: 72, y: 45, label: "DOUBLE TAP", color: "#ffd600", type: "perk", fixed: true, desc: "FIXED — east side near Tank Station path." },
    { id: "phd", x: 50, y: 70, label: "PHD FLOPPER", color: "#ff00aa", type: "perk", fixed: true, desc: "FIXED — mid-map between spawn and excavation." },
    { id: "mule", x: 40, y: 60, label: "MULE KICK", color: "#9b00ff", type: "perk", fixed: true, desc: "FIXED — excavation area. Allows carrying 3 weapons — essential for juggling staffs." },
    { id: "gen1", x: 65, y: 78, label: "GENERATOR 1", color: "#ff6b00", type: "key", desc: "SOUTHEAST — Charge by killing zombies nearby for final ritual." },
    { id: "gen2", x: 33, y: 25, label: "GENERATOR 2", color: "#ff6b00", type: "key", desc: "NORTHWEST — Second generator for final ritual." },
    { id: "box1", x: 28, y: 78, label: "BOX SPAWN", color: "#888", type: "box", desc: "Possible box spawn near spawn/church." },
  ],
  mapEdges: [["spawn","excavation"],["spawn","gen1"],["excavation","gen6"],["excavation","tank"],["excavation","crazy"],["gen6","robot_fire"],["tank","robot_ice"],["crazy","robot_light"],["excavation","jugg"],["spawn","phd"],["gen6","speed"],["tank","doubletap"],["excavation","mule"],["gen6","gen2"]],
  mapPhoto: "https://static.wikia.nocookie.net/callofduty/images/Origins_map_layout.png",
  mapOrientation: { north: "Lightning Robot / Crazy Place Portals (top)", south: "Spawn / Church (bottom)", east: "Tank Station / Ice Robot (right)", west: "Generator 6 / Fire Robot (left)" },
  tips: [
    { icon: "📋", title: "Assign Staffs Early", body: "With 2+ players, assign staffs before collecting starts. Prevents wasted trips and duplicate collecting." },
    { icon: "🤖", title: "Robots Are Friends", body: "Shoot every leg rune you see early — free perks add up. Learn paths in round 1. Never stand under a foot outside the purple circle." },
    { icon: "🎵", title: "Gramophone Management", body: "You only need the Gramophone to open portals. Once open, leave it at the entrance. It does not disappear." },
    { icon: "🦾", title: "Panzer Soldat Priority", body: "Everyone stops and kills the Panzer the moment it spawns. Ice Staff freeze then heavy fire on exposed head." },
    { icon: "⬆️", title: "Build All Before Upgrading", body: "Build all 4 staffs before upgrading any. Portal travel takes time and this is far more efficient." },
    { icon: "🎬", title: "Use Video for Wind Part 3", body: "The sky orbs for Wind Staff Part 3 are timing-dependent and hard to spot. Watch a 2-minute video clip beforehand." },
  ],
};

const ALL_MAP_DATA = {
  shadows: SHADOWS_DATA,
  ascension: ASCENSION_DATA,
  shangrila: SHANGRILA_DATA,
  moon: MOON_DATA,
  origins: ORIGINS_DATA,
};

// ═══ SESSION UTILITIES ═══
const PARTICIPANT_COLORS = ['#00e5ff','#00ff88','#ffd600','#ff6b00','#ff00aa','#9b00ff'];

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function formatTime(ts) {
  const d = new Date(ts);
  let h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2,'0')}${ampm}`;
}

// ═══ SUPABASE HOOKS ═══
function useParticipants(sessionId, session) {
  const [participants, setParticipants] = useState([]);
  useEffect(() => {
    if (!sessionId || session === 'solo' || !supabase) return;
    supabase.from('participants').select('*').eq('session_id', sessionId).order('joined_at')
      .then(({ data }) => { if (data) setParticipants(data); });
  }, [sessionId]);
  useEffect(() => {
    if (!sessionId || session === 'solo' || !supabase) return;
    const ch = supabase.channel('participants-' + sessionId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'participants', filter: `session_id=eq.${sessionId}` },
        payload => setParticipants(prev => prev.some(p => p.id === payload.new.id) ? prev : [...prev, payload.new]))
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [sessionId]);
  return participants;
}

function useStepCompletions(sessionId, session, myName, myColor) {
  const [completions, setCompletions] = useState([]);
  useEffect(() => {
    if (!sessionId || session === 'solo' || !supabase) return;
    supabase.from('step_completions').select('*').eq('session_id', sessionId)
      .then(({ data }) => { if (data) setCompletions(data); });
  }, [sessionId]);
  useEffect(() => {
    if (!sessionId || session === 'solo' || !supabase) return;
    const ch = supabase.channel('steps-' + sessionId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'step_completions', filter: `session_id=eq.${sessionId}` },
        payload => setCompletions(prev => prev.some(c => c.id === payload.new.id) ? prev : [...prev, payload.new]))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'step_completions', filter: `session_id=eq.${sessionId}` },
        payload => setCompletions(prev => prev.filter(c => c.id !== payload.old.id)))
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [sessionId]);

  async function toggleStep(stepIndex) {
    if (!supabase) return;
    const myCompletion = completions.find(c => c.step_index === stepIndex && c.completed_by_name === myName);
    if (myCompletion) {
      await supabase.from('step_completions').delete().eq('id', myCompletion.id);
      setCompletions(prev => prev.filter(c => c.id !== myCompletion.id));
    } else {
      const { data } = await supabase.from('step_completions')
        .insert({ session_id: sessionId, step_index: stepIndex, completed_by_name: myName, completed_by_color: myColor })
        .select().single();
      if (data) setCompletions(prev => [...prev, data]);
    }
  }
  return { completions, toggleStep };
}

// ═══ SHARED COMPONENTS ═══
function DifficultyBar({ rating, max = 10, color = "#ffd600" }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{ width: 16, height: 7, borderRadius: 2, background: i < rating ? color : "#1e2235" }} />
      ))}
      <span style={{ color, fontSize: 12, marginLeft: 6 }}>{rating}/10</span>
    </div>
  );
}

function ThreatDots({ level }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i < level ? "#ff3a3a" : "#1e2235" }} />
      ))}
    </div>
  );
}

// ═══ SESSION LOBBY ═══
function SessionLobby({ onSession, onSolo, mapsConfig }) {
  const [mode, setMode] = useState(null);
  const [sessionName, setSessionName] = useState('');
  const [selectedMap, setSelectedMap] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [userName, setUserName] = useState(() => localStorage.getItem('zee_name') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const bg = { minHeight:'100vh', background:'#060810', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'Courier New',monospace", color:'#e0e6f0', padding:'20px' };
  const card = { background:'#0c0f1a', border:'1px solid #1a2040', borderRadius:4, padding:'32px', width:'100%', maxWidth:'460px' };
  const btn = (primary) => ({ width:'100%', padding:'14px', background:primary?'#00e5ff':'transparent', color:primary?'#060810':'#00e5ff', border:'1px solid #00e5ff', borderRadius:2, fontFamily:"'Courier New',monospace", fontSize:'13px', letterSpacing:'2px', cursor:'pointer', marginBottom:'12px', fontWeight:primary?'bold':'normal' });
  const inp = { width:'100%', background:'#060810', border:'1px solid #1a2040', borderRadius:2, color:'#e0e6f0', fontFamily:"'Courier New',monospace", fontSize:'14px', padding:'10px 12px', marginBottom:'12px', boxSizing:'border-box', outline:'none' };
  const lbl = { display:'block', fontSize:'10px', letterSpacing:'2px', color:'#4a5580', marginBottom:'6px', textTransform:'uppercase' };
  const backBtn = { background:'none', border:'none', color:'#4a5580', cursor:'pointer', fontFamily:"'Courier New',monospace", fontSize:'12px', padding:'0 12px 0 0' };

  async function handleCreate() {
    if (!sessionName.trim()) { setError('Enter a session name.'); return; }
    if (!selectedMap) { setError('Select a map.'); return; }
    if (!userName.trim()) { setError('Enter your name.'); return; }
    if (!supabase) { setError('Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env'); return; }
    setLoading(true); setError('');
    try {
      const code = generateCode();
      const color = PARTICIPANT_COLORS[0];
      const { data: sess, error: e1 } = await supabase.from('sessions').insert({ code, session_name: sessionName.trim(), map_id: selectedMap }).select().single();
      if (e1) throw e1;
      await supabase.from('participants').insert({ session_id: sess.id, name: userName.trim(), color });
      localStorage.setItem('zee_name', userName.trim());
      onSession({ id: sess.id, code: sess.code, name: sess.session_name, mapId: sess.map_id, myName: userName.trim(), myColor: color });
    } catch { setError('Failed to create session. Check your connection.'); }
    setLoading(false);
  }

  async function handleJoin() {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) { setError('Enter a valid 6-character code.'); return; }
    if (!userName.trim()) { setError('Enter your name.'); return; }
    if (!supabase) { setError('Supabase not configured.'); return; }
    setLoading(true); setError('');
    try {
      const { data: sess, error: e1 } = await supabase.from('sessions').select('*').eq('code', code).eq('active', true).single();
      if (e1 || !sess) { setError('Session not found. Check the code.'); setLoading(false); return; }
      const { data: existing } = await supabase.from('participants').select('id').eq('session_id', sess.id);
      const color = PARTICIPANT_COLORS[(existing?.length || 0) % PARTICIPANT_COLORS.length];
      await supabase.from('participants').insert({ session_id: sess.id, name: userName.trim(), color });
      localStorage.setItem('zee_name', userName.trim());
      onSession({ id: sess.id, code: sess.code, name: sess.session_name, mapId: sess.map_id, myName: userName.trim(), myColor: color });
    } catch { setError('Failed to join session.'); }
    setLoading(false);
  }

  if (!mode) return (
    <div style={bg}>
      <div style={card}>
        <div style={{ fontSize:'10px', letterSpacing:'5px', color:'#4a5580', marginBottom:'8px' }}>CALL OF DUTY: BLACK OPS 3</div>
        <div style={{ fontSize:'24px', color:'#00e5ff', marginBottom:'32px', letterSpacing:'2px' }}>ZOMBIES EE GUIDE</div>
        <button style={btn(true)} onClick={() => setMode('create')}>+ CREATE SESSION</button>
        <button style={btn(false)} onClick={() => setMode('join')}>⌗ JOIN SESSION</button>
        <button style={{ ...btn(false), color:'#4a5580', borderColor:'#1a2040', marginBottom:0 }} onClick={onSolo}>SOLO (NO SESSION)</button>
      </div>
    </div>
  );

  if (mode === 'create') return (
    <div style={bg}>
      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', marginBottom:'24px' }}>
          <button style={backBtn} onClick={() => { setMode(null); setError(''); }}>← BACK</button>
          <span style={{ fontSize:'14px', letterSpacing:'2px', color:'#00e5ff' }}>CREATE SESSION</span>
        </div>
        <label style={lbl}>Session Name</label>
        <input style={inp} placeholder="e.g. Friday Night Moon Run" value={sessionName} onChange={e => setSessionName(e.target.value)} maxLength={50} />
        <label style={lbl}>Map</label>
        <select style={{ ...inp, cursor:'pointer' }} value={selectedMap} onChange={e => setSelectedMap(e.target.value)}>
          <option value="">Select a map…</option>
          {mapsConfig.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <label style={lbl}>Your Name</label>
        <input style={inp} placeholder="e.g. Cody" value={userName} onChange={e => setUserName(e.target.value)} maxLength={20} />
        {error && <div style={{ color:'#ff4081', fontSize:'12px', marginBottom:'12px' }}>{error}</div>}
        <button style={btn(true)} onClick={handleCreate} disabled={loading}>{loading ? 'CREATING…' : 'CREATE SESSION →'}</button>
      </div>
    </div>
  );

  return (
    <div style={bg}>
      <div style={card}>
        <div style={{ display:'flex', alignItems:'center', marginBottom:'24px' }}>
          <button style={backBtn} onClick={() => { setMode(null); setError(''); }}>← BACK</button>
          <span style={{ fontSize:'14px', letterSpacing:'2px', color:'#00e5ff' }}>JOIN SESSION</span>
        </div>
        <label style={lbl}>Session Code</label>
        <input style={{ ...inp, fontSize:'20px', letterSpacing:'6px', textTransform:'uppercase' }} placeholder="ABC123" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))} maxLength={6} />
        <label style={lbl}>Your Name</label>
        <input style={inp} placeholder="e.g. Cody" value={userName} onChange={e => setUserName(e.target.value)} maxLength={20} />
        {error && <div style={{ color:'#ff4081', fontSize:'12px', marginBottom:'12px' }}>{error}</div>}
        <button style={btn(true)} onClick={handleJoin} disabled={loading}>{loading ? 'JOINING…' : 'JOIN SESSION →'}</button>
      </div>
    </div>
  );
}

// ═══ SESSION HEADER BAR ═══
function SessionHeaderBar({ session, participants, mapName, mapColor, onBack }) {
  if (!session || session === 'solo') return (
    <div style={{ height:50, display:'flex', alignItems:'center', background:'#0c0f1a', borderBottom:'1px solid #1e2235', padding:'0 28px', flexShrink:0 }}>
      <button onClick={onBack} style={{ background:'transparent', border:'none', color:'#5a6280', cursor:'pointer', fontSize:11, letterSpacing:2, fontFamily:"inherit", marginRight:16 }}>← MAPS</button>
    </div>
  );
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 20px', background:'#0c0f1a', borderBottom:'1px solid #1e2235', flexShrink:0 }}>
      <button onClick={onBack} style={{ background:'none', border:'none', color:'#5a6280', cursor:'pointer', fontFamily:"'Courier New',monospace", fontSize:'12px', letterSpacing:'1px' }}>← MAPS</button>
      <div style={{ textAlign:'center', flex:1, padding:'0 16px' }}>
        <div style={{ fontSize:'13px', color:'#e0e0e0', letterSpacing:'1px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{session.name}</div>
        <div style={{ fontSize:'11px', color:'#4a5580', letterSpacing:'3px', marginTop:'2px' }}>[{session.code}]</div>
      </div>
      <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
        {participants.map((p, i) => (
          <div key={p.id || i} title={p.name} style={{ width:28, height:28, borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:'bold', color:'#060810' }}>
            {p.name.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ STATUS BAR ═══
function StatusBar({ steps, completions, mapColor, session }) {
  if (!session || session === 'solo' || !steps?.length) return null;
  const done = new Set(completions.map(c => c.step_index));
  const pct = Math.round((done.size / steps.length) * 100);
  const nextIdx = steps.findIndex((_, i) => !done.has(i));
  const cur = nextIdx === -1 ? steps[steps.length - 1] : steps[nextIdx];
  const nxt = nextIdx >= 0 && nextIdx < steps.length - 1 ? steps[nextIdx + 1] : null;
  const lbl = s => (typeof s === 'string' ? s : s?.title || '').slice(0, 42);
  return (
    <div style={{ background:'#080b14', borderBottom:'1px solid #1a2040', flexShrink:0 }}>
      <div style={{ height:3, background:'#1a2040' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${mapColor||'#00e5ff'},#00e5ff)`, transition:'width 0.4s ease' }} />
      </div>
      <div style={{ padding:'7px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:"'Courier New',monospace" }}>
        <div style={{ fontSize:11, color:mapColor||'#00e5ff', letterSpacing:1 }}>
          STEP {Math.min(done.size+1, steps.length)} / {steps.length}
          {cur && <span style={{ color:'#6a7aa0', marginLeft:8 }}>· {lbl(cur)}{lbl(cur).length === 42 ? '…' : ''}</span>}
        </div>
        <div style={{ fontSize:10, color:'#4a5580' }}>
          {pct}% Complete
          {nxt && <span style={{ marginLeft:8, color:'#2a3050' }}>· Next: {lbl(nxt)}</span>}
        </div>
      </div>
    </div>
  );
}

// ═══ COMPLETED BY BADGES ═══
function CompletedByBadges({ completions, stepIndex, myName }) {
  const forStep = completions.filter(c => c.step_index === stepIndex);
  if (!forStep.length) return null;
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:6 }}>
      {forStep.map(c => (
        <span key={c.id} style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:12, background:c.completed_by_color+'22', border:`1px solid ${c.completed_by_color}55`, fontSize:10, color:c.completed_by_name===myName?c.completed_by_color:'#9090b0', fontFamily:"'Courier New',monospace" }}>
          ✓ {c.completed_by_name===myName?'You':c.completed_by_name} · {formatTime(c.completed_at)}
        </span>
      ))}
    </div>
  );
}

// ═══ WHAT'S NEXT CARD ═══
function WhatsNextCard({ steps, completions, mapColor }) {
  if (!steps?.length) return null;
  const done = new Set(completions.map(c => c.step_index));
  const nextIdx = steps.findIndex((_, i) => !done.has(i));
  const lbl = s => typeof s === 'string' ? s : s?.title || s?.name || '';
  if (nextIdx === -1) return (
    <div style={{ background:(mapColor||'#00e5ff')+'18', border:`1px solid ${mapColor||'#00e5ff'}44`, borderRadius:4, padding:'16px', fontFamily:"'Courier New',monospace", marginBottom:20 }}>
      <div style={{ fontSize:10, letterSpacing:2, color:mapColor||'#00e5ff', marginBottom:4 }}>STATUS</div>
      <div style={{ fontSize:14, color:'#e0e0e0' }}>🎉 Easter Egg Complete!</div>
    </div>
  );
  const cur = steps[nextIdx], nxt = nextIdx < steps.length - 1 ? steps[nextIdx + 1] : null;
  return (
    <div style={{ background:(mapColor||'#00e5ff')+'10', border:`1px solid ${mapColor||'#00e5ff'}33`, borderRadius:4, padding:'16px', fontFamily:"'Courier New',monospace", marginBottom:20 }}>
      <div style={{ fontSize:10, letterSpacing:2, color:mapColor||'#00e5ff', marginBottom:6 }}>STEP {nextIdx+1} OF {steps.length} — CURRENT</div>
      <div style={{ fontSize:14, color:'#e0e0e0', marginBottom:nxt?10:0 }}>{lbl(cur)}</div>
      {nxt && <>
        <div style={{ height:1, background:'#1a2040', margin:'10px 0' }} />
        <div style={{ fontSize:10, letterSpacing:1, color:'#4a5580', marginBottom:4 }}>NEXT UP</div>
        <div style={{ fontSize:12, color:'#6a7aa0' }}>{lbl(nxt)}</div>
      </>}
    </div>
  );
}

// ═══ OVERVIEW TAB ═══
function OverviewTab({ data, meta, completions = [], session }) {
  const showWhatsNext = session && session !== 'solo';
  return (
    <div style={{ padding: "32px 40px", maxWidth: 1100, margin: "0 auto" }}>
      {showWhatsNext && <WhatsNextCard steps={data.steps} completions={completions} mapColor={meta.color} />}
      <div style={{ background: "linear-gradient(135deg,#0a1628 0%,#0d0a1e 60%,#1a0a0a 100%)", border: `1px solid #1e2235`, borderTop: `3px solid ${meta.color}`, borderRadius: 12, padding: "36px 40px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: meta.color + "08", pointerEvents: "none" }} />
        <div style={{ fontSize: 10, letterSpacing: 5, color: meta.color, marginBottom: 6 }}>{meta.subtitle}</div>
        <h1 style={{ margin: "0 0 4px", fontSize: 38, color: "#fff", letterSpacing: 2 }}>{meta.name}</h1>
        <div style={{ fontSize: 15, color: "#5a6280", marginBottom: 24, letterSpacing: 2 }}>Easter Egg: {meta.eeName}</div>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 9, color: "#5a6280", letterSpacing: 3, marginBottom: 6 }}>DIFFICULTY</div><DifficultyBar rating={meta.difficulty} color={meta.color} /></div>
          <div><div style={{ fontSize: 9, color: "#5a6280", letterSpacing: 3, marginBottom: 6 }}>PLAYERS</div><div style={{ color: "#00ff88", fontSize: 13 }}>👥 {meta.players}</div></div>
          <div><div style={{ fontSize: 9, color: "#5a6280", letterSpacing: 3, marginBottom: 6 }}>EST. TIME</div><div style={{ color: "#e0e6f0", fontSize: 13 }}>⏱ {meta.time}</div></div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "#0c0f1a", border: "1px solid #1e2235", borderRadius: 10, padding: "22px 26px" }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "#5a6280", marginBottom: 12 }}>WHAT IS THIS</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: "#b0bcd0" }}>{data.overview.summary}</p>
        </div>
        <div style={{ background: "#0c0f1a", border: "1px solid #1e2235", borderRadius: 10, padding: "22px 26px" }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "#5a6280", marginBottom: 12 }}>MUST HAVE</div>
          {data.overview.mustHave.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, fontSize: 13, color: "#b0bcd0", lineHeight: 1.5 }}>
              <span style={{ color: "#00ff88", flexShrink: 0 }}>✓</span><span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#0c0f1a", border: "1px solid #1e2235", borderRadius: 10, padding: "22px 26px" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: "#5a6280", marginBottom: 18 }}>THE ROADMAP</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {data.overview.phases.map((phase, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: meta.color + "22", border: `1px solid ${meta.color}55`, color: meta.color, fontSize: 11, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: meta.color }}>{phase.label}</div>
              </div>
              <div style={{ fontSize: 12, color: "#8896b0", lineHeight: 1.6 }}>{phase.desc}</div>
              {i < data.overview.phases.length - 1 && <div style={{ position: "absolute", top: 13, right: -10, color: "#5a6280", fontSize: 14 }}>→</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ STEPS TAB ═══
function StepsTab({ data, meta, session, myName, myColor, completions = [], onToggle }) {
  const [current, setCurrent] = useState(0);
  const [localCompleted, setLocalCompleted] = useState(new Set());
  const isSolo = !session || session === 'solo';
  const completedIndices = isSolo ? localCompleted : new Set(completions.map(c => c.step_index));
  const step = data.steps[current];
  const done = completedIndices.has(current);
  const progress = (completedIndices.size / data.steps.length) * 100;

  function handleToggle() {
    if (isSolo) {
      setLocalCompleted(prev => { const n = new Set(prev); n.has(current) ? n.delete(current) : n.add(current); return n; });
    } else if (onToggle) {
      onToggle(current);
    }
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: 248, flexShrink: 0, background: "#0c0f1a", borderRight: "1px solid #1e2235", overflowY: "auto", padding: "16px 0" }}>
        {!isSolo && <div style={{ padding: "0 16px 14px" }}><WhatsNextCard steps={data.steps} completions={completions} mapColor={meta.color} /></div>}
        <div style={{ padding: "0 16px 14px" }}>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#5a6280", marginBottom: 6 }}>PROGRESS</div>
          <div style={{ height: 4, background: "#1e2235", borderRadius: 2, marginBottom: 4 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${meta.color},#00e5ff)`, borderRadius: 2, transition: "width 0.4s" }} />
          </div>
          <div style={{ fontSize: 10, color: "#5a6280" }}>{completedIndices.size}/{data.steps.length} complete</div>
        </div>
        {data.steps.map((s, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ padding: "11px 16px", cursor: "pointer", background: i === current ? "#1a1f35" : "transparent", borderLeft: i === current ? `3px solid ${s.color}` : "3px solid transparent" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: "50%", background: completedIndices.has(i) ? s.color+"33" : i===current ? s.color+"22" : "#1e2235", border: `1px solid ${completedIndices.has(i)?s.color:i===current?s.color+"88":"transparent"}`, color: completedIndices.has(i)?s.color:i===current?s.color:"#5a6280", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {completedIndices.has(i) ? "✓" : s.icon}
              </div>
              <div>
                <div style={{ fontSize: 8, letterSpacing: 2, color: s.color, marginBottom: 1 }}>{s.phase}</div>
                <div style={{ fontSize: 11, color: i===current ? "#e0e6f0" : "#5a6280", lineHeight: 1.3 }}>{s.title}</div>
              </div>
            </div>
            {!isSolo && <CompletedByBadges completions={completions} stepIndex={i} myName={myName} />}
          </div>
        ))}
      </div>
      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
        <div style={{ maxWidth: 700 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, gap: 16 }}>
            <div>
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 9, letterSpacing: 3, padding: "3px 10px", borderRadius: 20, background: step.color+"22", color: step.color, border: `1px solid ${step.color}44` }}>{step.phase}</span>
                <span style={{ fontSize: 10, color: "#5a6280" }}>STEP {current+1} / {data.steps.length}</span>
              </div>
              <h2 style={{ margin: 0, fontSize: 26, color: "#fff", display: "flex", alignItems: "center", gap: 10 }}><span>{step.icon}</span>{step.title}</h2>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={() => setCurrent(c => Math.max(0,c-1))} disabled={current===0} style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #1e2235", background: "transparent", color: current===0?"#1e2235":"#5a6280", cursor: current===0?"not-allowed":"pointer", fontSize: 15 }}>←</button>
              <button onClick={() => setCurrent(c => Math.min(data.steps.length-1,c+1))} disabled={current===data.steps.length-1} style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${current===data.steps.length-1?"#1e2235":step.color+"66"}`, background: "transparent", color: current===data.steps.length-1?"#1e2235":step.color, cursor: current===data.steps.length-1?"not-allowed":"pointer", fontSize: 15 }}>→</button>
            </div>
          </div>
          <div style={{ background: "#0a1628", border: "1px solid #00e5ff33", borderLeft: "3px solid #00e5ff", borderRadius: 8, padding: "14px 18px", marginBottom: 18 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#00e5ff", marginBottom: 5 }}>📍 WHERE TO GO</div>
            <div style={{ fontSize: 13, color: "#00e5ff", fontWeight: "bold", marginBottom: 7 }}>{step.location}</div>
            <div style={{ fontSize: 12, color: "#8898b8", lineHeight: 1.7 }}>{step.locationDetail}</div>
          </div>
          <div style={{ background: "#0c0f1a", border: "1px solid #1e2235", borderRadius: 8, padding: "18px 22px", marginBottom: 14 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: "#5a6280", marginBottom: 14 }}>WHAT TO DO</div>
            {step.steps.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i<step.steps.length-1?"1px solid #1e2235":"none" }}>
                <div style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: step.color+"22", border: `1px solid ${step.color}55`, color: step.color, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>{i+1}</div>
                <div style={{ fontSize: 13, color: "#b0bcd0", lineHeight: 1.7 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#0a1a0a", border: "1px solid #1a3a1a", borderRadius: 8, padding: "11px 14px", marginBottom: step.warning ? 10 : 18, fontSize: 12, color: "#7ac47a", lineHeight: 1.6 }}>💡 {step.tip}</div>
          {step.warning && <div style={{ background: "#1a0e0a", border: "1px solid #3a1e0a", borderRadius: 8, padding: "11px 14px", marginBottom: 18, fontSize: 12, color: "#cc7744", lineHeight: 1.6 }}>⚠️ {step.warning}</div>}
          <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent("BO3 Zombies "+meta.name+" "+step.title)}`} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a0a0a", border: "1px solid #cc000033", borderRadius: 8, padding: "11px 14px", fontSize: 12, color: "#cc4444", textDecoration: "none", marginBottom: 20 }}>
            ▶ Watch on YouTube — "{meta.name}: {step.title}"
          </a>
          <button onClick={handleToggle} style={{ width: "100%", padding: "13px", borderRadius: 8, border: `1px solid ${done?step.color:"#1e2235"}`, background: done?step.color+"22":"#1a1f35", color: done?step.color:"#5a6280", fontSize: 12, letterSpacing: 2, cursor: "pointer", fontFamily: "'Courier New',monospace" }}>
            {done ? "✓ STEP COMPLETE" : "MARK AS DONE"}
          </button>
          {completedIndices.size === data.steps.length && (
            <div style={{ marginTop: 24, padding: 24, borderRadius: 12, background: "linear-gradient(135deg,#0a2a0a,#0a1a2a)", border: "1px solid #00ff88", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏆</div>
              <div style={{ color: "#00ff88", fontSize: 16, letterSpacing: 3 }}>EASTER EGG COMPLETE</div>
              <div style={{ color: "#5a6280", fontSize: 11, marginTop: 6 }}>{meta.eeName} — {meta.name}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══ MAP TAB (with compass, fixed perk clarity, overhead photo toggle) ═══
function MapTab({ data, meta }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("diagram"); // "diagram" | "photo"
  const node = selected ? data.mapNodes.find(n => n.id === selected) : null;
  const TI = { area:"🏛", key:"🎯", lander:"🚀", perk:"💊", box:"📦" };
  const TL = { area:"AREA", key:"KEY LOCATION", lander:"LANDER", perk:"PERK", box:"BOX (MOVES)" };

  const orient = data.mapOrientation || {};

  return (
    <div style={{ padding: "28px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom: 16, flexWrap:"wrap", gap:12 }}>
        <div>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, color: "#fff" }}>{meta.name} — Map Reference</h2>
          <p style={{ margin: 0, fontSize: 12, color: "#5a6280" }}>All perk machines are fixed every game. Mystery Box moves — follow the blue beam.</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={() => setView("diagram")} style={{ padding:"6px 14px", borderRadius:4, border:`1px solid ${view==="diagram"?meta.color:"#1e2235"}`, background:view==="diagram"?meta.color+"22":"transparent", color:view==="diagram"?meta.color:"#5a6280", fontSize:10, letterSpacing:2, cursor:"pointer", fontFamily:"'Courier New',monospace" }}>SVG DIAGRAM</button>
          <button onClick={() => setView("photo")} style={{ padding:"6px 14px", borderRadius:4, border:`1px solid ${view==="photo"?meta.color:"#1e2235"}`, background:view==="photo"?meta.color+"22":"transparent", color:view==="photo"?meta.color:"#5a6280", fontSize:10, letterSpacing:2, cursor:"pointer", fontFamily:"'Courier New',monospace" }}>OVERHEAD PHOTO</button>
        </div>
      </div>

      {/* Orientation legend */}
      {orient.north && (
        <div style={{ display:"flex", gap:16, marginBottom:12, flexWrap:"wrap" }}>
          {["north","south","east","west"].map(dir => orient[dir] && (
            <div key={dir} style={{ fontSize:10, color:"#5a6280", letterSpacing:1 }}>
              <span style={{ color:meta.color, marginRight:4 }}>{dir==="north"?"↑":dir==="south"?"↓":dir==="east"?"→":"←"} {dir.toUpperCase()}:</span>
              {orient[dir]}
            </div>
          ))}
        </div>
      )}

      {/* Filter buttons — only for diagram view */}
      {view === "diagram" && (
        <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
          {["all","key","perk","lander","box","area"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${filter===f?meta.color:"#1e2235"}`, background: filter===f?meta.color+"22":"transparent", color: filter===f?meta.color:"#5a6280", fontSize: 10, letterSpacing: 2, cursor: "pointer", fontFamily: "'Courier New',monospace", textTransform: "uppercase" }}>{f}</button>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginLeft:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"#00ff88" }}><div style={{ width:10, height:10, borderRadius:"50%", background:"#00ff88" }} />FIXED PERK</div>
            <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:10, color:"#888" }}><div style={{ width:10, height:10, borderRadius:"50%", background:"#888" }} />BOX (MOVES)</div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18 }}>
        <div style={{ background: "#0c0f1a", border: "1px solid #1e2235", borderRadius: 12, padding: 18, minHeight:360 }}>
          {view === "photo" ? (
            <div style={{ position:"relative" }}>
              <img
                src={data.mapPhoto}
                alt={`${meta.name} overhead map`}
                style={{ width:"100%", height:"auto", display:"block", borderRadius:8, objectFit:"contain" }}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
              />
              {/* Fallback if image fails */}
              <div style={{ display:"none", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:40, color:"#5a6280", fontSize:12, gap:12 }}>
                <div style={{ fontSize:32 }}>🗺️</div>
                <div>Overhead photo not available.</div>
                <a href={`https://callofduty.fandom.com/wiki/${meta.name.replace(/ /g,'_')}`} target="_blank" rel="noopener noreferrer" style={{ color:meta.color, fontSize:11 }}>View on CoD Wiki →</a>
              </div>
              {/* Orientation overlay on photo */}
              {orient.north && (
                <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)", background:"#060810cc", border:"1px solid #1e2235", borderRadius:4, padding:"4px 10px", fontSize:9, color:meta.color, letterSpacing:2, pointerEvents:"none" }}>
                  ↑ {orient.north.split('(')[0].trim()}
                </div>
              )}
            </div>
          ) : (
            <>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "auto", display: "block" }}>
                <defs><pattern id={"g"+meta.id} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1a1f35" strokeWidth="0.3"/></pattern></defs>
                <rect width="100" height="100" fill={`url(#g${meta.id})`}/>

                {/* Compass rose */}
                <g>
                  <text x="50" y="4" textAnchor="middle" fontSize="3" fill={meta.color} fontWeight="bold">N</text>
                  <text x="50" y="99" textAnchor="middle" fontSize="3" fill={meta.color}>S</text>
                  <text x="2" y="51" textAnchor="start" fontSize="3" fill={meta.color}>W</text>
                  <text x="97" y="51" textAnchor="end" fontSize="3" fill={meta.color}>E</text>
                  <line x1="50" y1="5" x2="50" y2="8" stroke={meta.color} strokeWidth="0.4" opacity="0.5"/>
                  <line x1="50" y1="92" x2="50" y2="95" stroke={meta.color} strokeWidth="0.4" opacity="0.5"/>
                  <line x1="5" y1="50" x2="8" y2="50" stroke={meta.color} strokeWidth="0.4" opacity="0.5"/>
                  <line x1="92" y1="50" x2="95" y2="50" stroke={meta.color} strokeWidth="0.4" opacity="0.5"/>
                </g>

                {/* Edges */}
                {data.mapEdges.map(([a,b],i) => {
                  const na=data.mapNodes.find(n=>n.id===a), nb=data.mapNodes.find(n=>n.id===b);
                  if(!na||!nb) return null;
                  return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="#1e2235" strokeWidth="0.8" strokeDasharray="2,2"/>;
                })}

                {/* Nodes */}
                {data.mapNodes.map(n => {
                  const vis = filter==="all" || n.type===filter;
                  const isSel = selected===n.id;
                  const isFixedPerk = n.type==="perk" && n.fixed;
                  const isBox = n.type==="box";
                  return (
                    <g key={n.id} onClick={() => setSelected(selected===n.id?null:n.id)} style={{ cursor:"pointer" }}>
                      {/* Outer ring for fixed perks */}
                      {isFixedPerk && vis && (
                        <circle cx={n.x} cy={n.y} r={isSel?7:5.5} fill="none" stroke={n.color} strokeWidth="0.5" strokeDasharray="1,1" opacity="0.6"/>
                      )}
                      <circle cx={n.x} cy={n.y} r={isSel?5.5:isFixedPerk?4.5:4} fill={vis?n.color+(isBox?"18":"33"):"#1a1f3522"} stroke={vis?(isSel?n.color:n.color+(isBox?"55":"88")):"#2a2f45"} strokeWidth={isSel?1.5:1}/>
                      <text x={n.x} y={n.y+0.5} textAnchor="middle" dominantBaseline="middle" fontSize="3" fill={vis?n.color:"#3a4060"}>{TI[n.type]||"●"}</text>
                      {/* Fixed label for perks and key locations */}
                      {(isSel || n.type==="key" || n.type==="lander" || isFixedPerk) && (
                        <text x={n.x} y={n.y+7.5} textAnchor="middle" fontSize="2.2" fill={vis?n.color:"#3a4060"}>{n.label}</text>
                      )}
                      {/* FIXED badge for perks */}
                      {isFixedPerk && vis && (
                        <text x={n.x} y={n.y+10.5} textAnchor="middle" fontSize="1.8" fill="#00ff88" opacity="0.8">FIXED</text>
                      )}
                    </g>
                  );
                })}
              </svg>
              <div style={{ display:"flex", gap:12, marginTop:10, flexWrap:"wrap" }}>
                {Object.entries(TI).map(([type,icon]) => (
                  <div key={type} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color: type==="perk"?"#00ff88":type==="box"?"#888":"#5a6280" }}>
                    <span>{icon}</span>{TL[type]}{type==="perk"?" (ALL FIXED)":""}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Detail panel */}
        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          {node ? (
            <div style={{ background:"#0c0f1a", border:`1px solid ${node.color}44`, borderTop:`3px solid ${node.color}`, borderRadius:10, padding:"18px 20px" }}>
              <div style={{ fontSize:8, letterSpacing:3, color:node.color, marginBottom:6 }}>{TI[node.type]} {TL[node.type]}</div>
              <div style={{ fontSize:17, color:"#fff", fontWeight:"bold", marginBottom:12 }}>{node.label}</div>
              <div style={{ fontSize:12, color:"#8898b8", lineHeight:1.8 }}>{node.desc}</div>
              {node.type==="perk" && (
                <div style={{ marginTop:12, padding:"8px 12px", background:"#0a1a0a", borderRadius:6, fontSize:11, color:"#00ff88" }}>
                  📌 Fixed location — same every game, no exceptions.
                </div>
              )}
              {node.type==="box" && (
                <div style={{ marginTop:12, padding:"8px 12px", background:"#1a1000", borderRadius:6, fontSize:11, color:"#ffd600" }}>
                  🎲 Mystery Box moves after several uses. Follow the blue light beam.
                </div>
              )}
              {node.type==="lander" && (
                <div style={{ marginTop:12, padding:"8px 12px", background:"#1a1000", borderRadius:6, fontSize:11, color:"#ffd600" }}>
                  🎯 EE: Throw Gersch Device here during each monkey round.
                </div>
              )}
            </div>
          ) : (
            <div style={{ background:"#0c0f1a", border:"1px solid #1e2235", borderRadius:10, padding:"16px 18px" }}>
              <div style={{ fontSize:10, color:"#5a6280", marginBottom:12 }}>TAP A LOCATION FOR DETAILS</div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {data.mapNodes.map(n => (
                  <div key={n.id} onClick={() => setSelected(n.id)} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:6, background:"#1a1f35", cursor:"pointer", border:"1px solid #1e2235" }}>
                    <span style={{ fontSize:13 }}>{TI[n.type]}</span>
                    <div>
                      <div style={{ fontSize:11, color:n.color }}>{n.label}</div>
                      <div style={{ fontSize:9, color: n.type==="perk"?"#00ff88":n.type==="box"?"#888":"#5a6280", letterSpacing:1 }}>
                        {n.type==="perk"?"FIXED PERK":n.type==="box"?"BOX SPAWN (MOVES)":TL[n.type]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══ WEAPONS TAB ═══
function WeaponsTab({ data, meta }) {
  const [sel, setSel] = useState(0);
  const w = data.weapons[sel];
  return (
    <div style={{ padding:"28px 40px", maxWidth:1100, margin:"0 auto" }}>
      <h2 style={{ margin:"0 0 20px", fontSize:22, color:"#fff" }}>Weapons and Wonder Weapons</h2>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {data.weapons.map((w,i) => (
            <div key={i} onClick={() => setSel(i)} style={{ padding:"14px 16px", borderRadius:10, cursor:"pointer", background:i===sel?"#1a1f35":"transparent", border:`1px solid ${i===sel?w.color+"66":"#1e2235"}`, borderLeft:`3px solid ${i===sel?w.color:"transparent"}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <span style={{ fontSize:20 }}>{w.icon}</span>
                <div>
                  <div style={{ fontSize:13, color:i===sel?"#fff":"#e0e6f0" }}>{w.name}</div>
                  <div style={{ fontSize:9, letterSpacing:2, color:w.color, marginTop:2 }}>{w.type}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ background:"#0c0f1a", border:`1px solid ${w.color}44`, borderTop:`3px solid ${w.color}`, borderRadius:10, padding:"22px 26px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <span style={{ fontSize:28 }}>{w.icon}</span>
              <div>
                <div style={{ fontSize:9, letterSpacing:3, color:w.color, marginBottom:4 }}>{w.type}</div>
                <div style={{ fontSize:22, color:"#fff" }}>{w.name}</div>
              </div>
            </div>
            <p style={{ margin:"0 0 18px", fontSize:13, color:"#b0bcd0", lineHeight:1.8 }}>{w.description}</p>
            <div style={{ background:"#1a1f35", border:"1px solid #1e2235", borderRadius:8, padding:"12px 16px", marginBottom:16 }}>
              <div style={{ fontSize:9, letterSpacing:3, color:"#5a6280", marginBottom:8 }}>HOW TO GET</div>
              <div style={{ fontSize:13, color:"#e0e6f0", lineHeight:1.6 }}>{w.acquisition}</div>
            </div>
            {w.parts && w.parts.length > 0 && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:9, letterSpacing:3, color:"#5a6280", marginBottom:10 }}>PARTS AND LOCATIONS</div>
                {w.parts.map((p,i) => (
                  <div key={i} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:i<w.parts.length-1?"1px solid #1e2235":"none" }}>
                    <div style={{ flexShrink:0, width:22, height:22, borderRadius:"50%", background:w.color+"22", border:`1px solid ${w.color}55`, color:w.color, fontSize:10, display:"flex", alignItems:"center", justifyContent:"center" }}>{i+1}</div>
                    <div>
                      <div style={{ fontSize:12, color:"#fff", marginBottom:3 }}>{p.name}</div>
                      <div style={{ fontSize:11, color:"#8898b8", lineHeight:1.5 }}>{p.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {w.upgradeNote && (
              <div style={{ background:"#0a1628", border:"1px solid #00e5ff33", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:12, color:"#00e5ff", lineHeight:1.6 }}>
                ⬆️ <strong>Pack-a-Punch:</strong> {w.upgradeNote}
              </div>
            )}
            <div style={{ background:"#1a0a1a", border:"1px solid #ff00aa33", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#cc88cc", lineHeight:1.6 }}>
              🎯 <strong>EE Relevance:</strong> {w.eeRelevance}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ ENEMIES TAB ═══
function EnemiesTab({ data, meta }) {
  const [sel, setSel] = useState(0);
  const e = data.enemies[sel];
  return (
    <div style={{ padding:"28px 40px", maxWidth:1100, margin:"0 auto" }}>
      <h2 style={{ margin:"0 0 20px", fontSize:22, color:"#fff" }}>Special Enemies</h2>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {data.enemies.map((en,i) => (
            <div key={i} onClick={() => setSel(i)} style={{ padding:"14px 16px", borderRadius:10, cursor:"pointer", background:i===sel?"#1a1f35":"transparent", border:`1px solid ${i===sel?en.color+"66":"#1e2235"}`, borderLeft:`3px solid ${i===sel?en.color:"transparent"}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontSize:22 }}>{en.icon}</span>
                <div style={{ fontSize:13, color:i===sel?"#fff":"#e0e6f0" }}>{en.name}</div>
              </div>
              <ThreatDots level={en.threat}/>
            </div>
          ))}
        </div>
        <div>
          <div style={{ background:"#0c0f1a", border:`1px solid ${e.color}44`, borderTop:`3px solid ${e.color}`, borderRadius:10, padding:"22px 26px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
              <span style={{ fontSize:34 }}>{e.icon}</span>
              <div>
                <div style={{ fontSize:22, color:"#fff" }}>{e.name}</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:5 }}>
                  <span style={{ fontSize:10, color:"#5a6280", letterSpacing:2 }}>THREAT</span>
                  <ThreatDots level={e.threat}/>
                </div>
              </div>
            </div>
            <p style={{ margin:"14px 0", fontSize:13, color:"#b0bcd0", lineHeight:1.8 }}>{e.description}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
              <div style={{ background:"#1a1f35", border:"1px solid #1e2235", borderRadius:8, padding:"12px 14px" }}>
                <div style={{ fontSize:9, letterSpacing:3, color:"#5a6280", marginBottom:8 }}>HOW TO IDENTIFY</div>
                <div style={{ fontSize:12, color:"#e0e6f0", lineHeight:1.7 }}>{e.identify}</div>
              </div>
              <div style={{ background:"#1a1f35", border:"1px solid #1e2235", borderRadius:8, padding:"12px 14px" }}>
                <div style={{ fontSize:9, letterSpacing:3, color:"#5a6280", marginBottom:8 }}>HOW TO HANDLE</div>
                <div style={{ fontSize:12, color:"#e0e6f0", lineHeight:1.7 }}>{e.handle}</div>
              </div>
            </div>
            <div style={{ background:"#1a0a1a", border:"1px solid #ff00aa33", borderRadius:8, padding:"10px 14px", fontSize:12, color:"#cc88cc", lineHeight:1.6 }}>
              🎯 <strong>EE Relevance:</strong> {e.eeRelevance}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ TIPS TAB ═══
function TipsTab({ data }) {
  return (
    <div style={{ padding:"28px 40px", maxWidth:1100, margin:"0 auto" }}>
      <h2 style={{ margin:"0 0 20px", fontSize:22, color:"#fff" }}>Pro Tips and Mechanics</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:14 }}>
        {data.tips.map((tip,i) => (
          <div key={i} style={{ background:"#0c0f1a", border:"1px solid #1e2235", borderRadius:10, padding:"20px 22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <span style={{ fontSize:20 }}>{tip.icon}</span>
              <div style={{ fontSize:14, color:"#fff", fontWeight:"bold" }}>{tip.title}</div>
            </div>
            <div style={{ fontSize:12, color:"#8898b8", lineHeight:1.8 }}>{tip.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ MAP GUIDE WRAPPER ═══
const MAP_TABS = ["OVERVIEW","STEPS","MAP","WEAPONS","ENEMIES","TIPS"];

function MapGuide({ mapId, onBack, session, sessionId, myName, myColor }) {
  const [tab, setTab] = useState(0);
  const meta = MAPS_CONFIG.find(m => m.id === mapId);
  const data = ALL_MAP_DATA[mapId];
  const isSolo = !session || session === 'solo';

  const participants = useParticipants(sessionId, session);
  const { completions, toggleStep } = useStepCompletions(sessionId, session, myName, myColor);

  const pages = [
    <OverviewTab data={data} meta={meta} completions={completions} session={session} />,
    <StepsTab data={data} meta={meta} session={session} myName={myName} myColor={myColor} completions={completions} onToggle={toggleStep} />,
    <MapTab data={data} meta={meta}/>,
    <WeaponsTab data={data} meta={meta}/>,
    <EnemiesTab data={data} meta={meta}/>,
    <TipsTab data={data}/>,
  ];

  return (
    <div style={{ width:"100vw", height:"100vh", background:"#060810", fontFamily:"'Courier New',monospace", color:"#e0e6f0", display:"flex", flexDirection:"column", overflow:"hidden" }}>
      {/* Session header OR simple back nav */}
      {!isSolo ? (
        <SessionHeaderBar session={session} participants={participants} mapName={meta.name} mapColor={meta.color} onBack={onBack} />
      ) : (
        <div style={{ height:50, display:"flex", alignItems:"center", background:"#0c0f1a", borderBottom:"1px solid #1e2235", padding:"0 28px", flexShrink:0 }}>
          <button onClick={onBack} style={{ background:"transparent", border:"none", color:"#5a6280", cursor:"pointer", fontSize:11, letterSpacing:2, marginRight:20, padding:"0 14px 0 0", borderRight:"1px solid #1e2235", fontFamily:"inherit", height:50 }}>← MAPS</button>
          <span style={{ fontSize:15, marginRight:8 }}>{meta.icon}</span>
          <span style={{ fontSize:11, color:meta.color, letterSpacing:2 }}>{meta.name}</span>
        </div>
      )}

      {/* Tab nav */}
      <div style={{ display:"flex", alignItems:"center", background:"#0c0f1a", borderBottom:"1px solid #1e2235", padding:"0 28px", flexShrink:0 }}>
        {!isSolo && <><span style={{ fontSize:13, marginRight:8 }}>{meta.icon}</span><span style={{ fontSize:10, color:meta.color, letterSpacing:2, marginRight:16 }}>{meta.name}</span></>}
        {MAP_TABS.map((label,i) => (
          <button key={i} onClick={() => setTab(i)} style={{ padding:"0 16px", height:44, background:"transparent", border:"none", borderBottom:tab===i?`2px solid ${meta.color}`:"2px solid transparent", color:tab===i?meta.color:"#5a6280", fontSize:10, letterSpacing:2, cursor:"pointer", fontFamily:"inherit", flexShrink:0 }}>{label}</button>
        ))}
      </div>

      {/* Status bar (session mode only) */}
      <StatusBar steps={data.steps} completions={completions} mapColor={meta.color} session={session} />

      {/* Content */}
      <div style={{ flex:1, overflow: tab===1 ? "hidden" : "auto" }}>
        {pages[tab]}
      </div>
    </div>
  );
}

// ═══ HOME SCREEN ═══
function HomeScreen({ onSelect }) {
  return (
    <div style={{ width:"100vw", minHeight:"100vh", background:"#060810", fontFamily:"'Courier New',monospace", color:"#e0e6f0" }}>
      <div style={{ padding:"36px 40px 24px", borderBottom:"1px solid #1e2235", background:"#0c0f1a" }}>
        <div style={{ fontSize:10, letterSpacing:5, color:"#00e5ff", marginBottom:8 }}>BLACK OPS 3 · ZOMBIES CHRONICLES + BASE GAME</div>
        <h1 style={{ margin:"0 0 8px", fontSize:36, color:"#fff", letterSpacing:2 }}>☣️ Easter Egg Guide</h1>
        <p style={{ margin:0, fontSize:13, color:"#5a6280" }}>Select a map to open the full guide — steps, map reference, weapons, enemies, and pro tips.</p>
      </div>
      <div style={{ padding:"32px 40px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))", gap:18, maxWidth:1200 }}>
          {MAPS_CONFIG.map(m => (
            <div key={m.id} onClick={() => onSelect(m.id)}
              style={{ background:"#0c0f1a", border:`1px solid #1e2235`, borderTop:`3px solid ${m.color}`, borderRadius:12, padding:"24px 26px", cursor:"pointer", position:"relative", overflow:"hidden", transition:"all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=m.color+"66"; e.currentTarget.style.background="#0f1225"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="#1e2235"; e.currentTarget.style.background="#0c0f1a"; }}>
              <div style={{ position:"absolute", top:-40, right:-40, width:140, height:140, borderRadius:"50%", background:m.color+"06", pointerEvents:"none" }}/>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:12 }}>
                <div style={{ fontSize:28 }}>{m.icon}</div>
                <span style={{ fontSize:8, letterSpacing:2, padding:"3px 8px", borderRadius:12, background:m.color+"22", color:m.color, border:`1px solid ${m.color}44` }}>{m.tag}</span>
              </div>
              <div style={{ fontSize:10, letterSpacing:3, color:m.color, marginBottom:4 }}>{m.subtitle}</div>
              <div style={{ fontSize:20, color:"#fff", marginBottom:5, letterSpacing:1 }}>{m.name}</div>
              <div style={{ fontSize:11, color:"#5a6280", marginBottom:14, letterSpacing:1 }}>EE: {m.eeName}</div>
              <p style={{ margin:"0 0 16px", fontSize:12, color:"#8896b0", lineHeight:1.6 }}>{m.tagline}</p>
              <div style={{ display:"flex", gap:20 }}>
                <div><div style={{ fontSize:8, color:"#5a6280", letterSpacing:2, marginBottom:5 }}>DIFFICULTY</div><DifficultyBar rating={m.difficulty} max={10} color={m.color}/></div>
                <div><div style={{ fontSize:8, color:"#5a6280", letterSpacing:2, marginBottom:5 }}>PLAYERS</div><div style={{ fontSize:11, color:"#00ff88" }}>👥 {m.players}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ APP ROOT ═══
export default function App() {
  const [session, setSession] = useState(null);
  const [activeMap, setActiveMap] = useState(null);

  function handleSession(s) {
    setSession(s);
    if (s !== 'solo' && s.mapId) setActiveMap(s.mapId);
  }

  if (!session) return <SessionLobby onSession={handleSession} onSolo={() => setSession('solo')} mapsConfig={MAPS_CONFIG} />;

  const isSolo = session === 'solo';
  const sessionId = isSolo ? null : session.id;
  const myName = isSolo ? 'Solo' : session.myName;
  const myColor = isSolo ? '#00e5ff' : session.myColor;

  if (activeMap) return <MapGuide mapId={activeMap} onBack={() => setActiveMap(null)} session={session} sessionId={sessionId} myName={myName} myColor={myColor} />;
  return <HomeScreen onSelect={setActiveMap} />;
}
