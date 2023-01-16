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
import { useFlowContextState, useFlowContextApi } from "../flowContext";
import {
  isInsideAGroup,
  hasChildren,
  calculateAbsolutePosition,
  updateChildrensLevel,
} from "./nodeUtilis";
import { nodeCollection, nodeTypes } from "../nodeCollection";
import { useAppContextApi } from "../../../hooks/contextHooks";

const Flow = () => {
  // console.log("Flow");
  const { addSuscription, removeSuscription } = useAppContextApi();
  const { nodes, edges, onNodesChange, onEdgesChange } = useFlowContextState();
  const { setEdges, setNodes, addNewNode, addDeviceNode } = useFlowContextApi();
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  // target is the node that the node is dragged over
  const [target, setTarget] = useState(null);
  const reactFlowWrapper = useRef(null);
  // this ref stores the current dragged node
  const dragRef = useRef(null);

  //Create new edges
  const onConnect = useCallback(
    (connection) => {
      if (connection.targetHandle === "target") {
        connection.markerEnd = { type: MarkerType.ArrowClosed };
      } else {
        connection.markerStart = { type: MarkerType.ArrowClosed };
      }

      setEdges((eds) => addEdge(connection, eds));

      addSuscription(connection, nodes);
    },
    [nodes, setEdges, addSuscription]
  );

  //Update existing edges
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => {
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
      console.log("onEdgeUpdate", newConnection);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onEdgesDelete = useCallback(
    (edgesToDelete) => {
      // setEdges((els) => els.filter((el) => !edgesToDelete.includes(el)));
      removeSuscription(edgesToDelete, nodes);
    },
    [nodes, removeSuscription]
  );

  //Add a div inside the flow
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeInfo = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (!nodeInfo) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const json = JSON.parse(nodeInfo);

      switch (json.type) {
        case nodeCollection.DeviceNode.name:
          addDeviceNode(position, json.data.device);
          break;

        default:
          addNewNode(position, json.type, json.data);
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [reactFlowInstance]
  );

  //save the current node when it starts to be dragged
  const onNodeDragStart = (evt, node) => {
    dragRef.current = node;
  };

  //set the target group
  const onNodeDrag = (evt, node) => {
    // find a node where the center point is inside

    const possibleTargets =
      nodes.filter((n) => {
        return isInsideAGroup(node, n, nodes);
      }) || [];

    //If there is no target, set target to outside
    if (possibleTargets.length === 0) {
      setTarget("outside");
      return;
    }

    //If there is only one target
    if (possibleTargets.length === 1) {
      //If the target is the parent node do nothing
      if (possibleTargets[0].id === node.parentNode) {
        setTarget("parentNode");
        return;
      }

      //If the target is a new parent node, set the target
      setTarget(possibleTargets[0]);
      return;
    }

    //If there is more than one target, find the younger son
    for (const n of possibleTargets) {
      if (!hasChildren(n, nodes)) {
        setTarget(n);
        return;
      }
    }
  };

  //Add or remove a node from a group
  const onNodeDragStop = (evt, node) => {
    // console.log("target", target, "parent", node.parentNode);

    //Remove hover effect from all groups
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.type === "customGroup") {
          node.style = { ...node.style, boxShadow: "none" };
        }
        return node;
      })
    );

    //If im inside a group add me to it
    if (target && typeof target === "object") {
      // calculate absolute position of the nodes
      const absolutePositionA = calculateAbsolutePosition(node, nodes);
      const absolutePositionB = calculateAbsolutePosition(target, nodes);

      //Calculate the position of the node inside the group
      const position = {
        x: absolutePositionA.x - absolutePositionB.x,
        y: absolutePositionA.y - absolutePositionB.y,
      };

      //Calculate the new level of the node
      const level = target.data.level + 1;

      setNodes((prevNodes) => {
        const newNodes = prevNodes.map((n) => {
          if (n.id === node.id) {
            n.parentNode = target.id;
            n.position = position;
            n.data = { ...n.data, level };
            // n.extent = "parent";
            // n.zIndex = 1000;
          }
          return n;
        });

        //If node is a gruop update the level of the childrens
        updateChildrensLevel(node, newNodes);

        //Sort the nodes by level
        newNodes.sort((a, b) => a.data.level - b.data.level);

        return newNodes;
      });

      // if im outside the parent node remove me from it
    } else if (target && target === "outside" && node.parentNode) {
      const position = {
        x: node.positionAbsolute.x,
        y: node.positionAbsolute.y,
      };

      setNodes((prevNodes) => {
        const newNodes = prevNodes.map((n) => {
          if (n.id === node.id) {
            n.parentNode = null;
            n.position = position;
            n.data = { ...n.data, level: 0 };
          }
          return n;
        });

        //If node is a gruop update the level of the childrens
        updateChildrensLevel(node, newNodes);

        //Sort the nodes by level
        newNodes.sort((a, b) => a.data.level - b.data.level);

        return newNodes;
      });
    }

    // if im inside the parent node do nothing
    // if (target && target === "parentNode") nothing;

    // if im outside the parent node and i dont have a parent do nothing
    // if (!target && !node.parentNode) nothing;

    // if I made click inside my parent do nothing
    // if (!target && node.parentNode) nothing;

    setTarget(null);
    dragRef.current = null;
  };

  //Add hover effect to the target group
  useEffect(() => {
    if (!target) {
      return;
    }
    setNodes((prevNodes) => {
      const newNodes = prevNodes.map((node) => {
        if (node.id === target.id) {
          node.style = { ...node.style, boxShadow: "0 0 30px #0ddbdb" };
        } else {
          node.style = { ...node.style, boxShadow: "none" };
        }
        return node;
      });
      return newNodes;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

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
        onEdgesDelete={onEdgesDelete}
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
