import React, { useState, useMemo, useEffect } from "react";
import { Box, Stack, TextField } from "@mui/material";
import { useFlowContextApi, useFlowContextState } from "../flowContext";
import { nodeCollection } from "../nodeCollection";
import { grey } from "@mui/material/colors";

const getFieldComponent = (type, label, required, value, onTextFieldChange) => {
  switch (type) {
    case "text":
      return (
        <TextField
          key={label}
          label={label || ""}
          required={required}
          variant="outlined"
          value={value}
          onChange={(e) => onTextFieldChange(e, label)}
          size={"small"}
          fullWidth
        />
      );

    // case "json":
    //   return (

    //   );
    default:
      return null;
  }
};

const RightMenu = ({ width }) => {
  const { setNodes } = useFlowContextApi();
  const { nodes } = useFlowContextState();
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!nodes) return;
    const selectedNode = nodes.find((node) => node.selected);
    console.log("selectedNode", selectedNode);
    setSelectedNode(selectedNode);
  }, [nodes]);

  const CurrentCard = useMemo(() => {
    if (!selectedNode) return null;
    return nodeCollection[selectedNode.type].component;
  }, [selectedNode]);

  const model = useMemo(() => {
    if (!selectedNode) return [];
    return nodeCollection[selectedNode.type].model;
  }, [selectedNode]);

  const onTextFieldChange = (e, label) => {
    const value = e.target.value;

    setNodes((prevNodes) => {
      const newNodes = prevNodes.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              [label]: value,
            },
          };
        }
        return node;
      });

      return newNodes;
    });
  };

  return (
    <Box
      sx={{
        width: width,
        height: "100%",
        backgroundColor: grey[100],
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: width,
      }}
      padding={"20px"}
    >
      {selectedNode && (
        <Stack direction="column" spacing={3}>
          <CurrentCard data={selectedNode.data} width={"100%"} disabled />
          <Stack direction="column" spacing={1}>
            {model.map((item) =>
              getFieldComponent(
                item.type,
                item.label,
                item.required,
                selectedNode.data[item.label],
                onTextFieldChange
              )
            )}
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default RightMenu;
