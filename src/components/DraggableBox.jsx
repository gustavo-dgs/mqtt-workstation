import { Box } from "@mui/material";

const DraggableBox = ({ children, onDragStart, draggable, ...props }) => {
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
      draggable={draggable}
    >
      {children}
    </Box>
  );
};

export default DraggableBox;
