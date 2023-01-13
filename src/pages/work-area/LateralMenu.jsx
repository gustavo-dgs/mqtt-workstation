import { Box, Stack, Button } from "@mui/material";
import { useFlowContextApi } from "./flowContext";
import CustomNode from "./Flow/CustomNode";

const initialDevices = [
  "💡",
  "🌡",
  "🎮",
  "🔊",
  "🎤",
  "📱",
  "💻",
  "📺",
  "📷",
  "📡",
];

const LateralMenu = () => {
  // console.log("LateralMenu");
  const { addNewNode, addNewGroup } = useFlowContextApi();

  const onDragStart = (event, device) => {
    event.dataTransfer.setData("application/reactflow", device);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Box
      sx={{
        width: 380,
        height: "100%",
        backgroundColor: "white",
      }}
      padding={1}
      overflow={"auto"}
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

        <Stack direction="row" flexWrap="wrap" justifyContent={"center"}>
          {initialDevices.map((device, index) => (
            <Box
              width={80}
              height={80}
              key={index}
              m={0.8}
              onDragStart={(event) => onDragStart(event, device)}
              sx={{
                "&:hover": {
                  cursor: "grab",
                },
                "&:active": {
                  cursor: "grabbing",
                },
              }}
              draggable
            >
              <CustomNode id={index} data={{ device }} disabled />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
};

export default LateralMenu;
