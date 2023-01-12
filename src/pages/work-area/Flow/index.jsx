import "reactflow/dist/style.css";
import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  updateEdge,
  MarkerType,
} from "reactflow";
import CustomNode from "./CustomNode";
import { useFlowContextState, useFlowContextApi } from "../flowContext";

const nodeTypes = { customNode: CustomNode };

const Flow = () => {
  // console.log("Flow");

  const { nodes, edges, onNodesChange, onEdgesChange } = useFlowContextState();
  const { setEdges } = useFlowContextApi();

  const onConnect = useCallback(
    (connection) => {
      if (connection.targetHandle === "target") {
        connection.markerEnd = { type: MarkerType.ArrowClosed };
      } else {
        connection.markerStart = { type: MarkerType.ArrowClosed };
      }

      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onEdgeUpdate={onEdgeUpdate}
      deleteKeyCode={"Delete"}
      nodeTypes={nodeTypes}
      defaultEdgeOptions={{
        type: "smoothstep",
        style: {
          strokeWidth: 2,
          // stroke: "#FF0072",
        },
      }}
      connectionLineType="smoothstep"
      fitView
    >
      <Background variant="dots" gap={12} size={1} />
      <MiniMap nodeStrokeWidth={3} />
      <Controls />
    </ReactFlow>
  );
};

export default Flow;
