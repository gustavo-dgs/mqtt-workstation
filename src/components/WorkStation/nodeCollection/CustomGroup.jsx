import "@reactflow/node-resizer/dist/style.css";
import { Box } from "@mui/material";
import { useFlowContextApi } from "../flowContext";
import ResizableInput from "../../../components/_shared/ResizableInput";
import { NodeResizer } from "@reactflow/node-resizer";
import NodeTemplate from "./NodeTemplate";
import icons from "../../../constants/icons";
import { green } from "@mui/material/colors";

const WIDTH = 200;

const CustomGroup = ({ id, data, selected, disabled }) => {
  const { setNodes } = useFlowContextApi();
  const { label } = data;

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
      {!disabled && (
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
              value={label || "Group-" + id}
              onChange={onTextChange}
              sx={{
                position: "absolute",
                bottom: -60,
              }}
            />
          </Box>
        </>
      )}
      {disabled && (
        <NodeTemplate
          label={label || "ActionNode-" + id}
          icon={icons.NEW_GROUP_ICON}
          color={green}
          width={"100%"}
        />
      )}
    </>
  );
};

export default CustomGroup;
