import React, { useMemo } from "react";
import NodeTemplate from "./NodeTemplate";
import { Handle, Position } from "reactflow";
import { Box, Badge } from "@mui/material";
import { cyan } from "@mui/material/colors";
import icons from "../../../constants/icons";
import { useAppContextState } from "../../../hooks/contextHooks";
import { CARD_NODE_WIDTH } from "../nodeCollection";

const DeviceNode = ({ data, disabled, width }) => {
  const { brokerDevices } = useAppContextState();
  let { device, color, icon } = data;
  color = color || cyan;
  icon = icon || icons.NEW_DEVICE_ICON;

  const isOnline = useMemo(() => {
    const newDevice = brokerDevices.get(device.mqttId);
    return newDevice?.isOnline;
  }, [brokerDevices, device.mqttId]);

  return (
    <>
      <Box
        width={width || CARD_NODE_WIDTH}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"center"}
      >
        <Badge
          color={isOnline ? "success" : "error"}
          badgeContent=" "
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          sx={{ width: "100%" }}
        >
          <NodeTemplate
            label={device.label || device.mqttId}
            icon={icon}
            color={color}
            width={"100%"}
          />
          {!disabled && (
            <>
              <Handle
                id={"source"}
                type={"source"}
                position={Position.Right}
                style={{
                  backgroundColor: "red",
                  width: 10,
                  height: 10,
                }}
              />
              <Handle
                id={"target"}
                type={"target"}
                position={Position.Left}
                style={{
                  backgroundColor: "cyan",
                  width: 10,
                  height: 10,
                }}
              />
            </>
          )}
        </Badge>
      </Box>
    </>
  );
};

export default DeviceNode;
