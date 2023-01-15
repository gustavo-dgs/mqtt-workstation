import { Stack } from "@mui/material";

const newDeviceCard = ({ device }) => {
  const { mqttId } = device;
  return <Stack>{mqttId}</Stack>;
};

export default newDeviceCard;
