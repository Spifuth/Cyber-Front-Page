import React, { useRef, useEffect, useState } from 'react';

export default function CyberMaze() {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mazeRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Maze generation parameters
    const gridSize = 40;
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
      }

      draw(ctx, time, mouseDistance = 1) {
        const x = this.x * gridSize;
        const y = this.y * gridSize;

        // Calculate glow based on mouse proximity and time
        const pulseValue = Math.sin(time * 0.003 + this.pulseOffset) * 0.3 + 0.7;
        const proximityGlow = Math.max(0, 1 - mouseDistance / 200);
        this.glowIntensity = pulseValue * 0.3 + proximityGlow * 0.7;

        // Draw walls with neon effect
        ctx.lineWidth = 2;
        
        const colors = [
          `rgba(34, 197, 94, ${this.glowIntensity * 0.8})`, // green
          `rgba(59, 130, 246, ${this.glowIntensity * 0.6})`, // blue
          `rgba(139, 92, 246, ${this.glowIntensity * 0.4})`, // purple
        ];

        colors.forEach((color, index) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = 3 - index;
          
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

        // Draw circuit-like nodes at intersections
        if (this.glowIntensity > 0.5) {
          ctx.fillStyle = `rgba(34, 197, 94, ${this.glowIntensity})`;
          ctx.beginPath();
          ctx.arc(x + gridSize/2, y + gridSize/2, 2, 0, Math.PI * 2);
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

      // Draw floating data packets
      drawDataPackets(ctx, time);
      
      animationId = requestAnimationFrame(animate);
    };

    // Data packets animation
    const dataPackets = Array.from({ length: 8 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(59, 130, 246, 0.7)',
      pulseOffset: Math.random() * Math.PI * 2
    }));

    const drawDataPackets = (ctx, time) => {
      dataPackets.forEach(packet => {
        // Update position
        packet.x += packet.dx;
        packet.y += packet.dy;
        
        // Bounce off edges
        if (packet.x <= 0 || packet.x >= canvas.width) packet.dx *= -1;
        if (packet.y <= 0 || packet.y >= canvas.height) packet.dy *= -1;
        
        // Pulse effect
        const pulse = Math.sin(time * 0.005 + packet.pulseOffset) * 0.5 + 0.5;
        const size = packet.size * (1 + pulse * 0.5);
        
        // Draw packet
        ctx.fillStyle = packet.color;
        ctx.shadowColor = packet.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Draw trail
        ctx.strokeStyle = packet.color.replace('0.7', '0.3');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(packet.x - packet.dx * 10, packet.y - packet.dy * 10);
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
  }, [mousePos]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 1,
        opacity: 0.4,
        mixBlendMode: 'screen'
      }}
    />
  );
}