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
import { HomePage, LoginPage, SignupPage } from "./pages/index.ts";
import { Toaster } from "./components/ui/toaster.tsx";
import ProtectedAuthLayout from "./components/auth/ProtectedAuthLayout.tsx";

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        path="/"
        element={
          <ProtectedAuthLayout authentication={false}>
            <HomePage />
          </ProtectedAuthLayout>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedAuthLayout authentication={false}>
            <SignupPage />
          </ProtectedAuthLayout>
        }
      />
      <Route
        path="/login"
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
