"use client";

import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  IconButton,
  TableRow,
  Modal,
  Alert,
  Snackbar,
  Stack,
} from "@mui/material";
import {
  RootStack,
  PagePanel,
  ValidDateStack,
  RedText,
  GreenText,
  ColumnHeaderText,
  ModalContentStack,
  ModalInnerContent,
  ModalHeader,
  BlackText,
  InviteButton,
  SearchInput,
  Toolbar,
  SearchField,
  ModalStyledInput,
  ModalActionButton,
  ModalContentWrapper,
  ModalBtnRow,
  TablePanel,
} from "./style";
import { UserData, useUserManagementModel } from "./user-management-model";
import EventRepeatIcon from "@mui/icons-material/EventRepeat";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useEffect } from "react";
import { Header } from "../../composed/header/header";
import CloseIcon from "@mui/icons-material/Close";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Tooltip from "@mui/material/Tooltip";
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { theme } from "@/constants/theme";

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
    if (key === "licencevaliduntil") {
      const isExpired = dayjs(item[key as keyof UserData]).isBefore(
        dayjs().startOf("day")
      );
      const dateStr = new Date(item[key as keyof UserData]).toLocaleDateString(
        "de-DE"
      );

      return (
        <ValidDateStack>
          {isExpired ? (
            <RedText>{dateStr}</RedText>
          ) : (
            <GreenText>{dateStr}</GreenText>
          )}
          <Stack direction="row" gap={0.5}>
            <Tooltip title="Extend licence">
              <IconButton
                size="small"
                aria-label="Extend licence"
                sx={{ color: theme.colors.freshBlue }}
                onClick={() =>
                  setModalProps({
                    modalAction: "EXTEND",
                    id: item.id,
                    date: new Date(),
                    email: "",
                  })
                }
              >
                <EventRepeatIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="End licence">
              <span>
                <IconButton
                  size="small"
                  aria-label="End licence"
                  disabled={item.role === "admin"}
                  sx={{ color: theme.colors.medium }}
                  onClick={() =>
                    setModalProps({
                      modalAction: "DEACTIVATE",
                      id: item.id,
                      date: dayjs().subtract(1, "day").toDate(),
                      email: "",
                    })
                  }
                >
                  <EventBusyIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
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
    <ModalBtnRow>
      <ModalActionButton
        variant="contained"
        onClick={() =>
          setModalProps((prev) =>
            prev
              ? {
                  ...prev,
                  date: new Date(
                    new Date().setMonth(new Date().getMonth() + 1)
                  ),
                }
              : prev
          )
        }
      >
        1 month
      </ModalActionButton>
      <ModalActionButton
        variant="contained"
        onClick={() =>
          setModalProps((prev) =>
            prev
              ? {
                  ...prev,
                  date: new Date(
                    new Date().setMonth(new Date().getMonth() + 6)
                  ),
                }
              : prev
          )
        }
      >
        6 months
      </ModalActionButton>
      <ModalActionButton
        variant="contained"
        onClick={() =>
          setModalProps((prev) =>
            prev
              ? {
                  ...prev,
                  date: new Date(
                    new Date().setFullYear(new Date().getFullYear() + 1)
                  ),
                }
              : prev
          )
        }
      >
        1 year
      </ModalActionButton>
    </ModalBtnRow>
  );

  // --- DatePicker input for EXTEND ---
  const renderDatePicker = () =>
    modalProps?.modalAction === "EXTEND" && (
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
      />
    );

  // --- Email input for INVITE ---
  const renderInviteEmailInput = () =>
    modalProps?.modalAction === "INVITE" && (
      <ModalStyledInput
        placeholder="Enter email"
        slotProps={{ input: { style: { height: 32, borderRadius: 16 } } }}
        onChange={(e) =>
          setModalProps((prev) =>
            prev ? { ...prev, email: e.target.value } : prev
          )
        }
      />
    );

  // --- User List Table or Empty State ---
  const renderTableBody = () =>
    filteredUserData.length === 0 ? (
      <TableRow>
        <TableCell colSpan={columns.length} align="center">
          <Typography variant="body2" color="textSecondary">
            No users yet.
          </Typography>
        </TableCell>
      </TableRow>
    ) : (
      filteredUserData.map((row) => (
        <TableRow
          key={row.id || row.email}
          hover
          sx={{
            "&:last-child td": { borderBottom: 0 },
          }}
        >
          {columns.map((column) => (
            <TableCell
              key={column.key}
              align={column.align}
              sx={{
                width: column.width,
                borderBottom: `1px solid ${theme.colors.softBlue}`,
                color: theme.colors.black,
                fontSize: theme.fontSize.cell,
                py: 1.1,
              }}
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
          <Header title="User Management" />
          <PagePanel>
          <Toolbar>
            <SearchField>
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email"
                size="small"
                slotProps={{
                  input: {
                    endAdornment:
                      searchTerm !== "" ? (
                        <IconButton
                          size="small"
                          aria-label="Clear search"
                          onClick={() => setSearchTerm("")}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <SearchIcon
                          fontSize="small"
                          sx={{ color: theme.colors.medium }}
                          aria-hidden="true"
                        />
                      ),
                  },
                }}
              />
            </SearchField>
            <InviteButton
              variant="contained"
              onClick={() =>
                setModalProps({
                  date: new Date(),
                  email: "",
                  id: "",
                  modalAction: "INVITE",
                })
              }
            >
              Invite user
            </InviteButton>
          </Toolbar>
          <TablePanel>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align}
                      sx={{
                        width: column.width,
                        backgroundColor: theme.colors.darker,
                        borderBottom: `1px solid ${theme.colors.freshBlue}`,
                        py: 1.1,
                      }}
                    >
                      <ColumnHeaderText>{column.label}</ColumnHeaderText>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>{renderTableBody()}</TableBody>
            </Table>
          </TablePanel>
          </PagePanel>
        </RootStack>
      </PageWrapper>

      {/* Modal */}
      <Modal open={!!modalProps} onClose={() => setModalProps(undefined)}>
        <ModalContentStack>
          <ModalInnerContent>
            <ModalHeader>
              <BlackText variant="h6">{getModalTitle()}</BlackText>
              <IconButton
                onClick={() => setModalProps(undefined)}
                sx={{ color: theme.colors.white }}
              >
                <CloseIcon />
              </IconButton>
            </ModalHeader>

            <ModalContentWrapper>
              {modalProps?.modalAction === "EXTEND" && renderExtendShortcuts()}
              {renderDatePicker()}
              {renderInviteEmailInput()}
              <ModalActionButton
                variant="contained"
                disabled={
                  modalProps?.modalAction === "INVITE" &&
                  (modalProps.email === "" ||
                    !emailRegex.test(modalProps.email))
                }
                onClick={onConfirm}
              >
                {getModalButtonText()}
              </ModalActionButton>
            </ModalContentWrapper>
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
