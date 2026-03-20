/**
 * CRUD helper functions for all 9 Appwrite collections + storage helpers.
 *
 * Each collection exposes:  list{X}(), get{X}(id), create{X}(data), update{X}(id, data), delete{X}(id)
 * Storage helpers:           uploadFile(), deleteFile(), getFileUrl()
 */

import { databases, storage, DB_ID, getFilePreviewUrl, getFileViewUrl } from "@/lib/appwrite";
import {
  PROJECTS_COL,
  SERVICES_COL,
  TEAM_COL,
  REVIEWS_COL,
  LEADS_COL,
  ABOUT_COL,
  HERO_SLIDES_COL,
  SOFTWARE_COL,
  SITE_SETTINGS_COL,
  IMAGES_BUCKET,
} from "@/lib/appwrite";
import { ID, Query, type Models } from "appwrite";

// ── Generic helpers ───────────────────────────────────────────────

type AnyDoc = Models.Document;

// ═══════════════════════════════════════════════════════════════════
// 1. PROJECTS
// ═══════════════════════════════════════════════════════════════════

export async function listProjects(filters?: string[]): Promise<AnyDoc[]> {
  const res = await databases.listDocuments(DB_ID, PROJECTS_COL, [
    Query.orderAsc("sort_order"),
    ...(filters ?? []),
  ]);
  return res.documents;
}

export async function getProject(id: string): Promise<AnyDoc> {
  return databases.getDocument(DB_ID, PROJECTS_COL, id);
}

export async function getProjectBySlug(slug: string): Promise<AnyDoc | null> {
  const res = await databases.listDocuments(DB_ID, PROJECTS_COL, [
    Query.equal("slug", slug),
    Query.limit(1),
  ]);
  return res.documents[0] ?? null;
}

export async function createProject(data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.createDocument(DB_ID, PROJECTS_COL, ID.unique(), data);
}

export async function updateProject(id: string, data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.updateDocument(DB_ID, PROJECTS_COL, id, data);
}

export async function deleteProject(id: string): Promise<void> {
  await databases.deleteDocument(DB_ID, PROJECTS_COL, id);
}

// ═══════════════════════════════════════════════════════════════════
// 2. SERVICES
// ═══════════════════════════════════════════════════════════════════

export async function listServices(filters?: string[]): Promise<AnyDoc[]> {
  const res = await databases.listDocuments(DB_ID, SERVICES_COL, [
    Query.orderAsc("sort_order"),
    ...(filters ?? []),
  ]);
  return res.documents;
}

export async function getService(id: string): Promise<AnyDoc> {
  return databases.getDocument(DB_ID, SERVICES_COL, id);
}

export async function createService(data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.createDocument(DB_ID, SERVICES_COL, ID.unique(), data);
}

export async function updateService(id: string, data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.updateDocument(DB_ID, SERVICES_COL, id, data);
}

export async function deleteService(id: string): Promise<void> {
  await databases.deleteDocument(DB_ID, SERVICES_COL, id);
}

// ═══════════════════════════════════════════════════════════════════
// 3. TEAM MEMBERS
// ═══════════════════════════════════════════════════════════════════

export async function listTeamMembers(filters?: string[]): Promise<AnyDoc[]> {
  const res = await databases.listDocuments(DB_ID, TEAM_COL, [
    Query.orderAsc("sort_order"),
    ...(filters ?? []),
  ]);
  return res.documents;
}

export async function getTeamMember(id: string): Promise<AnyDoc> {
  return databases.getDocument(DB_ID, TEAM_COL, id);
}

export async function createTeamMember(data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.createDocument(DB_ID, TEAM_COL, ID.unique(), data);
}

export async function updateTeamMember(id: string, data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.updateDocument(DB_ID, TEAM_COL, id, data);
}

export async function deleteTeamMember(id: string): Promise<void> {
  await databases.deleteDocument(DB_ID, TEAM_COL, id);
}

// ═══════════════════════════════════════════════════════════════════
// 4. REVIEWS
// ═══════════════════════════════════════════════════════════════════

export async function listReviews(filters?: string[]): Promise<AnyDoc[]> {
  const res = await databases.listDocuments(DB_ID, REVIEWS_COL, [
    Query.orderAsc("sort_order"),
    ...(filters ?? []),
  ]);
  return res.documents;
}

export async function getReview(id: string): Promise<AnyDoc> {
  return databases.getDocument(DB_ID, REVIEWS_COL, id);
}

export async function createReview(data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.createDocument(DB_ID, REVIEWS_COL, ID.unique(), data);
}

export async function updateReview(id: string, data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.updateDocument(DB_ID, REVIEWS_COL, id, data);
}

export async function deleteReview(id: string): Promise<void> {
  await databases.deleteDocument(DB_ID, REVIEWS_COL, id);
}

// ═══════════════════════════════════════════════════════════════════
// 5. LEADS
// ═══════════════════════════════════════════════════════════════════

export async function listLeads(filters?: string[]): Promise<AnyDoc[]> {
  const res = await databases.listDocuments(DB_ID, LEADS_COL, [
    Query.orderDesc("$createdAt"),
    ...(filters ?? []),
  ]);
  return res.documents;
}

export async function getLead(id: string): Promise<AnyDoc> {
  return databases.getDocument(DB_ID, LEADS_COL, id);
}

