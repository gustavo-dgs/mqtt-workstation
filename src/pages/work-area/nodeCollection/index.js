const nodeCollection = {
  CustomNode: {
    name: "CustomNode",
    component: require("./CustomNode").default,
    setData: (icon, label) => ({ icon, label }),
  },
  CustomGroup: {
    name: "CustomGroup",
    component: require("./CustomGroup").default,
    setData: (label) => ({ label }),
  },
  DeviceNode: {
    name: "DeviceNode",
    component: require("./DeviceNode").default,
    setData: (device, icon, color) => ({ device, icon, color }),
  },
};

const defaultNode = nodeCollection.DeviceNode;

const nodeTypes = {};

for (const type in nodeCollection) {
  nodeTypes[type] = nodeCollection[type].component;
}

export { nodeCollection, defaultNode, nodeTypes };
