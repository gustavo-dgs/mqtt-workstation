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
          data: { label: "Node-" + newStringId },
          position,
        };

        return [...prevNodes, newNode];
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
    () => ({ setNodes, setEdges, addNewNode }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setNodes, setEdges]
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
