// Compatibility shim: the real axios instance now lives in ./client (TypeScript).
// Existing modules still import from './api'; keep this re-export until they are
// migrated to import '@/api/client' directly.
export { default } from './client';
