//Is node A son of node B?
const isASon = (nodeA, nodeB, nodes) => {
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
    nodeB,
    nodes
  );
};

// calculate absolute position of a node
const calculateAbsolutePosition = (node, nodes) => {
  if (!node) {
    return { x: 0, y: 0 };
  }

  if (!node.parentNode) {
    return node.position;
  }

  const parentNode = nodes.find((n) => n.id === node.parentNode);

  const parentAbsolutePosition = calculateAbsolutePosition(parentNode, nodes);

  return {
    x: parentAbsolutePosition.x + node.position.x,
    y: parentAbsolutePosition.y + node.position.y,
  };
};

//check if the node is inside a group
const isInsideAGroup = (nodeA, nodeB, nodesArr) => {
  if (!nodeA || !nodeB) {
    return false;
  }

  if (nodesArr.length < 2) {
    return false;
  }

  // calculate absolute position of the nodes
  const absolutePositionA = calculateAbsolutePosition(nodeA, nodesArr);
  const absolutePositionB = calculateAbsolutePosition(nodeB, nodesArr);

  // calculate the center point of the node from position and dimensions
  const centerX = absolutePositionA.x + nodeA.width / 2;
  const centerY = absolutePositionA.y + nodeA.height / 2;

  const isInsideB =
    centerX > absolutePositionB.x &&
    centerX < absolutePositionB.x + nodeB.width &&
    centerY > absolutePositionB.y &&
    centerY < absolutePositionB.y + nodeB.height &&
    nodeB.type === "customGroup" &&
    nodeB.id !== nodeA.id; // this is needed, otherwise we would always find the dragged node

  //If A is inside a B
  if (isInsideB) {
    //If target (nodeB) is a child of the nodeA, return false
    return !isASon(nodeB, nodeA, nodesArr);
  }

  return false;
};

//Has children?
const hasChildren = (node, nodesArr) => {
  if (!node) {
    return false;
  }

  if (nodesArr.length < 2) {
    return false;
  }

  return nodesArr.some((n) => n.parentNode === node.id);
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

export {
  isASon,
  isInsideAGroup,
  hasChildren,
  updateChildrensLevel,
  calculateAbsolutePosition,
};
