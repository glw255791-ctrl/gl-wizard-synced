import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
// import { supabase, supabaseAdmin } from "../../../api/api";

export interface Column {
  key: string;
  label: string;
  width?: number;
  align?: "center" | "left" | "right" | "justify" | "inherit";
}

export interface UserData {
  first_name: string;
  last_name: string;
  licence_valid_until: string;
  email: string;
  id: string;
}

export interface ModalProps {
  modalAction: "EXTEND" | "DEACTIVATE" | "INVITE";
  date: Date;
  id: string;
  email: string;
}

export interface SnackbarProps {
  message: string;
  severity: "error" | "success" | "";
  open: boolean;
}
export function useUserManagementModel() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [snackbarProps, setSnackbarProps] = useState<SnackbarProps>({
    message: "",
    severity: "",
    open: false,
  });

  const [modalProps, setModalProps] = useState<ModalProps | undefined>(
    undefined
  );

  const navigate = useNavigate();

  const loadData = async () => {
    // try {
    //   const {
    //     data: { session },
    //   } = await supabase.auth.getSession();
    //   if (!session) {
    //     return;
    //   }
    //   const { data: profiles, error } = await supabase
    //     .from("profiles")
    //     .select("*");
    //   if (error || !profiles) {
    //     setSnackbarProps({
    //       message: `Failed to load data. ${error.message}`,
    //       severity: "error",
    //       open: true,
    //     });
    //     throw new Error();
    //   }
    //   setUserData(
    //     profiles.map(
    //       ({ first_name, last_name, email, licence_valid_until, id }) => ({
    //         first_name,
    //         last_name,
    //         email,
    //         licence_valid_until,
    //         id,
    //       })
    //     )
    //   );
    // } catch (error) {
    //   console.warn(error);
    // }
  };

  const updateLicenceDate = async (id: string, newDate: Date) => {
    // try {
    //   const { error } = await supabase
    //     .from("profiles")
    //     .update({ licence_valid_until: newDate.toISOString() })
    //     .eq("id", id);
    //   if (error) {
    //     setSnackbarProps({
    //       message: `Failed to update licence. ${error.message}`,
    //       severity: "error",
    //       open: true,
    //     });
    //     throw new Error();
    //   }
    //   setSnackbarProps({
    //     message: `Licence updated.`,
    //     severity: "success",
    //     open: true,
    //   });
    // } catch (error) {
    //   console.warn(error);
    // }
  };

  async function signUpUser(email: string) {
    // try {
    //   const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
    //   if (error) {
    //     setSnackbarProps({
    //       message: `Failed to invite user. ${error.message}`,
    //       severity: "error",
    //       open: true,
    //     });
    //     throw new Error();
    //   }
    //   setSnackbarProps({
    //     message: `User invited.`,
    //     severity: "success",
    //     open: true,
    //   });
    // } catch (error) {
    //   console.warn(error);
    // }
  }

  const columns: Column[] = [
    {
      key: "first_name",
      label: "First name",
      width: 300,
    },
    {
      key: "last_name",
      label: "Last name",
      width: 300,
    },
    { key: "", label: "" },
    {
      key: "licence_valid_until",
      label: "Licence valid until",
      width: 200,
      align: "center",
    },
    {
      key: "extend_licence",
      label: "Extend licence",
      width: 150,
      align: "center",
    },
    {
      key: "deactivate_licence",
      label: "Deactive licence",
      width: 150,
      align: "center",
    },
  ];

  const filteredUserData = useMemo(() => {
    if (searchTerm === "") return userData;

    return userData.filter(
      (item) =>
        item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userData, searchTerm]);

  const onConfirm = async () => {
    if (modalProps?.modalAction === "INVITE") {
      await signUpUser(modalProps.email);
    } else {
      if (modalProps?.id && modalProps?.date)
        await updateLicenceDate(modalProps?.id, modalProps?.date);
    }
    setModalProps(undefined);
    await loadData();
  };
  return {
    columns,
    filteredUserData,
    searchTerm,
    setSearchTerm,
    loadData,
    navigate,
    updateLicenceDate,
    setModalProps,
    modalProps,
    onConfirm,
    snackbarProps,
    setSnackbarProps,
  };
}
