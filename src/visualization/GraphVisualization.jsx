import { useEffect, useMemo, useRef, useState } from 'react';
import { Users } from 'lucide-react';
import { getPersonColor } from '../utils/colorUtils';
import { formatCurrency, formatSignedCurrency } from '../utils/formatters';

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.life = 1;
    this.color = color;
    this.size = Math.random() * 3 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.02;
    this.vy += 0.1;
  }

  draw(ctx) {
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const GraphVisualization = ({ people, transactions, animationSteps, currentStep, showOptimized, balances }) => {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [pulsePhase, setPulsePhase] = useState(0);
  const animationFrameRef = useRef();

  const nodePositions = useMemo(() => {
    const positions = {};
    const radius = 200;
    const centerX = 400;
    const centerY = 300;
    const angleStep = people.length > 0 ? (2 * Math.PI) / people.length : 0;

    people.forEach((person, idx) => {
      const angle = idx * angleStep - Math.PI / 2;
      positions[person] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });

    return positions;
  }, [people]);

  useEffect(() => {
    const animate = () => {
      setPulsePhase((prev) => (prev + 0.05) % (Math.PI * 2));

      setParticles((prev) => {
        const updated = prev.filter((particle) => particle.life > 0);
        updated.forEach((particle) => particle.update());
        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showOptimized && currentStep >= 0 && animationSteps[currentStep]) {
      const step = animationSteps[currentStep];
      if (step.type === 'transaction') {
        const fromPos = nodePositions[step.from];
        const toPos = nodePositions[step.to];

        if (fromPos && toPos) {
          const nextParticles = [];
          for (let i = 0; i < 20; i++) {
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;
            nextParticles.push(new Particle(midX, midY, '#10b981'));
          }
          queueMicrotask(() => {
            setParticles((prev) => [...prev, ...nextParticles]);
          });
        }
      }
    }
  }, [currentStep, showOptimized, animationSteps, nodePositions]);

  useEffect(() => {
    if (!canvasRef.current || Object.keys(nodePositions).length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = 800 * dpr;
    canvas.height = 600 * dpr;
    canvas.style.width = '800px';
    canvas.style.height = '600px';
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, 800, 600);

    const edgesToDraw = showOptimized && animationSteps.length > 0
      ? animationSteps.slice(0, currentStep + 1).filter((step) => step.type === 'transaction')
      : transactions;

    edgesToDraw.forEach((txn) => {
      const from = nodePositions[txn.from];
      const to = nodePositions[txn.to];
      if (!from || !to) return;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const angle = Math.atan2(dy, dx);

      const startX = from.x + 35 * Math.cos(angle);
      const startY = from.y + 35 * Math.sin(angle);
      const endX = to.x - 35 * Math.cos(angle);
      const endY = to.y - 35 * Math.sin(angle);

      const controlX = (startX + endX) / 2 + 30 * Math.cos(angle + Math.PI / 2);
      const controlY = (startY + endY) / 2 + 30 * Math.sin(angle + Math.PI / 2);

      const currentStepData = showOptimized && animationSteps[currentStep];
      const isActive = showOptimized && currentStepData && currentStepData.type === 'transaction' &&
        currentStepData.from === txn.from && currentStepData.to === txn.to;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.quadraticCurveTo(controlX, controlY, endX, endY);

      if (showOptimized) {
        ctx.strokeStyle = isActive ? '#10b981' : '#6366f1';
        ctx.lineWidth = isActive ? 5 : 3;
        ctx.shadowColor = isActive ? '#10b981' : '#6366f1';
        ctx.shadowBlur = isActive ? 20 : 5;
      } else {
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
      }

      ctx.stroke();

      const arrowSize = 12;
      const endAngle = Math.atan2(endY - controlY, endX - controlX);

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowSize * Math.cos(endAngle - Math.PI / 6),
        endY - arrowSize * Math.sin(endAngle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - arrowSize * Math.cos(endAngle + Math.PI / 6),
        endY - arrowSize * Math.sin(endAngle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fill();

      const midX = (startX + endX) / 2 + 20 * Math.cos(angle + Math.PI / 2);
      const midY = (startY + endY) / 2 + 20 * Math.sin(angle + Math.PI / 2);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(midX - 25, midY - 12, 50, 24);

      ctx.fillStyle = isActive ? '#10b981' : '#fbbf24';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(formatCurrency(txn.amount), midX, midY);
    });

    particles.forEach((particle) => particle.draw(ctx));

    people.forEach((person) => {
      const pos = nodePositions[person];
      if (!pos) return;

      const currentStepData = showOptimized && animationSteps[currentStep];
      const isActive = currentStepData &&
        ((currentStepData.type === 'transaction' &&
          (currentStepData.from === person || currentStepData.to === person)) ||
          (currentStepData.type === 'consider' &&
            currentStepData.people && currentStepData.people.includes(person)) ||
          (currentStepData.type === 'select' &&
            (currentStepData.creditor === person || currentStepData.debtor === person)));

      const pulseSize = isActive ? 5 + Math.sin(pulsePhase * 3) * 3 : 0;
      const nodeRadius = 30 + pulseSize;

      if (isActive) {
        ctx.shadowColor = getPersonColor(people, person);
        ctx.shadowBlur = 25 + Math.sin(pulsePhase * 3) * 10;
      } else {
        ctx.shadowColor = getPersonColor(people, person);
        ctx.shadowBlur = 15;
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = getPersonColor(people, person);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (isActive) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius + 8, 0, 2 * Math.PI);
        ctx.strokeStyle = getPersonColor(people, person);
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(person[0].toUpperCase(), pos.x, pos.y);

      const balance = balances && balances[person];
      if (balance !== undefined && balance !== 0) {
        const balanceText = formatSignedCurrency(balance);
        ctx.fillStyle = balance > 0 ? '#10b981' : '#ef4444';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(balanceText, pos.x, pos.y - 45);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(person, pos.x, pos.y + 50);
    });
  }, [nodePositions, transactions, animationSteps, currentStep, showOptimized, people, particles, pulsePhase, balances]);

  if (people.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white/50">
        <div className="text-center">
          <Users size={64} className="mx-auto mb-4 opacity-30" />
          <p>Add people to see graph visualization</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full">
      <canvas
        ref={canvasRef}
        className="rounded-xl"
        style={{ width: '800px', height: '600px' }}
      />
    </div>
  );
};

export default GraphVisualization;
