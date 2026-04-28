import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://72c92a987d18b21ca730c61632705c91@o4511298879881216.ingest.us.sentry.io/4511298904850432",
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  includeLocalVariables: true,
  enableLogs: true,
});
