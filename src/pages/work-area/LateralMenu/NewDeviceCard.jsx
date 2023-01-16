import { Box, Badge } from "@mui/material";
import DeviceNode from "../nodeCollection/DeviceNode";

const NewDeviceCard = ({ device }) => {
  const { mqttId, isOnline } = device;

  return (
    <>
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"center"}
      >
        <Badge
          color={isOnline ? "success" : "error"}
          badgeContent=" "
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          sx={{ width: "100%" }}
        >
          <DeviceNode data={{ label: mqttId }} disabled />
        </Badge>
      </Box>
    </>
  );
};

export default NewDeviceCard;
