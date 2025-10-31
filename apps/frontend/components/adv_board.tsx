"use client";

import * as fabric from "fabric";
import { useEffect, useState, useRef } from "react";
import { useWebSocket } from "./context/websocketcontext";


 function throttle(func: Function, limit: number) {
  let last = 0;
  return ( ) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      func ();
    }
  };
}

export default function AdvBoard({ slug }: { slug: string }) {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const ws = useWebSocket()?.socket;

  // Track if update came from remote
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas("canvas");
    setCanvas(fabricCanvas);

    // Example initial shape
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "red",
      width: 80,
      height: 80,
    });
    fabricCanvas.add(rect);

    const broadcast = () => {
      if (isRemoteUpdate.current) return; // skip remote updates

      console.log("Broadcasting local update...");
      ws?.send( JSON.stringify({ type: "update", message: { slug, data: fabricCanvas.toJSON() }, })
      );
    };

    // const subscribeToCanvasEvents = () => {
    //   fabricCanvas.on("object:added", broadcast);
    //   fabricCanvas.on("object:modified", broadcast);
    //   fabricCanvas.on("object:removed", broadcast);
    // };

    // const unsubscribeFromCanvasEvents = () => {
    //   fabricCanvas.off("object:added", broadcast);
    //   fabricCanvas.off("object:modified", broadcast);
    //   fabricCanvas.off("object:removed", broadcast);
    // };

    //subscribeToCanvasEvents();
     const throttleBroadcast = throttle(broadcast, 1);
     fabricCanvas.on("object:added", broadcast);
      fabricCanvas.on("object:modified", broadcast);
      fabricCanvas.on("object:removed", broadcast);
      fabricCanvas.on("object:moving", throttleBroadcast);
      fabricCanvas.on("object:scaling", throttleBroadcast);
      fabricCanvas.on("object:rotating", throttleBroadcast);
    ws!.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "update") {
          console.log("Receiving remote update...");
          // Temporarily mark as remote to prevent broadcast
          isRemoteUpdate.current = true;

          // unsubscribeFromCanvasEvents();
          console.log(msg.message)
          fabricCanvas.loadFromJSON(msg.message, () => {
            fabricCanvas.renderAll();
            fabricCanvas.requestRenderAll();
              console.log("Canvas objects:", fabricCanvas.getObjects());

            // subscribeToCanvasEvents();

            // Allow local changes again
            setTimeout(() =>{
              isRemoteUpdate.current = false;
              console.log("Remote update complete; re-enabling broadcast");
            }, 200);
          });
        }
      } catch (error) {
        console.error("Failed to parse incoming message:", e.data, error);
      }
    };

    return () => {
      //unsubscribeFromCanvasEvents();
      fabricCanvas.dispose();
    };
  }, [slug, ws]);

  return (
    <canvas
      id="canvas"
      width="1532"
      height="700"
      style={{ border: "1px solid #ccc" }}
    ></canvas>
  );
}
