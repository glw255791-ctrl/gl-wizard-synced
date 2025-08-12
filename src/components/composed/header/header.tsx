import { useNavigate } from "react-router";
import { styles } from "./header-style";
import { Stack, Breadcrumbs, Typography, IconButton } from "@mui/material";
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
        <Stack
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "flex-start",
          }}
        >
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

        <Breadcrumbs
          style={{
            flex: 1,
            justifyContent: "center",
            display: "flex",
            color: colors.lighter,
          }}
        >
          <Typography style={title ? {} : styles.title}>GL Wizard</Typography>
          {title && <Typography style={styles.title}>{title}</Typography>}
        </Breadcrumbs>
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
