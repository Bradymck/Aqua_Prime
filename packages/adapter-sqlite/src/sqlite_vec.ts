import { elizaLogger } from "@ai16z/eliza";

export async function loadExtensions(db: any) {
  elizaLogger.log("sqlite-vec extensions are currently disabled.");
}

/**
 * @param db - An instance of better - sqlite3 Database
 */
export function load(db: any) {
  loadExtensions(db);
}
