import React from "react";
import NodeTemplate from "./NodeTemplate";
import { Handle, Position } from "reactflow";
import { amber } from "@mui/material/colors";
import icons from "../../../constants/icons";
import { Stack, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const ActionNode = ({ id, data, disabled, width }) => {
  let { color, icon, label } = data;
  color = color || amber;
  icon = icon || icons.NEW_WSCLIENT_ICON;

  return (
    <>
      {!disabled && (
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
      )}
      {disabled && (
        <NodeTemplate
          label={label || "ActionNode-" + id}
          icon={icon}
          color={color}
          width={width}
        />
      )}
    </>
  );
};

export default ActionNode;
