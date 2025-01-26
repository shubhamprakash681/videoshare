import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import reduxStore from "./store/store.ts";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import {
  ChannelProfilePage,
  DashboardPage,
  EditPlaylistPage,
  HomePage,
  LoginPage,
  SignupPage,
  VideoPlaybackPage,
} from "./pages/index.ts";
import { Toaster } from "./components/ui/toaster.tsx";
import ProtectedAuthLayout from "./components/auth/ProtectedAuthLayout.tsx";
import { PathConstants } from "./lib/variables.ts";

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path={PathConstants.HOME} element={<App />}>
      <Route
        path={PathConstants.HOME}
        element={
          <ProtectedAuthLayout authentication={false}>
            <HomePage />
          </ProtectedAuthLayout>
        }
      />
      <Route
        path={PathConstants.VIDEO}
        element={
          <ProtectedAuthLayout authentication={false}>
            <VideoPlaybackPage />
          </ProtectedAuthLayout>
        }
      />
      <Route
        path={PathConstants.PLAYLIST}
        element={
          <ProtectedAuthLayout authentication={false}>
            <VideoPlaybackPage />
          </ProtectedAuthLayout>
        }
      />
      <Route
        path={PathConstants.DASHBOARD}
        element={
          <ProtectedAuthLayout authentication>
            <DashboardPage />
          </ProtectedAuthLayout>
        }
      />
      <Route
        path={PathConstants.MYCHANNEL}
        element={
          <ProtectedAuthLayout authentication>
            <ChannelProfilePage />
          </ProtectedAuthLayout>
        }
      />
      <Route
        path={PathConstants.CHANNEL}
        element={
          <ProtectedAuthLayout authentication>
            <ChannelProfilePage />
          </ProtectedAuthLayout>
        }
      />
      <Route
        path={PathConstants.EDITPLAYLIST}
        element={
          <ProtectedAuthLayout authentication>
            <EditPlaylistPage />
          </ProtectedAuthLayout>
        }
      />
      <Route
        path={PathConstants.SIGNUP}
        element={
          <ProtectedAuthLayout authentication={false}>
            <SignupPage />
          </ProtectedAuthLayout>
        }
      />
      <Route
        path={PathConstants.LOGIN}
        element={
          <ProtectedAuthLayout authentication={false}>
            <LoginPage />
          </ProtectedAuthLayout>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={reduxStore}>
      <RouterProvider router={appRouter} />

      <Toaster />
    </Provider>
  </StrictMode>
);
