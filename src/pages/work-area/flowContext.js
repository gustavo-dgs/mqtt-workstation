import React, {
  useContext,
  createContext,
  useCallback,
  useEffect,
} from "react";
import { useNodesState, useEdgesState } from "reactflow";
import { defaultNode, nodeCollection } from "./nodeCollection";
import { randomId } from "../../utils";
import {
  useAppContextApi,
  useAppContextUser,
  useAppContextState,
} from "../../hooks/contextHooks";

const FlowContextState = createContext();
const FlowContextApi = createContext();

const useFlowContextState = () => useContext(FlowContextState);
const useFlowContextApi = () => useContext(FlowContextApi);

const FlowContextProvider = ({ children }) => {
  // console.log("FlowContextProvider");

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { updateDevice, updateEdges, updateNodes } = useAppContextApi();
  const { user, workstation } = useAppContextUser();
  const { brokerDevices } = useAppContextState();

  useEffect(() => {
    const brokerDevicesArr = Array.from(brokerDevices.values());

    setNodes((prevNodes) => {
      const newNodes = [...prevNodes];

      brokerDevicesArr.forEach((device) => {
        const index = newNodes.findIndex((node) => {
          if (node.type === nodeCollection.DeviceNode.name) {
            return node.data.device.mqttId === device.mqttId;
          }

          return false;
        });

        if (index > -1) {
          newNodes[index].data.device = device;
        }
      });

      return newNodes;
    });
  }, [brokerDevices]);

  useEffect(() => {
    if (workstation?.nodes && workstation?.edges) {
      setNodes(workstation.nodes);
      setEdges(workstation.edges);
    }
  }, [workstation, setNodes, setEdges]);

  useEffect(() => {
    if (workstation) updateNodes(nodes);
  }, [nodes, workstation, updateNodes]);

  useEffect(() => {
    if (workstation) {
      console.log("useEffect", edges);
      updateEdges(edges);
    }
  }, [edges, workstation, updateEdges]);

  const addNewNode = (
    position = { x: 0, y: 0 },
    type = defaultNode.name,
    data
  ) => {
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
  };

  const addDeviceNode = useCallback(
    (position = { x: 0, y: 0 }, device) => {
      const nodeData = nodeCollection.DeviceNode.setData(device, null, null);
      const nodeId = addNewNode(
        position,
        nodeCollection.DeviceNode.name,
        nodeData
      );

      device.workstation = workstation.firebaseId;
      device.nodeId = nodeId;
      device.domain = user;

      device.channel =
        user + "/" + workstation.firebaseId + "/" + device.mqttId;

      updateDevice(device);
    },
    [workstation, user]
  );

  const addNewGroup = (position = { x: 0, y: 0 }) => {
    addNewNode(position, nodeCollection.CustomGroup.name, {
      label: "Group",
    });
  };

  const removeNodeFromGroup = (nodeId) => {
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
  };

  const getDevicesFromEdges = useCallback(
    (edges) => {
      if (!Array.isArray(edges)) {
        edges = [edges];
      }

      const devicesArr = [];

      edges.forEach((edge) => {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        const targetNode = nodes.find((node) => node.id === edge.target);

        if (!sourceNode || !targetNode) return;

        if (
          sourceNode.type === nodeCollection.DeviceNode.name &&
          targetNode.type === nodeCollection.DeviceNode.name
        ) {
          devicesArr.push({
            publisherDevice: sourceNode.data.device,
            subscriptorDevice: targetNode.data.device,
          });
        }
      });

      return devicesArr;
    },
    [nodes]
  );

  const addSubscription = useCallback(
    (edges) => {
      const subscriptions = getDevicesFromEdges(edges);

      subscriptions.forEach((subscription) => {
        const { subscriptorDevice, publisherDevice } = subscription;

        subscriptorDevice.subscriptions = subscriptorDevice.subscriptions || [];

        if (!subscriptorDevice.subscriptions.includes(publisherDevice.mqttId)) {
          subscriptorDevice.subscriptions.push(publisherDevice.mqttId);

          updateDevice(subscriptorDevice);
        }
      });
    },
    [nodes, updateDevice]
  );

  const removeSubscription = (edges) => {
    const subscriptions = getDevicesFromEdges(edges);

    subscriptions.forEach((subscription) => {
      const { subscriptorDevice, publisherDevice } = subscription;

      if (!subscriptorDevice.subscriptions) return;

      subscriptorDevice.subscriptions = subscriptorDevice.subscriptions.filter(
        (subs) => subs !== publisherDevice.mqttId
      );

      updateDevice(subscriptorDevice);
    });
  };

  const removeNode = (nodes) => {
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }

    nodes.forEach((node) => {
      if (node.type === nodeCollection.DeviceNode.name) {
        const { device } = node.data;
        device.nodeId = null;
        device.subscriptions = [];
        updateDevice(device);
      }
    });
  };

  const stateValue = { nodes, edges, onNodesChange, onEdgesChange };

  const apiValue = {
    setNodes,
    setEdges,
    addNewNode,
    addNewGroup,
    removeNodeFromGroup,
    addDeviceNode,
    addSubscription,
    removeSubscription,
    removeNode,
  };

  return (
    <FlowContextState.Provider value={stateValue}>
      <FlowContextApi.Provider value={apiValue}>
        {children}
      </FlowContextApi.Provider>
    </FlowContextState.Provider>
  );
};

export { FlowContextProvider, useFlowContextState, useFlowContextApi };
