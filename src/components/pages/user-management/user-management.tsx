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
import { styles } from "./user-management.style";
import { UserData, useUserManagementModel } from "./user-management-model";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
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

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const renderCellContent = (key: string, item: UserData) => {
    switch (key) {
      case "licence_valid_until": {
        const isExpired = dayjs(item[key as keyof UserData]).isBefore(
          dayjs().startOf("day")
        );
        return (
          <Stack style={styles.validDate}>
            <Typography style={isExpired ? styles.red : styles.green}>
              {new Date(item[key as keyof UserData]).toLocaleDateString(
                "de-DE"
              )}
            </Typography>
            {isExpired ? (
              <CancelOutlinedIcon style={styles.red} />
            ) : (
              <CheckCircleOutlineIcon style={styles.green} />
            )}
          </Stack>
        );
      }
      case "extend_licence":
        return (
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
        );
      case "deactivate_licence":
        return (
          <IconButton
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
        );
      default:
        return item[key as keyof UserData];
    }
  };

  return (
    <>
      <PageWrapper>
        <Stack style={styles.root}>
          <Header title="User management" />
          <Stack style={styles.searchBlock}>
            <Stack style={styles.searchField}>
              <TextField
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    style: styles.searchInput,
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
              style={styles.btn}
            >
              Invite user
            </Button>
          </Stack>
          <TableContainer style={styles.table} component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      sx={{ ...styles.columnHeader, width: column.width }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUserData.length === 0 ? (
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
                      {columns.map((column) => (
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
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </PageWrapper>
      <Modal open={!!modalProps}>
        <Stack style={styles.modalContent}>
          <Stack style={styles.modalInnerContent}>
            <Stack style={styles.modalHeader}>
              <Typography variant="h6" style={styles.black}>
                {modalProps?.modalAction === "EXTEND"
                  ? "Extend Licence"
                  : modalProps?.modalAction === "DEACTIVATE"
                  ? "Deactivate Licence"
                  : "Invite User"}
              </Typography>
              <IconButton onClick={() => setModalProps(undefined)}>
                <CloseIcon />
              </IconButton>
            </Stack>

            <Stack style={styles.modalContentWrapper}>
              {modalProps?.modalAction === "EXTEND" && (
                <>
                  <DatePicker
                    value={dayjs(modalProps.date)}
                    format="DD.MM.YYYY"
                    minDate={dayjs(new Date())}
                    onChange={(value) =>
                      setModalProps((prev) => {
                        if (!prev || !value) return prev;
                        return {
                          ...prev,
                          date: value.toDate(),
                        };
                      })
                    }
                    sx={styles.input}
                  />
                </>
              )}
              {modalProps?.modalAction === "INVITE" && (
                <TextField
                  label="Email"
                  onChange={(e) =>
                    setModalProps((prev) => {
                      if (!prev) return prev;

                      return { ...prev, email: e.target.value };
                    })
                  }
                />
              )}
              <Button
                variant="contained"
                disabled={
                  modalProps?.modalAction === "INVITE" &&
                  (modalProps.email === "" ||
                    !emailRegex.test(modalProps.email))
                }
                style={styles.input}
                onClick={onConfirm}
              >
                {modalProps?.modalAction === "EXTEND"
                  ? "Extend Licence"
                  : modalProps?.modalAction === "DEACTIVATE"
                  ? "Deactivate Licence"
                  : "Invite User"}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Modal>
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
