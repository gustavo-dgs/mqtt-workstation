import { Stack } from "@mui/material";
import LateralMenu from "./LateralMenu";
import Flow from "./Flow";

const WorkArea = () => {
  return (
    <Stack
      direction={"row"}
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <LateralMenu />
      <Flow />
    </Stack>
  );
};

export default WorkArea;
