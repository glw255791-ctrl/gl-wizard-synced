import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import { GeneralAnalysis } from "./components/pages/general-analysis/general-analysis";
import { MainMenu } from "./components/pages/main-menu/main-menu";
import { ReversalAnalysis } from "./components/pages/reversal-analysis/reversal-analysis";
import { ReversaReclassificationAnalysis } from "./components/pages/reversal-reclassification-analysis/reversal-reclassification-analysis";
import { LoginPage } from "./components/pages/auth/login/login";
import ProtectedRoute from "./components/routes/protected-route";
import { LogoutPage } from "./components/pages/auth/logout/logout";
import { UnauthorizedPage } from "./components/pages/auth/unauthorized/unauthorized";
import { LicenceExpiredPage } from "./components/pages/auth/licence-expired/licence-expired";
import { RegisterPage } from "./components/pages/auth/register/register";
import { RegisteredPage } from "./components/pages/auth/registered/registered";
import { NotFoundPage } from "./components/pages/auth/not-found/not-found";
import { UserManagementPage } from "./components/pages/user-management/user-management";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { UserManualPage } from "./components/pages/user-manual/user-manual";
function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          <Route path="/" element={<Navigate to={"/login"} />} />
          <Route element={<LoginPage />} path="/login" />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainMenu />
              </ProtectedRoute>
            }
          />

          {/* AUTH */}
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<LogoutPage />} path="/logout" />
          <Route element={<RegisteredPage />} path="/registered" />
          <Route element={<NotFoundPage />} path="*" />
          <Route element={<UnauthorizedPage />} path="/unauthorized" />
          <Route element={<LicenceExpiredPage />} path="/licence-expired" />
          {/* AUTH */}

          {/* ANALYSIS */}
          <Route element={<ProtectedRoute><GeneralAnalysis /></ProtectedRoute>} path="/general-analysis" />
          <Route element={<ProtectedRoute><ReversalAnalysis /></ProtectedRoute>} path="/reversal-analysis" />
          <Route
            element={<ProtectedRoute><ReversaReclassificationAnalysis /></ProtectedRoute>}
            path="/reversal-reclassification-analysis"
          />
          {/* ANALYSIS */}

          <Route element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} path="/user-management" />
          <Route element={<ProtectedRoute><UserManualPage /></ProtectedRoute>} path="/user-manual" />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </LocalizationProvider>
    </>
  );
}

export default App;
