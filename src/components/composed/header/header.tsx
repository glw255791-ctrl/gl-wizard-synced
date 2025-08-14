import { useNavigate } from "react-router";
import { styles } from "./header-style";
import { Stack, Typography, IconButton } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";
import { colors } from "../../../assets/colors";
// import { supabase } from "../../../api/api";
interface Props {
  title?: string;
  onPressResetBtn?: () => void;
}
export const Header = (props: Props) => {
  const { title, onPressResetBtn } = props;
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/logout");
  };

  const [user, setUser] = useState("");

  useEffect(() => {
    setUser("");
    // const checkAuth = async () => {
    //   const {
    //     data: { session },
    //   } = await supabase.auth.getSession();
    //   if (!session) {
    //     return;
    //   }
    //   const { data: profile, error } = await supabase
    //     .from("profiles")
    //     .select("*")
    //     .eq("id", session.user.id)
    //     .single();
    //   if (error || !profile) {
    //     return;
    //   }
    //   setUser(`${profile.first_name} ${profile.last_name}`);
    // };
    // checkAuth();
  }, []);

  return (
    <Stack style={styles.card}>
      <Stack style={styles.headerWrapper}>
        <Stack style={styles.root}>
          {title && (
            <IconButton
              style={{ color: colors.lighter }}
              onClick={() => navigate("/")}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          {onPressResetBtn && (
            <IconButton
              style={{ color: colors.lighter }}
              onClick={onPressResetBtn}
            >
              <RestartAltIcon />
            </IconButton>
          )}
        </Stack>

        <Typography style={styles.title}>{title ?? "Main Menu"}</Typography>

        <Stack style={styles.headerBtnsWrapper}>
          <Typography style={styles.name}>{user}</Typography>
          <IconButton style={{ color: colors.lighter }} onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Stack>
  );
};
