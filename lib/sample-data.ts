import type { Project } from "@/lib/types";

// Read-only showcase data used when no database is configured yet.
// Once DATABASE_URL is set and seeded, the real data takes over.

const now = "2026-02-01T10:00:00.000Z";

function pic(seed: string, w = 1200, h = 800) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export const sampleProjects: Project[] = [
  {
    id: "sample-1",
    slug: "ridfrom-ticketing",
    title: "Ridfrom Ticketing",
    summary: "A full-stack event ticketing platform built across two study modules.",
    description:
      "Ridfrom started as a database course assignment and grew into my largest project at VOCO. It handles event creation, seat maps, and QR check-in at the door.\n\nThe backend is a REST API over PostgreSQL with row-level checks so an organiser can only ever touch their own events. The front desk app works offline and syncs scans once it reconnects.",
    category: "Web",
    tags: ["Next.js", "PostgreSQL", "REST API", "Auth"],
    coverImage: pic("ridform-cover"),
    gallery: [
      { url: pic("ridform-seatmap", 1400, 900), caption: "Interactive seat map editor" },
      { url: pic("ridform-scan", 1400, 900), caption: "Door check-in with QR scanning" },
    ],
    links: [
      { label: "Live demo", url: "https://example.com/ridform" },
      { label: "Source", url: "https://github.com/MHenri27" },
    ],
    year: 2026,
    featured: true,
    published: true,
    sortOrder: 0,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sample-2",
    slug: "greenhouse-controller",
    title: "Greenhouse Controller",
    summary: "An ESP32 climate controller that keeps a classroom greenhouse in range.",
    description:
      "Built for the embedded systems module. A microcontroller reads temperature, humidity, and soil moisture, then drives a fan and a pump to hold target conditions.\n\nReadings stream to a small dashboard so the class can watch trends over a week and tune the thresholds without reflashing the board.",
    category: "Hardware",
    tags: ["ESP32", "C++", "MQTT", "Sensors"],
    coverImage: pic("greenhouse-cover"),
    gallery: [
      { url: pic("greenhouse-board", 1400, 900), caption: "The wired-up controller board" },
      { url: pic("greenhouse-graph", 1400, 900), caption: "A week of climate readings" },
    ],
    links: [{ label: "Write-up", url: "https://example.com/greenhouse" }],
    year: 2025,
    featured: true,
    published: true,
    sortOrder: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sample-3",
    slug: "voco-timetable",
    title: "VOCO Timetable Redesign",
    summary: "A faster, phone-first reader for the school timetable feed.",
    description:
      "The official timetable was hard to read on a phone, so I rebuilt the front end over the same data feed. It remembers your group, highlights the next lesson, and works without a signal once it has loaded.\n\nThis was a UX course project, so most of the work went into the information hierarchy and the empty states.",
    category: "Design",
    tags: ["UX", "TypeScript", "PWA", "Accessibility"],
    coverImage: pic("timetable-cover"),
    gallery: [{ url: pic("timetable-week", 1400, 900), caption: "Week view on mobile" }],
    links: [{ label: "Prototype", url: "https://example.com/timetable" }],
    year: 2025,
    featured: false,
    published: true,
    sortOrder: 2,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sample-4",
    slug: "pixel-forge",
    title: "Pixel Forge",
    summary: "A tiny 2D platformer made to learn game loops and collision.",
    description:
      "A side project from the game programming elective. It has three handmade levels, a sprite editor, and a level format I could hand-edit as plain text.\n\nThe point was not the game but understanding fixed timesteps, tile collision, and keeping input responsive at low frame rates.",
    category: "Games",
    tags: ["Godot", "GDScript", "Game loop"],
    coverImage: pic("pixelforge-cover"),
    gallery: [{ url: pic("pixelforge-level", 1400, 900), caption: "Level two, the cave" }],
    links: [{ label: "Play in browser", url: "https://example.com/pixelforge" }],
    year: 2024,
    featured: false,
    published: true,
    sortOrder: 3,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sample-5",
    slug: "shelf-inventory",
    title: "Shelf Inventory API",
    summary: "A documented REST API for a small shop's stock, with a seeded demo.",
    description:
      "A backend-only assignment. The API tracks products, batches, and stock movements, and refuses to let stock go negative.\n\nEverything is covered by integration tests and documented with OpenAPI so the front-end students in the group could build against it without asking me questions.",
    category: "Systems",
    tags: ["Node.js", "OpenAPI", "Testing", "Docker"],
    coverImage: pic("shelf-cover"),
    gallery: [{ url: pic("shelf-docs", 1400, 900), caption: "The generated API docs" }],
    links: [{ label: "API docs", url: "https://example.com/shelf" }],
    year: 2025,
    featured: false,
    published: true,
    sortOrder: 4,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "sample-6",
    slug: "studio-identity",
    title: "Studio Identity Kit",
    summary: "A small brand system: logo, type scale, and motion guidelines.",
    description:
      "A design module where we invented a studio and gave it a complete identity. I built a logo that works at favicon size, a type scale, and a short motion spec for how things should move.\n\nThe deliverable was a living style sheet rather than a static PDF, so the rules stay close to the code.",
    category: "Design",
    tags: ["Branding", "Figma", "Motion", "Type"],
    coverImage: pic("studio-cover"),
    gallery: [
      { url: pic("studio-logo", 1400, 900), caption: "Logo construction grid" },
      { url: pic("studio-type", 1400, 900), caption: "The type scale in use" },
    ],
    links: [{ label: "Style sheet", url: "https://example.com/studio" }],
    year: 2024,
    featured: false,
    published: true,
    sortOrder: 5,
    createdAt: now,
    updatedAt: now,
  },
];
