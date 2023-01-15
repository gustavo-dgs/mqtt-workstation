import React, { memo } from "react";
import {
  Box,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
// import { ExpandMoreIcon } from "@mui/icons-material";
import { useAppContextState } from "../../hooks/contextHooks";
import { useFlowContextApi } from "./flowContext";
import CustomNode from "./Flow/CustomNode";

// const initialDevices = [
//   "💡",
//   "🌡",
//   "🎮",
//   "🔊",
//   "🎤",
//   "📱",
//   "💻",
//   "📺",
//   "📷",
//   "📡",
// ];

const initialDevices = [
  { icon: "💡", label: "Lampada", isOnline: false, level: 0, deviceId: "1" },
  { icon: "🌡", label: "Termometro", isOnline: false, level: 0, deviceId: "2" },
  { icon: "🎮", label: "Controle", isOnline: false, level: 0, deviceId: "3" },
  { icon: "🔊", label: "Som", isOnline: false, level: 0, deviceId: "4" },
  { icon: "🎤", label: "Microfone", isOnline: false, level: 0, deviceId: "5" },
  { icon: "📱", label: "Celular", isOnline: false, level: 0, deviceId: "6" },
  { icon: "💻", label: "Computador", isOnline: false, level: 0, deviceId: "7" },
  { icon: "📺", label: "TV", isOnline: false, level: 0, deviceId: "8" },
  { icon: "📷", label: "Camera", isOnline: false, level: 0, deviceId: "9" },
  { icon: "📡", label: "Roteador", isOnline: false, level: 0, deviceId: "10" },
];

const ComponentWithNewBorkerDevices = (Component) => {
  const MemoComponent = memo(Component);

  return function WithNewBorkerDevices() {
    const { newBrokerDevices } = useAppContextState();

    return <MemoComponent newBrokerDevices={newBrokerDevices} />;
  };
};

const LateralMenu = ({ newBrokerDevices }) => {
  console.log("LateralMenu");

  const { addNewNode, addNewGroup } = useFlowContextApi();

  const onDragStart = (event, icon) => {
    event.dataTransfer.setData("application/reactflow", icon);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box
      sx={{
        width: 380,
        height: "100%",
        backgroundColor: "white",
      }}
      padding={1}
      overflow={"scroll"}
    >
      <Stack spacing={3}>
        <Button
          variant="contained"
          onClick={() => addNewNode({ x: 0, y: 0 })}
          sx={{ alignSelf: "center", justifySelf: "center" }}
        >
          Add Node
        </Button>
        <Button
          onClick={() => addNewGroup({ x: 0, y: 0 })}
          variant="outlined"
          sx={{ alignSelf: "center", justifySelf: "center" }}
        >
          Add Group
        </Button>

        <Stack>
          <Accordion>
            <AccordionSummary>
              <Typography variant="h7">New Connections</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {" "}
              <Stack direction="row" flexWrap="wrap" justifyContent={"center"}>
                {newBrokerDevices.map((device, index) => {
                  const data = {
                    icon: "📡",
                    label: device.label,
                    isOnline: true,
                    level: 0,
                    deviceId: device.mqttId,
                  };

                  return (
                    <Box
                      width={80}
                      height={80}
                      key={index}
                      m={0.8}
                      onDragStart={(event) => onDragStart(event, device)}
                      sx={{
                        "&:hover": {
                          cursor: "grab",
                        },
                        "&:active": {
                          cursor: "grabbing",
                        },
                      }}
                      draggable
                    >
                      <CustomNode id={device.mqttId} data={data} disabled />
                    </Box>
                  );
                })}
              </Stack>{" "}
            </AccordionDetails>
          </Accordion>

          <Accordion
            // expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <AccordionSummary>
              <Typography variant="h7">Devices</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="row" flexWrap="wrap" justifyContent={"center"}>
                {initialDevices.map((data, index) => (
                  <Box
                    width={80}
                    height={80}
                    key={index}
                    m={0.8}
                    onDragStart={(event) => onDragStart(event, data.icon)}
                    sx={{
                      "&:hover": {
                        cursor: "grab",
                      },
                      "&:active": {
                        cursor: "grabbing",
                      },
                    }}
                    draggable
                  >
                    <CustomNode id={index} data={data} disabled />
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ComponentWithNewBorkerDevices(LateralMenu);
