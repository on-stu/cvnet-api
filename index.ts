// index.ts
import { CVNetClient } from "./cvnet-client.ts";

const client = new CVNetClient();

// Wait a bit for connection to establish
setTimeout(async () => {
  const loginSuccess = await client.login("minsu0523", "cvnet");
  let mode: 0 | 1 = 0;
  if (loginSuccess) {
    setInterval(() => {
      client.register("18");
      client.controlLight(mode, "1", "1");
      mode = mode === 0 ? 1 : 0;
    }, 1000);
  }
}, 2000);
