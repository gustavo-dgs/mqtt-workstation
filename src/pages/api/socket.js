import { Server } from "socket.io";
import SocketClients from "../../services/socket/SocketClients";

export default function handler(req, res) {
  if (res.socket.server.io) {
    return res.status(500).json({ message: "Socket already initialized" });
  } else {
    res.socket.server.io = new Server(res.socket.server);

    res.socket.server.io.on("connection", (socket) => {
      SocketClients.add(socket);
    });
    return res.status(200).json({ message: "Socket initialized" });
  }
}
