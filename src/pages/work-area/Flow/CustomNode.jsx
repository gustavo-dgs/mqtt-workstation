import { Box } from "@mui/material";
import { Handle, Position } from "reactflow";
import { useFlowContextApi } from "../flowContext";
import ResizableInput from "./ResizableInput";

const WIDTH = 100;

const CustomNode = ({ id, data }) => {
  // console.log("CustomNode" + id);
  const { setNodes } = useFlowContextApi();

  const onTextChange = (e) => {
    setNodes((prevNodes) => {
      const newNodes = prevNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: e.target.value,
            },
          };
        }
        return node;
      });
      return newNodes;
    });
  };

  return (
    <>
      <Box
        width={WIDTH}
        height={WIDTH}
        backgroundColor={"#fff"}
        border={"1px solid #ddd"}
        boxShadow={1}
        borderRadius={4}
        overflow={"hidden"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
          }}
          padding={1}
          display={"flex"}
          justifyContent="center"
          alignItems="center"
        ></Box>

        <Handle
          id={"source"}
          type={"source"}
          position={Position.Top}
          style={{
            backgroundColor: "red",
            width: 10,
            height: 10,
          }}
        />
        <Handle
          id={"target"}
          type={"target"}
          position={Position.Bottom}
          style={{
            backgroundColor: "cyan",
            width: 10,
            height: 10,
          }}
        />

        <ResizableInput
          value={data.label}
          onChange={onTextChange}
          sx={{
            position: "absolute",
            bottom: -60,
          }}
        />
      </Box>
    </>
  );
};

export default CustomNode;
