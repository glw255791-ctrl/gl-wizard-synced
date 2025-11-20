import { useNavigate } from "react-router";
import {
  HeaderBtnsWrapper,
  HeaderBtnsWrapperRight,
  HeaderWrapper,
  IconButtonStyled,
  NameWrapper,
  Title,
  Wrapper
} from "./style";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
import { supabase } from "../../../api/api";

interface Props {
  title?: string;
  onPressResetBtn?: () => void;
}

export const Header = ({ title, onPressResetBtn }: Props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/logout");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error } = await supabase
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
            <IconButtonStyled onClick={() => navigate("/")}>
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
          <NameWrapper>
            {user}
          </NameWrapper>
          <IconButtonStyled onClick={handleLogout}>
            <LogoutIcon />
          </IconButtonStyled>
        </HeaderBtnsWrapperRight>
      </HeaderWrapper>
    </Wrapper>
  );
};
