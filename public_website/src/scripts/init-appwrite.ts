/**
 * Appwrite database + storage initializer.
 *
 * Creates aruna_devi_db, all 9 collections with their attribute schemas,
 * and 2 storage buckets (images + videos).
 *
 * IDEMPOTENT — safely skips any resource that already exists.
 *
 * Usage:
 *   npx tsx src/scripts/init-appwrite.ts
 *
 * Requires .env in project root with:
 *   NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID,
 *   APPWRITE_API_KEY, NEXT_PUBLIC_APPWRITE_DATABASE_ID
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import {
  Client,
  Databases,
  Storage,
  Permission,
  Role,
  IndexType,
} from "node-appwrite";

// ── Config ────────────────────────────────────────────────────────
const ENDPOINT   = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const API_KEY    = process.env.APPWRITE_API_KEY!;
const DB_ID      = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

if (!ENDPOINT || !PROJECT_ID || !API_KEY || !DB_ID) {
  console.error("❌  Missing required environment variables. Check your .env file.");
  process.exit(1);
}

// ── SDK init ──────────────────────────────────────────────────────
const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const db      = new Databases(client);
const storage = new Storage(client);

// ── Helpers ───────────────────────────────────────────────────────

/** Catch "already exists" (409) and plan/resource-limit (403/400) errors and continue; re-throw others. */
async function safe<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    const result = await fn();
    console.log(`  ✅  ${label}`);
    return result;
  } catch (err: unknown) {
    const code  = (err as { code?: number }).code;
    const type  = (err as { type?: string }).type;
    // 409: resource already exists
    if (code === 409) {
      console.log(`  ⏭   ${label} (already exists — skipped)`);
      return null;
    }
    // 403 additional_resource_not_allowed: plan limit on databases
    if (code === 403 && type === "additional_resource_not_allowed") {
      console.log(`  ⏭   ${label} (plan limit — resource already exists, skipped)`);
      return null;
    }
    // 400 attribute_limit_exceeded: collection already has max attributes (free plan = 15)
    if (code === 400 && type === "attribute_limit_exceeded") {
      console.log(`  ⏭   ${label} (attribute limit reached — skipped)`);
      return null;
    }
    console.error(`  ❌  ${label}`, err);
    throw err;
  }
}

// ── Standard permissions for all collections ──────────────────────
// Anyone can read; only authenticated users can write.
const defaultPerms = [
  Permission.read(Role.any()),
  Permission.create(Role.users()),
  Permission.update(Role.users()),
  Permission.delete(Role.users()),
];

