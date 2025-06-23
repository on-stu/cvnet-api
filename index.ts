// index.ts
import { CVNetClient } from "./cvnet-client.js";

const client = new CVNetClient();

// Wait a bit for connection to establish
setTimeout(async () => {
  const loginSuccess = await client.login("minsu0523", "cvnet");
  if (loginSuccess) {
    client.register("18");
    client.controlLight(1, "1", "1");
  }
}, 2000);
