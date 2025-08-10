import { Card, Stack, Grid2, Button } from "@mui/material";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import { styles } from "./styles";

interface Props {
  onPressAnalyzeData: () => void;
  isAnalyzeStep: boolean;
}
export function ActionButton(props: Props) {
  const { onPressAnalyzeData, isAnalyzeStep } = props;
  return (
    <Card style={isAnalyzeStep ? styles.card : styles.disabledCard}>
      <Stack sx={styles.buttonsWrapper}>
        <Grid2 container spacing={5} sx={styles.progressAndBtnWrapper}>
          <Grid2 size={6} />
          <Grid2 size={6}>
            <Button
              onClick={onPressAnalyzeData}
              variant="contained"
              sx={styles.button}
              endIcon={<TroubleshootIcon />}
            >
              Process
            </Button>
          </Grid2>
        </Grid2>
      </Stack>
    </Card>
  );
}
