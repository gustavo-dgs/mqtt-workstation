import { Stack } from "@mui/material";
import { FlowContextProvider } from "./flowContext";
import LateralMenu from "./LateralMenu";
import Flow from "./Flow";

const WorkArea = () => {
  console.log("WorkArea");

  return (
    <>
      <FlowContextProvider>
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
      </FlowContextProvider>
    </>
  );
};

export default WorkArea;
