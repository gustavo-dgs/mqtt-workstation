import CustomNode from "./CustomNode";
import CustomGroup from "./CustomGroup";
import DeviceNode from "./DeviceNode";

const nodeCollection = {
  CustomNode: {
    name: "CustomNode",
    component: CustomNode,
    setData: (icon, label) => ({ icon, label }),
  },
  CustomGroup: {
    name: "CustomGroup",
    component: CustomGroup,
    setData: (label) => ({ label }),
  },
  DeviceNode: {
    name: "DeviceNode",
    component: DeviceNode,
    setData: (device, icon, color) => ({ device, icon, color }),
  },
};

const defaultNode = nodeCollection.DeviceNode;

const nodeTypes = {};

for (const type in nodeCollection) {
  nodeTypes[type] = nodeCollection[type].component;
}

export { nodeCollection, defaultNode, nodeTypes };
