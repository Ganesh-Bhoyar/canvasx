"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Square,
  Circle,
  Triangle,
  Minus,
  Pen,
  MousePointer,
  Undo2,
  Redo2,
  Trash2,
  Download,
  ZoomIn,
  ZoomOut,
  Palette,
  Settings,
  Layers,
  Lock,
  Unlock,
  Sun,
  Moon,
  Users,
  Grid3x3,
  Hand,
  Type,
  Image as ImageIcon,
  Copy,
  ChevronLeft,
  ChevronRight,
  CopyIcon,
  Router
} from 'lucide-react';
import * as fabric from "fabric";

import { useRouter,usePathname  } from 'next/navigation'; 
import { useWebSocket } from "./context/websocketcontext";

// TypeScript interfaces
interface ToolbarButton {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action: () => void;
  variant?: 'default' | 'danger' | 'primary';
}

interface ShapeTool {
  type: 'rectangle' | 'circle' | 'line' | 'triangle' | 'freehand' | 'text' | 'select' | 'pan';
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface ColorOption {
  name: string;
  value: string;
}

function throttle(func: Function, limit: number) {
  let last = 0;
  return () => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      func();
    }
  };
}

const CanvasXBoard = ({ slug }: { slug: string }) => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [strokeWidth, setStrokeWidth] = useState<number>(2);
  const [selectedColor, setSelectedColor] = useState<string>('#000000');
  const [fillColor, setFillColor] = useState<string>('transparent');
  const [zoom, setZoom] = useState<number>(100);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showColorPalette, setShowColorPalette] = useState<boolean>(false);
  const [showFillPalette, setShowFillPalette] = useState<boolean>(false);
  const [showLayersPanel, setShowLayersPanel] = useState<boolean>(false);
  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState<boolean>(false);
  const [activeUsers, setActiveUsers] = useState<number>(3);
  const [showGridLines, setShowGridLines] = useState<boolean>(false);
  const [clipboard, setClipboard] = useState<fabric.Object | null>(null);
  const [isCopyMode, setIsCopyMode] = useState<boolean>(false);

  const pathname = usePathname();
  const prevPathname = useRef(pathname);


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorPaletteRef = useRef<HTMLDivElement>(null);
  const fillPaletteRef = useRef<HTMLDivElement>(null);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const ws = useWebSocket()?.socket;
  
  // Track if update came from remote
  const isRemoteUpdate = useRef(false);
  
  // **FIX #1: Use a ref to store the current tool so we always have the latest value**
  const selectedToolRef = useRef<string>(selectedTool);
  const selectedColorRef = useRef<string>(selectedColor);
  const fillColorRef = useRef<string>(fillColor);
  const strokeWidthRef = useRef<number>(strokeWidth);
  const clippedRef = useRef<any>(null);
  const Router = useRouter();

  // Update refs whenever state changes
  useEffect(() => {
    selectedToolRef.current = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    fillColorRef.current = fillColor;
  }, [fillColor]);

  useEffect(() => {
    strokeWidthRef.current = strokeWidth;
  }, [strokeWidth]);

  // ============================================
  // PREDEFINED COLORS
  // ============================================

  const colors: ColorOption[] = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
  ];

  // ============================================
  // SHAPE TOOLS CONFIGURATION
  // ============================================

  const shapeTools: ShapeTool[] = [
    { type: 'select', icon: MousePointer, label: 'Select' },
    { type: 'pan', icon: Hand, label: 'Pan' },
    { type: 'rectangle', icon: Square, label: 'Rectangle' },
    { type: 'circle', icon: Circle, label: 'Circle' },
    { type: 'triangle', icon: Triangle, label: 'Triangle' },
    { type: 'line', icon: Minus, label: 'Line' },
    { type: 'freehand', icon: Pen, label: 'Draw' },
    { type: 'text', icon: Type, label: 'Text' },
  ];


 

// Add this state at the top with other states


