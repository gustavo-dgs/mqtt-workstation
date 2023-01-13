import React, { useContext, createContext, useMemo, useCallback } from "react";
import { useNodesState, useEdgesState } from "reactflow";

const FlowContextState = createContext();
const FlowContextApi = createContext();

const useFlowContextState = () => useContext(FlowContextState);
const useFlowContextApi = () => useContext(FlowContextApi);

const FlowContextProvider = ({ children }) => {
  // console.log("FlowContextProvider");

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const addNewNode = useCallback(
    (position = { x: 0, y: 0 }) => {
      setNodes((prevNodes) => {
        const maxId =
          prevNodes.length > 0
            ? Math.max(...prevNodes.map((node) => Number.parseInt(node.id)))
            : 0;

        const newStringId = (maxId + 1).toString();

        const newNode = {
          id: newStringId,
          type: "customNode",
          data: { label: "Node-" + newStringId, level: 0 },
          position,
        };

        return [...prevNodes, newNode];
      });
    },
    [setNodes]
  );

  const addNewGroup = useCallback(
    (position = { x: 0, y: 0 }) => {
      setNodes((prevNodes) => {
        const maxId =
          prevNodes.length > 0
            ? Math.max(...prevNodes.map((node) => Number.parseInt(node.id)))
            : 0;

        const newStringId = (maxId + 1).toString();

        const newNode = {
          id: newStringId,
          type: "group",
          data: { label: null, level: 0 },
          position,
          style: {
            width: 270,
            height: 240,
          },
        };

        return [...prevNodes, newNode];
      });
    },
    [setNodes]
  );

  const removeNodeFromGroup = useCallback(
    (nodeId) => {
      setNodes((prevNodes) => {
        const newNodes = prevNodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              parentNode: null,
            };
          }
          return node;
        });
        return newNodes;
      });
    },
    [setNodes]
  );

  const stateValue = useMemo(
    () => ({ nodes, edges, onNodesChange, onEdgesChange }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, edges, onNodesChange, onEdgesChange]
  );
  const apiValue = useMemo(
    () => ({
      setNodes,
      setEdges,
      addNewNode,
      addNewGroup,
      removeNodeFromGroup,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setNodes, setEdges, addNewNode, addNewGroup, removeNodeFromGroup]
  );

  return (
    <FlowContextState.Provider value={stateValue}>
      <FlowContextApi.Provider value={apiValue}>
        {children}
      </FlowContextApi.Provider>
    </FlowContextState.Provider>
  );
};

export { FlowContextProvider, useFlowContextState, useFlowContextApi };
