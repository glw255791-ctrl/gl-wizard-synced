import {
  Stack,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  IconButton,
  TableRow,
  Modal,
  Button,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  RootStack,
  ValidDateStack,
  RedText,
  GreenText,
  ColumnHeaderText,
  ModalContentStack,
  ModalInnerContent,
  ModalHeader,
  BlackText,
} from "./style";
import { UserData, useUserManagementModel } from "./user-management-model";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useEffect } from "react";
import { Header } from "../../composed/header/header";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";

export function UserManagementPage() {
  const {
    loadData,
    filteredUserData,
    columns,
    modalProps,
    searchTerm,
    setSearchTerm,
    setModalProps,
    onConfirm,
    snackbarProps,
    setSnackbarProps,
  } = useUserManagementModel();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const renderCellContent = (key: string, item: UserData) => {
    if (key === "licencevaliduntil") {
      const isExpired = dayjs(item[key as keyof UserData]).isBefore(dayjs().startOf("day"));
      const dateStr = new Date(item[key as keyof UserData]).toLocaleDateString("de-DE");

      return (
        <ValidDateStack>
          {isExpired ? (
            <RedText>{dateStr}</RedText>
          ) : (
            <GreenText>{dateStr}</GreenText>
          )}
          <IconButton
            onClick={() =>
              setModalProps({
                modalAction: "EXTEND",
                id: item.id,
                date: new Date(),
                email: "",
              })
            }
          >
            <EventRepeatIcon />
          </IconButton>
          <IconButton
            disabled={item.role === "admin"}
            onClick={() =>
              setModalProps({
                modalAction: "DEACTIVATE",
                id: item.id,
                date: dayjs().subtract(1, "day").toDate(),
                email: "",
              })
            }
          >
            <EventBusyIcon />
          </IconButton>
        </ValidDateStack>
      );
    }

    return item[key as keyof UserData];
  };

  const getModalTitle = () => {
    switch (modalProps?.modalAction) {
      case "EXTEND":
        return "Extend Licence";
      case "DEACTIVATE":
        return "Deactivate Licence";
      default:
        return "Invite User";
    }
  };

  const getModalButtonText = getModalTitle;

  // --- Modal action shortcut buttons for EXTEND ---
  const renderExtendShortcuts = () => (
    <Stack sx={{ flexDirection: "row", gap: 1, mb: 2 }}>
      <Button
        variant="contained"
        onClick={() =>
          setModalProps(prev =>
            prev
              ? {
                ...prev,
                date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
              }
              : prev
          )
        }
      >
        1 month
      </Button>
      <Button
        variant="contained"
        onClick={() =>
          setModalProps(prev =>
            prev
              ? {
                ...prev,
                date: new Date(new Date().setMonth(new Date().getMonth() + 6)),
              }
              : prev
          )
        }
      >
        6 months
      </Button>
      <Button
        variant="contained"
        onClick={() =>
          setModalProps(prev =>
            prev
              ? {
                ...prev,
                date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
              }
              : prev
          )
        }
      >
        1 year
      </Button>
    </Stack>
  );

  // --- DatePicker input for EXTEND ---
  const renderDatePicker = () =>
    modalProps?.modalAction === "EXTEND" && (
      <DatePicker
        slotProps={{
          textField: {
            InputProps: {
              sx: { width: "100%", mb: 2 },
            },
          },
        }}
        value={dayjs(modalProps.date)}
        format="DD.MM.YYYY"
        minDate={dayjs(new Date())}
        onChange={value =>
          setModalProps(prev => {
            if (!prev || !value) return prev;
            return {
              ...prev,
              date: value.toDate(),
            };
          })
        }
        sx={{ width: "100%", height: 32, mb: 2 }}
      />
    );

  // --- Email input for INVITE ---
  const renderInviteEmailInput = () =>
    modalProps?.modalAction === "INVITE" && (
      <TextField
        placeholder="Enter email"
        sx={{ width: "100%", mb: 2 }}
        slotProps={{ input: {} }}
        onChange={e =>
          setModalProps(prev => (prev ? { ...prev, email: e.target.value } : prev))
        }
      />
    );

  // --- User List Table or Empty State ---
  const renderTableBody = () =>
    filteredUserData.length === 0 ? (
      <TableRow>
        <TableCell colSpan={columns.length} align="center">
          <Typography variant="body2" color="textSecondary">
            No data available
          </Typography>
        </TableCell>
      </TableRow>
    ) : (
      filteredUserData.map((row, index) => (
        <TableRow key={index}>
          {columns.map(column => (
            <TableCell
              key={column.key}
              align={column.align}
              sx={{ width: column.width }}
            >
              {renderCellContent(column.key, row)}
            </TableCell>
          ))}
        </TableRow>
      ))
    );

  // --- Main Render ---
  return (
    <>
      <PageWrapper>
        <RootStack>
          <Header title="User management" />
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              width: "100%",
            }}
          >
            <Stack sx={{ flex: 1 }}>
              <TextField
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment:
                      searchTerm !== "" ? (
                        <IconButton
                          style={{ padding: 0 }}
                          onClick={() => setSearchTerm("")}
                        >
                          <CloseIcon />
                        </IconButton>
                      ) : (
                        <SearchIcon />
                      ),
                  },
                }}
                sx={{ width: "100%" }}
              />
            </Stack>
            <Button
              variant="contained"
              onClick={() =>
                setModalProps({
                  date: new Date(),
                  email: "",
                  id: "",
                  modalAction: "INVITE",
                })
              }
              sx={{ ml: 2 }}
            >
              Invite user
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      sx={{ width: column.width }}
                    >
                      <ColumnHeaderText>{column.label}</ColumnHeaderText>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
          </TableContainer>
        </RootStack>
      </PageWrapper>

      {/* Modal */}
      <Modal open={!!modalProps}>
        <ModalContentStack>
          <ModalInnerContent>
            <ModalHeader>
              <BlackText variant="h6">{getModalTitle()}</BlackText>
              <IconButton onClick={() => setModalProps(undefined)}>
                <CloseIcon />
              </IconButton>
            </ModalHeader>

            <Stack sx={{ flex: 1, px: 3, py: 2 }}>
              {modalProps?.modalAction === "EXTEND" && renderExtendShortcuts()}
              {renderDatePicker()}
              {renderInviteEmailInput()}
              <Button
                variant="contained"
                disabled={
                  modalProps?.modalAction === "INVITE" &&
                  (modalProps.email === "" || !emailRegex.test(modalProps.email))
                }
                sx={{ mt: 1, width: "100%" }}
                onClick={onConfirm}
              >
                {getModalButtonText()}
              </Button>
            </Stack>
          </ModalInnerContent>
        </ModalContentStack>
      </Modal>

      {/* Snackbar/Alert */}
      <Snackbar
        open={snackbarProps.open}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbarProps({ message: "", open: false, severity: "" })
        }
      >
        <Alert
          severity={snackbarProps.severity as "error" | "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarProps.message}
        </Alert>
      </Snackbar>
    </>
  );
}
