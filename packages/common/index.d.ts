import { z } from "zod";
import { WebSocket } from "ws";
export declare const userSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const siginShema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const roomSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
interface user_active {
    type: "active";
    message: {
        socket: WebSocket;
    };
}
interface join_room {
    type: "join_room";
    message: {
        slug: string;
        socket: WebSocket;
    };
}
interface prev_messages {
    type: "prev_messages";
    message: {
        socket: WebSocket;
        slug: string;
    };
}
interface create_room {
    type: "create_room";
    message: {
        name: string;
        socket: WebSocket;
    };
}
interface message {
    type: "message";
    message: {
        socket: WebSocket;
        slug: string;
        content: string;
    };
}
interface leave_room {
    type: "leave_room";
    message: {
        socket: WebSocket;
        slug: string;
    };
}
interface disconnect {
    type: "disconnect";
    message: {};
}
type ws_message = user_active | join_room | prev_messages | create_room | message | leave_room | disconnect;
export type { ws_message };
//# sourceMappingURL=index.d.ts.map