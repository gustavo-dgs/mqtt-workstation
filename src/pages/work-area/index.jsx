import { useEffect } from "react";
import { Stack } from "@mui/material";
import LateralMenu from "./LateralMenu";
import Flow from "./Flow";
import { useNodesState, useEdgesState } from "reactflow";

const WorkArea = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const addNewNode = () => {
    setNodes((prevNodes) => {
      const maxId =
        prevNodes.length > 0
          ? Math.max(...prevNodes.map((node) => Number.parseInt(node.id)))
          : 0;

      const newStringId = (maxId + 1).toString();

      const newNode = {
        id: newStringId,
        type: "customNode",
        data: { label: "Node-" + newStringId },
        position: { x: 0, y: 0 },
        // style: { backgroundColor: "#6ede87", color: "white" },
      };

      return [...prevNodes, newNode];
    });
  };

  return (
    <Stack
      direction={"row"}
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <LateralMenu addNewNode={addNewNode} />
      <Flow
        nodes={nodes}
        edges={edges}
        setEdges={setEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
    </Stack>
  );
};

export default WorkArea;
