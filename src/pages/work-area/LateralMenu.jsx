import { Box, Stack, Button } from "@mui/material";
import { useFlowContextApi } from "./flowContext";

const LateralMenu = () => {
  // console.log("LateralMenu");
  const { addNewNode, addNewGroup } = useFlowContextApi();

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box
      sx={{
        width: 400,
        height: "100%",
        backgroundColor: "white",
      }}
      padding={5}
    >
      <Stack spacing={3}>
        <Button
          variant="contained"
          onClick={() => addNewNode({ x: 0, y: 0 })}
          sx={{ alignSelf: "center", justifySelf: "center" }}
        >
          Add Node
        </Button>
        <Button
          onClick={() => addNewGroup({ x: 0, y: 0 })}
          variant="outlined"
          sx={{ alignSelf: "center", justifySelf: "center" }}
        >
          Add Group
        </Button>

        <Box
          className="dndnode input"
          onDragStart={(event) => onDragStart(event, "input")}
          sx={{ border: "1px solid yellow" }}
          draggable
        >
          Input Node
        </Box>
        <Box
          className="dndnode"
          onDragStart={(event) => onDragStart(event, "default")}
          sx={{ border: "1px solid blue" }}
          draggable
        >
          Default Node
        </Box>
        <Box
          className="dndnode output"
          onDragStart={(event) => onDragStart(event, "output")}
          sx={{ border: "1px solid red" }}
          draggable
        >
          Output Node
        </Box>
      </Stack>
    </Box>
  );
};

export default LateralMenu;
