import React, { useRef, useEffect, useState } from 'react';

export default function CyberMaze({ isEnabled = true, color = 'green', opacity = 0.25 }) {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mazeRef = useRef(null);

  // Color mappings
  const colorMap = {
    green: { primary: '34, 197, 94', secondary: '59, 130, 246', tertiary: '139, 92, 246' },
    blue: { primary: '59, 130, 246', secondary: '34, 197, 94', tertiary: '139, 92, 246' },
    purple: { primary: '139, 92, 246', secondary: '59, 130, 246', tertiary: '34, 197, 94' },
    red: { primary: '239, 68, 68', secondary: '249, 115, 22', tertiary: '245, 158, 11' },
    yellow: { primary: '245, 158, 11', secondary: '34, 197, 94', tertiary: '59, 130, 246' }
  };

  useEffect(() => {
    if (!isEnabled) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Maze generation parameters - increased grid size for better performance
    const gridSize = 60; // Increased from 40
    const cols = Math.floor(canvas.width / gridSize);
    const rows = Math.floor(canvas.height / gridSize);

    class Cell {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = { top: true, right: true, bottom: true, left: true };
        this.visited = false;
        this.glowIntensity = 0;
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.baseOpacity = 0.15 + Math.random() * 0.1; // Reduced base opacity
      }

      draw(ctx, time, mouseDistance = 1) {
        const x = this.x * gridSize;
        const y = this.y * gridSize;

        // Much slower animation - reduced time multiplier by 5x
        const pulseValue = Math.sin(time * 0.0006 + this.pulseOffset) * 0.2 + 0.3; // Slower pulse
        const proximityGlow = Math.max(0, 1 - mouseDistance / 300); // Larger proximity radius
        this.glowIntensity = (pulseValue * 0.2 + proximityGlow * 0.4) * this.baseOpacity * opacity;

        // Draw walls with softer neon effect using selected colors
        ctx.lineWidth = 1.5; // Thinner lines
        
        const currentColors = colorMap[color];
        const colors = [
          `rgba(${currentColors.primary}, ${this.glowIntensity * 0.4})`,
          `rgba(${currentColors.secondary}, ${this.glowIntensity * 0.3})`,
          `rgba(${currentColors.tertiary}, ${this.glowIntensity * 0.2})`,
        ];

        colors.forEach((colorValue, index) => {
          ctx.strokeStyle = colorValue;
          ctx.lineWidth = 2 - index * 0.5;
          
          if (this.walls.top) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + gridSize, y);
            ctx.stroke();
          }
          if (this.walls.right) {
            ctx.beginPath();
            ctx.moveTo(x + gridSize, y);
            ctx.lineTo(x + gridSize, y + gridSize);
            ctx.stroke();
          }
          if (this.walls.bottom) {
            ctx.beginPath();
            ctx.moveTo(x + gridSize, y + gridSize);
            ctx.lineTo(x, y + gridSize);
            ctx.stroke();
          }
          if (this.walls.left) {
            ctx.beginPath();
            ctx.moveTo(x, y + gridSize);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        });

        // Smaller, subtler circuit nodes
        if (this.glowIntensity > 0.3) {
          ctx.fillStyle = `rgba(${currentColors.primary}, ${this.glowIntensity * 0.6})`;
          ctx.beginPath();
          ctx.arc(x + gridSize/2, y + gridSize/2, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      getNeighbors(grid, cols, rows) {
        const neighbors = [];
        const { x, y } = this;
        
        if (y > 0) neighbors.push(grid[x][y - 1]); // top
        if (x < cols - 1) neighbors.push(grid[x + 1][y]); // right
        if (y < rows - 1) neighbors.push(grid[x][y + 1]); // bottom
        if (x > 0) neighbors.push(grid[x - 1][y]); // left
        
        return neighbors.filter(neighbor => !neighbor.visited);
      }
    }

    // Generate maze
    const generateMaze = () => {
      const grid = [];
      const stack = [];

      // Create grid
      for (let x = 0; x < cols; x++) {
        grid[x] = [];
        for (let y = 0; y < rows; y++) {
          grid[x][y] = new Cell(x, y);
        }
      }

      let current = grid[0][0];
      current.visited = true;

      while (true) {
        const neighbors = current.getNeighbors(grid, cols, rows);
        
        if (neighbors.length > 0) {
          const next = neighbors[Math.floor(Math.random() * neighbors.length)];
          stack.push(current);
          
          // Remove walls between current and next
          const dx = current.x - next.x;
          const dy = current.y - next.y;
          
          if (dx === 1) {
            current.walls.left = false;
            next.walls.right = false;
          } else if (dx === -1) {
            current.walls.right = false;
            next.walls.left = false;
          } else if (dy === 1) {
            current.walls.top = false;
            next.walls.bottom = false;
          } else if (dy === -1) {
            current.walls.bottom = false;
            next.walls.top = false;
          }
          
          current = next;
          current.visited = true;
        } else if (stack.length > 0) {
          current = stack.pop();
        } else {
          break;
        }
      }

      return grid;
    };

    mazeRef.current = generateMaze();

    // Animation loop
    let animationId;
    const animate = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw maze with glow effects
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const cell = mazeRef.current[x][y];
          const cellCenterX = x * gridSize + gridSize / 2;
          const cellCenterY = y * gridSize + gridSize / 2;
          const mouseDistance = Math.sqrt(
            Math.pow(cellCenterX - mousePos.x, 2) + 
            Math.pow(cellCenterY - mousePos.y, 2)
          );
          
          cell.draw(ctx, time, mouseDistance);
        }
      }

      // Draw floating data packets (fewer and slower)
      drawDataPackets(ctx, time);
      
      animationId = requestAnimationFrame(animate);
    };

    // Fewer, slower data packets with color support
    const currentColors = colorMap[color];
    const dataPackets = Array.from({ length: 4 }, () => ({ // Reduced from 8 to 4
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.2, // Much slower movement
      dy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2 + 0.5, // Smaller particles
      color: Math.random() > 0.5 ? `rgba(${currentColors.primary}, 0.3)` : `rgba(${currentColors.secondary}, 0.3)`,
      pulseOffset: Math.random() * Math.PI * 2
    }));

    const drawDataPackets = (ctx, time) => {
      dataPackets.forEach(packet => {
        // Update position (slower)
        packet.x += packet.dx;
        packet.y += packet.dy;
        
        // Bounce off edges
        if (packet.x <= 0 || packet.x >= canvas.width) packet.dx *= -1;
        if (packet.y <= 0 || packet.y >= canvas.height) packet.dy *= -1;
        
        // Slower pulse effect
        const pulse = Math.sin(time * 0.001 + packet.pulseOffset) * 0.3 + 0.4;
        const size = packet.size * (1 + pulse * 0.3);
        
        // Draw packet with less glow
        ctx.fillStyle = packet.color;
        ctx.shadowColor = packet.color;
        ctx.shadowBlur = 5; // Reduced glow
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Shorter, more subtle trail
        ctx.strokeStyle = packet.color.replace('0.3', '0.15');
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(packet.x - packet.dx * 5, packet.y - packet.dy * 5);
        ctx.lineTo(packet.x, packet.y);
        ctx.stroke();
      });
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mousePos, isEnabled, color, opacity]);

  // Mouse tracking (throttled for better performance)
  useEffect(() => {
    if (!isEnabled) return;
    
    let mouseTimeout;
    const handleMouseMove = (e) => {
      if (mouseTimeout) return;
      
      mouseTimeout = setTimeout(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
        mouseTimeout = null;
      }, 50); // Throttle mouse updates
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimeout) clearTimeout(mouseTimeout);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 1,
        opacity: opacity,
        mixBlendMode: 'screen',
        filter: 'blur(0.5px)' // Added subtle blur
      }}
    />
  );
}