import React, { useContext, createContext, useMemo, useCallback } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import { defaultNode, nodeCollection } from "./nodeCollection";
import { randomId } from "../../utils";
import { useAppContextApi, useAppContextUser } from "../../hooks/contextHooks";

const FlowContextState = createContext();
const FlowContextApi = createContext();

const useFlowContextState = () => useContext(FlowContextState);
const useFlowContextApi = () => useContext(FlowContextApi);

/*
data = {
  icon: "💡",
  label: "Lampada",
  isOnline: true,
  level,
  deviceId,
}
*/

const FlowContextProvider = ({ children }) => {
  // console.log("FlowContextProvider");

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { updateDevice } = useAppContextApi();
  const { user, workstation } = useAppContextUser();

  const addNewNode = useCallback(
    (position = { x: 0, y: 0 }, type = defaultNode.name, data) => {
      const nodeId = randomId();

      setNodes((prevNodes) => {
        const newNode = {
          id: nodeId,
          type,
          data: {
            ...data,
            level: 0,
          },
          position,
        };

        return [...prevNodes, newNode];
      });

      return nodeId;
    },
    [setNodes]
  );

  const addDeviceNode = useCallback(
    (position = { x: 0, y: 0 }, device) => {
      const nodeData = nodeCollection.DeviceNode.setData(device, null, null);
      const nodeId = addNewNode(
        position,
        nodeCollection.DeviceNode.name,
        nodeData
      );
      device.nodeId = nodeId;
      device.workstationId = workstation;
      device.domain = user;
      updateDevice(device);
    },
    [addNewNode, updateDevice, user, workstation]
  );

  const addNewGroup = useCallback(
    (position = { x: 0, y: 0 }) => {
      addNewNode(position, nodeCollection.CustomGroup.name, {
        label: "Group",
      });
    },
    [addNewNode]
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
      addDeviceNode,
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
