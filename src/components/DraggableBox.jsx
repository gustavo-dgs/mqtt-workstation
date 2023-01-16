import { Box } from "@mui/material";

const DraggableBox = ({ children, onDragStart, ...props }) => {
  return (
    <Box
      {...props}
      onDragStart={onDragStart}
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
      {children}
    </Box>
  );
};

export default DraggableBox;
