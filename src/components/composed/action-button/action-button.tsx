import { Card, Stack, Button } from "@mui/material";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import { styles } from "./styles";

interface Props {
  onPressAnalyzeData: () => void;
  isAnalyzeStep: boolean;
}
export function ActionButton(props: Props) {
  const { onPressAnalyzeData, isAnalyzeStep } = props;
  return (
    <Card
      style={{ ...styles.card, ...(!isAnalyzeStep ? styles.disabledCard : {}) }}
    >
      <Stack sx={styles.buttonsWrapper}>
        <Button
          onClick={onPressAnalyzeData}
          variant="contained"
          sx={styles.button}
          endIcon={<TroubleshootIcon />}
        >
          Process
        </Button>
      </Stack>
    </Card>
  );
}
