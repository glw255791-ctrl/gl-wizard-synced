import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import { supabase } from "../../api/api";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        localStorage.clear();
        navigate("/unauthorized");
        return;
      }
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

  if (isAuthorized === null)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  if (!isAuthorized) return null;

  return children;
}
