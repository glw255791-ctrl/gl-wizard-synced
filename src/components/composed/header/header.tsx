import { useRouter } from "next/navigation";
import {
  HeaderBtnsWrapper,
  HeaderBtnsWrapperRight,
  HeaderWrapper,
  IconButtonStyled,
  NameWrapper,
  Title,
  Wrapper,
} from "./style";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser-client";
interface Props {
  title?: string;
  onPressResetBtn?: () => void;
}

export const Header = ({ title, onPressResetBtn }: Props) => {
  const router = useRouter();
  const [user, setUser] = useState("");

  const handleLogout = async () => {
    localStorage.clear();
    await supabaseBrowser.auth.signOut();

    router.push("/login");
  };

  useEffect(() => {
    const checkAuth = async () => {
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

      setUser(profile.full_name || "");
    };

    checkAuth();
  }, []);

  return (
    <Wrapper>
      <HeaderWrapper>
        <HeaderBtnsWrapper>
          {title && (
            <IconButtonStyled onClick={() => router.push("/dashboard")}>
              <ArrowBackIcon />
            </IconButtonStyled>
          )}
          {onPressResetBtn && (
            <IconButtonStyled onClick={onPressResetBtn}>
              <RestartAltIcon />
            </IconButtonStyled>
          )}
        </HeaderBtnsWrapper>

        <Title>{title ?? "Main Menu"}</Title>

        <HeaderBtnsWrapperRight>
          <PersonIcon />
          <NameWrapper>{user}</NameWrapper>
          <IconButtonStyled onClick={handleLogout}>
            <LogoutIcon />
          </IconButtonStyled>
        </HeaderBtnsWrapperRight>
      </HeaderWrapper>
    </Wrapper>
  );
};
