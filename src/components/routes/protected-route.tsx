import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import { supabase } from "../../api/api";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check session existence
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        localStorage.clear();
        navigate("/unauthorized");
        return;
      }

      // 2. Check if session is expired
      const isSessionExpired =
        session.expires_at !== undefined &&
        Date.now() / 1000 > session.expires_at;

      if (isSessionExpired) {
        localStorage.clear();
        navigate("/unauthorized");
        return;
      }

      // 3. Fetch user profile and license expiry
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("licence_valid_until")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) {
        localStorage.clear();
        navigate("/unauthorized");
        return;
      }

      // 4. Check license expiry
      const now = new Date();
      const expiry = new Date(profile.licence_valid_until);
      if (expiry < now) {
        alert("Your license has expired.");
        localStorage.clear();
        navigate("/licence-expired");
        return;
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [navigate]);

  // Loader while checking authorization
  if (isAuthorized === null) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!isAuthorized) return null;

  return children;
}
