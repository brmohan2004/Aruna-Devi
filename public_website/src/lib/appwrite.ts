/**
 * Appwrite client-side SDK configuration.
 *
 * Exports singleton instances of Client, Account, Databases, and Storage,
 * plus all collection/bucket ID constants and a file preview URL helper.
 */

import { Client, Account, Databases, Storage, ImageGravity } from "appwrite";

// ── Client singleton ──────────────────────────────────────────────
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client };

// ── Database / Collection / Bucket ID constants ───────────────────
export const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

export const PROJECTS_COL      = "projects";
export const SERVICES_COL      = "services";
export const TEAM_COL          = "team_members";
export const REVIEWS_COL       = "reviews";
export const LEADS_COL         = "leads";
export const ABOUT_COL         = "about_content";
export const HERO_SLIDES_COL   = "hero_slides";
export const SOFTWARE_COL      = "software_items";
export const SITE_SETTINGS_COL = "site_settings";

export const IMAGES_BUCKET = process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID!;
export const VIDEOS_BUCKET = process.env.NEXT_PUBLIC_APPWRITE_VIDEOS_BUCKET_ID!;

// ── File preview / view URL helpers ──────────────────────────────

/**
 * Returns an Appwrite Storage preview URL for an image file.
 * Falls back to the direct file view URL for non-image files (videos).
 */
export function getFilePreviewUrl(
  bucketId: string,
  fileId: string,
  width?: number,
  height?: number
): string {
  try {
    const url = storage.getFilePreview(
      bucketId,
      fileId,
      width,
      height,
      ImageGravity.Center,
      100
    );
    return url.toString();
  } catch {
    return getFileViewUrl(bucketId, fileId);
  }
}

/**
 * Returns an Appwrite Storage direct-view URL (for downloads / video src).
 */
export function getFileViewUrl(bucketId: string, fileId: string): string {
  return storage.getFileView(bucketId, fileId).toString();
}
