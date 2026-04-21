import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName =
  process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "Bufaloverde";

export default defineConfig({
  base: `/${repositoryName}/`,
  plugins: [react()],
});
