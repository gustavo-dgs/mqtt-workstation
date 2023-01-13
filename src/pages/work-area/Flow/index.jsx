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
import CustomGroup from "./CustomGroup";
import { useFlowContextState, useFlowContextApi } from "../flowContext";

const nodeTypes = { customNode: CustomNode, customGroup: CustomGroup };

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

  //Create new edges
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

  //Update existing edges
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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

  //Is node A son of node B?
  const isASon = (nodeA, nodeB) => {
    if (!nodeA || !nodeB) {
      return false;
    }

    if (nodes.length < 2) {
      return false;
    }

    if (nodeA.id === nodeB.id) {
      return false;
    }

    if (!nodeA.parentNode) {
      return false;
    }

    if (nodeA.parentNode === nodeB.id) {
      return true;
    }

    return isASon(
      nodes.find((n) => n.id === nodeA.parentNode),
      nodeB
    );
  };

  //check if the node is inside a group
  const isInsideAGroup = (nodeA, nodeB, nodesArr) => {
    if (!nodeA || !nodeB) {
      return false;
    }

    if (nodesArr.length < 2) {
      return false;
    }

    // check if the have a parent
    // if (nodeA.parentNode) {
    //   return false;
    // }

    // check if the node hava an absolute position
    const positionAttributeA = nodeA.parentNode
      ? "positionAbsolute"
      : "position";
    const positionAttributeB = nodeB.parentNode
      ? "positionAbsolute"
      : "position";

    // calculate the center point of the node from position and dimensions
    const centerX = nodeA[positionAttributeA].x + nodeA.width / 2;
    const centerY = nodeA[positionAttributeA].y + nodeA.height / 2;

    const isInsideB =
      centerX > nodeB[positionAttributeB].x &&
      centerX < nodeB[positionAttributeB].x + nodeB.width &&
      centerY > nodeB[positionAttributeB].y &&
      centerY < nodeB[positionAttributeB].y + nodeB.height &&
      nodeB.type === "customGroup" &&
      nodeB.id !== nodeA.id; // this is needed, otherwise we would always find the dragged node

    //Check if A is not inside a B's child
    if (isInsideB) {
      //If target (nodeB) is a child of the nodeA, return false
      if (isASon(nodeB, nodeA)) {
        return false;
      }

      nodesArr = nodesArr.filter((node) => node.id !== nodeB.id);

      for (let i = 0; i < nodesArr.length; i++) {
        if (nodesArr[i].parentNode === nodeB.id) {
          return !isInsideAGroup(nodeA, nodesArr[i], nodesArr);
        }
      }

      return true;
    }

    return false;
  };

  //set the target group
  const onNodeDrag = (evt, node) => {
    // find a node where the center point is inside

    for (const n of nodes) {
      //Im inside my parent?
      if (isInsideAGroup(node, n, nodes) && n.id === node.parentNode) {
        setTarget("parentNode");
        return;
      }

      //Im inside a new group?
      if (isInsideAGroup(node, n, nodes) && n.id !== node.parentNode) {
        setTarget(n);
        return;
      }
    }

    //Im outside
    setTarget("outside");
  };

  const updateChildrensLevel = (parentNode, nodesArr, copyArr) => {
    // console.log("updateChildrensLevel", parentNode.id);
    if (parentNode.type !== "customGroup") {
      return;
    }

    copyArr = copyArr || [...nodesArr];

    if (copyArr.length < 2) {
      return;
    }

    //remove parent node from copy
    copyArr = copyArr.filter((node) => node.id !== parentNode.id);

    for (let i = 0; i < copyArr.length; i++) {
      if (copyArr[i].parentNode === parentNode.id) {
        const index = nodesArr.findIndex((node) => node.id === copyArr[i].id);
        nodesArr[index].data.level = parentNode.data.level + 1;
        updateChildrensLevel(nodesArr[index], nodesArr, copyArr);
      }
    }
  };

  //Add or remove a node from a group
  const onNodeDragStop = (evt, node) => {
    console.log("target", target, "parent", node.parentNode);

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
      //Calculate the position of the node inside the group
      const position = {
        x: node.position.x - target.position.x,
        y: node.position.y - target.position.y,
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
