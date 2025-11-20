import { Alert, Snackbar } from "@mui/material";
import {
  Root,
  Row,
  Left,
  Title,
  BtnGroupsWrapper,
  TopBtns,
  BottomBtns,
  Content,
  MenuBtn,
  MenuBtnActive,
} from "./style";
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
import { SnackbarProps } from "../../pages/user-management/user-management-model";

interface Props {
  children: JSX.Element;
}

export function PageWrapper({ children }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>({
    message: "",
    severity: "",
    open: false,
  });
  const [userRole, setUserRole] = useState<"user" | "admin" | undefined>(undefined);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) return;

      const today = new Date();
      const expiry = new Date(profile.licence_valid_until);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 14) {
        setSnackbarProps({
          message: `Your licence will expire in ${diffDays} days.`,
          severity: "warning",
          open: true,
        });
      }
      setUserRole(profile.role);
    }
    checkSession();
  }, [navigate]);

  // Utility for a left menu button; highlights if active
  const MenuButton = ({
    menuPath,
    ...rest
  }: {
    menuPath: string;
    [key: string]: any;
  }) => {
    const isActive = pathname === menuPath;
    const ButtonComponent = isActive ? MenuBtnActive : MenuBtn;
    return <ButtonComponent {...rest} />;
  };

  return (
    <Root>
      <Row>
        <Left>
          <Title>GL Wizard</Title>
          <BtnGroupsWrapper>
            {userRole && <>   <TopBtns>
              <MenuButton
                menuPath="/dashboard"
                startIcon={<WidgetsIcon />}
                variant="contained"
                onClick={() => navigate("/dashboard")}
              >
                Main Menu
              </MenuButton>
              <MenuButton
                menuPath="/general-analysis"
                startIcon={<TableChartIcon />}
                variant="contained"
                onClick={() => navigate("/general-analysis")}
              >
                GL Transactions Analysis
              </MenuButton>
              <MenuButton
                menuPath="/reversal-analysis"
                startIcon={<RepeatOnIcon />}
                variant="contained"
                onClick={() => navigate("/reversal-analysis")}
              >
                Reversal
              </MenuButton>
              <MenuButton
                menuPath="/reversal-reclassification-analysis"
                startIcon={<ShuffleOnIcon />}
                variant="contained"
                onClick={() => navigate("/reversal-reclassification-analysis")}
              >
                Reversal/Reclassification
              </MenuButton>
              {userRole === "admin" && (
                <MenuButton
                  menuPath="/user-management"
                  startIcon={<GroupIcon />}
                  variant="contained"
                  onClick={() => navigate("/user-management")}
                >
                  User Management
                </MenuButton>
              )}
            </TopBtns>
              <BottomBtns>
                <MenuButton
                  menuPath="/user-manual"
                  startIcon={<HelpCenterIcon />}
                  variant="contained"
                  onClick={() => navigate("/user-manual")}
                >
                  User Manual
                </MenuButton>
                <MenuButton
                  menuPath="/about"
                  startIcon={<PrivacyTipIcon />}
                  variant="contained"
                  onClick={() => navigate("/about")}
                >
                  About
                </MenuButton>
              </BottomBtns></>}
          </BtnGroupsWrapper>
        </Left>
        <Content>{children}</Content>
      </Row>
      <Snackbar
        open={snackbarProps.open}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={4000}
        onClose={() => setSnackbarProps({ message: "", open: false, severity: "" })}
      >
        <Alert
          severity={snackbarProps.severity as "error" | "success" | "info" | "warning"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarProps.message}
        </Alert>
      </Snackbar>
    </Root>
  );
}
