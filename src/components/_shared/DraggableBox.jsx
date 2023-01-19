import { Box } from "@mui/material";

const DraggableBox = ({ children, onDragStart, draggable, ...props }) => {
  return (
    <Box
      {...props}
      onDragStart={onDragStart}
      sx={{
        "&:hover": {
          cursor: draggable ? "grab" : "default",
        },
        "&:active": {
          cursor: draggable ? "grabbing" : "default",
        },
      }}
      draggable={draggable}
    >
      {children}
    </Box>
  );
};

export default DraggableBox;
