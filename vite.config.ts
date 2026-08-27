import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function mirrorPortalAtPersonalRoutes(): Plugin {
  return {
    name: "mirror-portal-at-me",
    enforce: "post",
    generateBundle(_, bundle) {
      const indexHtml = bundle["index.html"];

      if (!indexHtml || indexHtml.type !== "asset") {
        throw new Error("Unable to create the /me mirror: index.html was not generated.");
      }

      for (const fileName of ["me/index.html", "me/me/index.html"]) {
        this.emitFile({
          type: "asset",
          fileName,
          source: indexHtml.source,
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), mirrorPortalAtPersonalRoutes()],
  base: "/",
});
