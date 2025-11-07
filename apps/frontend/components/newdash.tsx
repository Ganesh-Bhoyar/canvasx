"use client";

import React, { useState, useRef, useEffect, use } from 'react';
import {useCallback} from 'react';
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
  ChevronRight
} from 'lucide-react';
import * as fabric from "fabric";
 
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
  return ( ) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      func ();
    }
  };
}

const CanvasXBoard = ({ slug }: { slug: string }) => {
  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [selectedTool, setSelectedTool] = useState<string>('rectangle');
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorPaletteRef = useRef<HTMLDivElement>(null);
  const fillPaletteRef = useRef<HTMLDivElement>(null);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const ws = useWebSocket()?.socket;
  
    // Track if update came from remote
    const isRemoteUpdate = useRef(false);

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
const addeffect = useCallback((opt: any, canvas: fabric.Canvas | null) => {
  const cn = canvas || opt.target?.canvas;
  if (!cn || !opt.e) return;

  const pointer = cn.getPointer(opt.e);
  console.log("selected tool in addeffect",selectedTool);
  if (selectedTool === "rectangle") {
    const rect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      fill: selectedColor.trim(),
      width: 100,
      height: 100,
      stroke: selectedColor.trim(),
      strokeWidth,
      originX: "left",
      originY: "top",
      hasRotatingPoint: false,
      hasBorders: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingFlip: true,
      lockScalingX: true,
      lockScalingY: true,
      lockUniScaling: true,
    });

    cn.add(rect);
    cn.renderAll();

    setSelectedTool("select");
  }
}, [selectedTool, selectedColor, strokeWidth]);

      
   
 
 
  const handleAddShape = (type: string) => {
    console.log('Adding shape:', type);
    setSelectedTool(type);
    console.log("seleted tool",selectedTool)
    // TODO: Connect to fabric.js shape creation
  };

  const handleColorChange = (color: string) => {
    console.log('Changing stroke color:', color);
    setSelectedColor(color);
    setShowColorPalette(false);
    // TODO: Apply to selected object or next shape
  };

  const handleFillColorChange = (color: string) => {
    console.log('Changing fill color:', color);
    setFillColor(color);
    setShowFillPalette(false);
    // TODO: Apply to selected object or next shape
  };

  const handleStrokeWidthChange = (width: number) => {
    console.log('Changing stroke width:', width);
    setStrokeWidth(width);
    // TODO: Apply to selected object or next shape
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
      // TODO: Clear all objects from canvas
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 10, 200);
    setZoom(newZoom);
    console.log('Zoom in:', newZoom);
    // TODO: Apply zoom to fabric.js canvas
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 10, 50);
    setZoom(newZoom);
    console.log('Zoom out:', newZoom);
    // TODO: Apply zoom to fabric.js canvas
  };

  const handleExport = () => {
    console.log('Export canvas');
    // TODO: Export canvas as PNG/SVG/JSON
  };
 
  const handleToggleGrid = () => {
    setShowGridLines(!showGridLines);
    console.log('Toggle grid:', !showGridLines);
    // TODO: Show/hide grid on canvas
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  useEffect(() => {
    console.log("Initializing fabric canvas",canvasRef.current);
  if (!canvasRef.current) return;
  const fabricCanvas = new fabric.Canvas(canvasRef.current);
  setCanvas(fabricCanvas);
  console.log("fabric canvas initialized",fabricCanvas);
 
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

  // Example test shape
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: "red",
    width: 80,
    height: 80,
  });
  fabricCanvas?.add(rect);
  console.log("rect",fabricCanvas?.getObjects());
  
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
        fabricCanvas.on('mouse:down', (opt) => {addeffect(opt,fabricCanvas)});

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
          <div className="flex items-center space-x-3">
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
          className={`relative z-20 ${isToolbarCollapsed ? 'w-0' : 'w-20'}`}
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsToolbarCollapsed(!isToolbarCollapsed)}
            className={`absolute -right-3 top-6 z-30 p-1 rounded-full shadow-lg ${
              isDarkMode 
                ? 'bg-gray-700 text-gray-300' 
                : 'bg-white text-gray-700'
            }`}
          >
            {isToolbarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
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
              // style={{
              //   background: showGridLines 
              //     ? 'linear-gradient(90deg, rgba(200,200,200,0.1) 1px, transparent 1px), linear-gradient(rgba(200,200,200,0.1) 1px, transparent 1px)'
              //     : isDarkMode ? '#1F2937' : '#FF0000',
              //   backgroundSize: showGridLines ? '20px 20px' : 'auto'
              // }}
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
            {/* Undo */}
            <ToolButton
              icon={Undo2}
              label="Undo"
              onClick={handleUndo}
              isDarkMode={isDarkMode}
            />

            {/* Redo */}
            <ToolButton
              icon={Redo2}
              label="Redo"
              onClick={handleRedo}
              isDarkMode={isDarkMode}
            />

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

                {/* Layer list placeholder */}
                <div className="space-y-2">
                  {['Rectangle 1', 'Circle 1', 'Path 1'].map((layer, index) => (
                    <motion.div
                      key={layer}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isDarkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Square className={`w-4 h-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`} />
                        <span className={`text-sm ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {layer}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className={`p-1 rounded ${
                          isDarkMode 
                            ? 'hover:bg-gray-600 text-gray-400' 
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}>
                          <Unlock className="w-4 h-4" />
                        </button>
                        <button className={`p-1 rounded ${
                          isDarkMode 
                            ? 'hover:bg-gray-600 text-gray-400' 
                            : 'hover:bg-gray-200 text-gray-600'
                        }`}>
                          <Copy className="w-4 h-4" />
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