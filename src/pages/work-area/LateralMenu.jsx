import { Box, Stack, Button } from "@mui/material";

const LateralMenu = ({ addNewNode }) => {
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
