import React from "react";
import NodeTemplate from "./NodeTemplate";
import { Handle, Position } from "reactflow";
import { Box, Badge } from "@mui/material";
import { cyan } from "@mui/material/colors";
import icons from "../../../constants/icons";

const DeviceNode = ({ data, disabled, width }) => {
  let { device, color, icon } = data;
  color = color || cyan;
  icon = icon || icons.NEW_DEVICE_ICON;

  return (
    <>
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"center"}
      >
        <Badge
          color={device.isOnline ? "success" : "error"}
          badgeContent=" "
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          sx={{ width: "100%" }}
        >
          <Box>
            <NodeTemplate
              label={device.label || device.mqttId}
              icon={icon}
              color={color}
              width={width}
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
          </Box>
        </Badge>
      </Box>
    </>
  );
};

export default DeviceNode;
