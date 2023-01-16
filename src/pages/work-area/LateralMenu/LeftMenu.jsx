import React, { memo, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { useAppContextState } from "../../../hooks/contextHooks";
import { useFlowContextApi } from "./../flowContext";
import CustomNode from "../nodeCollection/CustomNode";
import DeviceNode from "../nodeCollection/DeviceNode";
import DraggableBox from "../../../components/DraggableBox";
import icons from "../../../constants/icons";
import { nodeCollection } from "../nodeCollection";

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
  // console.log("LateralMenu");
  const [expanded, setExpanded] = useState(false);
  const { addNewNode, addNewGroup } = useFlowContextApi();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onDragStart = (event, type, data) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ type, data })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box
      sx={{
        width: 380,
        height: "100%",
        backgroundColor: "white",
      }}
      // padding={1}
      overflow={"scroll"}
    >
      <Stack spacing={3}>
        <Stack spacing={3} p={"2px"}>
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
        </Stack>

        <Stack>
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-content"
            >
              <Typography fontWeight={400} variant="h7">
                New Connections
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack
                direction="column"
                flexWrap="wrap"
                justifyContent={"center"}
                spacing={1}
              >
                {newBrokerDevices.map((device) => (
                  <DraggableBox
                    width={"100%"}
                    key={device.mqttId}
                    onDragStart={(e) => {
                      const type = nodeCollection.DeviceNode.name;
                      const data = { device, icon: icons.NEW_DEVICE_ICON };

                      onDragStart(e, type, data);
                    }}
                  >
                    <DeviceNode
                      key={device.mqttId}
                      data={{ device }}
                      disabled
                    />
                  </DraggableBox>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls="panel2a-content"
              id="panel2a-content"
            >
              <Typography variant="h7">Devices</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="row" flexWrap="wrap" justifyContent={"center"}>
                {initialDevices.map((data, index) => (
                  <DraggableBox
                    width={80}
                    height={80}
                    key={index}
                    m={0.8}
                    onDragStart={(e) => {
                      const nodeType = nodeCollection.CustomNode.name;
                      const nodeData = {
                        icon: icons.NEW_DEVICE_ICON,
                        label: data.label,
                      };

                      onDragStart(e, nodeType, nodeData);
                    }}
                  >
                    <CustomNode id={index} data={data} disabled />
                  </DraggableBox>
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
