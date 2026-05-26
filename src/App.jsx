import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase is optional — app works fully in solo mode without it.
// To enable sessions: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
let supabase = null;
const _sbUrl = import.meta.env.VITE_SUPABASE_URL;
const _sbKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (_sbUrl && _sbUrl.startsWith('https://') && _sbKey && _sbKey.length > 20) {
  try {
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
  { id: "shadows", name: "SHADOWS OF EVIL", subtitle: "Morg City · BO3 Base Game", eeName: "Apocalypse Averted", difficulty: 8, players: "1-4 (Solo viable)", time: "2-3 hours", color: "#9b00ff", icon: "👁️", tag: "COMPLEX", tagline: "A 1940s noir city crawling with evil. Complete four character rituals, obtain the Apothicon Sword, and trap the Shadow Man before the apocalypse begins." },
  { id: "ascension", name: "ASCENSION", subtitle: "Soviet Space Facility · Zombies Chronicles", eeName: "Casimir Mechanism", difficulty: 5, players: "4 Players REQUIRED", time: "1.5-2.5 hours", color: "#00e5ff", icon: "🚀", tag: "4 PLAYERS REQUIRED", tagline: "Activate 5 nodes across the map — including a clock puzzle, a monkey-round button press, and powering the Casimir Mechanism with every upgraded wonder weapon at once." },
  { id: "shangrila", name: "SHANGRI-LA", subtitle: "Ancient Temple · Zombies Chronicles", eeName: "Time Travel Will Tell", difficulty: 9, players: "4 Players REQUIRED", time: "2-3 hours", color: "#ff6b00", icon: "🏛️", tag: "4 PLAYERS REQUIRED", tagline: "Trigger the eclipse with simultaneous button presses, divert waterfalls, shrink a stone ball, light gas pipes with a Napalm zombie, and claim the Focusing Stone." },
  { id: "moon", name: "MOON", subtitle: "Lunar Surface · Zombies Chronicles", eeName: "Cryogenic Slumber Party / Big Bang Theory", difficulty: 7, players: "Solo to Step 5; Full EE: 4 Required + Prerequisites", time: "1.5-2.5 hours", color: "#aaccff", icon: "🌕", tag: "PREREQUISITES REQUIRED", tagline: "Requires the Vril Device (from Call of the Dead EE) and Focusing Stone (from Shangri-La EE). Complete Samantha Says, the lab hack, and the MPD ritual." },
  { id: "origins", name: "ORIGINS", subtitle: "WWI France · Zombies Chronicles", eeName: "Little Lost Girl", difficulty: 9, players: "1-4 (2-3 ideal)", time: "2-4 hours", color: "#ffd600", icon: "⚙️", tag: "HARDEST", tagline: "Build and upgrade four elemental staffs, activate three giant robots, and complete an ancient ritual." },
  { id: "dereisendrache", name: "DER EISENDRACHE", subtitle: "Austrian Castle · DLC 1 — Awakening", eeName: "My Brother's Keeper", difficulty: 7, players: "1-4 (Solo viable)", time: "2-3 hours", color: "#3399ff", icon: "🏰", tag: "BOW MASTERY", hasShield: true, tagline: "An ancient Austrian castle fortress. Build the Wrath of the Ancients bow, master its four elemental forms, and complete Richtofen's darkest ritual." },
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
  shield: {
    name: "Margwa Shield",
    description: "A shield crafted from a Margwa's severed head. Blocks zombie attacks from behind. Charged melee launches a powerful energy blast. Highly recommended for the Rift sequence where enemies come from all directions.",
    parts: [
      { name: "Margwa Tentacle", locations: ["Footlight District — on or near the boxing ring floor or jazz club tables", "Near the Footlight Beast Mode altar on a surface"] },
      { name: "Margwa Eye", locations: ["Canal District — near the waterway bridges or on a ledge near Juggernog", "On a crate near the canal docks"] },
      { name: "Margwa Teeth", locations: ["Waterfront District — near the shipping crates or dock area workbench", "Near the Waterfront ritual altar on the floor"] },
    ],
    buildAt: "Any workbench in Junction or the four districts",
    uses: [
      "Hold the shield behind you to block zombie attacks from behind",
      "Charged melee slams the Margwa head down for a massive area-of-effect hit",
      "Absorbs several hits before breaking — find new parts to rebuild",
    ],
    tips: [
      "Build the shield before entering the Rift — Margwas and Keepers attack from every angle inside",
      "Parts spawn in one of 2-3 spots per district each game — check surfaces near the ritual altars",
      "The charged melee one-shots standard zombies and deals heavy damage to Margwas",
      "Shield breaks after absorbing enough damage — keep an eye on its health and rebuild when needed",
    ],
  },
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
    summary: "A Soviet-era rocket launch facility. Despite seeming simple, Ascension's Easter Egg requires EXACTLY 4 players and involves activating 5 nodes around the map: throwing a Gersch Device at a hidden generator, simultaneously pressing perk buttons during a Space Monkey round, standing completely still in the clock room for 1-2 minutes, spelling LUNA by riding landers in sequence, and powering the Casimir Mechanism with every upgraded wonder weapon at once.",
    phases: [
      { label: "SETUP", desc: "Turn on power, ride all 3 landers to unlock PaP, get Gersch Device and Matryoshka Dolls. Upgrade the Thundergun (Zeus Cannon), Crossbow, and Ray Guns." },
      { label: "NODE 1", desc: "Throw a Gersch Device at the hidden generator near the PhD Flopper area — outside the map boundary." },
      { label: "NODE 2", desc: "During a Space Monkey round, all 4 players simultaneously press small buttons near 4 specific perk machines." },
      { label: "NODE 3", desc: "All players stand still in the clock room (lower launch pad area) for 1-2 minutes without moving." },
      { label: "NODE 4 + CASIMIR", desc: "Ride landers spelling L-U-N-A. Then throw Gersch + Matryoshka Dolls + fire all upgraded weapons at the Casimir Mechanism simultaneously." },
    ],
    mustHave: [
      "4 PLAYERS — this Easter Egg cannot be done solo or with fewer than 4 players",
      "Gersch Device — needed for Node 1 and the Casimir Mechanism finale, get multiple from the Mystery Box",
      "Matryoshka Dolls — needed for the final Casimir Mechanism step",
      "Zeus Cannon (Pack-a-Punched Thundergun) — required for the Casimir finale",
      "Upgraded Crossbow and 2x Upgraded Ray Guns — all required for the Casimir finale",
      "PaP machine access — ride all 3 landers first, then interact with the 3rd-floor rooftop control panel",
    ],
  },
  steps: [
    { phase: "SETUP", icon: "⚡", title: "Power On + Ride All 3 Landers", color: "#00ff88",
      location: "Centrifuge Room for power switch. Landers near: Stamin-Up (A), Speed Cola (B), PhD Flopper (C).",
      locationDetail: "From spawn, buy doors toward the Centrifuge Room — large circular room with a giant spinning centrifuge. Power switch is on the right side wall. After power: ride all 3 landers. Lander A is upper-left near Stamin-Up. Lander B is upper-right near Speed Cola. Lander C is lower area near PhD Flopper. After riding all 3, go to the 3rd floor rooftop and interact with the control panel to open the launch doors and unlock Pack-a-Punch.",
      steps: ["Buy doors from spawn to reach the Centrifuge Room. Activate the power lever.", "Buy Juggernog immediately — on the wall just past spawn.", "Ride Lander A (Stamin-Up, upper-left): stand on the yellow pad and hold Square/X.", "Ride Lander B (Speed Cola, upper-right): same method.", "Ride Lander C (PhD Flopper, lower area): same method.", "Go to the 3rd floor rooftop and interact with the control panel to open launch doors and unlock PaP."],
      tip: "Buy PhD Flopper near Lander C — it prevents fall damage and is great solo. Also hunt the Mystery Box for the Thundergun.", warning: null },
    { phase: "SETUP", icon: "🔫", title: "Get the Wonder Weapons and Upgrade Them", color: "#00e5ff",
      location: "Mystery Box — look for the vertical blue light beam anywhere on the map",
      locationDetail: "The Casimir Mechanism finale requires firing ALL of these simultaneously: Zeus Cannon (PaP'd Thundergun), upgraded Crossbow, and 2 upgraded Ray Guns. With 4 players, each player handles one. Everyone needs to be hunting the box and getting to PaP early.",
      steps: ["Hunt the Mystery Box for the Thundergun (big air-blast cannon). Pack-a-Punch it → Zeus Cannon.", "Also hunt for: Crossbow (Pack-a-Punch it), Ray Gun (Pack-a-Punch it).", "Also get the Gersch Device (black hole grenade) and Matryoshka Dolls from the box.", "Assign weapons to players: one Zeus Cannon, one Crossbow, one or two Ray Guns.", "Do NOT use Gersch Devices recklessly — you need them for Node 1 and the finale."],
      tip: "The box moves after several uses — follow the blue light beam to find its new location.", warning: "If someone cannot get the Zeus Cannon from the box, keep trying between rounds. It is required." },
    { phase: "NODE 1", icon: "🌀", title: "Node 1 — Throw Gersch Device at the Generator", color: "#ff6b00",
      location: "Near the PhD Flopper corridor — outside the map boundary past the launch platform ramp",
      locationDetail: "Go to the PhD Flopper/Widow's Wine area. Walk to the very end of the corridor where you can hear wind howling past the map boundary. Look left toward a barrier window. A generator sits just outside the map boundary in that direction.",
      steps: ["Navigate to the PhD Flopper corridor on the launch platform side.", "Walk toward the end of the corridor — you'll hear wind howling and can see through a barrier window.", "Throw a Gersch Device outside the map boundary to suck in the hidden generator.", "Confirmation: Gersch's voice says 'it needs as much power as possible.'"],
      tip: "If Samantha steals your Gersch Device instead, your throw was off. Reposition and try with another Gersch when you get one.", warning: "Make sure you're throwing at the generator outside the map, not a zombie. Hear the wind cue — you're in the right corridor." },
    { phase: "NODE 2", icon: "🐒", title: "Node 2 — 4 Players Press Perk Buttons During Monkey Round", color: "#ffd600",
      location: "4 specific perk machine locations — small red buttons appear only during Space Monkey rounds",
      locationDetail: "During a Space Monkey round, 4 small red buttons appear on walls near 4 of the perk machines. They are small and dark — hard to spot in dim monkey round lighting. All 4 players must press one button each simultaneously. Buttons are near: PhD Flopper (left side), Juggernog (wall across from machine), Speed Cola (left wall opposite stairs), and Stamin-Up (left side of machine).",
      steps: ["Wait for a Space Monkey round to begin (distinctive music + screeching). These occur every 4-7 rounds after a perk is purchased.", "Assign each player to one of the 4 button locations BEFORE the monkey round.", "Button 1: near PhD Flopper, on the left side of the machine.", "Button 2: near Juggernog, on the wall directly across from the machine.", "Button 3: near Speed Cola, on the left wall opposite the stairs.", "Button 4: near Stamin-Up, on the left side of the machine.", "All 4 players simultaneously press their buttons. Use a 3-2-1 countdown.", "Confirmation: computer audio cue plays."],
      tip: "Scout all 4 button locations during a regular round BEFORE the monkey round starts. The buttons only appear during monkey rounds.", warning: "No button appears near Quick Revive or Mule Kick. Miss a button? Wait for the next monkey round — they recur every 4-7 rounds." },
    { phase: "NODE 3", icon: "🕐", title: "Node 3 — Clock Room — Stand Still 1-2 Minutes", color: "#aaccff",
      location: "Lower launch pad area — the circular room with the clock on the wall (where the rocket used to be)",
      locationDetail: "PaP must be accessible before this step. Go to the lower launch pad area — the room with the old rocket mount and a clock on the wall. All players must remain within the circular area in front of the clock without moving. Stand still for 1-2 minutes. Keep a crawler alive outside the room so the round doesn't end.",
      steps: ["Ensure PaP is unlocked (all 3 landers ridden and rooftop control panel activated).", "Leave a crawler zombie alive outside this room so the round timer doesn't advance.", "All players navigate to the clock room at the lower launch pad area.", "Stand inside the circular floor area directly in front of the clock. Everyone must be inside this zone.", "Do not move. Wait 1-2 minutes while standing still.", "Audio cue: Gersch says 'yes almost there, hurry she's coming.' The round ends automatically.", "Confirmation: all players hear the round-end cue from the location."],
      tip: "Use a crawler zombie outside the room to freeze the round timer. You have all the time you need as long as the crawler is alive.", warning: "Anyone moving outside the circle restarts the countdown. Keep everyone still and call it out if someone drifts." },
    { phase: "NODE 4", icon: "🚀", title: "Node 4 — Spell LUNA on the Landers", color: "#ff00aa",
      location: "All 3 lander pads — ride them in a specific sequence",
      locationDetail: "The howling sound from Node 1 moves to the lunar landers after Node 3. Ride the landers in this exact sequence to spell L-U-N-A: L=Stamin-Up, U=Spawn, N=Speed Cola, A=Stamin-Up again. Have teammates call the lander to each station to avoid spending extra points on the ride.",
      steps: ["After Node 3, the wind/howling sound moves to the landers — you're ready.", "Ride to Stamin-Up (L)", "Ride back to Spawn (U)", "Ride to Speed Cola (N)", "Ride back to Stamin-Up (A)", "Have teammates call landers to the desired station to save points.", "Confirmation: audio cue plays after the A step."],
      tip: "Coordinate who calls which lander to avoid conflicts. Call out each letter as you complete it.", warning: null },
    { phase: "COMPLETION", icon: "✅", title: "Power the Casimir Mechanism", color: "#00ff88",
      location: "Outside the map boundary, adjacent to the Stamin-Up/claymore area — the Casimir Mechanism machine",
      locationDetail: "The Casimir Mechanism is a machine visible just outside the map boundary near Stamin-Up. After all 4 nodes, an orb appears on the floor in front of it. The sequence: Gersch Device on the orb → Matryoshka Dolls at it → ALL players fire their upgraded weapons (Zeus Cannon, Crossbow, Ray Guns) into the black hole simultaneously.",
      steps: ["Navigate to the area near Stamin-Up by the claymore wall buy. Look outside the map boundary for the Casimir Mechanism machine.", "An orb (light ball) sits on the floor in front of the device.", "Throw a Gersch Device onto the orb — a black hole forms.", "Immediately throw Matryoshka Dolls at the black hole.", "All players simultaneously fire their upgraded weapons into the black hole: Zeus Cannon, upgraded Crossbow, upgraded Ray Guns.", "Fire all weapons at once during the black hole — timing is critical.", "Confirmation: audio says 'Casimir Mechanism safety protocol initiated, shutting down power systems.' Then Gersch says 'yes, I'm free!'", "All players receive a 90-second Death Machine. EE complete."],
      tip: "Assign firing order before approaching — everyone needs to know what they're firing and when. Call it out: 'Throw on 3, 2, 1... fire!'", warning: "All upgraded weapons must fire during the same black hole window. Missing one weapon means the node fails." },
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
  mapPhoto: "https://static.accelerated-ideas.com/news/images/ascension_ee_zombie_chronicles.jpg",
  mapOrientation: { north: "Rocket Launch Pad (top)", south: "Lander C / PhD Flopper (bottom)", east: "Lander B / Speed Cola (right)", west: "Lander A / Stamin-Up (left)" },
  tips: [
    { icon: "👥", title: "4 Players Required", body: "Node 2 (simultaneous perk buttons) makes this a strict 4-player EE. You cannot substitute players for this step. Make sure all 4 players know their button location before the first monkey round." },
    { icon: "🔫", title: "Weapon Prep is Critical", body: "The Casimir Mechanism finale requires the Zeus Cannon, upgraded Crossbow, and 2 upgraded Ray Guns firing simultaneously. Start hunting the box for these weapons from Round 1. The Thundergun is rarest — if the box gives it, take it and PaP it immediately." },
    { icon: "🐒", title: "Scout Node 2 Buttons First", body: "The 4 Node 2 buttons only appear during Space Monkey rounds and are small and dark. Find their exact locations (near PhD Flopper, Jug, Speed Cola, and Stamin-Up) during a regular round so you don't waste time searching during the monkey round." },
    { icon: "🕐", title: "Node 3 — Keep a Crawler", body: "Node 3 requires standing still in the clock room for 1-2 minutes. Leave a crawler zombie alive outside the room so the round doesn't end while you wait. Everyone must stay inside the circle." },
    { icon: "💰", title: "Point Management", body: "Budget heavily — you need doors, multiple perk machines, PaP for multiple weapons. Knife zombies in early rounds for max points. Assign who buys which perk to spread the cost." },
    { icon: "🌀", title: "Gersch Device Saves", body: "Keep at least 2 Gersch Devices in reserve for Node 1 and the Casimir finale. Do not throw them casually during regular rounds — they are too rare and too important." },
  ],
};

// ═══ SHANGRI-LA DATA ═══
const SHANGRILA_DATA = {
  overview: {
    summary: "Shangri-La is a lush jungle/ancient temple map featuring time-travel through an 'Eclipse' mechanic. The Easter Egg is one of the most complex in the game and requires EXACTLY 4 players — Eclipse mode itself requires 4 simultaneous button presses, and multiple steps need players in different positions at the same time. The reward is exceptional: the player who picks up the Focusing Stone receives all 7 perks permanently for the rest of the game. The Focusing Stone obtained here is also required as a PREREQUISITE for the Moon full Easter Egg.",
    phases: [
      { label: "SETUP", desc: "Turn on power, unlock PaP (4 simultaneous pressure plates), get Shrink Ray from Mystery Box." },
      { label: "ECLIPSE + SYMBOLS", desc: "All 4 players press 4 skull buttons simultaneously for Eclipse mode. Match stone slab symbols across the map." },
      { label: "WATER SLIDE + STONE BALL", desc: "3 players stand on grates, 1 rides the water slide. Then shrink a stone ball and push it down the slide." },
      { label: "GAS + WATERFALL + TRAPS", desc: "Turn gas valve, lure Napalm zombie to light gas pipes, plug waterfall holes with trip mines." },
      { label: "GONGS + DIALS + FOCUSING STONE", desc: "Melee 12 wall symbols, explode wooden trap, set dials to 16-1-3-4, hit 4 correct gongs, shrink the meteor to get the Focusing Stone." },
    ],
    mustHave: [
      "4 PLAYERS REQUIRED — Eclipse mode requires 4 simultaneous button presses. This EE cannot be done with fewer than 4 players",
      "31-79 JGb215 Shrink Ray — required for multiple steps including shrinking the stone ball and the meteor",
      "Upgraded Shrink Ray (Fractalizer via PaP) — required to shrink the meteor orbs in the final step",
      "Trip mines / Spikemore mines (wall buy) — required to plug the waterfall holes",
      "Juggernog — main temple courtyard area, buy immediately",
      "Voice chat — essential for simultaneous steps throughout",
    ],
  },
  steps: [
    { phase: "SETUP", icon: "⚡", title: "Power On and Unlock Pack-a-Punch", color: "#00ff88",
      location: "Power: underground tunnel below temple. PaP: 4 pressure plate stones around the map.",
      locationDetail: "From spawn, buy doors through the jungle paths to the temple. Power switch is in the underground mine tunnel system below the temple. PaP is unlocked by all 4 players simultaneously standing on the 4 square pressure plate stones — one near each rotating animal statue. The 4 plate locations: center of spawn, next to the gong in the first waterfall area, in front of the power switch below, and in the mine tunnel near the power room.",
      steps: ["Open doors from spawn through the jungle paths toward the temple structure.", "Find and activate the power switch in the underground tunnel system.", "Secure Juggernog in the main temple courtyard area immediately after power.", "All 4 players simultaneously stand on the 4 pressure plate stones to unlock PaP. Use a countdown.", "Hunt the Mystery Box for the Shrink Ray (31-79 JGb215) — a continuous shrink beam gun required for multiple EE steps."],
      tip: "The Shrink Ray lets you stomp shrunken zombies for 130 pts each — great early-round point farming.", warning: "Pack-a-Punch the Shrink Ray (into the Fractalizer) before the late EE steps — the upgraded version is required to shrink the meteor orbs." },
    { phase: "ECLIPSE", icon: "🌑", title: "Activate Eclipse Mode — 4 Simultaneous Skull Buttons", color: "#ffd600",
      location: "4 circular skull buttons on the walls surrounding the Quick Revive machine in spawn",
      locationDetail: "Four circular skull buttons are mounted on the walls surrounding the Quick Revive machine in the spawn area. All 4 players must press one button each at the same time. The eclipse activates with a teleporter sound, Richtofen speaks, and the sky visually changes to a red-black eclipse with a meteor above the temple.",
      steps: ["Each player positions at one of the 4 skull button locations around Quick Revive in spawn.", "Use a verbal countdown: 3-2-1-press.", "All 4 players press simultaneously.", "Confirmation: teleporter sound, Richtofen dialogue, sky changes to eclipse with red meteor above.", "Eclipse mode is now active — you have a time window to complete the next step."],
      tip: "Scout all 4 button positions before the countdown. They are on the walls surrounding the Quick Revive machine — not far from each other.", warning: "Eclipse has a time limit. Move immediately to the next step after confirmation." },
    { phase: "ECLIPSE", icon: "🪨", title: "Stone Slab Symbol Matching", color: "#ffd600",
      location: "Eclipse mode required. Stone slabs near the tunnel entrance and across from each other on both sides of map.",
      locationDetail: "During Eclipse mode, press a skull button on the stone wall near the minecart/tunnel entrance. Floor slabs light up with symbols (diamond, circle, half-moon, triangle, 3 dots, etc.). 12 slabs on one side, 12 on the other. Two players must each stand on matching symbol slabs simultaneously — one calls out their symbol, the other finds the match, both step on at the same time.",
      steps: ["During Eclipse, one player presses the circular skull button near the minecart/tunnel entrance.", "Floor slabs around the area light up with various symbols.", "Players split into pairs: one on each side of the slab area.", "Player 1 calls out what symbol their slab shows. Player 2 finds the matching one on their side.", "Both step on matching slabs at the same time. Repeat for all symbol pairs.", "Confirmation: audio from the two trapped explorers (Brock and Gary) mentioning a secret passageway."],
      tip: "Designate 'caller' and 'matcher' roles before this step. The caller reads their symbol, the matcher finds the identical one.", warning: "Symbols must be matched simultaneously. Practice the communication pattern before triggering Eclipse." },
    { phase: "ECLIPSE", icon: "🌊", title: "Water Slide — 3 on Grates, 1 Rides Down", color: "#ff6b00",
      location: "Re-enter Eclipse mode. Waterfall area: 3 players at the bottom grates; 1 player at the top of the water slide.",
      locationDetail: "Re-activate Eclipse (4 skull buttons again). Three players go to the metal grates at the bottom of the waterfall slide. The 4th player interacts with the water slide top to ride down. The sliding player hits the 3 on the grates with enough force to free the explorers trapped there.",
      steps: ["Re-activate Eclipse mode by pressing all 4 skull buttons again.", "3 players navigate to the bottom of the waterfall slide and stand on the metal grates.", "4th player goes to the top of the water slide.", "4th player interacts with the slide top and rides down, hitting the 3 on the grates.", "Confirmation: Explorers say 'the way is clear.' A Golden Rod appears on the side of the temple near the spawn area."],
      tip: "The 3 grate players need to be spread out on the grates — the rider needs to make contact with all 3 positions.", warning: "Timing the Eclipse window matters. Position everyone before re-triggering Eclipse." },
    { phase: "ECLIPSE", icon: "⚽", title: "Shrink the Stone Ball and Push it Down the Slide", color: "#ff6b00",
      location: "Water slide mud room entrance (from spawn side). The stone ball is on the cliff edge above.",
      locationDetail: "Go to the mud room side from spawn, toward the water slide entrance. Look up at the cliff edge above — a grey stone ball sits there. Shoot it down, shrink it with the Shrink Ray, melee/push it into the water slide entrance, then jump in after it. It rolls down and lands on a water shooter at the bottom — stand on the shooter and fly up into the outside temple area.",
      steps: ["Navigate to the water slide entrance from the mud room side (from spawn).", "Look up at the cliff edge above — shoot the grey stone ball down to the ground.", "Use the Shrink Ray to shrink the stone ball to a small size.", "Melee or push the shrunken ball into the water slide entrance.", "Jump in after it — the ball rolls down and lands on the circular water shooter at the bottom.", "Stand on the water shooter yourself and it launches you up into the outside temple area.", "Confirmation: short dialogue plays, eclipse fades to daylight. A second Golden Rod appears."],
      tip: "Shrink the ball completely before trying to push it — a full-size ball won't fit.", warning: null },
    { phase: "ECLIPSE", icon: "⛽", title: "Turn the Gas Valve and Light Gas Pipes with Napalm Zombie", color: "#ff6b00",
      location: "Eclipse mode required. Mine tunnel below the temple — valve wheel and gas pipes.",
      locationDetail: "Re-trigger Eclipse. In the mine tunnel (minecart side from spawn), find the valve wheel tight against the tunnel wall near a shaft hole in the ceiling. Turn the valve multiple times until the explorers say 'the walls are moving.' Then lure a Napalm zombie through the tunnel — its body automatically ignites nearby gas leaks. There are 4 gas pipes total (2 in the tunnel, 2 in the perk room area).",
      steps: ["Re-trigger Eclipse (4 skull buttons simultaneously).", "Navigate to the mine tunnel on the minecart side from spawn.", "Find the valve wheel on the tunnel wall near a ceiling shaft — turn it several times until explorers say 'the walls are moving.'", "Now lure a Napalm zombie (large flaming zombie boss type) into the mine tunnel. Walk it through both the tunnel area and the perk room to ignite all 4 gas pipes.", "After all 4 gas pipes are lit, return to the valve wheel and pull the lever next to it.", "Confirmation: audio dialogue from the explorers."],
      tip: "The Napalm zombie is naturally attracted to players — lead it slowly through the tunnel areas to light all pipes. Don't kill it early.", warning: "NEVER let the Napalm zombie die near you — its death explosion is massive. Once the gas pipes are lit, lure it far away before killing it." },
    { phase: "ECLIPSE", icon: "💥", title: "Plug Waterfall Holes with Trip Mines", color: "#aaccff",
      location: "Eclipse mode required. Mine tunnels near the waterfall — 4 circular holes in the brick tunnel wall.",
      locationDetail: "After the gas step, the explorers are trapped in the waterfall area. You must divert water by plugging 4 holes in the brick tunnel wall. Buy trip mines from the nearby wall buy. Place them at the 4 spots opposite the circular holes (look for flame torches on the walls as markers). Lure zombies into the trip mines — the explosions plug the holes. Then press the button at the bottom of the waterfall.",
      steps: ["Buy trip mines from the wall buy in the mine tunnel area.", "Locate 4 circular holes in the brick tunnel wall near the waterfall area — flame torches mark the spots opposite each hole.", "Place trip mines at the 4 spots across from the holes. Lure zombies into the mines — explosions plug the holes.", "After all 4 holes are plugged, press the button at the bottom of the waterfall to double water flow.", "Confirmation: teleporter sound."],
      tip: "Lure crawlers (not full zombies) into the trip mines for more control. You only need the explosion to count, not a full kill.", warning: null },
    { phase: "ECLIPSE", icon: "✊", title: "Melee 12 Wall Symbols", color: "#ff00aa",
      location: "Eclipse mode required. Wall symbols appear around the map after freeing the explorers.",
      locationDetail: "After freeing the explorers from the waterfall, stone symbols appear on walls around the map (not floor slabs — these are on the walls). Find and melee all 12. Approximate locations: 5 in or near spawn, 2 on the mud room side, 2 on the minecart side, 3 further down below the temple.",
      steps: ["Re-trigger Eclipse mode.", "Stone symbols appear on walls around the map — they glow faintly.", "Melee each wall symbol (knife it) to activate it. Check spawn area (5), mud room side (2), minecart side (2), and below temple (3).", "All 12 must be hit during the same Eclipse window.", "Confirmation: audio dialogue after the 12th."],
      tip: "Do a full loop of the map — this is circular, so running one direction covers all areas. Scout during a regular round first.", warning: "These are on the WALLS, not the floor slabs from the earlier step. Don't confuse them." },
    { phase: "COMPLETION", icon: "💣", title: "Explode the Wooden Trap and Set the Dials", color: "#ffd600",
      location: "Wooden trap: outside the hut on the minecart side. Dials: mud room area — 4 large golden rotating dials.",
      locationDetail: "Two steps here: First, find the outside hut on the minecart side and throw a grenade at the wooden trap to the left of the hut (outside the map boundary). Explode it. Second, in Eclipse mode, find the 4 large golden rotating dials in the mud room. Set the numbers 16, 1, 3, 4 to the top of each respective dial.",
      steps: ["Navigate to the outside hut on the minecart side of the map.", "Throw a grenade or explosive at the wooden trap to the LEFT of the hut, outside the map boundary. Destroy it.", "Re-trigger Eclipse mode.", "Navigate to the mud room — find the 4 large golden rotating dials.", "Set the dials to the following numbers at the top: 16 / 1 / 3 / 4.", "This brings the total Golden Rod count to 6 visible in the spawn area."],
      tip: "The dial numbers correspond to Roman numeral math (C=10, I=5, dot=1). Set 16, 1, 3, 4 to the top of each dial in order.", warning: null },
    { phase: "COMPLETION", icon: "🔔", title: "Hit 4 Correct Gongs and Shrink the Orbs", color: "#ffd600",
      location: "Eclipse mode required. 8 gongs scattered around the map — only 4 play a continuous tone.",
      locationDetail: "8 gongs are scattered around the map. 4 of them play a continuous tone when hit — the other 4 are wrong and turn the orbs red (resetting the attempt). Find and hit the 4 correct gongs in sequence. While the 4th correct gong is still ringing, use the upgraded Shrink Ray (Fractalizer) to shoot the orbs on top of all 6 Golden Rods. Then shoot a free-floating orb to deflect light at the meteor and shrink it. Dynamite drops into your inventory.",
      steps: ["Enter Eclipse mode. Begin hitting gongs around the map — listen for which ones play a CONTINUOUS tone.", "Wrong gong: orbs turn red, attempt resets. Correct gong: continuous tone persists.", "Hit all 4 correct gongs in sequence.", "While the 4th correct gong is still ringing, use the upgraded Shrink Ray (Fractalizer) to shoot the orbs on top of all 6 Golden Rods.", "Shoot the free-floating orb in the temple area to deflect light at the meteor — the meteor shrinks.", "Dynamite drops into your inventory."],
      tip: "A video guide is strongly recommended for the gong locations — their positions around the circular map are hard to describe in text. The continuous tone is very distinct once you hear it.", warning: "Wrong gong resets the sequence completely. If orbs turn red, you need to start the gong sequence again." },
    { phase: "COMPLETION", icon: "✅", title: "Free Explorers with Dynamite and Claim the Focusing Stone", color: "#00ff88",
      location: "Top of the temple stairs (where explorers were trapped). PaP must be reactivated first.",
      locationDetail: "Re-activate PaP by standing on the 4 pressure plates again. The PaP machine may have disappeared — reactivating it is required. Then go to the top of the stairs leading to the large temple. Stand by the wall and listen to Brock and Gary's dialogue. Give them the dynamite — they explode the wall in the past, and in the present that wall is now destroyed. Claim the Focusing Stone from inside.",
      steps: ["Re-activate Pack-a-Punch by having all 4 players stand on the 4 pressure plates again.", "Head to the top of the stairs leading to the large temple.", "Stand by the wall and wait for Brock and Gary's dialogue to play.", "Give them the dynamite — they blow up the wall. The wall is now destroyed in the present.", "Re-activate PaP again if needed and head to the top of the temple stairs.", "Enter the room where the explorers were trapped — the shrunk meteor (Focusing Stone) spins inside.", "Pick up the Focusing Stone.", "Reward: the player who picks it up receives ALL 7 perks and keeps them permanently for the rest of the game. All 4 players unlock the achievement."],
      tip: "The Focusing Stone earned here is also required as a PREREQUISITE for completing the Moon Easter Egg (Big Bang Theory). Make sure to carry it when loading into Moon.", warning: null },
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
  mapPhoto: "https://static.accelerated-ideas.com/news/images/shangri_la_ee_zombie_chronicles.jpg",
  mapOrientation: { north: "PHD Flopper / Upper Temple (top)", south: "Spawn (bottom)", east: "Speed Cola / Mine Tunnel (right)", west: "Waterfall / Mud Room (left)" },
  tips: [
    { icon: "👥", title: "4 Players — No Exceptions", body: "Eclipse mode requires 4 simultaneous button presses and multiple steps need players at different positions. This EE is fundamentally impossible with fewer than 4 players. No workarounds exist." },
    { icon: "🔫", title: "Upgrade the Shrink Ray Early", body: "Pack-a-Punch the Shrink Ray into the Fractalizer before the late EE steps. The upgraded version is REQUIRED to shrink the meteor orbs in the final gong step. Don't leave this until last minute." },
    { icon: "🗣️", title: "Communication Is the Whole Game", body: "Every step requires coordination. Assign roles before starting: who calls symbols, who rides the water slide, who monitors the Napalm zombie. Use voice chat — text chat is too slow." },
    { icon: "🔥", title: "Napalm Zombie Handling", body: "The Napalm zombie is your friend for the gas pipe step — lead it through the tunnel slowly. But its death explosion is enormous. Once pipes are lit, lure it far away before killing it. Never let it die near your team." },
    { icon: "🔔", title: "Gong Step — Use a Video", body: "The 4 correct gongs out of 8 are best found with a video guide. The continuous tone is distinct, but their positions around the circular map are hard to navigate by text alone. A 3-minute video clip will save 20+ minutes of confusion." },
    { icon: "🏆", title: "The Reward Is Worth It", body: "The player who picks up the Focusing Stone gets ALL 7 perks permanently for the rest of the game (even through downs). This is one of the strongest rewards in any Zombies EE. The stone is also required for the Moon full EE." },
  ],
};

// ═══ MOON DATA ═══
const MOON_DATA = {
  overview: {
    summary: "Moon spans two locations — Area 51 on Earth and Griffin Station on the lunar surface. The solo Easter Egg 'Cryogenic Slumber Party' involves a color-matching terminal puzzle, a timed lab hack, dislodging the Vril Sphere from two locations, and filling a soul tube at the MPD pyramid. The FULL 'Big Bang Theory' ending REQUIRES 4 players AND that your party bring the Vril Device (earned by completing the Call of the Dead EE) and the Focusing Stone (earned by completing the Shangri-La EE) into the session. Without these items, the final steps cannot be completed.",
    phases: [
      { label: "PREREQUISITES", desc: "Vril Device from Call of the Dead EE + Focusing Stone from Shangri-La EE must be in your party's inventory when loading Moon." },
      { label: "SAMANTHA SAYS", desc: "Complete a color-terminal Simon Says sequence using 4 color-coded screens outside Tunnel 6. Then do the Lab Hack — find the Hacker device and hack 4 panels within 60 seconds." },
      { label: "VRIL SPHERE", desc: "Wait for Excavator Pi to breach Tunnel 6, knife the Vril Sphere, shoot it off the satellite dish with the Wave Gun, then off the Tunnel 11 ceiling." },
      { label: "FILL SOUL TUBE (SOLO)", desc: "Kill 25 zombies right next to the MPD soul tube, then pull the MPD switch. Earns 'Cryogenic Slumber Party.' All players get a Death Machine." },
      { label: "BIG BANG (4 PLAYERS)", desc: "Supercharge the Vril Device, fill all 4 MPD soul tubes, complete Samantha Says 3 more times, and throw the final Gersch Device to destroy Earth." },
    ],
    mustHave: [
      "Vril Device (Golden Rod) — REQUIRED for full EE: earned by completing the Call of the Dead Easter Egg, must be carried in a player's inventory when loading Moon",
      "Focusing Stone — REQUIRED for full EE: earned by completing the Shangri-La Easter Egg",
      "Hacker device — found in the Lab, needed for the lab hack sequence",
      "Wave Gun — Mystery Box wonder weapon, REQUIRED to shoot the Vril Sphere off the satellite dish and the ceiling",
      "4 players for Big Bang Theory — Steps 1-5 (Cryogenic Slumber Party) are solo-able; Steps 6-9 REQUIRE 4 players",
      "Monitor Excavator warnings — hack the matching excavator panel immediately if one activates or you will lose perk machines",
    ],
  },
  steps: [
    { phase: "SETUP", icon: "⚡", title: "Activate Power and Secure Weapons", color: "#00ff88",
      location: "Power switch: main cave across from the MPD pyramid. Wave Gun: Mystery Box on either side of the map.",
      locationDetail: "From the Receiving Bay, open doors toward Tunnel 6 and the main cave area. The power switch is directly across from the MPD pyramid in the main cave. After power is on, buy Juggernog in the Lab corridors. Hunt the Mystery Box for the Wave Gun — a continuous electrical beam gun that is REQUIRED for an EE step later.",
      steps: ["Open doors from the Receiving Bay toward the main cave area and Lab.", "Activate the power switch in the main cave across from the MPD pyramid.", "Buy Juggernog immediately — it's in the Lab corridor area.", "Hunt the Mystery Box for the Wave Gun. It fires a continuous electrical beam and ages/kills zombies instantly.", "Also look for the Hacker device — a small electronic tool found in one of 4 spots in the Lab."],
      tip: "The Wave Gun is not just helpful — it is REQUIRED for EE Step 4 (shooting the Vril Sphere off the satellite dish). Keep it all game.", warning: "Cosmonaut zombie spawns on Moon surface around round 8. When it grabs you it teleports you and steals a perk. Kill it on sight every time." },
    { phase: "EASTER EGG", icon: "🖥️", title: "Samantha Says — Color Terminal Sequence", color: "#ff00aa",
      location: "Outside the Receiving Bay, in front of Tunnel 6's door — 4 color-coded computer terminals in a row",
      locationDetail: "Four terminals are lined up near a cliff edge, each a different color: Red, Green, Blue, Yellow (left to right). Interact with any to start a color-matching Simon Says. A sequence of colors lights up — input the matching colors by pressing the corresponding terminals. Sequences increase in length up to 5 colors.",
      steps: ["Navigate to the 4 color terminals outside the Receiving Bay, near Tunnel 6's door.", "Interact with any terminal to begin. The screens show a color sequence.", "Match the sequence by pressing the correct terminals in order.", "Sequences get longer each round — start with 1 color, build to 5.", "Success: all 4 screens flash green simultaneously. You'll hear: 'Integrity check complete. Main systems online.'"],
      tip: "Call out colors verbally with your team. The sequences aren't too long but moving quickly is important.", warning: "Wrong input resets that round's sequence. Stay calm and go deliberately." },
    { phase: "EASTER EGG", icon: "💻", title: "Lab Hacking — 60 Second Window", color: "#00e5ff",
      location: "The Lab — multi-floor laboratory accessible from Griffin Station",
      locationDetail: "Find the Hacker device in one of 4 spots in the Lab. Then go to the second floor, hack one button on the wall — this starts a 60-second timer. Four panels with green lights appear around the Lab. Hack all 4 panels, then press the 4 lit-up panels on the second floor — all within the 60-second window.",
      steps: ["Find the Hacker device in the Lab — check the desk, shelves, and floor in different rooms.", "Go to the second floor. Hack the button on the wall to start the 60-second timer.", "Four panels with green lights appear around the Lab. Hack each one (hold Square/X while Hacker equipped).", "Return to the second floor and press all 4 lit-up panels before time runs out.", "Audio cue confirms success. If 60 seconds elapse, restart from the second-floor button."],
      tip: "Scout the 4 panel locations before starting the timer so you know exactly where to go.", warning: "This is genuinely time-pressured — 60 seconds total, each hack takes 5-10 seconds. Pre-planning your route is essential." },
    { phase: "EASTER EGG", icon: "🔮", title: "The Vril Sphere — Knife, Shoot, Dislodge", color: "#ffd600",
      location: "Step starts in Tunnel 6, then tracks the sphere to the satellite dish above the Receiving Area, then to Tunnel 11",
      locationDetail: "This step starts with a random event — you must WAIT for the PA system to announce 'Excavator Pi is drilling' and let Tunnel 6 be breached. Once decompressed, use the Hacker on Tunnel 6's terminal to move the excavator away. Knife the Vril Sphere (glowing orb) in Tunnel 6 to start it bouncing. Follow it to the satellite dish, shoot it off with the Wave Gun, follow it to Tunnel 11 ceiling, shoot it again. It settles at the MPD pedestal.",
      steps: ["Wait for the PA announcement: 'Excavator Pi is drilling.' Let Tunnel 6 fully breach — do NOT hack it away yet.", "After breach, use the Hacker on the Tunnel 6 terminal to move the excavator.", "Enter Tunnel 6 and knife the Vril Sphere — the small glowing orb. It starts bouncing around the map.", "Follow the sphere. It eventually flies outside to the top of the satellite dish above the Receiving Area.", "Use the Wave Gun (or Zap Gun dual-wield) to shoot the sphere off the satellite dish.", "The sphere bounces to Tunnel 11 ceiling, above a barrier near Stamin-Up. Shoot it again to dislodge.", "The sphere settles at the MPD pedestal in the main cave. A soul tube rises from a corner of the MPD base."],
      tip: "Keep the Wave Gun all game for this step — it's the only reliable way to shoot the sphere off the satellite dish.", warning: "This step depends on Excavator Pi activating randomly. If Pi doesn't come up in normal rotation, you may need to wait. Do NOT let a different excavator breach and destroy your perk machines." },
    { phase: "EASTER EGG", icon: "💀", title: "Fill the Soul Tube — Cryogenic Slumber Party", color: "#aaccff",
      location: "In front of the MPD pyramid — the cylindrical tube that rose from its base",
      locationDetail: "After the Vril Sphere settles at the MPD pedestal, a cylindrical soul tube rises from one of the pyramid's floor corners. Kill 25 zombies in very close proximity to this tube. The range is short — zombie souls only count if they die nearly on top of the tube. When full, interact with the switch on the side of the MPD.",
      steps: ["After the Vril Sphere settles, locate the soul tube rising from a corner of the MPD base.", "Kill 25 zombies extremely close to the tube — the blue soul orbs fly into it as confirmation.", "Killing zombies too far away will not count. Stay near the tube.", "When the tube is full, interact with the switch on the side of the MPD.", "All players receive a 90-second Death Machine. Achievement: Cryogenic Slumber Party unlocked.", "⚠️ STOP HERE if you do not have the Vril Device and Focusing Stone, or do not have 4 players. Steps 6-9 are a separate harder completion."],
      tip: "The Kill zone for the tube is very small. Stand right next to the tube and draw zombies directly toward you.", warning: null },
    { phase: "BIG BANG (4 PLAYERS)", icon: "⚗️", title: "Supercharge the Vril Device", color: "#9b00ff",
      location: "Area 51 (Earth side), Lab (third floor), and Receiving Area terminal",
      locationDetail: "REQUIRES 4 players AND Vril Device + Focusing Stone from prior EEs. Go to Area 51 (starting room). Two hexagonal panels are on a high shelf — cook a grenade and knock them down without rolling away. Throw a Gersch Device at the panels to teleport them onto the teleporter pad. Back in Griffin Station, a second player throws a QED at the panels — they teleport to a terminal in the Receiving Area. Find the silver tube in the Lab, take it to the terminal, and insert the Vril Device (with Focusing Stone) while pressing use until the screen turns green.",
      steps: ["Go to Area 51. Two hexagonal panels are high on a shelf — cook and throw a grenade to knock them down.", "Throw a Gersch Device at the fallen panels to teleport them onto the teleporter pad.", "Back at Griffin Station, have a second player throw a QED at the panels — they teleport to a Receiving Area terminal.", "Find the silver tube in the Lab (top of the stairs to 3rd floor or a corner).", "Take the silver tube to the Receiving Area terminal and insert it.", "As the player with the Vril Device, insert it into the machine. Press use repeatedly — screen will flash red then turn green.", "Pick up the Supercharged Vril Device."],
      tip: "Coordinate the grenade and QED throws — have positions assigned before starting. Use voice comms.", warning: "If you do not have the Vril Device from Call of the Dead and the Focusing Stone from Shangri-La, this step is impossible." },
    { phase: "BIG BANG (4 PLAYERS)", icon: "🏛️", title: "Fill 4 Soul Tubes and Insert Vril Device", color: "#9b00ff",
      location: "The MPD pyramid — all 4 corner tubes",
      locationDetail: "Walk toward the MPD. All 4 soul tubes rise from the corners of the MPD base. Kill zombies near each tube to fill all 4. Then place the Supercharged Vril Device into its slot on the MPD.",
      steps: ["Approach the MPD — all 4 soul tubes rise simultaneously.", "Kill zombies in close proximity to each tube to fill all 4.", "With all 4 tubes full, place the Supercharged Vril Device into its slot on the MPD side.", "Richtofen and Samantha swap bodies — Richtofen gains control of the zombies.", "All living players instantly receive all 8 perks simultaneously."],
      tip: "Split players up to fill multiple tubes at once — standing near one tube at a time is too slow.", warning: null },
    { phase: "BIG BANG (4 PLAYERS)", icon: "🖥️", title: "Samantha Says — Three More Times", color: "#ff00aa",
      location: "The Samantha Says color terminals outside Tunnel 6",
      locationDetail: "Throw a QED at the Vril Sphere on the ground. It teleports outside to the Samantha Says terminals. Play the full color-matching sequence 3 complete times — all-green confirmation counts as 1 completion.",
      steps: ["Throw a QED at the Vril Sphere on the ground near the MPD.", "The sphere teleports to the color terminals outside Tunnel 6.", "Play Samantha Says 3 complete times — each time match all color sequences until all 4 screens go green.", "After 3 completions, 3 rockets rise from the canyon outside Griffin Station."],
      tip: "Same as Step 2 — assign one person to call out the colors and everyone else confirms.", warning: null },
    { phase: "BIG BANG (4 PLAYERS)", icon: "💥", title: "Big Bang Theory — End It All", color: "#00ff88",
      location: "Near the Vril Sphere on the ground",
      locationDetail: "Throw one final Gersch Device at the Vril Sphere where it rests on the ground. The Gersch Device's black hole engulfs the sphere and Earth explodes. The Big Bang Theory achievement unlocks.",
      steps: ["Throw one final Gersch Device directly at the Vril Sphere on the ground.", "The black hole engulfs it. Earth explodes in a spectacular ending sequence.", "Achievement 'Big Bang Theory' unlocked for all players."],
      tip: "Make sure everyone sees this — it's one of the most epic endings in Zombies history.", warning: null },
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
  mapPhoto: "https://static.accelerated-ideas.com/news/images/der_eisendrache_teleporter_ee.jpg",
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
  shield: {
    name: "Zombie Shield",
    description: "A makeshift shield built from zombie parts and scrap metal. Blocks attacks from behind and can be used for a powerful charged melee. Useful throughout Origins given the constant pressure from Panzer Soldats and large zombie hordes.",
    parts: [
      { name: "Shield Body (Wooden Plank)", locations: ["Near Generator 1 — leaning against equipment or crates in the trench area", "Spawn church area — on the floor near the door frame or pews"] },
      { name: "Shield Handle (Metal Bar)", locations: ["Near Tank Station — on or beside the tank platform structure", "Trench network near Generator 2 — on a ledge or ground"] },
      { name: "Shield Spine (Zombie Bone)", locations: ["Excavation site / Crazy Place entrance area — check the dig site surfaces", "Near Generator 6 on the west side — on a crate or the ground"] },
    ],
    buildAt: "Any workbench scattered around the map — near generators and the church",
    uses: [
      "Hold behind you to absorb zombie hits while navigating crowded areas",
      "Charged melee delivers a powerful strike — useful for thinning zombie packs",
      "Does NOT protect against Panzer Soldat attacks — stay mobile against them",
    ],
    tips: [
      "Build early — Origins has one of the highest zombie pressure maps and the shield saves lives",
      "Parts reset each game to one of their spawn spots — check all spots in each zone if you miss one",
      "The charged melee in the Crazy Place is strong against Keepers",
      "Shield breaks after heavy use — parts respawn so you can always rebuild",
    ],
  },
  tips: [
    { icon: "📋", title: "Assign Staffs Early", body: "With 2+ players, assign staffs before collecting starts. Prevents wasted trips and duplicate collecting." },
    { icon: "🤖", title: "Robots Are Friends", body: "Shoot every leg rune you see early — free perks add up. Learn paths in round 1. Never stand under a foot outside the purple circle." },
    { icon: "🎵", title: "Gramophone Management", body: "You only need the Gramophone to open portals. Once open, leave it at the entrance. It does not disappear." },
    { icon: "🦾", title: "Panzer Soldat Priority", body: "Everyone stops and kills the Panzer the moment it spawns. Ice Staff freeze then heavy fire on exposed head." },
    { icon: "⬆️", title: "Build All Before Upgrading", body: "Build all 4 staffs before upgrading any. Portal travel takes time and this is far more efficient." },
    { icon: "🎬", title: "Use Video for Wind Part 3", body: "The sky orbs for Wind Staff Part 3 are timing-dependent and hard to spot. Watch a 2-minute video clip beforehand." },
  ],
};

// ═══ DER EISENDRACHE DATA ═══
const DEREISENDRACHE_DATA = {
  overview: {
    summary: "An ancient Austrian castle fortress commandeered by Group 935. The Primis crew must build and master the Wrath of the Ancients bow, feed three imprisoned dragons, activate the Death Ray, and complete a dark ritual to release Ultimis Dempsey and send rockets to the Moon.",
    phases: [
      { label: "SETUP", desc: "Turn on 3 power switches, feed all 3 dragons, and build the Wrath of the Ancients bow." },
      { label: "BOW UPGRADES", desc: "Upgrade at least one bow to an elemental form (solo: 1 bow, 4 players: all 4 upgraded)." },
      { label: "DEATH RAY", desc: "Activate the Death Ray near the pyramid and use it to complete two key objectives." },
      { label: "RITUAL", desc: "Interact with 3 teleporters with the Summoning Key, complete the Memory Game, and finish the final ritual." },
    ],
    mustHave: [
      "Juggernog — lower courtyard near the base of the clock tower steps, buy immediately",
      "Wrath of the Ancients bow — required for the Easter egg, build from 3 parts",
      "At least one upgraded elemental bow — the EE uses the upgraded bow for key steps",
      "Ragnarok DG-4 (Gravity Spikes) — craftable wonder weapon, excellent for Panzer Soldat",
      "Activate the Death Ray at least once before Step 4 — it's required for the ritual steps",
    ],
  },
  steps: [
    { phase: "SETUP", icon: "⚡", title: "Turn On the Power — 3 Switches", color: "#3399ff",
      location: "Three power switches: Clock Tower Room, Undercroft (basement), and the Keep (upper battlements)",
      locationDetail: "From spawn (landing pad), head down into the castle. The three power switches are spread across three floors: one in the room adjacent to the Clock Tower, one in the Undercroft (the underground cave below the castle), and one in the Keep area up the battlements stairs. All three must be activated.",
      steps: ["Switch 1 — Clock Tower Room: from the landing pad, descend the stairs and find the room adjacent to the large clock. Pull the lever.", "Switch 2 — Undercroft: navigate down into the underground cave system beneath the castle. The lever is on the cave wall near the pyramid.", "Switch 3 — Keep: ascend to the upper battlements/Keep area. Lever is on the wall near the battlements overlook.", "After all 3, full power comes on. Wunderspheres (green launchers) activate — use them to travel around the map quickly."],
      tip: "Wunderspheres are your best friend for traversal. Learn the two routes: one goes lower-to-upper, one goes to the Clock Tower area.", warning: null },
    { phase: "SETUP", icon: "🐉", title: "Feed All 3 Dragon Obelisks", color: "#ff6b00",
      location: "One dragon obelisk in each zone: Undercroft, Clock Tower area, and the Keep/Battlements",
      locationDetail: "Three dragon head obelisks are locked behind barriers early in the game, each in a different zone. After opening the area, kill zombies in close proximity to each dragon's head until it's fully fed — the dragon glows and roars when satisfied. Each dragon requires approximately 20-30 zombie kills nearby.",
      steps: ["Open the gate to each dragon's zone by spending points on the barrier.", "Stand near the dragon head and kill zombies close to it. The dragon's mouth will begin to glow as it feeds.", "Dragon 1 — Undercroft cave, near the pyramid structure.", "Dragon 2 — Clock Tower courtyard area, near the large clock.", "Dragon 3 — Keep/Battlements upper area.", "When a dragon is fully fed, it breathes a large burst of fire and rewards a free perk."],
      tip: "You get a FREE PERK from each fed dragon. Feed all 3 before spending points on perks — saves thousands of points.", warning: "Do not try to feed dragons during high rounds. Feed them in rounds 3-6 when zombie counts are manageable." },
    { phase: "SETUP", icon: "🏹", title: "Build the Wrath of the Ancients Bow", color: "#3399ff",
      location: "3 arrow parts found across the castle — assemble at the pyramid in the Undercroft",
      locationDetail: "The Wrath of the Ancients is Der Eisendrache's base wonder weapon bow. Three parts (Arrow Head, Arrow Shaft, Braided Wire) each have 2-3 spawn locations. Once all 3 are collected, bring them to the glowing pyramid altar in the Undercroft to assemble.",
      steps: ["Arrow Head: check the Undercroft cave near the pyramid — on a stone shelf, or on a table near the rocket area.", "Arrow Shaft: check the main courtyard near the clock tower base, or near the Keep battlements stairs.", "Braided Wire: check near the spawn landing pad area, or in the upper Keep room near the window.", "Once you have all 3 parts, go to the pyramid altar in the Undercroft and hold Square/X to build.", "The bow appears on the altar — pick it up."],
      tip: "Parts glow faintly. Walk through each zone systematically — they are not hidden, just spread out.", warning: "Only one player can build the bow — but in multiplayer, all players need their own bow. Each player must collect and build separately." },
    { phase: "BOW UPGRADES", icon: "⬆️", title: "Upgrade the Bow to Elemental Form", color: "#ffd600",
      location: "Each upgrade has unique steps around the castle — see Weapons tab for full detail on each of the 4 bows",
      locationDetail: "The Wrath of the Ancients can be upgraded into one of four elemental bows. Solo: upgrade one bow. Multiplayer: each player upgrades their own bow. For the EE you need at least one upgraded bow per player. The upgrades are multi-step processes involving finding symbols, shooting targets, and charging urns by killing zombies.",
      steps: ["Choose one of the 4 elemental bow upgrades: Storm (lightning), Wolf (spirit), Void (shadow), or Fire.", "Each upgrade follows a pattern: find 3 glowing targets/symbols → shoot them with WotA → complete an undercroft puzzle → kill zombies near urns to charge them → collect the upgraded bow.", "Detailed steps for each bow are in the WEAPONS tab.", "One upgraded bow unlocks the next EE steps. Getting all 4 earns the 'Arms of the Triumvirate' achievement.", "Pack-a-Punch the upgraded bow when done — dramatically increases damage."],
      tip: "The Wolf Bow is considered easiest to upgrade and is great for regular gameplay. The Storm Bow has the most satisfying charged shot for crowd control.", warning: "Do not skip this step. The upgraded bow is used directly in the EE ritual steps." },
    { phase: "DEATH RAY", icon: "☠️", title: "Activate the Death Ray", color: "#ff3a3a",
      location: "Death Ray terminal — next to the pyramid in the Undercroft",
      locationDetail: "The Death Ray is a powerful energy weapon mounted near the pyramid in the Undercroft. Activating it fires at a target and is required for two specific EE objectives. You can activate it multiple times by paying points at the terminal.",
      steps: ["Go to the pyramid area in the Undercroft.", "Find the Death Ray activation terminal on the wall — hold Square/X to activate (costs points).", "The Death Ray charges and fires — a beam shoots across the room.", "For the EE, the Death Ray must be used on Keeper skulls (glowing enemy skulls that appear near the pyramid during later steps — shoot them into the Death Ray's path).", "The Death Ray is also required to craft the Ragnarok DG-4 (see Weapons tab)."],
      tip: "Activate the Death Ray early in the game (round 5+) even if not on an EE step — it unlocks Ragnarok DG-4 parts and counts toward the EE progression.", warning: null },
    { phase: "RITUAL", icon: "🔮", title: "Summon Keepers and Use the Death Ray", color: "#9b00ff",
      location: "Pyramid area in the Undercroft",
      locationDetail: "With the upgraded bow, interact with the pyramid to summon Keeper enemies. Shoot the Keeper skulls/projectiles into the beam of the Death Ray when it fires. This sequence must be completed to progress the ritual.",
      steps: ["With your upgraded bow equipped, interact with the pyramid in the Undercroft.", "Keeper enemies spawn — these are powerful hooded entities.", "When the Death Ray activates, shoot Keeper projectile/skulls so they travel through the Death Ray beam.", "Repeat until the pyramid ritual phase is complete — audio cue signals progress.", "Survive the Keeper wave."],
      tip: "Keep Juggernog active for this step. Keepers have ranged attacks. Stay mobile and keep the pyramid in sight.", warning: "Keepers take significant damage to kill. Pack-a-Punch weapons and the Ragnarok DG-4 are highly recommended." },
    { phase: "RITUAL", icon: "📡", title: "Interact with 3 Teleporters with the Summoning Key", color: "#9b00ff",
      location: "Three teleporters spread around the castle — one per major zone",
      locationDetail: "After the pyramid sequence, the Summoning Key activates. Carry it to three teleporter pads around the castle and interact at each. The teleporters glow and are fairly visible — one in the Undercroft, one near the Clock Tower, and one in the Keep.",
      steps: ["The Summoning Key appears after the pyramid ritual — it floats and follows you automatically.", "Find and interact with Teleporter 1 in the Undercroft zone.", "Find and interact with Teleporter 2 near the Clock Tower courtyard.", "Find and interact with Teleporter 3 in the Keep/Battlements zone.", "Each interaction plays an audio cue from Richtofen. Complete all 3 without dying."],
      tip: "These teleporters are large glowing pads on the floor. Use Wunderspheres to travel between zones quickly.", warning: "Do not go down (get downed) while holding the Summoning Key during this phase. Make sure you are stocked on ammo and health." },
    { phase: "RITUAL", icon: "🧩", title: "Complete the Memory Game at the Pyramid", color: "#3399ff",
      location: "The pyramid in the Undercroft — glowing panels on its faces",
      locationDetail: "The pyramid's four faces light up with glowing symbols in a sequence. You must shoot the panels in the correct order using your bow — like a zombie Simon Says. The sequence randomizes each time you fail, but the pattern is shown once before you input.",
      steps: ["Return to the pyramid in the Undercroft. The panels on its faces are now glowing.", "Watch the panel sequence carefully — each face lights up in order.", "Shoot the faces with your upgraded bow in the same order they lit up.", "A correct sequence plays a success tone. Incorrect = round resets.", "Complete 3-4 rounds of the memory game successfully.", "Final success triggers a major audio cue from Richtofen."],
      tip: "In multiplayer, have one player focus entirely on the memory game while others hold the zombie horde back. Call out the pattern verbally.", warning: "The memory game sequence gets longer each round. Pay close attention — mistakes reset the round." },
    { phase: "COMPLETION", icon: "✅", title: "Final Ritual and Completion", color: "#00ff88",
      location: "Clock Tower area — interact with the terminal outside the Clock Tower, then the pyramid for the finale",
      locationDetail: "After the Memory Game, carry the Summoning Key to the terminal outside the Clock Tower (Radio Room). The Key floats into the terminal and triggers the rocket launch cutscene — Der Eisendrache's rockets fire toward the Moon. A final enemy wave occurs before the ending plays.",
      steps: ["With the Summoning Key after completing the Memory Game, navigate to the terminal outside the Clock Tower (Radio Room on some guides).", "Interact with the terminal — the Summoning Key floats in and begins sparking with electricity.", "All zombies despawn for the cutscene.", "Rockets launch toward the Moon — My Brother's Keeper ending cutscene plays.", "Ultimis Dempsey's fate is decided. Richtofen's plan advances."],
      tip: "Stock up and stay safe before this final interaction. Once you interact with the terminal the EE is complete.", warning: null },
  ],
  weapons: [
    { name: "Wrath of the Ancients", type: "CRAFTABLE", icon: "🏹", color: "#3399ff",
      description: "The base wonder weapon bow of Der Eisendrache. Fires magical arrows that deal significant damage. Required base for all 4 elemental upgrades. Accurate, silent, and deadly.",
      acquisition: "Build from 3 parts (Arrow Head, Arrow Shaft, Braided Wire) found around the castle. Assemble at the pyramid altar in the Undercroft.",
      parts: [
        { name: "Arrow Head", location: "Undercroft — on a stone shelf near the pyramid, or on a table near the rocket area in the lower castle." },
        { name: "Arrow Shaft", location: "Main courtyard near the Clock Tower base, or near the Keep battlements stairs on the ground." },
        { name: "Braided Wire", location: "Near the spawn/landing pad area, or in the upper Keep room near the window looking out." },
      ],
      upgradeNote: "Cannot be Pack-a-Punched in base form. Upgrade to an elemental bow first, then PaP the upgraded version.",
      eeRelevance: "Required for all EE steps. Without it you cannot upgrade, complete the ritual, or damage the Keepers correctly." },
    { name: "Storm Bow (Kreema'ahm la Ahmahm)", type: "BOW UPGRADE — LIGHTNING", icon: "⚡", color: "#00e5ff",
      description: "Fires a ball of electricity that lingers, shocking and chaining to nearby zombies. Charged shot releases a swirling thunderstorm at the impact point that sucks in and electrocutes zombies. Outstanding for mid-size hordes.",
      acquisition: "Upgrade the Wrath of the Ancients via the Storm upgrade questline.",
      parts: [
        { name: "Step 1 — Find 3 Storm Urns", location: "Three small storm-marked urns are hidden around the map. Shoot each glowing urn with the Wrath of the Ancients — they're on ledges and surfaces in the Undercroft, Clock Tower area, and Keep. They emit a faint blue glow." },
        { name: "Step 2 — Fill the Storm Jars", location: "Go to the Undercroft near the pyramid. Three storm jars appear in a triangle pattern. Kill zombies near the jars to fill them with souls. When all three glow bright blue, the jars are fully charged." },
        { name: "Step 3 — Shoot the Floating Orb", location: "A glowing electrical orb appears floating in the Undercroft. Shoot it precisely with the Wrath of the Ancients. It moves slowly — lead your shot. One clean hit activates the next phase." },
        { name: "Step 4 — Collect from the Pyramid", location: "Return to the pyramid altar in the Undercroft. The Storm Bow materializes on the altar — hold Square/X to collect it." },
      ],
      upgradeNote: "Pack-a-Punch after acquiring. PaP'd Storm Bow clears entire rooms with the charged shot.",
      eeRelevance: "One of 4 valid bows for the EE ritual. Many players prefer this one for its crowd control charged shot." },
    { name: "Wolf Bow (Kreeholo lu Kreemasaleet)", type: "BOW UPGRADE — SPIRIT/WOLF", icon: "🐺", color: "#ff6b00",
      description: "Fires a shot that slows all zombies in a blast radius. Charged shot causes spectral wolves to leap from the impact point, dealing damage and slowing anything they hit. Excellent for training hordes. Often considered the easiest upgrade to complete.",
      acquisition: "Upgrade the Wrath of the Ancients via the Wolf upgrade questline.",
      parts: [
        { name: "Step 1 — Shoot 3 Wolf Symbols", location: "Three wolf paw-print/symbol targets are painted on walls around the castle — one in the Undercroft, one near the Clock Tower courtyard, one in the Keep. They glow orange-red when the bow is equipped. Shoot each with the WotA to activate them." },
        { name: "Step 2 — Crazy Place Wolf Targets", location: "Enter the Crazy Place (via the Wundersphere that leads to the alternate dimension — a dark shadow version of the castle). Inside, 3 wolf-spirit targets appear on the walls and light up in sequence. Shoot them in the order they light up before they fade." },
        { name: "Step 3 — Fill Wolf Fire Urns", location: "In the Crazy Place, three fire urns appear near a wolf altar. Kill zombies near them to fill the urns with wolf souls — they glow orange when charged. All 3 must be filled before leaving." },
        { name: "Step 4 — Collect from the Wolf Altar", location: "The Wolf Bow materializes on the altar in the Crazy Place — hold Square/X to collect. Or it may appear at the main pyramid — check both." },
      ],
      upgradeNote: "Pack-a-Punch after acquiring. The PaP'd charged shot becomes a massive wolf pack charge that covers enormous distance.",
      eeRelevance: "Widely considered the easiest upgrade and best for general gameplay. Great starting choice if this is your first time." },
    { name: "Void Bow (Kreegakaleet lu Gosata'ahm)", type: "BOW UPGRADE — SHADOW/VOID", icon: "💀", color: "#9b00ff",
      description: "Normal shot spawns a single skull that kills 2-3 zombies before vanishing. Charged shot opens a dark portal that launches many skulls in a wide radius, stalling and eating nearby zombies for several seconds. Excellent for area denial.",
      acquisition: "Upgrade the Wrath of the Ancients via the Void upgrade questline.",
      parts: [
        { name: "Step 1 — Find 3 Void Symbols", location: "Three void/shadow symbols are marked on walls around the castle — look for dark skull-like marks in the Undercroft, near the rocket area, and near the Keep. Shoot each with the Wrath of the Ancients to activate them." },
        { name: "Step 2 — Shoot the Glowing Panels in Order", location: "In the Undercroft, three glowing void panels appear on the walls. They light up briefly in a random sequence — watch carefully and shoot them in the same order (a Memory Game mechanic). Wrong order resets the sequence." },
        { name: "Step 3 — Fill the Void Urns", location: "Three shadow urns appear near the void altar (Undercroft area). Kill zombies nearby to fill them. The urns pulse purple as they fill. Kill 8-10 zombies near each urn." },
        { name: "Step 4 — Collect from the Altar", location: "The Void Bow materializes on the void altar in the Undercroft. Hold Square/X to collect it." },
      ],
      upgradeNote: "Pack-a-Punch into the Kreegakaleet lu Gosata'ahm PaP. The portal charged shot becomes devastating at high rounds — stops full hordes cold.",
      eeRelevance: "Strong tactical choice for the EE — the portal charged shot is perfect for controlling the Keeper fight near the pyramid." },
    { name: "Fire Bow (Kreeaho'ahm nal Ahmhogaroc)", type: "BOW UPGRADE — FIRE/RUNE", icon: "🔥", color: "#ff3a3a",
      description: "Normal shot creates a small burst of lava that burns zombies over time. Charged shot fires a massive rune prison that encases multiple zombies in a fiery cage, burning them to death. One of the highest sustained damage bows.",
      acquisition: "Upgrade the Wrath of the Ancients via the Fire upgrade questline.",
      parts: [
        { name: "Step 1 — Find 3 Fire Rune Symbols", location: "Three fire rune symbols are inscribed on castle walls — look for orange glowing marks near the Keep upper area, the Clock Tower courtyard walls, and the upper landing near spawn. Shoot each with the WotA." },
        { name: "Step 2 — Crazy Place Fire Targets", location: "Enter the Crazy Place. Three fire-circle targets appear on the ground — they glow orange and cycle in an order. Shoot each fire circle target with the WotA as it glows. Timing matters — too slow and the sequence resets." },
        { name: "Step 3 — Fill Fire Urns", location: "Three fire urns appear near the fire altar in the Crazy Place or Undercroft. Kill zombies near them — they are filled with kill-souls. The urns glow bright orange when fully charged." },
        { name: "Step 4 — Collect from the Altar", location: "The Fire Bow materializes on the fire altar. Hold Square/X to pick it up." },
      ],
      upgradeNote: "Pack-a-Punch into the Kreeaho'ahm nal Ahmhogaroc PaP. The rune prison charged shot becomes a massive multi-trap that kills entire waves.",
      eeRelevance: "Excellent in the final ritual wave — the rune prison traps clusters of Keepers, giving you time to reposition." },
    { name: "Ragnarok DG-4 (Gravity Spikes)", type: "CRAFTABLE", icon: "⚡", color: "#ffd600",
      description: "A wonder weapon that slams gravity spikes into the ground, creating a zone that pulls in and crushes zombies. Devastating against the Panzer Soldat. Three parts to build.",
      acquisition: "Build from 3 parts found after activating the Death Ray at least once. Parts appear in the Undercroft and castle areas.",
      parts: [
        { name: "DG-4 Head", location: "Appears in the Undercroft near the Death Ray after it has been activated. Check the floor near the terminal." },
        { name: "DG-4 Body", location: "In the castle battlements/Keep area — check near the artillery or equipment crates after Death Ray activation." },
        { name: "DG-4 Base", location: "Near the landing pad/spawn area or the Clock Tower room — on the floor or a surface after Death Ray fires." },
      ],
      upgradeNote: "Pack-a-Punch into the Ragnarok DG-4 Supreme. Gravity pull radius doubles and damage becomes extreme.",
      eeRelevance: "Not required for the EE but near-essential for surviving the Keeper fights and Panzer Soldat encounters during the ritual steps." },
  ],
  enemies: [
    { name: "Panzer Soldat", icon: "🦾", threat: 5, color: "#ff3a3a",
      description: "A heavily armored zombie in a full metal suit. Equipped with a flamethrower on one arm and a claw grapple on the other. First spawns around round 8-10 and returns every few rounds. Very high health.",
      identify: "Tall metal suit, bright red eye, distinctive mechanical sound and jet engine noise when spawning. Much slower than standard zombies but takes a full magazine of most guns.",
      handle: "Ragnarok DG-4 to pull it in, then unload into its face. Shoot the exposed glass eye for bonus damage. Never let its claw grab you — it pins you and drains your health rapidly. Never stand still — constantly strafe.",
      eeRelevance: "Spawns regularly throughout the EE. Will interrupt ritual steps if not handled. Kill on sight as the top priority every time one appears." },
    { name: "Keeper", icon: "👁️", threat: 4, color: "#9b00ff",
      description: "Powerful hooded supernatural entities summoned during the EE ritual steps near the pyramid. High health, ranged energy projectile attacks, and resistant to most damage types. Only appear during specific EE phases.",
      identify: "Tall robed figures with glowing eyes. Only appear near the pyramid during the Keeper fight EE step. Emit a purple aura and launch energy balls.",
      handle: "Pack-a-Punched weapons. Upgraded and PaP'd bows deal heavy damage. Ragnarok DG-4 pulls them into a cluster you can then bomb. Stay mobile and use the Undercroft pillars for cover.",
      eeRelevance: "A required encounter during the pyramid ritual phase. Expect 2-4 simultaneously. Failure to handle them means restarting the ritual step." },
  ],
  mapNodes: [
    { id: "spawn", x: 50, y: 8, label: "LANDING PAD / SPAWN", color: "#00ff88", type: "area", desc: "NORTH — Starting area at the top of the castle. Wundersphere launch point here for fast travel." },
    { id: "keep", x: 75, y: 22, label: "THE KEEP", color: "#3399ff", type: "area", desc: "NORTHEAST — Upper battlements area. Power Switch 3, Dragon 3, and Fire Rune symbols here. Pack-a-Punch machine is in this area." },
    { id: "clock", x: 50, y: 38, label: "CLOCK TOWER AREA", color: "#ffd600", type: "area", desc: "CENTER — Large courtyard with the main clock tower. Dragon 2 is here. EE: final ritual terminal outside the Clock Tower." },
    { id: "undercroft", x: 28, y: 62, label: "UNDERCROFT", color: "#9b00ff", type: "key", desc: "SOUTHWEST — Underground cave below the castle. Pyramid, Death Ray, Dragon 1 all here. Most EE steps happen here." },
    { id: "pyramid", x: 28, y: 72, label: "PYRAMID / DEATH RAY", color: "#ff3a3a", type: "key", desc: "UNDERCROFT — The glowing pyramid is the bow build station and EE ritual focus. Death Ray terminal is right next to it." },
    { id: "crazyplace", x: 12, y: 50, label: "CRAZY PLACE (PORTAL)", color: "#ff00aa", type: "key", desc: "WEST — Enter via Wundersphere on the west side. Shadow version of the castle. Required for Wolf Bow and Fire Bow upgrades." },
    { id: "jugg", x: 52, y: 48, label: "JUGGERNOG", color: "#ff3a3a", type: "perk", fixed: true, desc: "FIXED — Lower courtyard near the base of the Clock Tower steps. Buy this first." },
    { id: "speed", x: 65, y: 32, label: "SPEED COLA", color: "#00e5ff", type: "perk", fixed: true, desc: "FIXED — Keep area, near the top battlements. Faster reloads." },
    { id: "quick", x: 38, y: 52, label: "QUICK REVIVE", color: "#00ff88", type: "perk", fixed: true, desc: "FIXED — Near the spawn/landing pad area or upper courtyard." },
    { id: "stamin", x: 42, y: 68, label: "STAMIN-UP", color: "#00ff88", type: "perk", fixed: true, desc: "FIXED — In the lower castle area near the Undercroft entrance." },
    { id: "pap", x: 72, y: 18, label: "PACK-A-PUNCH", color: "#ffd600", type: "key", desc: "Keep area — upper battlements. Always available after power is on, no activation required." },
    { id: "box1", x: 55, y: 58, label: "BOX SPAWN", color: "#888", type: "box", desc: "Possible Mystery Box — lower castle near the Undercroft entrance path." },
    { id: "box2", x: 35, y: 28, label: "BOX SPAWN", color: "#888", type: "box", desc: "Possible Mystery Box — Clock Tower courtyard area." },
  ],
  mapEdges: [["spawn","keep"],["spawn","clock"],["clock","undercroft"],["undercroft","pyramid"],["undercroft","crazyplace"],["keep","pap"],["clock","jugg"],["keep","speed"],["undercroft","stamin"],["spawn","quick"],["clock","box2"],["undercroft","box1"]],
  mapPhoto: "https://static.wikia.nocookie.net/callofduty/images/Der_Eisendrache_map_layout.png",
  mapOrientation: { north: "Spawn / Landing Pad (top)", south: "Undercroft / Pyramid (bottom)", east: "The Keep / Pack-a-Punch (right)", west: "Crazy Place Portal (left)" },
  tips: [
    { icon: "🐉", title: "Free Perks From Dragons", body: "Each fed dragon gives a free perk. Feed all 3 dragons (rounds 3-6) before spending a single point on perks. That's potentially 3 free perks worth ~7,500 points." },
    { icon: "🏹", title: "Upgrade Bow Before EE Steps", body: "Fully upgrade at least one bow and Pack-a-Punch it before starting any EE ritual steps. Keeper fights require heavy damage output." },
    { icon: "🦾", title: "Panzer Priority", body: "The moment you hear the Panzer Soldat's jet engine sound, stop everything and focus it. Ragnarok DG-4 pulls it in, then unload into the glass eye. Never let it grab you." },
    { icon: "⚡", title: "Use Wunderspheres", body: "The green launch pads (Wunderspheres) are the fastest traversal in the map. Learn both routes — they save minutes of running during timed EE steps." },
    { icon: "🎯", title: "Perk Priority", body: "Juggernog first. Quick Revive second (solo — self-revive). Speed Cola third. Stamin-Up is optional. Dragons often give you the first one or two for free." },
    { icon: "🔮", title: "Memory Game Tips", body: "For the pyramid memory game, have one player call out each panel position out loud (North, South, East, West) as they light up. Then both players confirm the sequence before shooting." },
  ],
  shield: {
    name: "Zombie Shield",
    description: "A makeshift shield built from castle scrap and zombie parts. Blocks attacks from behind and delivers a powerful melee slam. Essential during the Panzer Soldat fights and the Keeper encounters in the ritual steps.",
    parts: [
      { name: "Shield Frame (Wooden Door)", locations: ["Near the Clock Tower courtyard — leaning against a wall or on the ground near the clock base", "Near the landing pad/spawn area by the equipment crates"] },
      { name: "Shield Handle (Metal Pipe)", locations: ["In the Keep area — near the battlements wall or beside an artillery piece", "Lower castle path near the Stamin-Up machine"] },
      { name: "Shield Bracket (Skull Mount)", locations: ["In the Undercroft — near the pyramid on the cave floor, or near the Death Ray terminal", "Near the Crazy Place Wundersphere entrance on the west side"] },
    ],
    buildAt: "Any workbench around the castle — there are workbenches near the Clock Tower, Keep, and Undercroft",
    uses: [
      "Hold behind you to absorb zombie hits — critical when focused on ritual steps near the pyramid",
      "Charged melee slams the shield down for a powerful area hit — useful against Keeper clusters",
      "Does NOT block Panzer Soldat flamethrower — stay mobile against Panzers regardless",
    ],
    tips: [
      "Build the shield as early as possible — it's especially valuable during the Keeper fight at the pyramid",
      "The charged melee deals surprising damage to Keepers — use it when they cluster together",
      "Parts rotate between 2-3 possible spawns each game — check both locations if one spot is empty",
      "Shield breaks after absorbing enough damage — parts respawn so you can always rebuild",
    ],
  },
};

const ALL_MAP_DATA = {
  shadows: SHADOWS_DATA,
  ascension: ASCENSION_DATA,
  shangrila: SHANGRILA_DATA,
  moon: MOON_DATA,
  origins: ORIGINS_DATA,
  dereisendrache: DEREISENDRACHE_DATA,
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
function SessionLobby({ onSession, onSolo, mapsConfig, initialCode = '' }) {
  const [mode, setMode] = useState(initialCode ? 'join' : null);
  const [sessionName, setSessionName] = useState('');
  const [selectedMap, setSelectedMap] = useState('');
  const [joinCode, setJoinCode] = useState(initialCode);
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
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  function copyCode() {
    navigator.clipboard.writeText(session.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  function shareLink() {
    const url = `${window.location.origin}${window.location.pathname}?join=${session.code}`;
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    });
  }
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
        <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
          <button onClick={copyCode} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:"'Courier New',monospace", padding:0 }}>
            <span style={{ fontSize:'11px', color: copied ? '#00ff88' : '#4a5580', letterSpacing:'3px' }}>
              {copied ? '✓ COPIED!' : `[${session.code}] 📋`}
            </span>
          </button>
          <button onClick={shareLink} style={{ background: linkCopied ? '#00ff8822' : 'transparent', border:`1px solid ${linkCopied ? '#00ff88' : '#1e2235'}`, borderRadius:4, cursor:'pointer', fontFamily:"'Courier New',monospace", padding:'2px 8px', fontSize:'9px', letterSpacing:'1px', color: linkCopied ? '#00ff88' : '#4a5580' }}>
            {linkCopied ? '✓ LINK COPIED' : '🔗 SHARE'}
          </button>
        </div>
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
  const isMobile = window.innerWidth < 600;
  return (
    <div style={{ padding: isMobile ? "16px" : "32px 40px", maxWidth: 1100, margin: "0 auto" }}>
      {showWhatsNext && <WhatsNextCard steps={data.steps} completions={completions} mapColor={meta.color} />}
      <div style={{ background: "linear-gradient(135deg,#0a1628 0%,#0d0a1e 60%,#1a0a0a 100%)", border: `1px solid #1e2235`, borderTop: `3px solid ${meta.color}`, borderRadius: 12, padding: isMobile ? "20px" : "36px 40px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: meta.color + "08", pointerEvents: "none" }} />
        <div style={{ fontSize: 10, letterSpacing: 4, color: meta.color, marginBottom: 6 }}>{meta.subtitle}</div>
        <h1 style={{ margin: "0 0 4px", fontSize: isMobile ? 24 : 38, color: "#fff", letterSpacing: 2 }}>{meta.name}</h1>
        <div style={{ fontSize: isMobile ? 12 : 15, color: "#5a6280", marginBottom: 20, letterSpacing: 1 }}>Easter Egg: {meta.eeName}</div>
        <div style={{ display: "flex", gap: isMobile ? 16 : 32, flexWrap: "wrap" }}>
          <div><div style={{ fontSize: 9, color: "#5a6280", letterSpacing: 3, marginBottom: 6 }}>DIFFICULTY</div><DifficultyBar rating={meta.difficulty} color={meta.color} /></div>
          <div><div style={{ fontSize: 9, color: "#5a6280", letterSpacing: 3, marginBottom: 6 }}>PLAYERS</div><div style={{ color: "#00ff88", fontSize: 12 }}>👥 {meta.players}</div></div>
          <div><div style={{ fontSize: 9, color: "#5a6280", letterSpacing: 3, marginBottom: 6 }}>EST. TIME</div><div style={{ color: "#e0e6f0", fontSize: 12 }}>⏱ {meta.time}</div></div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "#0c0f1a", border: "1px solid #1e2235", borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "#5a6280", marginBottom: 12 }}>WHAT IS THIS</div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.8, color: "#b0bcd0" }}>{data.overview.summary}</p>
        </div>
        <div style={{ background: "#0c0f1a", border: "1px solid #1e2235", borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "#5a6280", marginBottom: 12 }}>MUST HAVE</div>
          {data.overview.mustHave.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 9, fontSize: 12, color: "#b0bcd0", lineHeight: 1.5 }}>
              <span style={{ color: "#00ff88", flexShrink: 0 }}>✓</span><span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "#0c0f1a", border: "1px solid #1e2235", borderRadius: 10, padding: "18px 20px" }}>
        <div style={{ fontSize: 9, letterSpacing: 4, color: "#5a6280", marginBottom: 18 }}>THE ROADMAP</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 14 }}>
          {data.overview.phases.map((phase, i) => (
            <div key={i} style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: meta.color + "22", border: `1px solid ${meta.color}55`, color: meta.color, fontSize: 11, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 9, letterSpacing: 2, color: meta.color }}>{phase.label}</div>
              </div>
              <div style={{ fontSize: 12, color: "#8896b0", lineHeight: 1.6 }}>{phase.desc}</div>
              {!isMobile && i < data.overview.phases.length - 1 && <div style={{ position: "absolute", top: 12, right: -10, color: "#5a6280", fontSize: 14 }}>→</div>}
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

  const isMobile = window.innerWidth < 700;
  const [showSidebar, setShowSidebar] = useState(!isMobile);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", flexDirection: "column" }}>
      {/* Mobile step picker bar */}
      {isMobile && (
        <div style={{ background:"#0c0f1a", borderBottom:"1px solid #1e2235", padding:"8px 12px", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
          <button onClick={() => setShowSidebar(s => !s)} style={{ background:"transparent", border:`1px solid #1e2235`, color:"#5a6280", cursor:"pointer", fontFamily:"inherit", fontSize:10, letterSpacing:2, padding:"6px 10px", borderRadius:4 }}>
            {showSidebar ? "✕ CLOSE" : "☰ STEPS"}
          </button>
          <div style={{ fontSize:11, color:"#5a6280" }}>Step {current+1}/{data.steps.length} — <span style={{ color:"#e0e6f0" }}>{step.title}</span></div>
        </div>
      )}
      <div style={{ display: "flex", flex:1, overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{ width: isMobile ? "100%" : 248, flexShrink: 0, background: "#0c0f1a", borderRight: "1px solid #1e2235", overflowY: "auto", padding: "16px 0", display: (!isMobile || showSidebar) ? "block" : "none", position: isMobile ? "absolute" : "relative", zIndex: isMobile ? 10 : "auto", height: isMobile ? "calc(100% - 40px)" : "auto", top: isMobile ? 40 : "auto", left:0 }}>
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
      <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px" : "28px 36px", display: isMobile && showSidebar ? "none" : "block" }}>
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

// ═══ SHIELD TAB ═══
function ShieldTab({ data, meta }) {
  const s = data.shield;
  if (!s) return null;
  return (
    <div style={{ padding:"28px 40px", maxWidth:900, margin:"0 auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <span style={{ fontSize:32 }}>🛡️</span>
        <div>
          <h2 style={{ margin:"0 0 4px", fontSize:22, color:"#fff" }}>{s.name}</h2>
          <div style={{ fontSize:11, color:meta.color, letterSpacing:2 }}>3 PARTS TO BUILD</div>
        </div>
      </div>
      <p style={{ margin:"0 0 24px", fontSize:13, color:"#b0bcd0", lineHeight:1.8, background:"#0c0f1a", border:"1px solid #1e2235", borderRadius:8, padding:"16px 20px" }}>{s.description}</p>

      {/* Parts */}
      <div style={{ fontSize:9, letterSpacing:4, color:"#5a6280", marginBottom:14 }}>PARTS AND SPAWN LOCATIONS</div>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:28 }}>
        {s.parts.map((part, i) => (
          <div key={i} style={{ background:"#0c0f1a", border:"1px solid #1e2235", borderLeft:`3px solid ${meta.color}`, borderRadius:8, padding:"16px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:24, height:24, borderRadius:"50%", background:meta.color+"22", border:`1px solid ${meta.color}55`, color:meta.color, fontSize:11, fontWeight:"bold", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{i+1}</div>
              <div style={{ fontSize:14, color:"#fff", fontWeight:"bold" }}>{part.name}</div>
            </div>
            <div style={{ fontSize:9, letterSpacing:2, color:"#5a6280", marginBottom:8 }}>POSSIBLE SPAWN LOCATIONS</div>
            {part.locations.map((loc, j) => (
              <div key={j} style={{ display:"flex", gap:8, marginBottom:6, fontSize:12, color:"#8898b8", lineHeight:1.6 }}>
                <span style={{ color:meta.color, flexShrink:0 }}>→</span><span>{loc}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Build location */}
      <div style={{ background:"#0a1628", border:"1px solid #00e5ff33", borderRadius:8, padding:"14px 18px", marginBottom:20 }}>
        <div style={{ fontSize:9, letterSpacing:3, color:"#00e5ff", marginBottom:6 }}>🔨 WHERE TO BUILD</div>
        <div style={{ fontSize:13, color:"#e0e6f0" }}>{s.buildAt}</div>
      </div>

      {/* Uses */}
      <div style={{ fontSize:9, letterSpacing:4, color:"#5a6280", marginBottom:12 }}>HOW TO USE IT</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
        {s.uses.map((use, i) => (
          <div key={i} style={{ display:"flex", gap:10, fontSize:13, color:"#b0bcd0", lineHeight:1.6, padding:"8px 0", borderBottom:i<s.uses.length-1?"1px solid #1e2235":"none" }}>
            <span style={{ color:"#00ff88", flexShrink:0 }}>✓</span><span>{use}</span>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div style={{ fontSize:9, letterSpacing:4, color:"#5a6280", marginBottom:12 }}>PRO TIPS</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {s.tips.map((tip, i) => (
          <div key={i} style={{ background:"#0a1a0a", border:"1px solid #1a3a1a", borderRadius:8, padding:"12px 16px", fontSize:12, color:"#7ac47a", lineHeight:1.7 }}>
            💡 {tip}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ MAP GUIDE WRAPPER ═══

function MapGuide({ mapId, onBack, session, sessionId, myName, myColor }) {
  const [tab, setTab] = useState(0);
  const meta = MAPS_CONFIG.find(m => m.id === mapId);
  const data = ALL_MAP_DATA[mapId];
  const isSolo = !session || session === 'solo';

  const participants = useParticipants(sessionId, session);
  const { completions, toggleStep } = useStepCompletions(sessionId, session, myName, myColor);

  const hasShield = !!data.shield;
  const MAP_TABS = ["OVERVIEW","STEPS","MAP","WEAPONS","ENEMIES","TIPS", ...(hasShield ? ["SHIELD"] : [])];

  const pages = [
    <OverviewTab data={data} meta={meta} completions={completions} session={session} />,
    <StepsTab data={data} meta={meta} session={session} myName={myName} myColor={myColor} completions={completions} onToggle={toggleStep} />,
    <MapTab data={data} meta={meta}/>,
    <WeaponsTab data={data} meta={meta}/>,
    <EnemiesTab data={data} meta={meta}/>,
    <TipsTab data={data}/>,
    ...(hasShield ? [<ShieldTab data={data} meta={meta}/>] : []),
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
      <div style={{ display:"flex", alignItems:"center", background:"#0c0f1a", borderBottom:"1px solid #1e2235", padding:"0 28px", overflowX:"auto", flexShrink:0 }}>
        {!isSolo && <><span style={{ fontSize:13, marginRight:8 }}>{meta.icon}</span><span style={{ fontSize:10, color:meta.color, letterSpacing:2, marginRight:16, whiteSpace:"nowrap" }}>{meta.name}</span></>}
        {MAP_TABS.map((label,i) => (
          <button key={i} onClick={() => setTab(i)} style={{ padding:"0 16px", height:44, background:"transparent", border:"none", borderBottom:tab===i?`2px solid ${meta.color}`:"2px solid transparent", color:tab===i?meta.color:label==="SHIELD"?"#ffd60088":"#5a6280", fontSize:10, letterSpacing:2, cursor:"pointer", fontFamily:"inherit", flexShrink:0, whiteSpace:"nowrap" }}>{label==="SHIELD"?"🛡️ SHIELD":label}</button>
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
  const isMobile = window.innerWidth < 600;
  return (
    <div style={{ width:"100vw", minHeight:"100vh", background:"#060810", fontFamily:"'Courier New',monospace", color:"#e0e6f0" }}>
      <div style={{ padding: isMobile ? "20px 16px 16px" : "36px 40px 24px", borderBottom:"1px solid #1e2235", background:"#0c0f1a" }}>
        <div style={{ fontSize:10, letterSpacing: isMobile ? 2 : 5, color:"#00e5ff", marginBottom:8 }}>BLACK OPS 3 · ZOMBIES CHRONICLES + BASE GAME</div>
        <h1 style={{ margin:"0 0 8px", fontSize: isMobile ? 24 : 36, color:"#fff", letterSpacing:2 }}>☣️ Easter Egg Guide</h1>
        <p style={{ margin:0, fontSize:12, color:"#5a6280" }}>Select a map to open the full guide — steps, map reference, weapons, enemies, and pro tips.</p>
      </div>
      <div style={{ padding: isMobile ? "16px" : "32px 40px" }}>
        <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(320px,1fr))", gap: isMobile ? 12 : 18, maxWidth:1200 }}>
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

  // Read ?join=CODE from URL on first load — auto-fills join screen
  const urlCode = new URLSearchParams(window.location.search).get('join') || '';

  function handleSession(s) {
    setSession(s);
    // Clear the join code from URL once joined
    if (window.history.replaceState) window.history.replaceState({}, '', window.location.pathname);
    if (s !== 'solo' && s.mapId) setActiveMap(s.mapId);
  }

  if (!session) return <SessionLobby onSession={handleSession} onSolo={() => setSession('solo')} mapsConfig={MAPS_CONFIG} initialCode={urlCode} />;

  const isSolo = session === 'solo';
  const sessionId = isSolo ? null : session.id;
  const myName = isSolo ? 'Solo' : session.myName;
  const myColor = isSolo ? '#00e5ff' : session.myColor;

  if (activeMap) return <MapGuide mapId={activeMap} onBack={() => setActiveMap(null)} session={session} sessionId={sessionId} myName={myName} myColor={myColor} />;
  return <HomeScreen onSelect={setActiveMap} />;
}
