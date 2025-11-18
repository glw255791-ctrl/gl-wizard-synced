import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../../../api/api";

export interface LoginData {
  email: string;
  password: string;
}
export function useLoginModel() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<LoginData & { rest: string }>({
    email: "",
    password: "",
    rest: "",
  });

  const onChangeField = (key: keyof LoginData, value: string) => {
    setFieldErrors((prev) => ({ ...prev, [key]: "", rest: "" }));
    setLoginData((prev) => ({ ...prev, [key]: value }));
  };

  const onLogin = async () => {
    try {
      const { email, password } = loginData;
      if (!email) {
        setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
      }
      if (!password) {
        setFieldErrors((prev) => ({
          ...prev,
          password: "Password is required",
        }));
      }
      if (!password || !email) {
        throw new Error();
      }
      const loginResponse = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginResponse.error) throw loginResponse.error;
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setFieldErrors((prev) => ({ ...prev, rest: error.message }));
      }
    }
  };
  return {
    onLogin,
    setLoginData,
    navigate,
    loginData,
    fieldErrors,
    onChangeField,
  };
}