export async function createLead(data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.createDocument(DB_ID, LEADS_COL, ID.unique(), data);
}

export async function updateLead(id: string, data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.updateDocument(DB_ID, LEADS_COL, id, data);
}

export async function deleteLead(id: string): Promise<void> {
  await databases.deleteDocument(DB_ID, LEADS_COL, id);
}

// ═══════════════════════════════════════════════════════════════════
// 6. ABOUT CONTENT (single document)
// ═══════════════════════════════════════════════════════════════════

export async function getAboutContent(): Promise<AnyDoc | null> {
  const res = await databases.listDocuments(DB_ID, ABOUT_COL, [Query.limit(1)]);
  return res.documents[0] ?? null;
}

export async function createAboutContent(data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.createDocument(DB_ID, ABOUT_COL, ID.unique(), data);
}

export async function updateAboutContent(id: string, data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.updateDocument(DB_ID, ABOUT_COL, id, data);
}

// ═══════════════════════════════════════════════════════════════════
// 7. HERO SLIDES
// ═══════════════════════════════════════════════════════════════════

export async function listHeroSlides(filters?: string[]): Promise<AnyDoc[]> {
  const res = await databases.listDocuments(DB_ID, HERO_SLIDES_COL, [
    Query.orderAsc("sort_order"),
    ...(filters ?? []),
  ]);
  return res.documents;
}

export async function getHeroSlide(id: string): Promise<AnyDoc> {
  return databases.getDocument(DB_ID, HERO_SLIDES_COL, id);
}

export async function createHeroSlide(data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.createDocument(DB_ID, HERO_SLIDES_COL, ID.unique(), data);
}

export async function updateHeroSlide(id: string, data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.updateDocument(DB_ID, HERO_SLIDES_COL, id, data);
}

export async function deleteHeroSlide(id: string): Promise<void> {
  await databases.deleteDocument(DB_ID, HERO_SLIDES_COL, id);
}

// ═══════════════════════════════════════════════════════════════════
// 8. SOFTWARE ITEMS
// ═══════════════════════════════════════════════════════════════════

export async function listSoftwareItems(filters?: string[]): Promise<AnyDoc[]> {
  const res = await databases.listDocuments(DB_ID, SOFTWARE_COL, [
    Query.orderAsc("sort_order"),
    ...(filters ?? []),
  ]);
  return res.documents;
}

export async function getSoftwareItem(id: string): Promise<AnyDoc> {
  return databases.getDocument(DB_ID, SOFTWARE_COL, id);
}

export async function createSoftwareItem(data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.createDocument(DB_ID, SOFTWARE_COL, ID.unique(), data);
}

export async function updateSoftwareItem(id: string, data: Record<string, unknown>): Promise<AnyDoc> {
  return databases.updateDocument(DB_ID, SOFTWARE_COL, id, data);
}

export async function deleteSoftwareItem(id: string): Promise<void> {
  await databases.deleteDocument(DB_ID, SOFTWARE_COL, id);
}

// ═══════════════════════════════════════════════════════════════════
// 9. SITE SETTINGS (key-value store)
// ═══════════════════════════════════════════════════════════════════

export async function listSiteSettings(group?: string): Promise<AnyDoc[]> {
  const queries: string[] = [];
  if (group) queries.push(Query.equal("group", group));
  const res = await databases.listDocuments(DB_ID, SITE_SETTINGS_COL, queries);
  return res.documents;
}

export async function getSiteSetting(key: string): Promise<AnyDoc | null> {
  const res = await databases.listDocuments(DB_ID, SITE_SETTINGS_COL, [
    Query.equal("key", key),
    Query.limit(1),
  ]);
  return res.documents[0] ?? null;
}

export async function upsertSiteSetting(
  key: string,
  value: string,
  group: string
): Promise<AnyDoc> {
  const existing = await getSiteSetting(key);
  if (existing) {
    return databases.updateDocument(DB_ID, SITE_SETTINGS_COL, existing.$id, {
      value: value as unknown as string,
    } as Record<string, unknown>);
  }
  return databases.createDocument(DB_ID, SITE_SETTINGS_COL, ID.unique(), {
    key,
    value,
    group,
  } as Record<string, unknown>);
}

export async function deleteSiteSetting(id: string): Promise<void> {
  await databases.deleteDocument(DB_ID, SITE_SETTINGS_COL, id);
}

// ═══════════════════════════════════════════════════════════════════
// STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════

/**
 * Uploads a file to the given Appwrite Storage bucket.
 * Returns the file document (includes $id for saving as *_id field).
 */
export async function uploadFile(
  bucketId: string,
  file: File,
  fileId?: string
): Promise<Models.File> {
  return storage.createFile(bucketId, fileId ?? ID.unique(), file);
}

/** Deletes a file from Appwrite Storage. */
export async function deleteFile(bucketId: string, fileId: string): Promise<void> {
  await storage.deleteFile(bucketId, fileId);
}

/**
 * Returns the appropriate URL for a stored file:
 * - Image files: preview URL (supports resize params)
 * - Video/other files: direct view URL
 */
export function getFileUrl(
  bucketId: string,
  fileId: string,
  width?: number,
  height?: number
): string {
  if (bucketId === IMAGES_BUCKET) {
    return getFilePreviewUrl(bucketId, fileId, width, height);
  }
  return getFileViewUrl(bucketId, fileId);
}
