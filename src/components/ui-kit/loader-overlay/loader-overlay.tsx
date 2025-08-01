import { Backdrop, Stack, Typography, CircularProgress } from "@mui/material";
import { colors } from "../../../assets/colors";

interface Props {
  loadingStatus: boolean;
}
export function Loader(props: Props) {
  const { loadingStatus } = props;

  return (
    <Backdrop
      sx={{
        color: colors.vistaBlue,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={loadingStatus}
    >
      <Stack
        style={{
          backgroundColor: "#fff",
          borderRadius: 45,
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
          padding: 15,
        }}
      >
        <Typography>Analysing, this may take a while...</Typography>
        <CircularProgress color="inherit" />
      </Stack>
    </Backdrop>
  );
}
