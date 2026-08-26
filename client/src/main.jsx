import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import router from "./routes/AppRoutes";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </AuthProvider>
  </StrictMode>,
);
