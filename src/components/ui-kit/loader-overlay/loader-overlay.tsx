import {
  StyledBackdrop,
  LoaderContent,
  LoaderText,
  StyledCircularProgress,
} from "./style";

interface Props {
  loadingStatus: boolean;
}
export function Loader(props: Props) {
  const { loadingStatus } = props;

  return (
    <StyledBackdrop open={loadingStatus}>
      <LoaderContent>
        <LoaderText>Analysing, this may take a while...</LoaderText>
        <StyledCircularProgress />
      </LoaderContent>
    </StyledBackdrop>
  );
}
