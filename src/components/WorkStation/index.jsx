import { useEffect, useRef } from "react";
import { Stack } from "@mui/material";
import { FlowContextProvider } from "./flowContext";
import LeftMenu from "./menu/LeftMenu";
import RightMenu from "./menu/RightMenu";
import Flow from "./Flow";
import { useAppContextApi } from "../../hooks/contextHooks";

const WIDTH = "270px";

const WorkArea = () => {
  // console.log("WorkArea");

  const { getDevicesFromDb } = useAppContextApi();
  const firstTimeRef = useRef(true);

  useEffect(() => {
    if (firstTimeRef.current) {
      firstTimeRef.current = false;
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
            right: 0,
          }}
        >
          <LeftMenu width={WIDTH} />
          <Flow />
          <RightMenu width={WIDTH} />
        </Stack>
      </FlowContextProvider>
    </>
  );
};

export default WorkArea;
