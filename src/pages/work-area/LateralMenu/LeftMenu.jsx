import React, { memo, useState, useMemo } from "react";
import {
  Box,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  useAppContextState,
  useAppContextUser,
} from "../../../hooks/contextHooks";
import { useFlowContextApi } from "./../flowContext";
import DeviceNode from "../nodeCollection/DeviceNode";
import DraggableBox from "../../../components/DraggableBox";
import icons from "../../../constants/icons";
import { nodeCollection } from "../nodeCollection";

const ComponentWithNewBorkerDevices = (Component) => {
  const MemoComponent = memo(Component);

  return function WithNewBorkerDevices() {
    const { newBrokerDevices, oldBrokerDevices } = useAppContextState();

    return (
      <MemoComponent
        newBrokerDevices={newBrokerDevices}
        oldBrokerDevices={oldBrokerDevices}
      />
    );
  };
};

const AccordeonStep = ({
  title,
  name,
  data,
  expanded,
  handleChange,
  onDragStart,
  draggable,
}) => {
  return (
    <Accordion expanded={expanded === name} onChange={handleChange(name)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={400} variant="h7">
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          direction="column"
          flexWrap="wrap"
          justifyContent={"center"}
          spacing={1}
        >
          {data.map((item) => {
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
                draggable={draggable}
              >
                <DeviceNode key={item.mqttId} data={data} disabled />
              </DraggableBox>
            );
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

const LateralMenu = ({ newBrokerDevices, oldBrokerDevices }) => {
  // console.log("LateralMenu");
  const [expanded, setExpanded] = useState(false);
  const { addNewGroup } = useFlowContextApi();
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
        draggable: true,
      },
      {
        title: "Workstation Devices",
        name: "panel2",
        data: oldBrokerDevices,
        draggable: false,
      },
    ],
    [newBrokerDevices, oldBrokerDevices]
  );

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
        <Stack spacing={3} p={2}>
          <Typography fontWeight={400} variant="h5">
            {workstation ? workstation.name : "Workstation"}
          </Typography>

          <Button
            onClick={() => addNewGroup({ x: 0, y: 0 })}
            variant="outlined"
            sx={{ alignSelf: "center", justifySelf: "center" }}
          >
            Add Group
          </Button>
        </Stack>

        <Stack>
          {accordeons.map((accordeon) => (
            <AccordeonStep
              key={accordeon.name}
              name={accordeon.name}
              data={accordeon.data}
              title={accordeon.title}
              draggable={accordeon.draggable}
              expanded={expanded}
              handleChange={handleChange}
              onDragStart={onDragStart}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ComponentWithNewBorkerDevices(LateralMenu);
