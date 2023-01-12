import "reactflow/dist/style.css";
import ReactFlow, { Background, Controls, MiniMap } from "reactflow";

// import { Stack, Box } from "@mui/material";

// const initialNodes = [
//   { id: "1", position: { x: 0, y: 0 }, data: { label: "node 1" } },
//   { id: "2", position: { x: 0, y: 100 }, data: { label: "node 2" } },
// ];

// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const Flow = () => {
  return (
    <ReactFlow fitView>
      <Background variant="dots" gap={12} size={1} />
      <MiniMap nodeStrokeWidth={3} />
      <Controls />
    </ReactFlow>
  );
};

export default Flow;
