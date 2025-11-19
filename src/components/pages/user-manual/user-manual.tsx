import { IconButton, Stack, Typography } from "@mui/material";
import { styles } from "./style";
import DownloadIcon from "@mui/icons-material/Download";

import { PageWrapper } from "../../composed/page-wrapper/page-wrapper";
import { Header } from "../../composed/header/header";


export function UserManualPage() {


  return (
    <PageWrapper>
      <Stack style={styles.root}>
        <Header title="User Manual" />

        <Stack style={styles.buttonsWrapper}>
          <Stack style={styles.button}>
            <Typography>Serbia CoA</Typography>
            <IconButton
              component="a"
              href="/assets/files/serbia-coa.xlsx"
              download="Serbia_CoA.xlsx"
            >
              <DownloadIcon style={styles.icon} />
            </IconButton>
          </Stack>
          <Stack style={styles.button}><Typography>International CoA</Typography><IconButton component="a" href="/assets/files/international-coa.xlsx" download="International_CoA.xlsx"><DownloadIcon style={styles.icon} /></IconButton></Stack>
        </Stack>

      </Stack>
    </PageWrapper>
  );
}
