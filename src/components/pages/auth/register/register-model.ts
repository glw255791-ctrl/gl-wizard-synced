import { useState } from "react";
import { useNavigate } from "react-router";
// import { handleRegister, supabase } from "../../../../api/api";

export interface RegisterData {
  firstName: string;
  lastName: string;
  password: string;
}
export function useRegisterModel() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState<
    RegisterData & { rest: string }
  >({
    firstName: "",
    lastName: "",
    password: "",
    rest: "",
  });

  const [fieldErrors, setFieldErrors] = useState<RegisterData>({
    firstName: "",
    lastName: "",
    password: "",
  });

  const onChangeField = (key: keyof RegisterData, value: string) => {
    setFieldErrors((prev) => ({ ...prev, [key]: "" }));
    setRegisterData((prev) => ({ ...prev, [key]: value }));
  };

  const onRegister = async () => {
    // try {
    //   const { firstName, lastName, password } = registerData;
    //   if (!firstName) {
    //     setFieldErrors((prev) => ({
    //       ...prev,
    //       firstName: "First name is required",
    //     }));
    //   }
    //   if (!lastName) {
    //     setFieldErrors((prev) => ({
    //       ...prev,
    //       lastName: "Last name is required",
    //     }));
    //   }
    //   if (!password) {
    //     setFieldErrors((prev) => ({
    //       ...prev,
    //       password: "Password is required",
    //     }));
    //   }
    //   if (!password || !firstName || !lastName) {
    //     throw new Error();
    //   }
    //   const {
    //     data: { user },
    //     error,
    //   } = await supabase.auth.getUser();
    //   if (!user || error) throw new Error("No user found");
    //   const registerResponse = await handleRegister(
    //     user.id,
    //     password,
    //     firstName,
    //     lastName
    //   );
    //   if (registerResponse.success) {
    //     navigate("/registered");
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     setFieldErrors((prev) => ({ ...prev, rest: error.message }));
    //   }
    // }
  };

  return {
    navigate,
    onRegister,
    fieldErrors,
    registerData,
    onChangeField,
  };
}
