import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";

class SocketService {
    private static instance: SocketService;
    private io: SocketIOServer | null = null;

    // Private constructor ensures no one can do "new SocketService()"
    private constructor() {}

    // 1. Get the single instance (Singleton Pattern)
    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    // 2. Initialize Socket.io with the HTTP Server
    public init(httpServer: HttpServer) {
        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST", "PUT", "DELETE"],
                credentials: true,
            },
        });

        this.io.on("connection", (socket) => {
            console.log("User connected:", socket.id);

            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.id);
            });
        });
    }

    // 3. The "Broadcast" function

    public emit(event: string, data: any) {
        if (this.io) {
            this.io.emit(event, data);
        } else {
            console.warn("Socket.io is not initialized!");
        }
    }
}

export const socketService = SocketService.getInstance();
