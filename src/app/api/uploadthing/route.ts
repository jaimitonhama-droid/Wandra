import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

console.log("--- UPLOADTHING DIAGNOSTICS ---");
console.log("Token currently seen by Next.js:", process.env.UPLOADTHING_TOKEN ? (process.env.UPLOADTHING_TOKEN.substring(0, 20) + "...") : "MISSING!");

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  }
});
