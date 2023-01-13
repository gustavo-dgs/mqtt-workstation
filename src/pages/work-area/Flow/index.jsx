import "reactflow/dist/style.css";
import { useCallback, useRef, useState, useEffect } from "react";
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
  const { setEdges, setNodes, addNewNode } = useFlowContextApi();
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // target is the node that the node is dragged over
  const [target, setTarget] = useState(null);
  const reactFlowWrapper = useRef(null);
  // this ref stores the current dragged node
  const dragRef = useRef(null);

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

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      addNewNode(position);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reactFlowInstance]
  );

  const onNodeDragStart = (evt, node) => {
    dragRef.current = node;
  };

  const isInsideItsParent = (nodeA, nodeB) => {
    // calculate the center point of the node from position and dimensions
    const centerX = nodeA.position.x + nodeA.width / 2;
    const centerY = nodeA.position.y + nodeA.height / 2;

    return (
      nodeB.id === nodeA.parentNode &&
      centerX > 0 &&
      centerX < nodeB.width &&
      centerY > 0 &&
      centerY < nodeB.height
    );
  };

  const isInsideAGruop = (nodeA, nodeB) => {
    // calculate the center point of the node from position and dimensions
    const centerX = nodeA.position.x + nodeA.width / 2;
    const centerY = nodeA.position.y + nodeA.height / 2;

    return (
      centerX > nodeB.position.x &&
      centerX < nodeB.position.x + nodeB.width &&
      centerY > nodeB.position.y &&
      centerY < nodeB.position.y + nodeB.height &&
      nodeB.type === "group" &&
      nodeB.id !== nodeA.id // this is needed, otherwise we would always find the dragged node
    );
  };

  const onNodeDrag = (evt, node) => {
    // find a node where the center point is inside

    for (const n of nodes) {
      //Im inside my parent?
      if (isInsideItsParent(node, n)) {
        setTarget("parentNode");
        return;
      }

      //Im inside a new group?
      if (isInsideAGruop(node, n) && n.id !== node.parentNode) {
        setTarget(n);
        return;
      }
    }

    //Im outside
    setTarget("outside");
  };

  // useEffect(() => {
  //   if (!target) {
  //     return;
  //   }
  //   setNodes((prevNodes) => {
  //     const newNodes = prevNodes.map((node) => {
  //       if (node.id === target.id) {
  //         node.style = { ...node.style, shadow: "0 0 10px 5px #1890ff" };
  //       } else {
  //         node.style = { ...node.style, shadow: "none" };
  //       }
  //       return node;
  //     });
  //     return newNodes;
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [target]);

  const onNodeDragStop = (evt, node) => {
    // on drag stop, we add the node to the group
    console.log("target", target, "parent", node.parentNode);

    //If im inside a group
    if (target && typeof target === "object") {
      const position = {
        x: node.position.x - target.position.x,
        y: node.position.y - target.position.y,
      };

      setNodes((nodes) =>
        nodes.map((n) => {
          if (n.id === node.id) {
            n.parentNode = target.id;
            n.position = position;
            // n.extent = "parent";

            n.zIndex = 1000;
          }
          return n;
        })
      );

      // if im outside the parent node
    } else if (target && target === "outside" && node.parentNode) {
      const parent = nodes.find((n) => n.id === node.parentNode);

      const position = {
        x: node.position.x + parent.position.x,
        y: node.position.y + parent.position.y,
      };

      setNodes((nodes) =>
        nodes.map((n) => {
          if (n.id === node.id) {
            n.parentNode = null;
            n.position = position;
            n.zIndex = 0;
          }
          return n;
        })
      );
    }

    // if im inside the parent node
    // if (target && target === "parentNode") nothing;

    // if im outside the parent node and i dont have a parent
    // if (!target && !node.parentNode) nothing;

    // if I made click inside my parent
    // if (!target && node.parentNode) nothing;

    setTarget(null);
    dragRef.current = null;
  };

  //  useEffect(() => {
  //    // whenever the target changes, we swap the colors temporarily
  //    // this is just a placeholder, implement your own logic here
  //    setNodes((nodes) =>
  //      nodes.map((node) => {
  //        if (node.id === target?.id) {
  //          node.style = {
  //            ...node.style,
  //            backgroundColor: dragRef.current?.data.color,
  //          };
  //          node.data = { ...node.data, label: dragRef.current?.data.color };
  //        } else if (node.id === dragRef.current?.id && target) {
  //          node.style = { ...node.style, backgroundColor: target.data.color };
  //          node.data = { ...node.data, label: target.data.color };
  //        } else {
  //          node.style = { ...node.style, backgroundColor: node.data.color };
  //          node.data = { ...node.data, label: node.data.color };
  //        }
  //        return node;
  //      })
  //    );
  //  }, [target]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeUpdate={onEdgeUpdate}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
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
    </div>
  );
};

export default Flow;
