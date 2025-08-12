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
          padding: "15px 20px",
        }}
      >
        <Typography style={{ color: colors.medium }}>
          Analysing, this may take a while...
        </Typography>
        <CircularProgress style={{ color: colors.medium }} />
      </Stack>
    </Backdrop>
  );
}
