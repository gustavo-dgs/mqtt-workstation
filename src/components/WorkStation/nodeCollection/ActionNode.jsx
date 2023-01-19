import React, { useMemo } from "react";
import NodeTemplate from "./NodeTemplate";
import { Handle, Position } from "reactflow";
import { amber } from "@mui/material/colors";
import icons from "../../../constants/icons";
import { Stack, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MqttClient from "../../../services/mqtt-client";

const ActionNode = ({ id, data, disabled, width }) => {
  let { color, icon, label, device, payload } = data;
  color = color || amber;
  icon = icon || icons.NEW_WSCLIENT_ICON;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mqttClient = useMemo(() => (disabled ? null : new MqttClient()), []);

  const onClick = () => {
    mqttClient.publish(device.channel, payload);
  };

  if (disabled) {
    return (
      <NodeTemplate
        label={label || device?.label || "ActionNode-" + id}
        icon={icon}
        color={color}
        width={width}
      />
    );
  }

  return (
    <>
      <Stack direction={"row"} alignItems={"center"}>
        <IconButton
          sx={{
            border: `3px solid ${amber[50]}`,
            borderRadius: 0,
            boxShadow: 1,
            width: "35px",
            height: "35px",
            bgcolor: amber[100],
          }}
          color={"warning"}
          onClick={onClick}
        >
          <SendIcon />
        </IconButton>
        <NodeTemplate
          label={label || "ActionNode-" + id}
          icon={icon}
          color={color}
          width={width}
        />
      </Stack>
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
    </>
  );
};

export default ActionNode;
