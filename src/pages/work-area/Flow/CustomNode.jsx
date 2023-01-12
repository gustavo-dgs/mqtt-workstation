import { Box } from "@mui/material";
import { Handle, Position } from "reactflow";

const WIDTH = 100;

const CustomNode = ({ data }) => {
  return (
    <Box width={WIDTH} height={WIDTH}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
        }}
        borderRadius={4}
        backgroundColor={"#fff"}
        boxShadow={1}
        border={"1px solid #ddd"}
        padding={1}
      >
        <p>{data.label}</p>
      </Box>

      <Handle
        id={"source"}
        type={"source"}
        position={Position.Top}
        color="red"
      />
      <Handle
        id={"target"}
        type={"target"}
        position={Position.Bottom}
        color="cyan"
      />
    </Box>
  );
};

export default CustomNode;
