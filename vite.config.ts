import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

function mirrorPortalAtMe(): Plugin {
  return {
    name: "mirror-portal-at-me",
    enforce: "post",
    generateBundle(_, bundle) {
      const indexHtml = bundle["index.html"];

      if (!indexHtml || indexHtml.type !== "asset") {
        throw new Error("Unable to create the /me mirror: index.html was not generated.");
      }

      this.emitFile({
        type: "asset",
        fileName: "me/index.html",
        source: indexHtml.source,
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), mirrorPortalAtMe()],
  base: "/",
});
