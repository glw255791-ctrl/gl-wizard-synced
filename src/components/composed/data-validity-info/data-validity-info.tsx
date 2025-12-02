import { Typography, Divider } from "@mui/material";
import {
  ErrorIcon,
  ErrorText,
  ErrorWrapper,
  ReviewLabel,
  ReviewsWrapper,
  Wrapper,
} from "./style";
import { ReviewData } from "../../pages/general-analysis/general-analysis-model";

interface Props {
  reviewData: ReviewData;
  error?: string;
  disabled: boolean;
}

export const DataValidityInfo = ({ reviewData, error, disabled }: Props) => {
  const { startDate, endDate, rows, total } = reviewData;

  if (error) {
    return (
      <Wrapper>
        <ReviewsWrapper>
          <ErrorWrapper>
            <ErrorIcon />
            <ErrorText>{error}</ErrorText>
          </ErrorWrapper>
        </ReviewsWrapper>
      </Wrapper>
    );
  }

  if (disabled) {
    return (
      <Wrapper>
        <ReviewsWrapper />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ReviewsWrapper>
        <ReviewLabel>
          <Typography variant="body2">Start date:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {startDate}
          </Typography>
        </ReviewLabel>
        <Divider />
        <ReviewLabel>
          <Typography variant="body2">End date:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {endDate}
          </Typography>
        </ReviewLabel>
        <Divider />
        <ReviewLabel>
          <Typography variant="body2">Rows:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {rows}
          </Typography>
        </ReviewLabel>
        <Divider />
        <ReviewLabel>
          <Typography variant="body2">Total:</Typography>
          <Typography variant="body2" fontWeight="bold">
            {Math.abs(total).toFixed(2)}
          </Typography>
        </ReviewLabel>
      </ReviewsWrapper>
    </Wrapper>
  );
};
