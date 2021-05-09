import { setupServer } from "msw/node";

export const mswServer = setupServer();

export const mswServerListen = () => {
  return mswServer.listen({
    onUnhandledRequest: "warn",
  });
};
