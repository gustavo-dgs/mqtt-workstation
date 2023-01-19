import React, { useEffect } from "react";
import NodeTemplate from "./NodeTemplate";
import { Handle, Position } from "reactflow";
import { amber } from "@mui/material/colors";
import icons from "../../../constants/icons";
import { Stack, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import mqtt from "mqtt";

class MqttClient {
  static client = null;
}

const ActionNode = ({ id, data, disabled, width }) => {
  let { color, icon, label, device, payload } = data;
  color = color || amber;
  icon = icon || icons.NEW_WSCLIENT_ICON;

  const firtsLoad = React.useRef(true);

  useEffect(() => {
    if (firtsLoad.current) {
      firtsLoad.current = false;

      const options = {
        port: 1884,
        host: "localhost",
        clean: true,
      };

      const client = mqtt.connect(options);
      client.on("connect", () => console.log("Device connected"));
      // client.publish("test", "test");

      MqttClient.client = client;
    }
  }, []);

  const onClick = () => {
    const options = [
      {
        qos: 0,
        retain: false,
      },
    ];

    MqttClient.client.publish(device.channel, payload, options);
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
