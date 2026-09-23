/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Alert, Snackbar, Tooltip } from "@mui/material";
import {
  Root,
  Row,
  Left,
  Banner,
  BannerLogo,
  BannerTitle,
  BannerAccount,
  BannerAccountName,
  BannerAccountButton,
  BannerButton,
  BtnGroupsWrapper,
  TopBtns,
  BottomBtns,
  Content,
  MenuBtn,
} from "./style";
import { JSX, useEffect, useState } from "react";
import WidgetsIcon from "@mui/icons-material/Widgets";
import TableChartIcon from "@mui/icons-material/TableChart";
import RepeatOnIcon from "@mui/icons-material/RepeatOn";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import GroupIcon from "@mui/icons-material/Group";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
import { isLicenceExpired } from "@/lib/licence";
import { SnackbarProps } from "../../pages/user-management/user-management-model";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  children: JSX.Element;
}

function NavLink({
  menuPath,
  pathname,
  collapsed,
  label,
  ...rest
}: {
  menuPath: string;
  pathname: string;
  collapsed: boolean;
  label: string;
  [key: string]: any;
}) {
  const isActive = pathname === menuPath;
  return (
    <MenuBtn
      {...rest}
      className={isActive ? "nav-active" : undefined}
      aria-current={isActive ? "page" : undefined}
      title={label}
      aria-label={label}
    >
      {collapsed ? null : label}
    </MenuBtn>
  );
}

export function PageWrapper({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>({
    message: "",
    severity: "",
    open: false,
  });
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "admin" | undefined>(
    undefined
  );
  const [accountName, setAccountName] = useState("");
  const [accountMeta, setAccountMeta] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem("gl-wizard-nav-collapsed");
    if (stored === "true") setNavCollapsed(true);
  }, []);

  const toggleNav = () => {
    setNavCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem("gl-wizard-nav-collapsed", String(next));
      return next;
    });
  };

  useEffect(() => {
    if (!supabaseBrowser) return;

    async function checkSession() {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession();
      if (!session) return;

      const { data: profile, error } = await supabaseBrowser
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error || !profile) return;

      if (profile.role !== "admin" && isLicenceExpired(profile.licence_valid_until)) {
        router.push("/licence-expired");
        return;
      }

      const today = new Date();
      const expiry = new Date(profile.licence_valid_until);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 0 && diffDays < 14) {
        setSnackbarProps({
          message: `Your licence will expire in ${diffDays} days.`,
          severity: "warning",
          open: true,
        });
      }
      setUserRole(profile.role);
      setAccountName(profile.full_name || "");
      if (profile.role === "admin") {
        setAccountMeta("Administrator");
      } else if (profile.licence_valid_until) {
        setAccountMeta(
          `Licence until ${new Date(profile.licence_valid_until).toLocaleDateString("de-DE")}`
        );
      }
    }
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    localStorage.clear();
    if (supabaseBrowser) {
      await supabaseBrowser.auth.signOut();
    }
    router.push("/login");
  };

  return (
    <Root>
      <Banner>
        <BannerLogo src="/logo-white.png" alt="GL Wizard" />
        <BannerTitle>GL Wizard</BannerTitle>
        <BannerAccount>
          <PersonIcon aria-hidden="true" />
          <BannerAccountName>
            <span>{accountName}</span>
            {accountMeta ? <span className="account-meta">{accountMeta}</span> : null}
          </BannerAccountName>
          <Tooltip title="Log out">
            <BannerAccountButton aria-label="Log out" onClick={handleLogout}>
              <LogoutIcon />
            </BannerAccountButton>
          </Tooltip>
        </BannerAccount>
      </Banner>
      <Row>
        <Left collapsed={navCollapsed}>
          <BannerButton
            onClick={toggleNav}
            aria-label={navCollapsed ? "Show menu" : "Hide menu"}
          >
            {navCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
          </BannerButton>
          <BtnGroupsWrapper>
            <TopBtns>
              <NavLink
                menuPath="/dashboard"
                pathname={pathname}
                collapsed={navCollapsed}
                label="Main Menu"
                startIcon={<WidgetsIcon />}
                variant="contained"
                onClick={() => router.push("/dashboard")}
              />
              <NavLink
                menuPath="/general-analysis"
                pathname={pathname}
                collapsed={navCollapsed}
                label="GL Transactions Analysis"
                startIcon={<TableChartIcon />}
                variant="contained"
                onClick={() => router.push("/general-analysis")}
              />
              <NavLink
                menuPath="/reversal-analysis"
                pathname={pathname}
                collapsed={navCollapsed}
                label="Reversal"
                startIcon={<RepeatOnIcon />}
                variant="contained"
                onClick={() => router.push("/reversal-analysis")}
              />
              <NavLink
                menuPath="/reversal-reclassification-analysis"
                pathname={pathname}
                collapsed={navCollapsed}
                label="Reversal/Reclassification"
                startIcon={<ShuffleOnIcon />}
                variant="contained"
                onClick={() =>
                  router.push("/reversal-reclassification-analysis")
                }
              />
              {userRole !== "user" && (
                <NavLink
                  menuPath="/user-management"
                  pathname={pathname}
                  collapsed={navCollapsed}
                  label="User Management"
                  startIcon={<GroupIcon />}
                  variant="contained"
                  disabled={userRole !== "admin"}
                  onClick={() => router.push("/user-management")}
                  sx={
                    userRole === "admin"
                      ? undefined
                      : { visibility: "hidden", pointerEvents: "none" }
                  }
                  aria-hidden={userRole !== "admin"}
                  tabIndex={userRole === "admin" ? 0 : -1}
                />
              )}
            </TopBtns>
            <BottomBtns>
              <NavLink
                menuPath="/user-manual"
                pathname={pathname}
                collapsed={navCollapsed}
                label="User Manual"
                startIcon={<HelpCenterIcon />}
                variant="contained"
                onClick={() => router.push("/user-manual")}
              />
              <NavLink
                menuPath="/about"
                pathname={pathname}
                collapsed={navCollapsed}
                label="About"
                startIcon={<PrivacyTipIcon />}
                variant="contained"
                onClick={() => router.push("/about")}
              />
            </BottomBtns>
          </BtnGroupsWrapper>
        </Left>
        <Content data-app-content>{children}</Content>
      </Row>
      <Snackbar
        open={snackbarProps.open}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbarProps({ message: "", open: false, severity: "" })
        }
      >
        <Alert
          severity={
            snackbarProps.severity as "error" | "success" | "info" | "warning"
          }
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarProps.message}
        </Alert>
      </Snackbar>
    </Root>
  );
}
