import { CommonProps } from "@mui/material/OverridableComponent";
import { colors } from "../../../../assets/colors";
export const styles: Record<string, CommonProps["style"]> = {
  root: {
    width: "calc(100vw - 6rem)",
    minHeight: "calc(100vh - 4rem)",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBlock: {
    width: 400,
    backgroundColor: colors.lighter,
    borderRadius: 16,
    padding: "1rem",
    gap: "1rem",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: "8rem",
    width: "8rem",
    marginBottom: "-0.5rem",
  },
  label: {
    color: colors.darker,
    fontWeight: "bold",
    fontSize: "1.5rem",
  },
  button: {
    color: "white",
    fontSize: "1rem",
    textTransform: "none",
    borderRadius: 16,
    height: 32,
    paddingLeft: 32,
    paddingRight: 32,
    backgroundColor: colors.action,
    marginTop: '1rem'
  },
  imageAndLogo: {
    paddingBottom: "1rem",
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    width: "80%",
    height: 32,
    borderRadius: 16,
  },
  input: {
    height: 32,
    borderRadius: 16,
  },
  errors: {
    minHeight: "3rem",
  },
  error: {
    fontSize: "0.75rem",
    color: "red",
  },
};
