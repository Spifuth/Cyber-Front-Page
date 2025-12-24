import { useEffect, useRef } from 'react';

const COLOR_MAP = {
  green: { primary: '34, 197, 94', secondary: '59, 130, 246', tertiary: '139, 92, 246' },
  blue: { primary: '59, 130, 246', secondary: '34, 197, 94', tertiary: '139, 92, 246' },
  purple: { primary: '139, 92, 246', secondary: '59, 130, 246', tertiary: '34, 197, 94' },
  red: { primary: '239, 68, 68', secondary: '249, 115, 22', tertiary: '245, 158, 11' },
  yellow: { primary: '245, 158, 11', secondary: '34, 197, 94', tertiary: '59, 130, 246' }
};

const GRID_SIZE = 60;
const PACKET_COUNT = 4;

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.visited = false;
    this.pulseOffset = Math.random() * Math.PI * 2;
  }

  draw(ctx, time, palette, mouseDistance, opacity) {
    const xPos = this.x * GRID_SIZE;
    const yPos = this.y * GRID_SIZE;

    const pulse = Math.sin(time * 0.0004 + this.pulseOffset) * 0.2 + 0.35;
    const proximity = Math.max(0, 1 - mouseDistance / 280);
    const intensity = (pulse + proximity * 0.6) * opacity;

    const layers = [
      `rgba(${palette.primary}, ${intensity * 0.5})`,
      `rgba(${palette.secondary}, ${intensity * 0.35})`,
      `rgba(${palette.tertiary}, ${intensity * 0.2})`
    ];

    layers.forEach((color, index) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6 - index * 0.3;

      if (this.walls.top) {
        ctx.beginPath();
        ctx.moveTo(xPos, yPos);
        ctx.lineTo(xPos + GRID_SIZE, yPos);
        ctx.stroke();
      }
      if (this.walls.right) {
        ctx.beginPath();
        ctx.moveTo(xPos + GRID_SIZE, yPos);
        ctx.lineTo(xPos + GRID_SIZE, yPos + GRID_SIZE);
        ctx.stroke();
      }
      if (this.walls.bottom) {
        ctx.beginPath();
        ctx.moveTo(xPos + GRID_SIZE, yPos + GRID_SIZE);
        ctx.lineTo(xPos, yPos + GRID_SIZE);
        ctx.stroke();
      }
      if (this.walls.left) {
        ctx.beginPath();
        ctx.moveTo(xPos, yPos + GRID_SIZE);
        ctx.lineTo(xPos, yPos);
        ctx.stroke();
      }
    });

    if (intensity > 0.25) {
      ctx.fillStyle = `rgba(${palette.primary}, ${intensity * 0.6})`;
      ctx.beginPath();
      ctx.arc(xPos + GRID_SIZE / 2, yPos + GRID_SIZE / 2, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

const createPackets = (width, height, palette) =>
  Array.from({ length: PACKET_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    dx: (Math.random() - 0.5) * 0.18,
    dy: (Math.random() - 0.5) * 0.18,
    size: Math.random() * 1.5 + 0.5,
    pulseOffset: Math.random() * Math.PI * 2,
    color: Math.random() > 0.5 ? palette.primary : palette.secondary
  }));

export default function CyberMaze({ isEnabled = true, color = 'green', opacity = 0.25 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const resizeRafRef = useRef(null);
  const mouseUpdateRef = useRef(null);
  const pendingMouseRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });
  const mazeRef = useRef({ grid: [], cols: 0, rows: 0 });
  const packetsRef = useRef([]);
  const drawFrameRef = useRef(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (!isEnabled) {
      mazeRef.current = { grid: [], cols: 0, rows: 0 };
      packetsRef.current = [];
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      canvas.style.opacity = '0';
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      return;
    }

    const palette = COLOR_MAP[color] ?? COLOR_MAP.green;
    const safeOpacity = Math.max(0, Math.min(opacity, 1));

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const generateMaze = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const cols = Math.max(1, Math.floor(width / GRID_SIZE));
      const rows = Math.max(1, Math.floor(height / GRID_SIZE));
      const grid = Array.from({ length: cols }, (_, x) =>
        Array.from({ length: rows }, (_, y) => new Cell(x, y))
      );

      const stack = [];
      let current = grid[0][0];
      current.visited = true;

      const getUnvisited = (cell) => {
        const neighbors = [];
        const { x, y } = cell;
        if (y > 0) neighbors.push(grid[x][y - 1]);
        if (x < cols - 1) neighbors.push(grid[x + 1][y]);
        if (y < rows - 1) neighbors.push(grid[x][y + 1]);
        if (x > 0) neighbors.push(grid[x - 1][y]);
        return neighbors.filter((neighbor) => !neighbor.visited);
      };

      while (current) {
        const neighbors = getUnvisited(current);
        if (neighbors.length > 0) {
          const next = neighbors[Math.floor(Math.random() * neighbors.length)];
          stack.push(current);

          if (current.x > next.x) {
            current.walls.left = false;
            next.walls.right = false;
          } else if (current.x < next.x) {
            current.walls.right = false;
            next.walls.left = false;
          } else if (current.y > next.y) {
            current.walls.top = false;
            next.walls.bottom = false;
          } else if (current.y < next.y) {
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

      mazeRef.current = { grid, cols, rows };
    };

    const renderPackets = (time) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      packetsRef.current.forEach((packet) => {
        packet.x += packet.dx;
        packet.y += packet.dy;

        if (packet.x <= 0 || packet.x >= width) packet.dx *= -1;
        if (packet.y <= 0 || packet.y >= height) packet.dy *= -1;

        const pulse = Math.sin(time * 0.001 + packet.pulseOffset) * 0.3 + 0.5;
        const size = packet.size * (1 + pulse * 0.25);
        const fillColor = `rgba(${packet.color}, ${0.3 * safeOpacity})`;

        ctx.fillStyle = fillColor;
        ctx.shadowColor = fillColor;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(packet.x, packet.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = `rgba(${packet.color}, ${0.12 * safeOpacity})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(packet.x - packet.dx * 6, packet.y - packet.dy * 6);
        ctx.lineTo(packet.x, packet.y);
        ctx.stroke();
      });
    };

    const drawFrame = (time) => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        animationRef.current = null;
        return;
      }

      const { grid, cols, rows } = mazeRef.current;
      if (!grid.length) {
        animationRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      const { x, y } = mousePosRef.current;

      for (let col = 0; col < cols; col += 1) {
        for (let row = 0; row < rows; row += 1) {
          const cell = grid[col][row];
          const centerX = col * GRID_SIZE + GRID_SIZE / 2;
          const centerY = row * GRID_SIZE + GRID_SIZE / 2;
          const distance = Math.hypot(centerX - x, centerY - y);
          cell.draw(ctx, time, palette, distance, safeOpacity);
        }
      }

      renderPackets(time);
      animationRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrameRef.current = drawFrame;

    resizeCanvas();
    generateMaze();
    packetsRef.current = createPackets(canvas.clientWidth, canvas.clientHeight, palette);
    canvas.style.opacity = safeOpacity;

    if (typeof document === 'undefined' || document.visibilityState !== 'hidden') {
      animationRef.current = requestAnimationFrame(drawFrame);
    }

    const handleResize = () => {
      if (resizeRafRef.current) {
        cancelAnimationFrame(resizeRafRef.current);
      }

      resizeRafRef.current = requestAnimationFrame(() => {
        resizeCanvas();
        generateMaze();
        packetsRef.current = createPackets(canvas.clientWidth, canvas.clientHeight, palette);
        resizeRafRef.current = null;
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeRafRef.current) {
        cancelAnimationFrame(resizeRafRef.current);
        resizeRafRef.current = null;
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [color, isEnabled, opacity]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const handleVisibilityChange = () => {
      const hidden = document.visibilityState === 'hidden';
      if (hidden) {
        if (resizeRafRef.current) {
          cancelAnimationFrame(resizeRafRef.current);
          resizeRafRef.current = null;
        }
        if (mouseUpdateRef.current) {
          cancelAnimationFrame(mouseUpdateRef.current);
          mouseUpdateRef.current = null;
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      } else if (isEnabled && !animationRef.current) {
        animationRef.current = requestAnimationFrame((time) => drawFrameRef.current(time));
      }
    };

    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isEnabled]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handleMouseMove = (event) => {
      pendingMouseRef.current = { x: event.clientX, y: event.clientY };
      if (!mouseUpdateRef.current) {
        mouseUpdateRef.current = requestAnimationFrame(() => {
          mousePosRef.current = pendingMouseRef.current;
          mouseUpdateRef.current = null;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseUpdateRef.current) {
        cancelAnimationFrame(mouseUpdateRef.current);
        mouseUpdateRef.current = null;
      }
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, mixBlendMode: 'screen', filter: 'blur(0.4px)' }}
      aria-hidden="true"
    />
  );
}
