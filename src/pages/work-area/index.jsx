import { useEffect, useRef } from "react";
import { Stack } from "@mui/material";
import { FlowContextProvider } from "./flowContext";
import LateralMenu from "./LateralMenu";
import Flow from "./Flow";
import { useAppContextApi } from "../../hooks/contextHooks";

const WorkArea = () => {
  console.log("WorkArea");

  const { getDevicesFromDb } = useAppContextApi();
  const firstTimeRef = useRef(false);

  useEffect(() => {
    if (!firstTimeRef.current) {
      firstTimeRef.current = true;
      getDevicesFromDb();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
