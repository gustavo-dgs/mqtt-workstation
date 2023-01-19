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
import Device from "../../services/mqtt-firebase/models/Device";
import MqttConstants from "../../services/mqtt-firebase/MqttConstants";

const FlowContextState = createContext();
const FlowContextApi = createContext();

const useFlowContextState = () => useContext(FlowContextState);
const useFlowContextApi = () => useContext(FlowContextApi);

const FlowContextProvider = ({ children }) => {
  // console.log("FlowContextProvider");

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const {
    updateDevice,
    updateEdges,
    updateNodes,
    removeDevice,
    addVirtualDevice,
  } = useAppContextApi();
  const { user, workstation } = useAppContextUser();
  const { brokerDevices } = useAppContextState();

  // useEffect(() => console.log("-----NODES-----", nodes), [nodes]);

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
  }, [brokerDevices, setNodes]);

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
      // console.log("useEffect Edges", edges);
      updateEdges(edges);
    }
  }, [edges, workstation, updateEdges]);

  const addNewNode = useCallback(
    (position = { x: 0, y: 0 }, type = defaultNode.name, data, style, id) => {
      const nodeId = id || randomId();

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

        if (style) {
          newNode.style = style;
        }

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

      device.workstation = workstation.firebaseId;
      device.nodeId = nodeId;
      device.domain = user;

      device.channel =
        user + "/" + workstation.firebaseId + "/" + device.mqttId;

      updateDevice(device);
    },
    [addNewNode, workstation, user, updateDevice]
  );

  const addNewGroup = (position = { x: 0, y: 0 }) => {
    addNewNode(
      position,
      nodeCollection.CustomGroup.name,
      {
        label: "Group",
      },
      { height: 300, width: 300 }
    );
  };

  const addActionNode = useCallback(
    (position) => {
      const nodeId = randomId();
      const mqttId = "ActionNode-" + nodeId;
      const channel = `${user}/${workstation.firebaseId}/${mqttId}`;

      const newDevice = new Device(
        null,
        mqttId,
        "::1",
        user,
        workstation.firebaseId,
        [],
        channel,
        null,
        null,
        false,
        null,
        null,
        nodeId,
        MqttConstants.VIRTUAL_DEVICE
      );

      addNewNode(
        position,
        nodeCollection.ActionNode.name,
        {
          device: newDevice,
        },
        null,
        nodeId
      );

      addVirtualDevice(newDevice, (firebaseId) => {
        newDevice.firebaseId = firebaseId;

        setNodes((prevNodes) => {
          const newNodes = prevNodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                data: {
                  ...node.data,
                  device: newDevice,
                },
              };
            }

            return node;
          });

          return newNodes;
        });
      });
    },
    [addNewNode, addVirtualDevice, user, workstation, setNodes]
  );

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
    [getDevicesFromEdges, updateDevice]
  );

  const removeSubscription = useCallback(
    (edges) => {
      const subscriptions = getDevicesFromEdges(edges);

      subscriptions.forEach((subscription) => {
        const { subscriptorDevice, publisherDevice } = subscription;

        if (!subscriptorDevice.subscriptions) return;

        subscriptorDevice.subscriptions =
          subscriptorDevice.subscriptions.filter(
            (subs) => subs !== publisherDevice.mqttId
          );

        updateDevice(subscriptorDevice);
      });
    },
    [getDevicesFromEdges, updateDevice]
  );

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

  const removeDeviceFromWorkstation = (device) => {
    removeDevice(device);

    if (device.nodeId) {
      setNodes((prevNodes) => {
        return prevNodes.filter((node) => node.id !== device.nodeId);
      });

      setEdges((prevEdges) => {
        return prevEdges.filter(
          (edge) =>
            edge.source !== device.nodeId && edge.target !== device.nodeId
        );
      });
    }
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
    removeDeviceFromWorkstation,
    addActionNode,
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
