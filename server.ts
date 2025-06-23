// server.ts
import express from "express";
import { CVNetClient } from "./cvnet-client.ts";

const app = express();
const port = 2222;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize CVNet client
const client = new CVNetClient();

// Wait for connection and login
setTimeout(async () => {
  const loginSuccess = await client.login("minsu0523", "cvnet");
  if (loginSuccess) {
    console.log("✅ Server ready to control lights");
    client.register("18");
  } else {
    console.error("❌ Failed to login to CVNet");
  }
}, 2000);

// POST endpoint to control lights
app.post("/control-light", (req: any, res: any) => {
  const { onoff, zone, number } = req.body;
  console.log(req.body);

  // Validate required parameters
  if (onoff === undefined || !zone || !number) {
    return res.status(400).json({
      error: "Missing required parameters",
      required: ["onoff", "zone", "number"],
      received: { onoff, zone, number },
    });
  }

  // Validate onoff value
  if (onoff !== 0 && onoff !== 1) {
    return res.status(400).json({
      error: "Invalid onoff value",
      message: "onoff must be 0 (off) or 1 (on)",
      received: onoff,
    });
  }

  try {
    // Control the light
    client.controlLight(onoff, zone, number);

    res.json({
      success: true,
      message: `Light ${onoff === 1 ? "turned ON" : "turned OFF"}`,
      zone: zone,
      number: number,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error controlling light:", error);
    res.status(500).json({
      error: "Failed to control light",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// GET endpoint to check server status
app.get("/status", (req: any, res: any) => {
  res.json({
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      "POST /control-light": "Control lights with onoff, zone, and number",
      "GET /status": "Check server status",
    },
  });
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📝 POST /control-light - Control lights`);
  console.log(`📊 GET /status - Check server status`);
});

export default app;
