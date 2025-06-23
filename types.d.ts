declare module "@kiwigrid/vertxbus-client" {
  class EventBus {
    constructor(url: string, options?: any);
    onopen: (() => void) | null;
    onclose: (() => void) | null;
    login(
      username: string,
      password: string,
      replyHandler: (reply: any) => void
    ): void;
    send(
      address: string,
      message: any,
      replyHandler?: (reply: any) => void
    ): void;
    publish(address: string, message: any): void;
    registerHandler(
      address: string,
      handler: (message: any, replyHandler?: (reply: any) => void) => void
    ): void;
    unregisterHandler(
      address: string,
      handler: (message: any, replyHandler?: (reply: any) => void) => void
    ): void;
    close(): void;
    readyState(): number;
    sessionID?: string;
  }

  namespace EventBus {
    const CONNECTING: number;
    const OPEN: number;
    const CLOSING: number;
    const CLOSED: number;
  }

  export = EventBus;
}
