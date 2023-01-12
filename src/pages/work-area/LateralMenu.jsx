import { Box, Stack, Button } from "@mui/material";
import { useEffect } from "react";
import { useFlowContextApi } from "./flowContext";

const LateralMenu = () => {
  console.log("LateralMenu");
  const { setNodes, setEdges } = useFlowContextApi();

  useEffect(() => {
    console.log("LateralMenu useEffect");
  }, [setNodes, setEdges]);

  const addNewNode = () => {
    setNodes((prevNodes) => {
      const maxId =
        prevNodes.length > 0
          ? Math.max(...prevNodes.map((node) => Number.parseInt(node.id)))
          : 0;

      const newStringId = (maxId + 1).toString();

      const newNode = {
        id: newStringId,
        type: "customNode",
        data: { label: "Node-" + newStringId },
        position: { x: 0, y: 0 },
      };

      return [...prevNodes, newNode];
    });
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
          onClick={addNewNode}
          sx={{ alignSelf: "center", justifySelf: "center" }}
        >
          Add Node
        </Button>
        <Button
          variant="outlined"
          sx={{ alignSelf: "center", justifySelf: "center" }}
        >
          Add Group
        </Button>
      </Stack>
    </Box>
  );
};

export default LateralMenu;
