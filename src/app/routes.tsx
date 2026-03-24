import { createBrowserRouter } from "react-router";
import { MainApp } from "./App";
import { FollowModePage } from "./pages/FollowModePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainApp />,
  },
  {
    path: "/follow-mode",
    element: <FollowModePage />,
  },
]);