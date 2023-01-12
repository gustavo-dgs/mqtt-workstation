import { Box, Stack, Button } from "@mui/material";

const LateralMenu = () => {
  return (
    <Box
      sx={{
        width: 400,
        height: "100%",
        backgroundColor: "red",
      }}
      padding={5}
    >
      <Stack>
        <Button
          variant="contained"
          sx={{ alignSelf: "center", justifySelf: "center" }}
        >
          Add Node
        </Button>
      </Stack>
    </Box>
  );
};

export default LateralMenu;
