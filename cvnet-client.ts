import EventBus from "@kiwigrid/vertxbus-client";

const WEBSOCKET_URL = "https://sk-51dr2.uasis.com:9099/devicecontrol";
const ID = "minsu0523";
const PASSWORD = "cvnet";

export class CVNetClient {
  private eb: any;
  private sessionID: string | null = null;
  private isConnected: boolean = false;

  constructor() {
    this.eb = new EventBus(WEBSOCKET_URL);
    this.eb.onopen = this.onOpen;
    this.eb.onclose = this.onClose;

    // Add missing login method to the EventBus instance
    this.eb.login = (
      username: string,
      password: string,
      replyHandler: (reply: any) => void
    ) => {
      this.eb.send(
        "vertx.basicauthmanager.login",
        { username: username, password: password },
        (reply: any) => {
          if (reply.status === "ok") {
            this.eb.sessionID = reply.sessionID;
          }
          if (replyHandler) {
            delete reply.sessionID;
            replyHandler(reply);
          }
        }
      );
    };
  }

  private onOpen = () => {
    console.log("✅ Connected to CVNet WebSocket");
    this.isConnected = true;
  };

  private onClose = () => {
    console.log("🔌 WebSocket closed");
    this.isConnected = false;
  };

  public login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isConnected) {
        console.error("❌ WebSocket not connected yet");
        resolve(false);
        return;
      }

      this.eb.login(username, password, (reply: any) => {
        console.log("🔐 Login response:", reply);
        if (reply.result) {
          console.log("🔐 Login success");
          this.sessionID = reply.sessionID ?? null;
          resolve(true);
        } else {
          console.error("❌ Login failed:", reply);
          resolve(false);
        }
      });
    });
  }

  public controlLight(onoff: 0 | 1, zone: string, number: string) {
    if (!this.isConnected) {
      console.log("⏳ Waiting for connection...");
      setTimeout(() => this.controlLight(onoff, zone, number), 1000);
      return;
    }

    const payload = {
      id: ID,
      remote_addr: "127.0.0.1",
      request: "control",
      number: number,
      onoff: String(onoff),
      brightness: "0",
      zone: zone,
    };

    console.log(payload);

    this.eb.publish("18", JSON.stringify(payload));
    console.log(`💡 Light ${onoff === 1 ? "ON" : "OFF"} command sent`);
  }

  public register(address: string) {
    if (!this.isConnected) {
      console.error("❌ WebSocket not connected yet");
      return;
    }

    this.eb.registerHandler(address, (msg: any) => {
      console.log("📩 Message received:", msg);
    });
    console.log(`📮 Registered to ${address}`);
  }
}
