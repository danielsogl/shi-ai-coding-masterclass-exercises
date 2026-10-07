import { createApp } from "./app.ts";

const port = Number(process.env["PORT"] ?? 3000);

createApp().listen(port, (err) => {
  if (err) throw err;
  console.log(`Tasks API listening on http://localhost:${port}`);
});
