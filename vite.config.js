import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// base "./" makes the build portable for static hosting (Cloudflare / GitHub Pages)
export default defineConfig({
    base: "./",
    plugins: [react()],
    server: { host: true, port: 5173 },
});
