import "reactflow/dist/style.css";
import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  updateEdge,
} from "reactflow";
import CustomNode from "./CustomNode";

const nodeTypes = { customNode: CustomNode };

const Flow = ({ nodes, edges, setEdges, onNodesChange, onEdgesChange }) => {
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
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
      defaultEdgeOptions={{ type: "smoothstep" }}
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
