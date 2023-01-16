import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const NodeTemplate = ({ label, icon, color, width }) => {
  return (
    <>
      <Stack
        direction="row"
        alignItems={"center"}
        borderRadius={2}
        width={width || "223px"}
        height={"45px"}
        border={`3px solid ${color[50]}`}
        overflow={"hidden"}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"flex-end"}
        flexGrow={"1"}
        boxShadow={1}
      >
        <Box
          width={"40px"}
          height={"100%"}
          sx={{ bgcolor: color[400] }}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography fontSize={25}>{icon}</Typography>
        </Box>

        <Box
          width={"100%"}
          height={"100%"}
          sx={{ bgcolor: color[100] }}
          padding={0.5}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography fontSize={14} variant="h7" flexGrow={1}>
            {label}
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

export default NodeTemplate;