// Add this handler function
const handleCopy = () => {
  if (!canvas) return;
  
  const activeObject = canvas.getActiveObject();
  if (!activeObject) {
    console.log('No object selected to copy');
    return;
  }
 canvas?.getActiveObject()?.clone()
    .then((cloned) => {
     setClipboard(cloned);
     setIsCopyMode(true);
    console.log('Object copied to clipboard');
     setTimeout(() => {
      setIsCopyMode(false);
    }, 2000);
    });
  // Clone the object to clipboard
   
};

const handlePaste = async () => {
  if (!canvas || !clipboard) {
    console.log('Nothing to paste');
    return;
  }

  // Clone the clipboard object
  const clonedObj = await clipboard.clone();
  canvas.discardActiveObject();
  clonedObj.set({
    left: clonedObj.left + 10,
    top: clonedObj.top + 10,
    evented: true,
  });
  if (clonedObj instanceof fabric.ActiveSelection) {
    // active selection needs a reference to the canvas.
    clonedObj.canvas = canvas;
    clonedObj.forEachObject((obj) => {
      canvas.add(obj);
    });
    // this should solve the unselectability
    clonedObj.setCoords();
  } else {
    canvas.add(clonedObj);
  }
  clipboard.top += 10;
  clipboard.left += 10;
  canvas.setActiveObject(clonedObj);
  canvas.requestRenderAll();
  console.log('Object pasted from clipboard');
  setIsCopyMode(false);
  
};
 


