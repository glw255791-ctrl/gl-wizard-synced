import { Button, Stack, Typography } from "@mui/material";
import { styles } from "./style";
import { JSX, useEffect, useState } from "react";
import WidgetsIcon from "@mui/icons-material/Widgets";
import TableChartIcon from "@mui/icons-material/TableChart";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import GroupIcon from "@mui/icons-material/Group";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { useLocation, useNavigate } from "react-router";
import { supabase } from "../../../api/api";
interface Props {
  children: JSX.Element;
}

export function PageWrapper(props: Props) {
  const { children } = props;

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [userRole, setUserRole] = useState<"user" | "admin">("user");
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (error || !profile) {
          return;
        }
        setUserRole(profile.role);
      }
    };
    checkSession();
  }, [navigate]);

  const getButtonStyle = (path: string) => {
    return {
      ...styles.menuBtn,
      ...(pathname === path && styles.menuBtnActive),
      ...(pathname !== path && {
        '&:hover': {
          fontSize: '1rem',
          borderBottom: '2px solid #4F6367'
        }
      })
    }
  }


  return (
    <Stack style={styles.root}>
      <Stack style={styles.row}>
        <Stack style={styles.left}>
          <Typography style={styles.title}>GL Wizard</Typography>
          <Stack style={styles.btnGroupsWrapper}>
            <Stack style={styles.topBtns}>
              <Button
                startIcon={<WidgetsIcon />}
                variant="contained"
                sx={getButtonStyle("/dashboard")}
                onClick={() => navigate("/dashboard")}
              >
                Main Menu
              </Button>
              <Button
                startIcon={<TableChartIcon />}
                variant="contained"
                sx={getButtonStyle("/general-analysis")}
                onClick={() => navigate("/general-analysis")}
              >
                GL Transactions Analysis
              </Button>
              <Button
                startIcon={<RepeatOnIcon />}
                variant="contained"
                sx={getButtonStyle("/reversal-analysis")}
                onClick={() => navigate("/reversal-analysis")}
              >
                Reversal
              </Button>
              <Button
                startIcon={<ShuffleOnIcon />}
                variant="contained"
                sx={getButtonStyle("/reversal-reclassification-analysis")}
                onClick={() => navigate("/reversal-reclassification-analysis")}
              >
                Reversal/Reclassification
              </Button>
              {userRole === "admin" && (
                <Button
                  startIcon={<GroupIcon />}
                  variant="contained"
                  sx={getButtonStyle("/user-management")}
                  onClick={() => navigate("/user-management")}
                >
                  User Management
                </Button>
              )}
            </Stack>

            <Stack style={styles.bottomBtns}>
              <Button
                startIcon={<HelpCenterIcon />}
                variant="contained"
                style={{
                  ...styles.menuBtn,
                  ...(pathname === "/1" && styles.menuBtnActive),
                }}
              >
                User Manual
              </Button>
              <Button
                startIcon={<PrivacyTipIcon />}
                variant="contained"
                style={{
                  ...styles.menuBtn,
                  ...(pathname === "/2" && styles.menuBtnActive),
                }}
              >
                About
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <Stack style={styles.content}>{children}</Stack>
      </Stack>
    </Stack >
  );
}
