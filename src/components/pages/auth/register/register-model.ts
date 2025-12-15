import { useState } from "react";
import { useNavigate } from "react-router";
import { handleRegister, supabase } from "../../../../api/api";
import { RegisterData } from "../../../../types";

// Re-export type for backward compatibility
export type { RegisterData };
export function useRegisterModel() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState<
    RegisterData & { rest: string }
  >({
    name: "",
    password: "",
    rest: "",
  });

  const [fieldErrors, setFieldErrors] = useState<RegisterData>({
    name: "",
    password: "",
  });

  const onChangeField = (key: keyof RegisterData, value: string) => {
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setRegisterData((prev) => ({ ...prev, [key]: value }));
  };

  const onRegister = async () => {
    try {
      const { name, password } = registerData;
      if (!name) {
        setFieldErrors((prev) => ({
          ...prev,
          firstName: "Name is required",
        }));
      }

      if (!password) {
        setFieldErrors((prev) => ({
          ...prev,
          password: "Password is required",
        }));
      }
      if (!password || !name) {
        throw new Error();
      }
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (!user || error) throw new Error("No user found");
      const registerResponse = await handleRegister(user.id, password, name);
      if (registerResponse.success) {
        navigate("/registered");
      }
    } catch (error) {
      if (error instanceof Error) {
        setFieldErrors((prev) => ({ ...prev, rest: error.message }));
      }
    }
  };

  return {
    navigate,
    onRegister,
    fieldErrors,
    registerData,
    onChangeField,
  };
}
