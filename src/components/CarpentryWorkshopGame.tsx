import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Play,
  RotateCcw,
  Trophy,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Hammer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CarpentryWorkshopGameProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderTask {
  name: string;
  wood: string;
  targetLength: number; // inches
  reward: number;
}

export const CarpentryWorkshopGame: React.FC<CarpentryWorkshopGameProps> = ({ isOpen, onClose }) => {
  const [gameState, setGameState] = useState<'title' | 'playing' | 'gameover' | 'victory'>('title');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [step, setStep] = useState<'cut' | 'join' | 'polish'>('cut');
  const [cutterPos, setCutterPos] = useState(50); // percentage 0-100
  const [polishProgress, setPolishProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);

  const ORDERS: OrderTask[] = [
    { name: 'Royal Sheesham King Bed Frame', wood: '100% Solid Sheesham', targetLength: 78, reward: 500 },
    { name: 'CP Teakwood Pooja Mandir Shikhar', wood: 'Grade-A CP Teak (Sagwan)', targetLength: 60, reward: 650 },
    { name: '6-Seater Heritage Dining Tabletop', wood: 'Seasoned Rosewood', targetLength: 84, reward: 800 },
    { name: 'Executive Walnut Study Desk Top', wood: 'Kiln-Dried Mango Wood', targetLength: 64, reward: 550 },
  ];

  const currentOrder = ORDERS[currentOrderIndex % ORDERS.length];

  // Procedural Web Audio Synth Sounds
  const playSynthSound = (type: 'saw' | 'hammer' | 'polish' | 'success' | 'fail') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'saw') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'hammer') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'polish') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Audio fallback
    }
  };

  // Game Timer Loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState(score >= 1200 ? 'victory' : 'gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState, score]);

  // Cutter blade oscillating animation
  useEffect(() => {
    if (gameState !== 'playing' || step !== 'cut') return;
    let forward = true;
    const interval = setInterval(() => {
      setCutterPos((pos) => {
        if (pos >= 90) forward = false;
        if (pos <= 10) forward = true;
        return forward ? pos + 2.5 : pos - 2.5;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [gameState, step]);

  // Handle Cut Timing Action
  const handleCutAction = () => {
    playSynthSound('saw');
    // Sweet spot is between 45% and 65%
    const accuracy = Math.abs(cutterPos - 55);
    if (accuracy <= 15) {
      setScore((s) => s + 200);
      playSynthSound('success');
      setStep('join');
    } else {
      setScore((s) => Math.max(0, s + 50));
      setStep('join');
    }
  };

  // Handle Mortise Joinery Action
  const handleJoinAction = () => {
    playSynthSound('hammer');
    setScore((s) => s + 200);
    setStep('polish');
  };

  // Handle Polishing Rubs
  const handlePolishAction = () => {
    playSynthSound('polish');
    const nextProg = polishProgress + 35;
    if (nextProg >= 100) {
      playSynthSound('success');
      setScore((s) => s + currentOrder.reward);
      setPolishProgress(0);
      setStep('cut');
      setCurrentOrderIndex((i) => i + 1);

      if (score + currentOrder.reward >= 2000) {
        setGameState('victory');
        confetti({ particleCount: 80, spread: 70 });
      }
    } else {
      setPolishProgress(nextProg);
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(45);
    setCurrentOrderIndex(0);
    setStep('cut');
    setPolishProgress(0);
    setGameState('playing');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#1f140e] text-[#f5ede1] flex flex-col justify-between p-4 sm:p-6 select-none overflow-hidden">
      {/* Perimeter Status Header (Low-occlusion UI) */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7e4b2c] border border-[#cb9f6a] flex items-center justify-center text-[#dec099] shadow-md">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base text-white">
              Karigar Master: Udhyog Carpentry Challenge
            </h2>
            <p className="text-[10px] text-stone-400">
              Satkkabir Furniture Udhyog Handcrafted Mini-Game
            </p>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#cb9f6a]/40 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Clock className="w-3.5 h-3.5" />
              <span className="tabular-nums font-bold">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300">
              <Trophy className="w-3.5 h-3.5" />
              <span className="tabular-nums font-bold">₹{score}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Playfield Screen */}
      <div className="relative flex-1 flex items-center justify-center my-4">
        {/* TITLE SCREEN */}
        {gameState === 'title' && (
          <div className="text-center max-w-md bg-black/50 p-8 rounded-3xl border border-[#cb9f6a]/60 shadow-2xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c28e46] to-[#7e4b2c] flex items-center justify-center mx-auto text-white shadow-lg">
              <Hammer className="w-8 h-8" />
            </div>

            <div>
              <h1 className="font-serif text-3xl font-extrabold text-white">
                The Master Craftsman
              </h1>
              <p className="text-xs text-[#dec099] mt-1 font-medium">
                Step into the workshop floor of Satkkabir Furniture Udhyog. Saw logs to exact blueprint sizes, chisel mortise tenon joints, and beeswax polish royal pieces!
              </p>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs text-stone-300 space-y-1">
              <p>🎯 <strong>Objective:</strong> Fulfill client orders before the 45s timer expires.</p>
              <p>🏆 <strong>Goal:</strong> Earn ₹1,200+ in craft master reputation.</p>
            </div>

            <button
              onClick={startGame}
              className="w-full py-3.5 rounded-xl bg-[#c28e46] hover:bg-[#aa7730] text-[#241711] font-bold text-sm shadow-xl transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter Workshop (Start Game)</span>
            </button>
            <p className="text-[10px] text-stone-400">Controls: Click or Tap actions</p>
          </div>
        )}

        {/* ACTIVE PLAYING SCREEN */}
        {gameState === 'playing' && (
          <div className="w-full max-w-xl bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-[#dec099]/40 shadow-2xl space-y-6">
            {/* Active Order Card */}
            <div className="bg-[#301a11]/80 p-4 rounded-2xl border border-[#cb9f6a] flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#dec099]">
                  Commission #{currentOrderIndex + 1}:
                </span>
                <h3 className="font-serif font-bold text-base text-white">{currentOrder.name}</h3>
                <span className="text-xs text-emerald-400 font-semibold">{currentOrder.wood}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">Reward</span>
                <span className="text-lg font-mono font-extrabold text-[#c28e46]">
                  +₹{currentOrder.reward}
                </span>
              </div>
            </div>

            {/* STEP 1: PRECISION TIMBER SAWING */}
            {step === 'cut' && (
              <div className="space-y-4 text-center">
                <span className="text-xs font-bold text-stone-300 block">
                  Stage 1: Precision Circular Saw Cutting (Target: {currentOrder.targetLength} inches)
                </span>

                {/* Oscillating Saw Gauge Bar */}
                <div className="relative w-full h-12 bg-[#3d2417] rounded-2xl overflow-hidden border-2 border-[#7e4b2c] p-1">
                  {/* Sweet spot target zone */}
                  <div className="absolute top-0 bottom-0 left-[45%] right-[35%] bg-emerald-500/30 border-x-2 border-emerald-400 flex items-center justify-center">
                    <span className="text-[9px] text-emerald-300 font-bold uppercase">
                      Exact {currentOrder.targetLength}" Mark
                    </span>
                  </div>

                  {/* Moving Saw Blade */}
                  <div
                    className="absolute top-1 bottom-1 w-3 bg-[#f5ede1] rounded-sm shadow-md transition-all duration-20"
                    style={{ left: `${cutterPos}%` }}
                  />
                </div>

                <button
                  onClick={handleCutAction}
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-lg active:scale-95 transition"
                >
                  ⚡ STRIKE CUT SAW BLADE
                </button>
                <p className="text-[11px] text-stone-400">
                  Tap when the white blade aligns with the green zone!
                </p>
              </div>
            )}

            {/* STEP 2: MORTISE & TENON JOINERY */}
            {step === 'join' && (
              <div className="space-y-4 text-center">
                <span className="text-xs font-bold text-stone-300 block">
                  Stage 2: Mortise & Tenon Interlocking Wooden Joinery
                </span>

                <div className="p-6 bg-[#3d2417] rounded-2xl border-2 border-[#7e4b2c] flex items-center justify-center gap-4">
                  <div className="w-16 h-12 bg-[#c28e46] rounded-md border border-white/20 flex items-center justify-center font-bold text-xs">
                    TENON
                  </div>
                  <span className="text-lg">➡️</span>
                  <div className="w-16 h-12 bg-[#5a3825] rounded-md border-2 border-dashed border-emerald-400 flex items-center justify-center font-bold text-xs text-emerald-300">
                    MORTISE
                  </div>
                </div>

                <button
                  onClick={handleJoinAction}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <Hammer className="w-4 h-4" />
                  <span>HAMMER WOOD JOINTS TOGETHER</span>
                </button>
              </div>
            )}

            {/* STEP 3: HAND POLISHING & BEESWAX */}
            {step === 'polish' && (
              <div className="space-y-4 text-center">
                <span className="text-xs font-bold text-stone-300 block">
                  Stage 3: Italian Polyurethane Buff & Organic Waxing
                </span>

                <div className="w-full h-8 bg-stone-800 rounded-full overflow-hidden p-1 border border-stone-700">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-200"
                    style={{ width: `${polishProgress}%` }}
                  />
                </div>

                <button
                  onClick={handlePolishAction}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>BUFF & POLISH ({polishProgress}% Finished)</span>
                </button>
                <p className="text-[11px] text-stone-400">
                  Rapidly tap to bring out the pure golden wood glow!
                </p>
              </div>
            )}
          </div>
        )}

        {/* GAME OVER / VICTORY MODAL */}
        {(gameState === 'gameover' || gameState === 'victory') && (
          <div className="text-center max-w-md bg-black/60 p-8 rounded-3xl border border-[#cb9f6a] shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-800">
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="font-serif text-2xl font-bold text-white">
              {gameState === 'victory' ? 'Royal Master Artisan Certified!' : 'Shift Complete!'}
            </h2>
            <p className="text-xs text-stone-300">
              You earned <strong className="text-emerald-400 font-mono text-base">₹{score}</strong> in workshop reputation points for Satkkabir Furniture Udhyog.
            </p>

            <button
              onClick={startGame}
              className="w-full py-3 rounded-xl bg-[#c28e46] hover:bg-[#aa7730] text-[#241711] font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Another Shift</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-stone-300 transition"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>

      {/* Control Hint Line Bottom */}
      <div className="text-center text-[11px] text-stone-500 font-mono z-20">
        Satkkabir Carpentry Simulation • Handcrafted Timber Quality Standard
      </div>
    </div>
  );
};
