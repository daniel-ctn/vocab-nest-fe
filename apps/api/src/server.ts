import { createApp } from "./app";

const port = Number(process.env.PORT ?? 4000);
const app = createApp();

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/docs`);
});