async function Paste() {
  // clone again, so you can do multiple copies.
  if (!canvas || !clippedRef.current) return;
  const clonedObj = await clippedRef.current.clone();
  canvas?.discardActiveObject();
  clonedObj.set({
    left: clonedObj.left + 10,
    top: clonedObj.top + 10,
    evented: true,
  });
  if (clonedObj instanceof fabric.ActiveSelection) {
    // active selection needs a reference to the canvas.
    if (!canvas) return;
    clonedObj.canvas = canvas;
    clonedObj.forEachObject((obj) => {
      canvas.add(obj);
    });
    // this should solve the unselectability
    clonedObj.setCoords();
  } else {
    canvas.add(clonedObj);
  }
  clippedRef.current.top += 10;
  clippedRef.current.left += 10;
  canvas.setActiveObject(clonedObj);
  canvas.requestRenderAll();
}
  const handleMouseDown = useCallback((opt: fabric.TPointerEventInfo<fabric.TPointerEvent>,canvas: fabric.Canvas | null) => {
    if (!canvas || !opt.e) return;

    const pointer = canvas.getPointer(opt.e);
    const currentTool = selectedToolRef.current;
    const currentColor = selectedColorRef.current;
    const currentFillColor = fillColorRef.current;
    const currentStrokeWidth = strokeWidthRef.current;

    console.log("Mouse down - Current tool:", currentTool);

    // Handle different tools
    switch (currentTool) {
      case 'rectangle': {
        const rect = new fabric.Rect({
          left: pointer.x,
          top: pointer.y,
          fill: currentFillColor === 'transparent' ? 'transparent' : currentFillColor,
          width: 100,
          height: 100,
          stroke: currentColor,
          strokeWidth: currentStrokeWidth,
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
        
        // Auto-switch back to select tool after drawing
        setSelectedTool('select');
        break;
      }

      case 'circle': {
        const circle = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 50,
          fill: currentFillColor === 'transparent' ? 'transparent' : currentFillColor,
          stroke: currentColor,
          strokeWidth: currentStrokeWidth,
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
        
        setSelectedTool('select');
        break;
      }

      case 'triangle': {
        const triangle = new fabric.Triangle({
          left: pointer.x,
          top: pointer.y,
          width: 100,
          height: 100,
          fill: currentFillColor === 'transparent' ? 'transparent' : currentFillColor,
          stroke: currentColor,
          strokeWidth: currentStrokeWidth,
        });
        canvas.add(triangle);
        canvas.setActiveObject(triangle);
        canvas.renderAll();
        
        setSelectedTool('select');
        break;
      }

      case 'line': {
        const line = new fabric.Line([pointer.x, pointer.y, pointer.x + 100, pointer.y], {
          stroke: currentColor,
          strokeWidth: currentStrokeWidth,
        });
        canvas.add(line);
        canvas.setActiveObject(line);
        canvas.renderAll();
        
        setSelectedTool('select');
        break;
      }

      case 'select':
        // Default selection behavior - fabric.js handles this
        break;

      case 'pan':
        // Pan tool - implement panning logic if needed
        break;

      case 'freehand':
        console.log("Enabling freehand drawing mode");
        console.log("Freehand brush color:", fillColorRef.current);
        console.log("Freehand brush width:", currentStrokeWidth);
        console.log(canvas.freeDrawingBrush);
         
        if(!canvas.freeDrawingBrush) return;
     canvas.isDrawingMode = true;
  canvas.selection = false;
  // prefer to use selectedColorRef.current for stroke color:
  canvas.freeDrawingBrush.color = selectedColorRef.current;
  canvas.freeDrawingBrush.width = currentStrokeWidth || 1;
        // canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        //   blur:  0,
        //   offsetX: 0,
        //   offsetY: 0,
        //   affectStroke: true,
        //   color: selectedColorRef.current,
        // });
        break;

      case 'text': {
        const text = new fabric.IText('Double click to edit', {
          left: pointer.x,
          top: pointer.y,
          fill: currentColor,
          fontSize: 20,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        
        setSelectedTool('select');
        break;
      }

      default:
        break;
    }
  }, [canvas]); // Only depend on canvas, not on state values

  // **FIX #3: Handle selection mode changes**
  useEffect(() => {
    if (!canvas) return;

    // Disable drawing mode when not in freehand mode
    if (selectedTool !== 'freehand') {
      canvas.isDrawingMode = false;
    }

    // Enable/disable selection based on tool
    if (selectedTool === 'select') {
      canvas.selection = true;
      canvas.forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
      });
    } else if (selectedTool === 'pan') {
      canvas.selection = false;
      canvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = false;
      });
    } else {
      // For drawing tools, disable selection temporarily
      canvas.selection = false;
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [selectedTool, canvas]);

  const handleAddShape = (type: string) => {
    console.log('Selecting tool:', type);
    setSelectedTool(type);
  };

  const handleColorChange = (color: string) => {
    console.log('Changing stroke color:', color);
    setSelectedColor(color);
    setShowColorPalette(false);
    
    // Apply to selected object if any
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set('stroke', color);
        canvas.renderAll();
      }
    }
  };

  const handleFillColorChange = (color: string) => {
    console.log('Changing fill color:', color);
    setFillColor(color);
    setShowFillPalette(false);
    
    // Apply to selected object if any
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && 'fill' in activeObject) {
        activeObject.set('fill', color === 'transparent' ? 'transparent' : color);
        canvas.renderAll();
      }
    }
  };

  const handleStrokeWidthChange = (width: number) => {
    console.log('Changing stroke width:', width);
    setStrokeWidth(width);
    
    // Apply to selected object if any
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject && 'strokeWidth' in activeObject) {
        activeObject.set('strokeWidth', width);
        canvas.renderAll();
      }
    }
  };

  const handleUndo = () => {
    console.log('Undo action');
    // TODO: Implement undo logic with fabric.js
  };

  const handleRedo = () => {
    console.log('Redo action');
    // TODO: Implement redo logic with fabric.js
  };

  const handleClear = () => {
    console.log('Clear canvas');
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      canvas?.clear();
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, 500);
    setZoom(newZoom);
    console.log('Zoom in:', newZoom);
    if (canvas) {
      canvas.setZoom(newZoom / 100);
      canvas.renderAll();
    }
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, 10);
    setZoom(newZoom);
    console.log('Zoom out:', newZoom);
    if (canvas) {
      canvas.setZoom(newZoom / 100);
      canvas.renderAll();
    }
  };

  const handleExport = () => {
    console.log('Export canvas');
    // if (canvas) {
    //   const dataURL = canvas.toDataURL({
    //     format: 'png',
    //     quality: 1,
    //   });
    //   const link = document.createElement('a');
    //   link.download = 'canvas-export.png';
    //   link.href = dataURL;
    //   link.click();
    // }
  };
 
  const handleToggleGrid = () => {
    setShowGridLines(!showGridLines);
    console.log('Toggle grid:', !showGridLines);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    console.log('Toggle theme:', !isDarkMode);
  };

  // ============================================
  // CLICK OUTSIDE TO CLOSE PALETTES
  // ============================================

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPaletteRef.current && !colorPaletteRef.current.contains(event.target as Node)) {
        setShowColorPalette(false);
      }
      if (fillPaletteRef.current && !fillPaletteRef.current.contains(event.target as Node)) {
        setShowFillPalette(false);
      }
    };
     const persistCanvas = () => {
      if (canvas && ws) {
        console.log("Persisting canvas to server...");
        ws.send(
          JSON.stringify({ type: "update_database", message: { slug, data: canvas.toJSON() } })
        );
        console.log("Sent final canvas state to server");
      }
    };
    if (prevPathname.current !== pathname) {
      console.log("Pathname changed, persisting canvas...");
      persistCanvas();
      prevPathname.current = pathname;
    }


    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log("Window unloading, persisting canvas...");
      persistCanvas();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    console.log("sending request for previous messages");
    ws?.send(JSON.stringify({ type: "prev_messages", message: { slug} }));
    document.addEventListener('mousedown', handleClickOutside);
    return () =>{ document.removeEventListener('mousedown', handleClickOutside);
           if(canvas)
          { 
            ws?.send(JSON.stringify({ type: "update_database", message: { slug, data: canvas?.toJSON() } }));
            console.log("Sent final canvas state to server");
          }
    };
  }, [ws]);

  // ============================================
  // GRID BACKGROUND EFFECT
  // ============================================

  useEffect(() => {
   const svgString = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <rect width="20" height="20" fill="none" stroke="rgba(200,200,200,0.1)" stroke-width="1"/>
  </svg>
`;

// Convert SVG string directly into a base64-encoded data URL
const base64Svg = `data:image/svg+xml;base64,${btoa(svgString)}`;

const img = new Image();
img.src = base64Svg;

img.onload = () => {
  const pattern = new fabric.Pattern({
    source: img,
    repeat: showGridLines ? 'repeat' : 'no-repeat',
  });
  if (!canvas) return;
  canvas.backgroundColor = pattern;
  canvas.renderAll();
 

    };
  }, [showGridLines, isDarkMode, canvas]);

  // ============================================
  // **FIX #4: CANVAS INITIALIZATION - Add event listener once**
  // ============================================

  
  useEffect(() => {
    console.log("Initializing fabric canvas", canvasRef.current);
    if (!canvasRef.current) return;
    
    const fabricCanvas = new fabric.Canvas(canvasRef.current,{
      isDrawingMode: true
    });
         fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);

    setCanvas(fabricCanvas);
    console.log("fabric canvas initialized", fabricCanvas);

    const resizeCanvas = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();

      fabricCanvas.setWidth(width);
      fabricCanvas.setHeight(height);
      fabricCanvas.renderAll();
    };

    // Call once and on window resize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // **Add the mouse:down event listener once with the stable handler**
    fabricCanvas.on('mouse:down', (opt)=>handleMouseDown(opt,fabricCanvas));

    // WebSocket broadcast functions
    const broadcast = () => {
      console.log("Broadcasting update...");
      console.log("isRemoteUpdate.current:",isRemoteUpdate.current);
      if (isRemoteUpdate.current) return; // skip remote updates
      console.log("isRemoteUpdate.current:",isRemoteUpdate.current);

      console.log("Broadcasting local update...");
      ws?.send(JSON.stringify({ 
        type: "update", 
        message: { slug, data: fabricCanvas.toJSON() }, 
      }));
    };

    const throttleBroadcast = throttle(broadcast, 1);

    fabricCanvas.on("object:added", broadcast);
    fabricCanvas.on("object:modified", broadcast);
    fabricCanvas.on("object:removed", broadcast);
    fabricCanvas.on("object:moving", throttleBroadcast);
    fabricCanvas.on("object:scaling", throttleBroadcast);
    fabricCanvas.on("object:rotating", throttleBroadcast);

    // WebSocket message handler
    if (ws) {
      ws.onmessage = (e) => {
        console.log("Received message:", e.data);
        try {
          const msg = JSON.parse(e.data);
          if (msg.type === "update" && msg.message) {
            console.log("Receiving remote update...");
            isRemoteUpdate.current = true;
            
            console.log(msg.message);
            fabricCanvas.loadFromJSON(msg.message, () => {
              fabricCanvas.renderAll();
              fabricCanvas.requestRenderAll();
              console.log("Canvas objects:", fabricCanvas.getObjects());

              setTimeout(() => {
                isRemoteUpdate.current = false;
                console.log("Remote update complete; re-enabling broadcast");
              }, 200);
              console.log(" i am after settimeout")
            });
          }
        } catch (error) {
          console.error("Failed to parse incoming message:", e.data, error);
        }
      };
    }

    return () => {
      fabricCanvas.off('mouse:down', (opt)=>handleMouseDown(opt,fabricCanvas));
      fabricCanvas.dispose();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [slug, ws]);

  // ============================================
  // RENDER: MAIN COMPONENT
  // ============================================

  return (
    <div id='canvas' className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>

      {/* ============================================ */}
      {/* TOP NAVIGATION BAR */}
      {/* ============================================ */}

      <nav className={`border-b backdrop-blur-sm ${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="px-6 py-3 flex items-center justify-between">

          {/* Logo and title */}
          <div className="flex items-center space-x-3" onClick={()=>{Router.push("/")}}>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Pen className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              CanvasX
            </span>
          </div>

          {/* Center: Active users indicator */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <Users className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {activeUsers} active
            </span>
            <div className="flex -space-x-2">
              {[...Array(Math.min(activeUsers, 3))].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-purple-400"
                  style={{ zIndex: 3 - i }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: Theme toggle and settings */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* ============================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================ */}

      <div className="flex h-[calc(100vh-60px)] relative">

        {/* ============================================ */}
        {/* LEFT TOOLBAR - SHAPE TOOLS */}
        {/* ============================================ */}

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ 
            x: isToolbarCollapsed ? -80 : 0, 
            opacity: 1 
          }}
          transition={{ duration: 0.3 }}
          className={`relative z-20 ${isToolbarCollapsed ? 'w-20' : 'w-20'}`}
        >
          <div className={`h-full border-r backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gray-800/90 border-gray-700' 
              : 'bg-white/90 border-gray-200'
          }`}>
            <div className="flex flex-col items-center py-6 space-y-3">

              {/* Shape tool buttons */}
              {shapeTools.map((tool) => {
                const Icon = tool.icon;
                const isActive = selectedTool === tool.type;

                return (
                  <motion.button
                    key={tool.type}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddShape(tool.type)}
                    className={`relative p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title={tool.label}
                  >
                    <Icon className="w-5 h-5" />

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeToolIndicator"
                        className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                      />
                    )}
                  </motion.button>
                );
              })}

              {/* Divider */}
              <div className={`w-8 h-px ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
              }`} />

              {/* Image upload button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-3 rounded-xl transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Add Image"
              >
                <ImageIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Collapse/Expand button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
            className={`absolute -right-3 top-6 z-30 p-1 rounded-full shadow-lg ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-white text-gray-700'
            }`}
          >
            {isToolbarCollapsed ? (
              <ChevronRight className="w-50 h-50" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </motion.button>
        </motion.div>

        {/* ============================================ */}
        {/* CENTER - CANVAS AREA */}
        {/* ============================================ */}

        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">

          {/* Canvas container with shadow and border */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative w-full h-full rounded-2xl shadow-2xl overflow-hidden flex items-center justify-center ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            style={{
              width: '90%',
              maxWidth: '1400px',
              height: '80%',
              maxHeight: '800px'
            }}
          >
            {/* Canvas element - This is where fabric.js will be attached */}
            <canvas
              id='fabric-canvas'
              ref={canvasRef}
              width={1550}
              height={800}
              className="w-[95%] h-[95%] rounded-xl border border-gray-300"
            />

            {/* Zoom indicator */}
            <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-lg backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gray-700/90 text-gray-300' 
                : 'bg-white/90 text-gray-700'
            }`}>
              <span className="text-sm font-medium">{zoom}%</span>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* FLOATING ACTION TOOLBAR - BOTTOM CENTER */}
          {/* ============================================ */}

          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-sm border ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700' 
                : 'bg-white/90 border-gray-200'
            }`}
          >
                      <ToolButton
            icon={CopyIcon}
            label="Copy"
            onClick={handleCopy   }
            isDarkMode={isDarkMode}
            isActive={isCopyMode}
          />

          {/* Paste button */}
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePaste}
                disabled={!clipboard}
                className={`p-2 rounded-lg transition-colors ${
                  !clipboard
                    ? isDarkMode 
                      ? 'bg-gray-700 text-gray-500 opacity-50 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed'
                    : isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title={clipboard ? "Paste" : "Nothing to paste"}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </motion.button>

            <Divider isDarkMode={isDarkMode} />
            {/* Stroke color picker */}
            <div className="relative" ref={colorPaletteRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowColorPalette(!showColorPalette)}
                className={`p-2 rounded-lg transition-colors relative ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Stroke Color"
              >
                <Palette className="w-5 h-5" style={{ color: selectedColor }} />
                <div 
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: selectedColor }}
                />
              </motion.button>

              {/* Color palette popup */}
              <AnimatePresence>
                {showColorPalette && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className={`absolute bottom-full mb-2 p-3 rounded-xl shadow-2xl ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <div className="grid grid-cols-4 gap-2">
                      {colors.map((color) => (
                        <motion.button
                          key={color.value}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleColorChange(color.value)}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300 transition-transform"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {selectedColor === color.value && (
                            <motion.div
                              layoutId="selectedColor"
                              className="w-full h-full rounded-lg border-2 border-blue-500"
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fill color picker */}
            <div className="relative" ref={fillPaletteRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFillPalette(!showFillPalette)}
                className={`p-2 rounded-lg transition-colors relative ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                title="Fill Color"
              >
                <Square className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                <div 
                  className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                  style={{ 
                    backgroundColor: fillColor === 'transparent' ? '#FFFFFF' : fillColor,
                    opacity: fillColor === 'transparent' ? 0.3 : 1
                  }}
                />
              </motion.button>

              {/* Fill palette popup */}
              <AnimatePresence>
                {showFillPalette && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className={`absolute bottom-full mb-2 p-3 rounded-xl shadow-2xl ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <div className="grid grid-cols-4 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleFillColorChange('transparent')}
                        className="w-8 h-8 rounded-lg border-2 border-gray-300 bg-white relative overflow-hidden"
                        title="Transparent"
                      >
                        <div className="absolute inset-0 bg-red-500 rotate-45 translate-y-3 h-0.5" />
                      </motion.button>
                      {colors.map((color) => (
                        <motion.button
                          key={color.value}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleFillColorChange(color.value)}
                          className="w-8 h-8 rounded-lg border-2 border-gray-300"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        >
                          {fillColor === color.value && (
                            <motion.div
                              layoutId="selectedFillColor"
                              className="w-full h-full rounded-lg border-2 border-blue-500"
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Stroke width slider */}
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="20"
                value={strokeWidth}
                onChange={(e) => handleStrokeWidthChange(Number(e.target.value))}
                className="w-24 h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(strokeWidth / 20) * 100}%, ${isDarkMode ? '#374151' : '#E5E7EB'} ${(strokeWidth / 20) * 100}%, ${isDarkMode ? '#374151' : '#E5E7EB'} 100%)`
                }}
              />
              <span className={`text-sm font-medium w-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {strokeWidth}
              </span>
            </div>

            <Divider isDarkMode={isDarkMode} />

            {/* Zoom controls */}
            <ToolButton
              icon={ZoomOut}
              label="Zoom Out"
              onClick={handleZoomOut}
              isDarkMode={isDarkMode}
            />
            <ToolButton
              icon={ZoomIn}
              label="Zoom In"
              onClick={handleZoomIn}
              isDarkMode={isDarkMode}
            />

            <Divider isDarkMode={isDarkMode} />

            {/* Grid toggle */}
            <ToolButton
              icon={Grid3x3}
              label="Toggle Grid"
              onClick={handleToggleGrid}
              isDarkMode={isDarkMode}
              isActive={showGridLines}
            />

            {/* Layers panel toggle */}
            <ToolButton
              icon={Layers}
              label="Layers"
              onClick={() => setShowLayersPanel(!showLayersPanel)}
              isDarkMode={isDarkMode}
              isActive={showLayersPanel}
            />

            <Divider isDarkMode={isDarkMode} />

            {/* Clear canvas */}
            <ToolButton
              icon={Trash2}
              label="Clear"
              onClick={handleClear}
              isDarkMode={isDarkMode}
              variant="danger"
            />

            {/* Export */}
            <ToolButton
              icon={Download}
              label="Export"
              onClick={handleExport}
              isDarkMode={isDarkMode}
              variant="primary"
            />
          </motion.div>
        </div>

        {/* ============================================ */}
        {/* RIGHT PANEL - LAYERS (Optional) */}
        {/* ============================================ */}

        <AnimatePresence>
          {showLayersPanel && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-80 border-l backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-gray-800/90 border-gray-700' 
                  : 'bg-white/90 border-gray-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Layers
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLayersPanel(false)}
                    className={`p-1 rounded-lg ${
                      isDarkMode 
                        ? 'hover:bg-gray-700 text-gray-400' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Layer list */}
                <div className="space-y-2">
                  {canvas?.getObjects().map((obj, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        canvas.setActiveObject(obj);
                        canvas.renderAll();
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <Square className={`w-4 h-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {obj.type} {index + 1}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button 
                          className={`p-1 rounded ${
                            isDarkMode 
                              ? 'hover:bg-gray-600 text-gray-400' 
                              : 'hover:bg-gray-200 text-gray-600'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            canvas.remove(obj);
                            setShowLayersPanel(false);
                            setShowLayersPanel(true);
                            canvas.renderAll();
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============================================
// HELPER COMPONENTS
// ============================================

interface ToolButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  isDarkMode: boolean;
  variant?: 'default' | 'danger' | 'primary';
  isActive?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  isDarkMode, 
  variant = 'default',
  isActive = false
}) => {
  const getButtonStyles = () => {
    if (isActive) {
      return 'bg-blue-500 text-white';
    }

    switch (variant) {
      case 'danger':
        return isDarkMode 
          ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400' 
          : 'bg-red-50 hover:bg-red-100 text-red-600';
      case 'primary':
        return 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white';
      default:
        return isDarkMode 
          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
          : 'bg-gray-100 hover:bg-gray-200 text-gray-700';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors ${getButtonStyles()}`}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
};

const Divider: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
  <div className={`w-px h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
);

export default CanvasXBoard;