import CustomNode from "./CustomNode";
import CustomGroup from "./CustomGroup";
import DeviceNode from "./DeviceNode";
import ActionNode from "./ActionNode";

const commonModel = [
  {
    label: "label",
    required: true,
    type: "text",
  },
  {
    label: "icon",
    required: true,
    type: "text",
  },
];

const nodeCollection = {
  CustomNode: {
    name: "CustomNode",
    component: CustomNode,
    setData: (icon, label) => ({ icon, label }),
    model: [...commonModel],
  },
  CustomGroup: {
    name: "CustomGroup",
    component: CustomGroup,
    setData: (label) => ({ label }),
    model: [...commonModel],
  },
  DeviceNode: {
    name: "DeviceNode",
    component: DeviceNode,
    setData: (device, icon, color) => ({ device, icon, color }),
    model: [...commonModel],
  },
  ActionNode: {
    name: "ActionNode",
    component: ActionNode,
    setData: (label, icon, color, topic, payload) => ({
      label,
      icon,
      color,
      topic,
      payload,
    }),
    model: [
      ...commonModel,
      {
        label: "payload",
        required: false,
        type: "json",
      },
    ],
  },
};

const defaultNode = nodeCollection.DeviceNode;

const nodeTypes = {};

for (const type in nodeCollection) {
  nodeTypes[type] = nodeCollection[type].component;
}

const CARD_NODE_WIDTH = "223px";

export { nodeCollection, defaultNode, nodeTypes, CARD_NODE_WIDTH };
