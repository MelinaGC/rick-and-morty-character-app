import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3100",
    specPattern: "src/cypress/e2e/**/*.cy.{ts,tsx}",
    supportFile: false,
    video: false,
  },
});
