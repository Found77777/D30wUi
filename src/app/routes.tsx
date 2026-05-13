import { createHashRouter } from "react-router";
import { MainApp } from "./App";
import { FollowModePage } from "./pages/FollowModePage";

export const router = createHashRouter([
  {
    path: "/",
    element: <MainApp />,
  },
  {
    path: "/follow-mode",
    element: <FollowModePage />,
  },
]);
