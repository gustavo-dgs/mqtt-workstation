import React, { useState, useMemo } from "react";
import {
  Box,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  useAppContextState,
  useAppContextUser,
} from "../../../hooks/contextHooks";
import { useFlowContextApi } from "../flowContext";
import DeviceNode from "../nodeCollection/DeviceNode";
import DraggableBox from "../../../components/_shared/DraggableBox";
import icons from "../../../constants/icons";
import { nodeCollection } from "../nodeCollection";
import { grey } from "@mui/material/colors";

const toolNodes = [
  nodeCollection.CustomGroup.name,
  nodeCollection.ActionNode.name,
];

const AccordeonStep = ({
  title,
  name,
  data,
  expanded,
  handleChange,
  renderItems,
}) => {
  return (
    <Accordion expanded={expanded === name} onChange={handleChange(name)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={400} variant="h7">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "10px" }}>
        <Stack
          direction="column"
          flexWrap="wrap"
          justifyContent={"center"}
          spacing={1}
        >
          {data.map(renderItems)}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

const LateralMenu = ({ width }) => {
  // console.log("LateralMenu");
  const [expanded, setExpanded] = useState(false);
  const { newBrokerDevices, oldBrokerDevices } = useAppContextState();
  const { removeDeviceFromWorkstation } = useFlowContextApi();
  const { workstation } = useAppContextUser();

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

  const accordeons = useMemo(
    () => [
      {
        title: "New Connections",
        name: "panel1",
        data: newBrokerDevices,
        renderItems: (item) => {
          const data = nodeCollection.DeviceNode.setData(
            item,
            icons.NEW_DEVICE_ICON
          );
          const type = nodeCollection.DeviceNode.name;
          return (
            <DraggableBox
              width={"100%"}
              key={item.mqttId}
              onDragStart={(e) => onDragStart(e, type, data)}
              draggable={true}
              display={"flex"}
              flexDirection={"row"}
            >
              <DeviceNode data={data} width={"100%"} disabled />
              <IconButton onClick={() => removeDeviceFromWorkstation(item)}>
                <DeleteOutlinedIcon />
              </IconButton>
            </DraggableBox>
          );
        },
      },
      {
        title: "Tools",
        name: "panel3",
        data: toolNodes,
        renderItems: (item) => {
          const data = nodeCollection[item].setData(nodeCollection[item].name);
          const type = nodeCollection[item].name;
          const Component = nodeCollection[item].component;
          return (
            <DraggableBox
              width={"100%"}
              key={item}
              onDragStart={(e) => onDragStart(e, type, data)}
              draggable={true}
            >
              <Component data={data} width={"100%"} disabled />
            </DraggableBox>
          );
        },
      },
      {
        title: "Workstation Devices",
        name: "panel2",
        data: oldBrokerDevices,
        renderItems: (item) => {
          const data = nodeCollection.DeviceNode.setData(
            item,
            icons.NEW_DEVICE_ICON
          );
          const type = nodeCollection.DeviceNode.name;
          return (
            <DraggableBox
              width={"100%"}
              key={item.mqttId}
              onDragStart={(e) => onDragStart(e, type, data)}
              draggable={false}
              display={"flex"}
              flexDirection={"row"}
            >
              <DeviceNode data={data} width={"100%"} disabled />
              <IconButton onClick={() => removeDeviceFromWorkstation(item)}>
                <DeleteOutlinedIcon />
              </IconButton>
            </DraggableBox>
          );
        },
      },
    ],
    [newBrokerDevices, oldBrokerDevices, removeDeviceFromWorkstation]
  );

  return (
    <Box
      sx={{
        width: width,
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: width,
        height: "100%",
        backgroundColor: grey[100],
      }}
      // padding={1}
      overflow={"scroll"}
    >
      <Stack spacing={3}>
        <Stack spacing={3} p={2}>
          <Typography fontWeight={400} variant="h5">
            {workstation ? workstation.name : "Workstation"}
          </Typography>
        </Stack>

        <Stack>
          {accordeons.map((accordeon) => (
            <AccordeonStep
              key={accordeon.name}
              {...accordeon}
              expanded={expanded}
              handleChange={handleChange}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default LateralMenu;
