import "@reactflow/node-resizer/dist/style.css";
// import { memo } from "react";
import { Box } from "@mui/material";
import { useFlowContextApi } from "../flowContext";
import ResizableInput from "../../../components/_shared/ResizableInput";
import { NodeResizer } from "@reactflow/node-resizer";

const WIDTH = 200;

const CustomGroup = ({ id, data, selected }) => {
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
      <NodeResizer
        color="#3367D9"
        isVisible={selected}
        minWidth={WIDTH}
        minHeight={WIDTH}
        lineStyle={{ borderWidth: 1 }}
      />
      <Box
        width={"100%"}
        height={"100%"}
        backgroundColor={"#0fc44579"}
        border={"2px solid #505050"}
        borderRadius={4}
        overflow={"hidden"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
      >
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

export default CustomGroup;
