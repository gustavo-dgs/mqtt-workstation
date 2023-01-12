import React, { useContext, createContext, useMemo } from "react";
import { useNodesState, useEdgesState } from "reactflow";

const FlowContextState = createContext();
const FlowContextApi = createContext();

const useFlowContextState = () => useContext(FlowContextState);
const useFlowContextApi = () => useContext(FlowContextApi);

const FlowContextProvider = ({ children }) => {
  // console.log("FlowContextProvider");

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const stateValue = useMemo(
    () => ({ nodes, edges, onNodesChange, onEdgesChange }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nodes, edges, onNodesChange, onEdgesChange]
  );
  const apiValue = useMemo(
    () => ({ setNodes, setEdges }),
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
