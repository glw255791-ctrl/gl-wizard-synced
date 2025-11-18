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
          style={styles.button}
          endIcon={<TroubleshootIcon />}
        >
          Generate
        </Button>
      </Stack>
    </Card>
  );
}
