/**
 * The GitHub Pages sub-path ("/CV-WEB"), or "" locally and in unit tests.
 * next/link adds it automatically, but plain <a> links to files in public/ and
 * next/image `src` do not, so those go through `withBasePath`.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBasePath = (path: string) => `${BASE_PATH}${path}`;
