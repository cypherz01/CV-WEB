import { BASE_PATH } from "./base-path";

/**
 * The live site's absolute URL, with a trailing slash: "https://cypherz01.github.io/CV-WEB/".
 * Set SITE_ORIGIN (and BASE_PATH="") at build time for a custom domain (milestone M5).
 */
export const SITE_ORIGIN = process.env.SITE_ORIGIN ?? "https://cypherz01.github.io";
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}/`;