// ── Main ──────────────────────────────────────────────────────────
async function main() {
  console.log("\n🔧  Aruna Devi — Appwrite initializer\n");

  // 1. Create database
  console.log("📦  Database");
  await safe("aruna_devi_db", () =>
    db.create(DB_ID, "Aruna Devi DB")
  );

  // ──────────────────────────────────────────────────────────────
  // 2. PROJECTS collection
  // ──────────────────────────────────────────────────────────────
  console.log("\n📂  Creating collections…\n");

  await safe("projects collection", () =>
    db.createCollection(DB_ID, "projects", "Projects", defaultPerms)
  );
  const projectAttrs: Array<() => Promise<unknown>> = [
    () => db.createStringAttribute(DB_ID, "projects", "slug",          255, true),
    () => db.createStringAttribute(DB_ID, "projects", "title",         255, true),
    () => db.createStringAttribute(DB_ID, "projects", "location",      100, true),
    () => db.createStringAttribute(DB_ID, "projects", "category",       50, true),
    () => db.createStringAttribute(DB_ID, "projects", "client",        255, true),
    () => db.createStringAttribute(DB_ID, "projects", "area",          100, true),
    () => db.createStringAttribute(DB_ID, "projects", "duration",      100, true),
    () => db.createStringAttribute(DB_ID, "projects", "description",  5000, true),
    () => db.createStringAttribute(DB_ID, "projects", "challenges",   5000, true),
    () => db.createStringAttribute(DB_ID, "projects", "solutions",    5000, true),
    () => db.createStringAttribute(DB_ID, "projects", "key_outcomes",10000, true),
    () => db.createStringAttribute(DB_ID, "projects", "image_id",      255, true),
    () => db.createStringAttribute(DB_ID, "projects", "hero_media_id", 255, false),
    () => db.createStringAttribute(DB_ID, "projects", "gallery_ids",  5000, false),
    () => db.createBooleanAttribute(DB_ID, "projects", "is_featured",       true),
    () => db.createIntegerAttribute(DB_ID, "projects", "sort_order",         true),
    () => db.createStringAttribute(DB_ID, "projects", "status",         20, true),
  ];
  for (const fn of projectAttrs) {
    const parts = fn.toString().match(/"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"/);
    const label = parts ? `projects.${parts[3]}` : "projects.attr";
    await safe(label, fn);
  }

  // ──────────────────────────────────────────────────────────────
  // 3. SERVICES
  // ──────────────────────────────────────────────────────────────
  await safe("services collection", () =>
    db.createCollection(DB_ID, "services", "Services", defaultPerms)
  );
  const serviceAttrs = [
    ["title",                255, true],
    ["description",         1000, true],
    ["extended_description",5000, true],
    ["image_id",             255, true],
    ["status",                20, true],
  ] as const;
  for (const [name, size, req] of serviceAttrs) {
    await safe(`services.${name}`, () =>
      db.createStringAttribute(DB_ID, "services", name, size, req)
    );
  }
  await safe("services.sort_order", () =>
    db.createIntegerAttribute(DB_ID, "services", "sort_order", true)
  );

  // ──────────────────────────────────────────────────────────────
  // 4. TEAM MEMBERS
  // ──────────────────────────────────────────────────────────────
  await safe("team_members collection", () =>
    db.createCollection(DB_ID, "team_members", "Team Members", defaultPerms)
  );
  await safe("team_members.name",       () => db.createStringAttribute(DB_ID, "team_members", "name",      255, true));
  await safe("team_members.role",       () => db.createStringAttribute(DB_ID, "team_members", "role",      255, false));
  await safe("team_members.image_id",   () => db.createStringAttribute(DB_ID, "team_members", "image_id",  255, true));
  await safe("team_members.sort_order", () => db.createIntegerAttribute(DB_ID, "team_members", "sort_order", true));
  await safe("team_members.status",     () => db.createStringAttribute(DB_ID, "team_members", "status",    20, true));

  // ──────────────────────────────────────────────────────────────
  // 5. REVIEWS
  // ──────────────────────────────────────────────────────────────
  await safe("reviews collection", () =>
    db.createCollection(DB_ID, "reviews", "Reviews", defaultPerms)
  );
  await safe("reviews.client_name",     () => db.createStringAttribute(DB_ID, "reviews", "client_name",     255, true));
  await safe("reviews.client_image_id", () => db.createStringAttribute(DB_ID, "reviews", "client_image_id", 255, false));
  await safe("reviews.review_text",     () => db.createStringAttribute(DB_ID, "reviews", "review_text",    1000, true));
  await safe("reviews.rating",          () => db.createIntegerAttribute(DB_ID, "reviews", "rating",              true, 1, 5));
  await safe("reviews.sort_order",      () => db.createIntegerAttribute(DB_ID, "reviews", "sort_order",          true));
  await safe("reviews.status",          () => db.createStringAttribute(DB_ID, "reviews", "status",           20, true));

  // ──────────────────────────────────────────────────────────────
  // 6. LEADS
  // ──────────────────────────────────────────────────────────────
  await safe("leads collection", () =>
    db.createCollection(DB_ID, "leads", "Leads", defaultPerms)
  );
  await safe("leads.type",       () => db.createStringAttribute(DB_ID, "leads", "type",        20, true));
  await safe("leads.name",       () => db.createStringAttribute(DB_ID, "leads", "name",       255, true));
  await safe("leads.phone",      () => db.createStringAttribute(DB_ID, "leads", "phone",       30, true));
  await safe("leads.location",   () => db.createStringAttribute(DB_ID, "leads", "location",   255, false));
  await safe("leads.role",       () => db.createStringAttribute(DB_ID, "leads", "role",        50, false));
  await safe("leads.skills",     () => db.createStringAttribute(DB_ID, "leads", "skills",    1000, false));
  await safe("leads.message",    () => db.createStringAttribute(DB_ID, "leads", "message",   2000, false));
  await safe("leads.status",     () => db.createStringAttribute(DB_ID, "leads", "status",      20, true));
  await safe("leads.admin_note", () => db.createStringAttribute(DB_ID, "leads", "admin_note",2000, false));

  // ──────────────────────────────────────────────────────────────
  // 7. HERO SLIDES
  // ──────────────────────────────────────────────────────────────
  await safe("hero_slides collection", () =>
    db.createCollection(DB_ID, "hero_slides", "Hero Slides", defaultPerms)
  );
  await safe("hero_slides.category",   () => db.createStringAttribute(DB_ID, "hero_slides", "category",   100, true));
  await safe("hero_slides.title",      () => db.createStringAttribute(DB_ID, "hero_slides", "title",      255, true));
  await safe("hero_slides.media_id",   () => db.createStringAttribute(DB_ID, "hero_slides", "media_id",   255, true));
  await safe("hero_slides.media_type", () => db.createStringAttribute(DB_ID, "hero_slides", "media_type",  10, true));
  await safe("hero_slides.sort_order", () => db.createIntegerAttribute(DB_ID, "hero_slides", "sort_order",     true));
  await safe("hero_slides.status",     () => db.createStringAttribute(DB_ID, "hero_slides", "status",      20, true));

  // ──────────────────────────────────────────────────────────────
  // 8. ABOUT CONTENT (single document)
  // ──────────────────────────────────────────────────────────────
  await safe("about_content collection", () =>
    db.createCollection(DB_ID, "about_content", "About Content", defaultPerms)
  );
  await safe("about_content.section_label", () => db.createStringAttribute(DB_ID, "about_content", "section_label", 100, true));
  await safe("about_content.heading",       () => db.createStringAttribute(DB_ID, "about_content", "heading",       255, true));
  await safe("about_content.description",   () => db.createStringAttribute(DB_ID, "about_content", "description",  5000, true));
  await safe("about_content.image_id",      () => db.createStringAttribute(DB_ID, "about_content", "image_id",      255, false));
  await safe("about_content.stats",         () => db.createStringAttribute(DB_ID, "about_content", "stats",        2000, true));

  // ──────────────────────────────────────────────────────────────
  // 9. SITE SETTINGS
  // ──────────────────────────────────────────────────────────────
  await safe("site_settings collection", () =>
    db.createCollection(DB_ID, "site_settings", "Site Settings", defaultPerms)
  );
  await safe("site_settings.key",   () => db.createStringAttribute(DB_ID, "site_settings", "key",    100, true));
  await safe("site_settings.value", () => db.createStringAttribute(DB_ID, "site_settings", "value", 2000, true));
  await safe("site_settings.group", () => db.createStringAttribute(DB_ID, "site_settings", "group",  50, true));

  // ──────────────────────────────────────────────────────────────
  // 10. SOFTWARE ITEMS
  // ──────────────────────────────────────────────────────────────
  await safe("software_items collection", () =>
    db.createCollection(DB_ID, "software_items", "Software Items", defaultPerms)
  );
  await safe("software_items.name",       () => db.createStringAttribute(DB_ID, "software_items", "name",       100, true));
  await safe("software_items.image_id",   () => db.createStringAttribute(DB_ID, "software_items", "image_id",   255, true));
  await safe("software_items.sort_order", () => db.createIntegerAttribute(DB_ID, "software_items", "sort_order",     true));
  await safe("software_items.status",     () => db.createStringAttribute(DB_ID, "software_items", "status",      20, true));

  // ──────────────────────────────────────────────────────────────
  // 11. STORAGE BUCKETS
  // ──────────────────────────────────────────────────────────────
  console.log("\n🪣  Creating storage buckets…\n");

  await safe("images bucket", () =>
    storage.createBucket(
      "images",
      "Images",
      defaultPerms,
      false,
      false,
      10 * 1024 * 1024, // 10 MB
      ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"]
    )
  );

  await safe("videos bucket", () =>
    storage.createBucket(
      "videos",
      "Videos",
      defaultPerms,
      false,
      false,
      100 * 1024 * 1024, // 100 MB
      ["video/mp4", "video/webm", "video/quicktime", "video/ogg"]
    )
  );

  // ──────────────────────────────────────────────────────────────
  // 12. INDEXES (for fast queries)
  // ──────────────────────────────────────────────────────────────
  console.log("\n🔍  Creating indexes…\n");

  await safe("projects index: slug",   () => db.createIndex(DB_ID, "projects",      "idx_slug",       IndexType.Unique, ["slug"]));
  await safe("projects index: status", () => db.createIndex(DB_ID, "projects",      "idx_status",     IndexType.Key,    ["status"]));
  await safe("leads index: type",      () => db.createIndex(DB_ID, "leads",         "idx_type",       IndexType.Key,    ["type"]));
  await safe("leads index: status",    () => db.createIndex(DB_ID, "leads",         "idx_status",     IndexType.Key,    ["status"]));
  await safe("reviews index: status",  () => db.createIndex(DB_ID, "reviews",       "idx_status",     IndexType.Key,    ["status"]));
  await safe("settings index: key",    () => db.createIndex(DB_ID, "site_settings", "idx_key",        IndexType.Unique, ["key"]));
  await safe("settings index: group",  () => db.createIndex(DB_ID, "site_settings", "idx_group",      IndexType.Key,    ["group"]));

  console.log("\n✅  Appwrite initialization complete!\n");
}

main().catch((err) => {
  console.error("\n❌  Initialization failed:", err);
  process.exit(1);
});
