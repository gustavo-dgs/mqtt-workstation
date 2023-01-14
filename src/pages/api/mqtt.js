import Mqtt from "../../services/mqtt/Mqtt";

export default function handler(req, res) {
  if (Mqtt.client) {
    return res.status(500).json({ message: "MQTT already initialized" });
  } else {
    res.socket.server.io = new Server(res.socket.server);

    res.socket.server.io.on("connection", (socket) => {
      SocketClients.add(socket);
    });
    return res.status(200).json({ message: "MQTT initialized" });
  }
}
