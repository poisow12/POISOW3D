const API = import.meta.env.VITE_API_URL || "";
import React, { useState, useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, useInView } from "framer-motion";
import { SiInstagram } from "react-icons/si";
import { ArrowRight, ChevronRight, MapPin, Clock, Star, CheckCircle2, Trash2, Copy, Download, Search, ChevronDown, ChevronUp, StickyNote, LogOut, RefreshCw, X, AlertTriangle, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const queryClient = new QueryClient();
const INSTAGRAM_URL = "https://www.instagram.com/poisow3d/";

/* ─── Logo Mark ─────────────────────────────────────────────────────────── */
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 22 L16 28 L28 22 L16 16 Z" fill="#3F3F46" />
      <path d="M4 16 L16 22 L28 16 L16 10 Z" fill="#52525B" />
      <path d="M4 10 L16 16 L28 10 L16 4 Z" fill="#FF5A2A" />
      <path d="M4 16 L4 22 L16 28 L16 22 Z" fill="#27272A" />
      <path d="M28 16 L28 22 L16 28 L16 22 Z" fill="#3F3F46" />
    </svg>
  );
}

/* ─── Printer Visual ─────────────────────────────────────────────────────── */
function PrinterVisual() {
  const [rawMs, setRawMs] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      setRawMs(ts - startRef.current);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const LOOP_MS = 12000;
  const t = (rawMs % LOOP_MS) / LOOP_MS;
  const glowPulse = 0.55 + 0.45 * Math.sin((rawMs % 800) / 800 * Math.PI * 2);
  const bedPulse = 0.04 + 0.03 * Math.sin((rawMs % 2400) / 2400 * Math.PI * 2);
  const fanAngle = (rawMs / 4) % 360;

  const NUM_LAYERS = 7;
  const LAYER_H = 10;
  const PRINT_FRAC = 0.80;
  const isPrinting = t < PRINT_FRAC;

  const printT = isPrinting ? t / PRINT_FRAC : 1;
  const totalPhase = printT * NUM_LAYERS;
  const layerIdx = Math.min(Math.floor(totalPhase), NUM_LAYERS - 1);
  const layerProg = totalPhase - Math.floor(totalPhase);

  const POST_L = 28;
  const POST_R = 308;
  const FRAME_TOP = 10;
  const BED_TOP = 236;
  const PL = 68;
  const PR = 270;
  const PW = PR - PL;
  const NOZZLE_DROP = 42;
  const DEPTH_X = 22;
  const DEPTH_Y = 11;

  const goingRight = layerIdx % 2 === 0;
  const nozzleNorm = goingRight ? layerProg : 1 - layerProg;
  const nozzleX = isPrinting ? PL + nozzleNorm * PW : PR;

  const layerTopY = (idx: number) => BED_TOP - (idx + 1) * LAYER_H;
  const currentTopY = layerTopY(layerIdx);
  const nozzleTipY = isPrinting ? currentTopY : layerTopY(NUM_LAYERS - 1) - 6;
  const gantryY = nozzleTipY - NOZZLE_DROP;

  const curLayerX = goingRight ? PL : PL + layerProg * PW;
  const curLayerW = layerProg * PW;

  const layerFrontColor = (i: number) => (i % 2 === 0 ? "#FF5A2A" : "#D94E22");
  const layerSideColor  = (i: number) => (i % 2 === 0 ? "#B83D1A" : "#A33318");
  const layerTopColor   = "#FF7850";
  const pct = Math.round(t * 100);
  const completedLayerCount = isPrinting ? layerIdx : NUM_LAYERS;

  return (
    <div className="relative w-full flex items-center justify-center p-4 md:p-6">
      <svg viewBox="0 0 370 280" fill="none" className="w-full max-w-[420px]"
        style={{ filter: "drop-shadow(0 6px 40px rgba(255,90,42,0.18))" }}>
        <defs>
          <linearGradient id="postG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3F3F46" /><stop offset="100%" stopColor="#27272A" />
          </linearGradient>
          <linearGradient id="gantryG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#52525B" /><stop offset="100%" stopColor="#3F3F46" />
          </linearGradient>
          <radialGradient id="nozzleGlowG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5A2A" stopOpacity={glowPulse * 0.7} />
            <stop offset="60%" stopColor="#FF5A2A" stopOpacity={glowPulse * 0.15} />
            <stop offset="100%" stopColor="#FF5A2A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bedGlowG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF2200" stopOpacity={bedPulse * 2} />
            <stop offset="100%" stopColor="#FF2200" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="layerGlowG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF7A50" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF5A2A" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <rect x={POST_L} y={FRAME_TOP} width="12" height="240" rx="2" fill="url(#postG)" />
        <rect x={POST_L + 2} y={FRAME_TOP + 2} width="2" height="236" fill="#52525B" opacity="0.3" />
        <rect x={POST_R - 12} y={FRAME_TOP} width="12" height="240" rx="2" fill="#27272A" />
        <rect x={POST_R - 5} y={FRAME_TOP + 2} width="2" height="236" fill="#52525B" opacity="0.25" />
        <rect x={POST_L} y={FRAME_TOP} width={POST_R - POST_L} height="10" rx="2" fill="#3F3F46" />
        <rect x={POST_L + 3} y={FRAME_TOP + 2} width={POST_R - POST_L - 6} height="3.5" rx="1" fill="#52525B" opacity="0.4" />
        <rect x={POST_L - 8} y={250} width="40" height="8" rx="2" fill="#27272A" />
        <rect x={POST_L - 8} y={248} width="40" height="4" rx="1" fill="#3F3F46" />
        <rect x={POST_R - 32} y={250} width="40" height="8" rx="2" fill="#27272A" />
        <rect x={POST_R - 32} y={248} width="40" height="4" rx="1" fill="#3F3F46" />
        <rect x={POST_L + 4} y={FRAME_TOP + 12} width="3" height="226" fill="#52525B" opacity="0.45" />
        <rect x={POST_R - 7} y={FRAME_TOP + 12} width="3" height="226" fill="#52525B" opacity="0.45" />
        {Array.from({ length: 18 }, (_, i) => (
          <line key={i} x1={POST_L + 4} y1={FRAME_TOP + 14 + i * 12} x2={POST_L + 7} y2={FRAME_TOP + 14 + i * 12}
            stroke="#71717A" strokeWidth="0.5" opacity="0.4" />
        ))}
        <rect x={POST_L + 16} y={FRAME_TOP + 2} width="56" height="32" rx="2" fill="#080E08" stroke="#3F3F46" strokeWidth="0.8" />
        <rect x={POST_L + 18} y={FRAME_TOP + 4} width="52" height="28" rx="1" fill="#060D06" />
        <text x={POST_L + 20} y={FRAME_TOP + 12} fontFamily="monospace" fontSize="4.5" fill="#9FD356" letterSpacing="0.3">poisow 3d</text>
        <text x={POST_L + 20} y={FRAME_TOP + 19} fontFamily="monospace" fontSize="3.8" fill="#5A8A3A" letterSpacing="0.2">{`T:210 B:60°C`}</text>
        <rect x={POST_L + 20} y={FRAME_TOP + 22} width="46" height="3.5" rx="1.5" fill="#122212" />
        <rect x={POST_L + 20} y={FRAME_TOP + 22} width={46 * t} height="3.5" rx="1.5" fill="#9FD356" />
        <rect x={POST_L + 18} y={FRAME_TOP + 4} width="14" height="28" rx="1" fill="white" opacity="0.025" />
        <text x={POST_L + 20} y={FRAME_TOP + 30} fontFamily="monospace" fontSize="3.5" fill="#4A6A3A">{pct}% complet.</text>
        <circle cx={POST_R + 26} cy={FRAME_TOP + 36} r="26" fill="#1A1A1D" stroke="#3F3F46" strokeWidth="1.5" />
        <circle cx={POST_R + 26} cy={FRAME_TOP + 36} r="22" fill="none" stroke="#FF5A2A" strokeWidth="5" strokeDasharray="60 12" opacity="0.7" />
        <circle cx={POST_R + 26} cy={FRAME_TOP + 36} r="16" fill="none" stroke="#CC3A11" strokeWidth="3" strokeDasharray="40 10" opacity="0.45" />
        <circle cx={POST_R + 26} cy={FRAME_TOP + 36} r="8" fill="#27272A" stroke="#3F3F46" strokeWidth="1" />
        {[0, 60, 120, 180, 240, 300].map(deg => {
          const rad = deg * Math.PI / 180;
          return <line key={deg}
            x1={POST_R + 26 + Math.cos(rad) * 3} y1={FRAME_TOP + 36 + Math.sin(rad) * 3}
            x2={POST_R + 26 + Math.cos(rad) * 7} y2={FRAME_TOP + 36 + Math.sin(rad) * 7}
            stroke="#52525B" strokeWidth="1" />;
        })}
        <circle cx={POST_R + 26} cy={FRAME_TOP + 36} r="3" fill="#3F3F46" />
        <path d={`M${POST_R + 8} ${FRAME_TOP + 24} C${nozzleX + 60} ${gantryY - 50} ${nozzleX + 30} ${gantryY - 22} ${nozzleX + 10} ${gantryY + 2}`}
          stroke="#D4D4D8" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.25" fill="none" />
        <rect x="44" y={BED_TOP + 7} width={POST_R - 44 + 12} height="8" rx="1" fill="#1E1E22" />
        <rect x="52" y={BED_TOP + 1} width={PW + 16} height="8" rx="1" fill="#2A2A32" />
        <rect x="55" y={BED_TOP - 4} width={PW + 10} height="7" rx="0.5" fill="#48484F" />
        <rect x="56" y={BED_TOP - 4} width="30" height="7" rx="0.5" fill="white" opacity="0.04" />
        {[PL + 20, PL + 46, PL + 72, PL + 98, PL + 124, PL + 150, PL + 176].map(gx => (
          <line key={gx} x1={gx} y1={BED_TOP - 4} x2={gx} y2={BED_TOP + 3} stroke="#3A3A42" strokeWidth="0.7" />
        ))}
        <ellipse cx={(PL + PR) / 2} cy={BED_TOP} rx={PW / 2} ry="6" fill="url(#bedGlowG)" />
        {Array.from({ length: completedLayerCount }, (_, i) => {
          const ty = layerTopY(i);
          const fc = layerFrontColor(i);
          const sc = layerSideColor(i);
          return (
            <g key={i}>
              <rect x={PL} y={ty} width={PW} height={LAYER_H} fill={fc} />
              <rect x={PL} y={ty} width={PW} height="1.5" fill="white" opacity="0.09" />
              <rect x={PL} y={ty + LAYER_H - 1} width={PW} height="1" fill="black" opacity="0.2" />
              <polygon points={`${PR},${ty} ${PR + DEPTH_X},${ty - DEPTH_Y} ${PR + DEPTH_X},${ty + LAYER_H - DEPTH_Y} ${PR},${ty + LAYER_H}`} fill={sc} />
              <polygon points={`${PR},${ty} ${PR + DEPTH_X},${ty - DEPTH_Y} ${PR + DEPTH_X},${ty - DEPTH_Y + 1.5} ${PR},${ty + 1.5}`} fill="white" opacity="0.06" />
            </g>
          );
        })}
        {completedLayerCount > 0 && (
          <polygon
            points={`${PL},${layerTopY(completedLayerCount - 1)} ${PL + DEPTH_X},${layerTopY(completedLayerCount - 1) - DEPTH_Y} ${PR + DEPTH_X},${layerTopY(completedLayerCount - 1) - DEPTH_Y} ${PR},${layerTopY(completedLayerCount - 1)}`}
            fill={layerTopColor} opacity="0.75" />
        )}
        {isPrinting && curLayerW > 1 && (
          <g>
            <rect x={curLayerX} y={currentTopY} width={curLayerW} height={LAYER_H} fill={layerFrontColor(layerIdx)} />
            <rect x={curLayerX} y={currentTopY} width={curLayerW} height="1.5" fill="white" opacity="0.12" />
            <rect x={curLayerX} y={currentTopY} width={curLayerW} height={LAYER_H} fill="#FF7A50" opacity="0.18" />
          </g>
        )}
        <rect x={POST_L + 12} y={gantryY} width={POST_R - POST_L - 24} height="10" rx="1.5" fill="url(#gantryG)" />
        <rect x={POST_L + 12} y={gantryY + 1} width={POST_R - POST_L - 24} height="3" rx="0.5" fill="#71717A" opacity="0.35" />
        <rect x={POST_L + 12} y={gantryY + 4} width={POST_R - POST_L - 24} height="1.5" rx="0.5" fill="#18181B" opacity="0.5" />
        <rect x={nozzleX - 19} y={gantryY - 4} width="38" height="22" rx="3" fill="#1E1E24" stroke="#3A3A42" strokeWidth="0.8" />
        <rect x={nozzleX - 16} y={gantryY - 2} width="32" height="8" rx="2" fill="#3A3A42" />
        <rect x={nozzleX - 14} y={gantryY} width="28" height="4" rx="1" fill="#4A4A52" opacity="0.6" />
        <rect x={nozzleX - 17} y={gantryY + 8} width="14" height="13" rx="2" fill="#141418" stroke="#28282E" strokeWidth="0.5" />
        {[0, 60, 120, 180, 240, 300].map(deg => {
          const rad = (deg + fanAngle) * Math.PI / 180;
          return <line key={deg}
            x1={nozzleX - 10} y1={gantryY + 14.5}
            x2={nozzleX - 10 + Math.cos(rad) * 5} y2={gantryY + 14.5 + Math.sin(rad) * 5}
            stroke="#2E2E36" strokeWidth="1.2" />;
        })}
        <circle cx={nozzleX - 10} cy={gantryY + 14.5} r="6" stroke="#28282E" strokeWidth="0.8" fill="none" />
        <circle cx={nozzleX - 10} cy={gantryY + 14.5} r="2" fill="#1A1A20" />
        <rect x={nozzleX - 2} y={gantryY + 6} width="7" height="12" rx="1" fill="#27272A" stroke="#3A3A42" strokeWidth="0.5" />
        {[0, 3, 6, 9].map(fi => (
          <rect key={fi} x={nozzleX - 4} y={gantryY + 7 + fi} width="11" height="1.5" rx="0.5" fill="#3A3A42" />
        ))}
        <rect x={nozzleX - 4} y={gantryY + 18} width="11" height="10" rx="1.5" fill="#C02800" />
        <rect x={nozzleX - 3} y={gantryY + 19} width="9" height="8" rx="1" fill="#E03200" opacity="0.8" />
        <rect x={nozzleX - 4} y={gantryY + 18} width="11" height="10" rx="1.5" fill="#FF5A2A" opacity={glowPulse * 0.3} />
        <path d={`M${nozzleX + 6} ${gantryY + 22} C${nozzleX + 14} ${gantryY + 20} ${nozzleX + 18} ${gantryY + 10} ${nozzleX + 18} ${gantryY}`}
          stroke="#D4D4D8" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d={`M${nozzleX - 3} ${gantryY + 28} L${nozzleX + 3} ${gantryY + 28} L${nozzleX + 1.5} ${gantryY + 38} L${nozzleX - 1.5} ${gantryY + 38} Z`} fill="#6A6A72" />
        <path d={`M${nozzleX - 1.5} ${gantryY + 38} L${nozzleX + 1.5} ${gantryY + 38} L${nozzleX + 0.8} ${gantryY + 41} L${nozzleX - 0.8} ${gantryY + 41} Z`} fill="#A1A1AA" />
        <circle cx={nozzleX} cy={nozzleTipY} r="24" fill="url(#nozzleGlowG)" />
        <circle cx={nozzleX} cy={nozzleTipY} r="8" fill="#FF5A2A" opacity={glowPulse * 0.2} />
        <circle cx={nozzleX} cy={nozzleTipY} r="3.5" fill="#FF5A2A" opacity={0.8 + glowPulse * 0.2} filter="url(#glow)" />
        <circle cx={nozzleX} cy={nozzleTipY} r="1.5" fill="white" opacity={0.5 + glowPulse * 0.35} />
        {isPrinting && curLayerW > 2 && (
          <line x1={nozzleX} y1={nozzleTipY} x2={nozzleX} y2={currentTopY}
            stroke="#FF7A50" strokeWidth="2" opacity={0.5 + glowPulse * 0.3} />
        )}
        {isPrinting && (
          <ellipse cx={nozzleX} cy={currentTopY + 2} rx="14" ry="5" fill="url(#layerGlowG)" opacity={glowPulse * 0.8} />
        )}
      </svg>
    </div>
  );
}

/* ─── Order Modal ────────────────────────────────────────────────────────── */
type OrderModalProps = { open: boolean; onClose: () => void; productName?: string };

function OrderModal({ open, onClose, productName = "" }: OrderModalProps) {
  const [name, setName] = useState("");
  const [product, setProduct] = useState(productName);
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setProduct(productName);
    setSent(false);
  }, [productName, open]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(API + "/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, product, details, contact }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        setError("Error al enviar el encargo. Por favor intenta de nuevo.");
      }
    } catch {
      setError("Error de conexión. Por favor intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="rounded-none border-primary/40 bg-card max-w-lg w-full p-0 gap-0">
        <div className="h-1 w-full bg-primary" />
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="font-mono text-2xl font-bold flex items-center gap-2">
              <LogoMark size={24} />
              Pedir encargo
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Rellena el formulario y te respondo con precio y plazo en menos de 24h.
            </p>
          </DialogHeader>

          {sent ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-2 border-primary flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-mono text-xl font-bold">¡Encargo recibido!</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Ya tengo tu encargo. Te respondo con precio y plazo en menos de 24 horas.
              </p>
              <Button variant="outline" className="font-mono rounded-none border-muted mt-2" onClick={onClose}>Cerrar</Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Tu nombre</Label>
                  <Input data-testid="input-order-name" className="rounded-none border-muted bg-background font-mono" placeholder="Nombre o alias" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Producto</Label>
                  <Input data-testid="input-order-product" className="rounded-none border-muted bg-background font-mono" placeholder="Ej: Llavero personalizado" value={product} onChange={(e) => setProduct(e.target.value)} required />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Cuéntame tu idea</Label>
                <Textarea data-testid="input-order-details" className="rounded-none border-muted bg-background font-mono min-h-[110px] resize-none" placeholder="Colores, medidas, referencia de imagen, fichero STL... Cuanto más detalle mejor." value={details} onChange={(e) => setDetails(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">¿Cómo te contacto?</Label>
                <Input data-testid="input-order-contact" className="rounded-none border-muted bg-background font-mono" placeholder="tu@email.com o @tuinstagram" value={contact} onChange={(e) => setContact(e.target.value)} required />
              </div>
              {error && <p className="text-xs text-red-400 font-mono text-center">{error}</p>}
              <Button data-testid="button-order-submit" type="submit" size="lg" disabled={submitting} className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none mt-2 h-12">
                {submitting ? "Enviando..." : <><span>Enviar encargo</span><ArrowRight className="ml-2 w-4 h-4" /></>}
              </Button>
              <p className="text-xs text-muted-foreground/60 text-center font-mono">Respuesta garantizada en menos de 24h</p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar({ onOrderClick }: { onOrderClick: () => void }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-mono text-lg font-bold tracking-tight">
          <LogoMark size={26} />
          poisow 3d
        </div>
        <div className="hidden md:flex items-center gap-8 font-mono text-sm">
          <button data-testid="link-nav-catalogo" onClick={() => scrollTo("catalogo")} className="text-muted-foreground hover:text-foreground transition-colors">Catálogo</button>
          <button data-testid="link-nav-como-funciona" onClick={() => scrollTo("como-funciona")} className="text-muted-foreground hover:text-foreground transition-colors">Cómo funciona</button>
          <button data-testid="link-nav-encargo" onClick={() => scrollTo("encargo")} className="text-muted-foreground hover:text-foreground transition-colors">Encargo</button>
          <button data-testid="link-nav-materiales" onClick={() => scrollTo("materiales")} className="text-muted-foreground hover:text-foreground transition-colors">Materiales</button>
        </div>
        <Button data-testid="button-nav-order" className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-10 px-6" onClick={onOrderClick}>
          Pedir encargo
        </Button>
      </div>
    </nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function Hero({ onOrderClick }: { onOrderClick: () => void }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="pt-28 pb-16 md:pt-40 md:pb-28 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
        <div className="flex-1 flex flex-col items-start space-y-6">
          <h1 className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground">
            Tu idea,<br />impresa<br /><span className="text-primary">capa a capa.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
            Piezas 3D personalizadas impresas con precisión. Hablas directamente conmigo, sin formularios perdidos ni esperas innecesarias.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-secondary" /> Respuesta en 24h</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-secondary" /> Precio cerrado antes de imprimir</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-secondary" /> Envío o recogida en mano</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button data-testid="button-hero-order" size="lg" className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none" onClick={onOrderClick}>
              Pedir encargo <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button data-testid="button-hero-catalog" size="lg" variant="ghost" className="font-mono rounded-none hover:bg-muted text-muted-foreground hover:text-foreground" onClick={() => scrollTo("catalogo")}>
              Ver catálogo
            </Button>
          </div>
        </div>
        <div className="flex-1 w-full bg-card border border-muted relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,90,42,0.06)_0%,transparent_70%)]" />
          <PrinterVisual />
        </div>
      </div>
    </section>
  );
}

/* ─── Catalog ────────────────────────────────────────────────────────────── */
const CATALOG_ICONS: Record<string, React.ReactNode> = {
  keychain: (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
      <circle cx="22" cy="20" r="12" stroke="#FF5A2A" strokeWidth="2.5" />
      <circle cx="22" cy="20" r="6" stroke="#FF5A2A" strokeWidth="1.5" strokeDasharray="3 2" />
      <path d="M31 27 L52 48" stroke="#71717A" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 44 L56 44" stroke="#FF5A2A" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="30" y="45" width="18" height="8" rx="4" stroke="#52525B" strokeWidth="2" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
      <rect x="20" y="8" width="24" height="38" rx="3" stroke="#9FD356" strokeWidth="2.5" />
      <rect x="23" y="11" width="18" height="26" rx="1" fill="#27272A" stroke="#3F3F46" strokeWidth="1" />
      <circle cx="32" cy="42" r="2" stroke="#9FD356" strokeWidth="1.5" />
      <path d="M20 48 L14 56" stroke="#52525B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 48 L50 56" stroke="#52525B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10 56 L54 56" stroke="#71717A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  figure: (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
      <rect x="8" y="24" width="48" height="28" rx="8" stroke="#FF5A2A" strokeWidth="2.5" />
      <path d="M20 36 L20 44" stroke="#FF5A2A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 40 L24 40" stroke="#FF5A2A" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="42" cy="39" r="2.5" fill="#FF5A2A" />
      <circle cx="48" cy="35" r="2.5" fill="#9FD356" />
      <path d="M22 24 C22 14 42 14 42 24" stroke="#52525B" strokeWidth="2" strokeDasharray="3 2" />
      <circle cx="32" cy="11" r="5" stroke="#71717A" strokeWidth="1.5" />
    </svg>
  ),
  organizer: (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
      <rect x="8" y="28" width="48" height="28" rx="2" stroke="#9FD356" strokeWidth="2.5" />
      <path d="M24 28 L24 56" stroke="#9FD356" strokeWidth="1.5" />
      <path d="M40 28 L40 56" stroke="#9FD356" strokeWidth="1.5" />
      <path d="M16 10 L16 28" stroke="#52525B" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 8 L32 28" stroke="#52525B" strokeWidth="2" strokeLinecap="round" />
      <path d="M48 13 L48 28" stroke="#52525B" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 10 L20 10" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M28 8 L36 8" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  pot: (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
      <path d="M16 28 L20 52 L44 52 L48 28 Z" stroke="#9FD356" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 28 L52 28" stroke="#9FD356" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 28 C32 20 32 14 32 14" stroke="#52525B" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 20 C26 16 22 11 28 8" stroke="#9FD356" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M32 17 C38 13 42 8 36 6" stroke="#9FD356" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  custom: (
    <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
      <path d="M12 20 L32 10 L52 20 L52 44 L32 54 L12 44 Z" stroke="#FF5A2A" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M12 20 L32 30 L52 20" stroke="#FF5A2A" strokeWidth="1.5" />
      <path d="M32 30 L32 54" stroke="#FF5A2A" strokeWidth="1.5" />
      <circle cx="46" cy="46" r="12" fill="#18181B" />
      <path d="M46 40 L46 52" stroke="#9FD356" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 46 L52 46" stroke="#9FD356" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

type CatalogApiItem = {
  id: number;
  name: string;
  description: string;
  detail: string;
  price: string;
  badge: string;
  badgeVariant: string;
  iconType: string;
  imageUrl: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
};

const STATIC_PRODUCTS: CatalogApiItem[] = [
  { id: 0, name: "Llavero personalizado",    description: "Con tu nombre, iniciales, logo o diseño favorito. Pequeño, ligero y resistente.", detail: "Perfecto como regalo o para identificar tus llaves con estilo.",  price: "4,50€",    badge: "Más pedido",       badgeVariant: "orange", iconType: "keychain",  imageUrl: "", active: true, sortOrder: 0, createdAt: "" },
  { id: 1, name: "Soporte de móvil",         description: "Para escritorio o uso vertical. Estable, con el ángulo que necesites.",           detail: "Diseño limpio que encaja en cualquier espacio de trabajo.",       price: "7€",       badge: "Popular",          badgeVariant: "green",  iconType: "phone",     imageUrl: "", active: true, sortOrder: 1, createdAt: "" },
  { id: 2, name: "Figura gaming / meme",     description: "Personajes, logos, memes en 3D desde tu imagen o diseño. Cada pieza es única.",   detail: "Trae tu referencia y lo imprimimos tal cual.",                    price: "desde 6€", badge: "A medida",         badgeVariant: "orange", iconType: "figure",    imageUrl: "", active: true, sortOrder: 2, createdAt: "" },
  { id: 3, name: "Organizador de escritorio",description: "Compartimentos para bolígrafos, cables, notas o lo que necesites tener a mano.", detail: "Las medidas y divisiones, a tu gusto.",                            price: "9€",       badge: "Personalizable",   badgeVariant: "green",  iconType: "organizer", imageUrl: "", active: true, sortOrder: 3, createdAt: "" },
  { id: 4, name: "Maceta decorativa",        description: "Geométrica, moderna o con diseño propio. Para plantas pequeñas o suculentas.",    detail: "Con o sin agujero de drenaje, a elegir.",                         price: "desde 5€", badge: "Ecofriendly",      badgeVariant: "green",  iconType: "pot",       imageUrl: "", active: true, sortOrder: 4, createdAt: "" },
  { id: 5, name: "Pieza a medida",           description: "¿Tienes un STL, una imagen o solo una idea? Lo imprimimos sin problema.",         detail: "Presupuesto sin compromiso antes de confirmar.",                  price: "Consultar",badge: "100% personalizado",badgeVariant: "orange", iconType: "custom",    imageUrl: "", active: true, sortOrder: 5, createdAt: "" },
];

function badgeClass(variant: string) {
  return variant === "green"
    ? "text-secondary border-secondary/40 bg-secondary/10"
    : "text-primary border-primary/40 bg-primary/10";
}

function Catalog({ onOrderClick }: { onOrderClick: (p: string) => void }) {
  const [products, setProducts] = useState<CatalogApiItem[]>(STATIC_PRODUCTS);

  useEffect(() => {
    fetch(API + "/api/catalog")
      .then((r) => r.ok ? r.json() : null)
      .then((data: CatalogApiItem[] | null) => { if (data && data.length > 0) setProducts(data); })
      .catch(() => {/* keep static fallback */});
  }, []);

  return (
    <section id="catalogo" className="py-24 px-6 bg-card border-y border-muted">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">Lo que imprimo</p>
          <h2 className="font-mono text-3xl font-bold tracking-tight">Catálogo<span className="text-primary">_</span></h2>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-muted-foreground mb-12 max-w-xl">
          Productos habituales con precio fijo. Si lo que buscas no está aquí, escríbeme y lo hablamos.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((prod, i) => (
            <motion.div key={prod.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Card
                data-testid={`card-product-${i}`}
                className="rounded-none border-muted bg-background hover:border-primary/60 transition-all duration-200 group flex flex-col h-full overflow-hidden"
              >
                <div className="p-6 pb-4 bg-card border-b border-muted flex items-end justify-between">
                  <div className="p-2">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="w-16 h-16 object-cover" />
                    ) : (
                      CATALOG_ICONS[prod.iconType] ?? CATALOG_ICONS["custom"]
                    )}
                  </div>
                  <Badge variant="outline" className={`font-mono text-xs rounded-none ${badgeClass(prod.badgeVariant)}`}>
                    {prod.badge}
                  </Badge>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-mono text-lg font-bold mb-1 group-hover:text-primary transition-colors">{prod.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2 leading-relaxed">{prod.description}</p>
                  <p className="text-xs text-muted-foreground/60 font-mono mb-6 italic">{prod.detail}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-muted">
                    <span className="font-mono font-black text-xl text-foreground">{prod.price}</span>
                    <Button
                      data-testid={`button-order-product-${i}`}
                      variant="outline" size="sm"
                      className="font-mono rounded-none border-muted hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                      onClick={() => onOrderClick(prod.name)}
                    >
                      Encargar
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { num: "01", title: "Rellena el formulario", desc: "Cuéntame qué necesitas — producto, medidas, colores o el fichero STL." },
    { num: "02", title: "Precio y plazo cerrado", desc: "Te confirmo el coste exacto y cuándo estará listo. Sin sorpresas." },
    { num: "03", title: "Lo imprimo con cuidado", desc: "Cada pieza se revisa antes de salir. Si algo no está bien, lo repito." },
    { num: "04", title: "Lo recibes", desc: "Recogida en mano o envío a tu dirección. Tú eliges." }
  ];

  return (
    <section id="como-funciona" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
        <p className="font-mono text-xs text-secondary uppercase tracking-widest mb-2">El proceso</p>
        <h2 className="font-mono text-3xl font-bold tracking-tight">Cómo funciona<span className="text-secondary">_</span></h2>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-muted-foreground mb-16 max-w-xl">
        Sencillo y sin complicaciones. De tu idea a tu puerta en unos pocos pasos.
      </motion.p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
        <div className="hidden md:block absolute top-8 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-muted to-transparent" />
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="relative">
            <div className="w-16 h-16 border border-muted bg-card flex items-center justify-center mb-6">
              <span className="font-mono text-2xl font-black text-primary">{step.num}</span>
            </div>
            <h3 className="font-mono text-base font-bold mb-3 leading-tight">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── Custom Order CTA ───────────────────────────────────────────────────── */
function CustomOrder({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <section id="encargo" className="py-24 px-6 bg-card border-y border-muted">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="font-mono text-xs text-primary uppercase tracking-widest mb-3">Encargo a medida</p>
            <h2 className="font-mono text-4xl md:text-5xl font-bold mb-6 leading-tight">
              ¿Tienes una<br /><span className="text-primary">idea en mente?</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Si tienes un diseño STL, una imagen de referencia o simplemente una idea en la cabeza, lo hago realidad. Escríbeme sin compromiso y te doy precio antes de imprimir nada.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8 font-mono text-sm text-muted-foreground">
              {["Describe tu idea", "Precio cerrado", "Lo imprimo", "Lo recibes"].map((s, i) => (
                <React.Fragment key={i}>
                  <span className="flex items-center gap-1.5">
                    <span className="text-primary font-bold">{String(i + 1).padStart(2, "0")}.</span> {s}
                  </span>
                  {i < 3 && <ChevronRight className="w-4 h-4 text-muted hidden sm:block" />}
                </React.Fragment>
              ))}
            </div>
            <Button data-testid="button-custom-order" size="lg" className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-8 h-12" onClick={onOrderClick}>
              Pedir encargo <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-4">
            {[
              { icon: <Clock className="w-5 h-5 text-primary" />, title: "Respuesta en menos de 24h", desc: "Te confirmo si puedo hacerlo y a qué precio antes de que pasen 24 horas." },
              { icon: <CheckCircle2 className="w-5 h-5 text-secondary" />, title: "Precio cerrado antes de imprimir", desc: "No hay sorpresas. Acordamos el precio y no cambia, salvo que tú lo pidas." },
              { icon: <Star className="w-5 h-5 text-primary" />, title: "Calidad o lo repito", desc: "Si la pieza no te convence, la volvemos a imprimir. Así de sencillo." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 border border-muted bg-background">
                <div className="mt-0.5 shrink-0">{item.icon}</div>
                <div>
                  <h4 className="font-mono text-sm font-bold mb-1">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Materials ──────────────────────────────────────────────────────────── */
const MATERIALS = [
  { name: "PLA", tag: "El más común", desc: "Versátil y con acabado muy limpio. Ideal para decoración, figuras y accesorios del día a día. Amplia gama de colores.", accent: "bg-secondary", pros: ["Buen acabado", "Colores vivos", "Fácil de limpiar"] },
  { name: "PETG", tag: "Resistente", desc: "Aguanta calor y humedad mejor que el PLA. Perfecto para piezas funcionales, de exterior o que estén en contacto con agua.", accent: "bg-blue-400", pros: ["Resistente al calor", "Soporta humedad", "Alta durabilidad"] },
  { name: "TPU", tag: "Flexible", desc: "Filamento elástico y blando. Para fundas de móvil, protectores, juntas y cualquier pieza que necesite flexibilidad.", accent: "bg-primary", pros: ["Elástico y suave", "Absorbe impactos", "Resistente al desgaste"] },
  { name: "ABS", tag: "Técnico", desc: "Alta resistencia mecánica y térmica. Para piezas que trabajan en entornos exigentes o requieren mecanizado posterior.", accent: "bg-zinc-400", pros: ["Alta resistencia", "Fácil de lijar", "Acabado liso"] },
];

function Materials() {
  return (
    <section id="materiales" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
        <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">Con qué imprimo</p>
        <h2 className="font-mono text-3xl font-bold tracking-tight">Materiales<span className="text-primary">_</span></h2>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-muted-foreground mb-12 max-w-xl">
        Cada material tiene sus ventajas. Si no sabes cuál elegir, te asesoro sin coste.
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {MATERIALS.map((mat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <Card data-testid={`card-material-${i}`} className="rounded-none border-muted bg-card overflow-hidden h-full hover:border-muted-foreground/40 transition-colors">
              <div className={`h-1 w-full ${mat.accent}`} />
              <div className="p-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <h3 className="font-mono text-2xl font-black">{mat.name}</h3>
                  <span className="font-mono text-xs text-muted-foreground">{mat.tag}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{mat.desc}</p>
                <ul className="space-y-1.5">
                  {mat.pros.map((pro, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />{pro}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────────────── */
const FAQ_ITEMS = [
  { q: "¿Cuánto tarda un encargo?", a: "Depende del tamaño y la complejidad. Piezas pequeñas o medianas suelen estar listas en 2–5 días. Te doy un plazo concreto cuando confirmo el encargo, antes de imprimir nada." },
  { q: "¿Puedo enviar mi propio fichero STL?", a: "Sí, perfectamente. Si tienes el fichero listo, solo tienes que enviármelo junto con el material y el acabado que quieres. Si hay algún problema con el diseño, te aviso antes de empezar." },
  { q: "¿Cuánto cuesta?", a: "El precio depende del material, el tiempo de impresión y el acabado. Manda tu idea y te doy un presupuesto cerrado — sin sorpresas ni costes extra al final." },
  { q: "¿Hacéis envíos?", a: "Sí. Hago envíos a toda España. También puedes recogerlo en mano si lo prefieres y nos ahorramos el envío." },
  { q: "¿Qué materiales usáis?", a: "Trabajo principalmente con PLA, PETG, TPU y ABS. Si no sabes cuál elegir, cuéntame para qué es la pieza y te recomiendo el que mejor le va." },
  { q: "¿Qué pasa si la pieza sale mal?", a: "Si el resultado no cumple lo que acordamos, la vuelvo a imprimir sin coste adicional. La calidad es mi responsabilidad." },
];

function FaqSection() {
  return (
    <section id="faq" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
        <p className="font-mono text-xs text-secondary uppercase tracking-widest mb-2">Dudas frecuentes</p>
        <h2 className="font-mono text-3xl font-bold tracking-tight">FAQ<span className="text-secondary">_</span></h2>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-muted-foreground mb-12 max-w-xl">
        Si tu pregunta no está aquí, escríbeme directamente.
      </motion.p>
      <Accordion type="single" collapsible className="w-full max-w-3xl space-y-0">
        {FAQ_ITEMS.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-b border-muted">
            <AccordionTrigger className="font-mono text-sm font-semibold text-left hover:text-primary hover:no-underline py-5">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="font-mono text-sm text-muted-foreground leading-relaxed pb-5">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

/* ─── Admin Page ─────────────────────────────────────────────────────────── */
type Order = {
  id: number;
  name: string;
  product: string;
  details: string;
  contact: string;
  status: string;
  notes: string;
  createdAt: string;
};

const STATUS_LABELS: Record<string, { label: string; badge: string; border: string; dot: string }> = {
  pending:     { label: "Pendiente",  badge: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10", border: "border-l-yellow-400",  dot: "bg-yellow-400" },
  in_progress: { label: "En proceso", badge: "text-blue-400 border-blue-400/30 bg-blue-400/10",       border: "border-l-blue-400",    dot: "bg-blue-400"   },
  done:        { label: "Listo",      badge: "text-secondary border-secondary/30 bg-secondary/10",    border: "border-l-secondary",   dot: "bg-secondary"  },
};

const STATUS_KEYS = ["pending", "in_progress", "done"] as const;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora mismo";
  if (mins < 60) return `hace ${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

function agingHours(dateStr: string): number {
  return (Date.now() - new Date(dateStr).getTime()) / 3600000;
}

function exportCsv(orders: Order[]) {
  const headers = ["ID", "Nombre", "Producto", "Detalles", "Contacto", "Estado", "Notas", "Fecha"];
  const rows = orders.map((o) => [
    o.id, o.name, o.product,
    `"${o.details.replace(/"/g, '""')}"`,
    o.contact,
    STATUS_LABELS[o.status]?.label ?? o.status,
    `"${o.notes.replace(/"/g, '""')}"`,
    new Date(o.createdAt).toLocaleString("es-ES"),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `encargos-poisow3d-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

type ToastMsg = { id: number; msg: string; type: "ok" | "err" };
let toastId = 0;

/* ─── CatalogItemForm ────────────────────────────────────────────────────── */
function CatalogItemForm({
  item, onChange, onSave, onCancel,
}: {
  item: Partial<CatalogApiItem>;
  onChange: (v: Partial<CatalogApiItem>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const f = (field: keyof CatalogApiItem, val: string | boolean | number) =>
    onChange({ ...item, [field]: val });

  const inputCls = "w-full h-9 px-3 bg-background border border-muted font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 rounded-none";
  const labelCls = "font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1 block";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className={labelCls}>Nombre</label>
        <input className={inputCls} value={item.name ?? ""} onChange={(e) => f("name", e.target.value)} placeholder="Nombre del producto" />
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Descripción corta</label>
        <input className={inputCls} value={item.description ?? ""} onChange={(e) => f("description", e.target.value)} placeholder="Una línea descriptiva" />
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Detalle extra</label>
        <input className={inputCls} value={item.detail ?? ""} onChange={(e) => f("detail", e.target.value)} placeholder="Texto en cursiva bajo la descripción" />
      </div>
      <div>
        <label className={labelCls}>Precio</label>
        <input className={inputCls} value={item.price ?? ""} onChange={(e) => f("price", e.target.value)} placeholder="ej. 4,50€ o desde 6€" />
      </div>
      <div>
        <label className={labelCls}>Etiqueta (badge)</label>
        <input className={inputCls} value={item.badge ?? ""} onChange={(e) => f("badge", e.target.value)} placeholder="ej. Más pedido" />
      </div>
      <div>
        <label className={labelCls}>Color badge</label>
        <select className={inputCls} value={item.badgeVariant ?? "orange"} onChange={(e) => f("badgeVariant", e.target.value)}>
          <option value="orange">Naranja (primary)</option>
          <option value="green">Verde (secondary)</option>
        </select>
      </div>
      <div>
        <label className={labelCls}>Icono</label>
        <select className={inputCls} value={item.iconType ?? "custom"} onChange={(e) => f("iconType", e.target.value)}>
          <option value="keychain">Llavero</option>
          <option value="phone">Soporte móvil</option>
          <option value="figure">Figura</option>
          <option value="organizer">Organizador</option>
          <option value="pot">Maceta</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Imagen (opcional)</label>
        <div className="flex gap-2 items-center">
          <input className={inputCls} value={item.imageUrl ?? ""} onChange={(e) => f("imageUrl", e.target.value)} placeholder="https://..." />
          <label className="font-mono text-xs px-3 py-2 border border-muted text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all cursor-pointer whitespace-nowrap">
            Subir imagen
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", "poisow3d");
              const res = await fetch("https://api.cloudinary.com/v1_1/evjciqji/image/upload", { method: "POST", body: formData });
              const data = await res.json();
              if (data.secure_url) f("imageUrl", data.secure_url);
            }} />
          </label>
        </div>
        {item.imageUrl && <img src={item.imageUrl} alt="preview" className="mt-2 w-24 h-24 object-cover border border-muted" />}
      </div>
      <div>
        <label className={labelCls}>Orden</label>
        <input type="number" className={inputCls} value={item.sortOrder ?? 0} onChange={(e) => f("sortOrder", parseInt(e.target.value) || 0)} />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <input type="checkbox" id="active-chk" checked={item.active ?? true} onChange={(e) => f("active", e.target.checked)} className="w-4 h-4 accent-primary" />
        <label htmlFor="active-chk" className="font-mono text-xs text-muted-foreground">Visible en la web</label>
      </div>
      <div className="sm:col-span-2 flex gap-2 pt-2 border-t border-muted">
        <button onClick={onSave} className="font-mono text-xs px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
          Guardar
        </button>
        <button onClick={onCancel} className="font-mono text-xs px-4 py-2 border border-muted text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all">
          Cancelar
        </button>
      </div>
    </div>
  );
}

function AdminPage() {
  const [isAdmin, setIsAdmin]         = useState<boolean | null>(null);
  const [password, setPassword]       = useState("");
  const [loginError, setLoginError]   = useState("");
  const [orders, setOrders]           = useState<Order[]>([]);
  const [loading, setLoading]         = useState(false);
  const [filter, setFilter]           = useState<string>("all");
  const [search, setSearch]           = useState("");
  const [expandedId, setExpandedId]   = useState<number | null>(null);
  const [noteMap, setNoteMap]         = useState<Record<number,string>>({});
  const [savingNote, setSavingNote]   = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [copiedId, setCopiedId]       = useState<number | null>(null);
  const [toasts, setToasts]           = useState<ToastMsg[]>([]);
  const [adminTab, setAdminTab]       = useState<"orders" | "catalog">("orders");
  const [catalogItems, setCatalogItems] = useState<CatalogApiItem[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState<CatalogApiItem | null>(null);
  const [newItem, setNewItem]         = useState<Partial<CatalogApiItem> | null>(null);

  const toast = (msg: string, type: "ok" | "err" = "ok") => {
    const id = ++toastId;
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  useEffect(() => {
    fetch(API + "/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { isAdmin: boolean }) => setIsAdmin(d.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => { if (isAdmin) loadOrders(); }, [isAdmin]);
  useEffect(() => { if (isAdmin && adminTab === "catalog") loadCatalog(); }, [isAdmin, adminTab]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const r = await fetch(API + "/api/orders", { credentials: "include" });
      if (r.ok) {
        const data = await r.json() as Order[];
        setOrders(data);
        const notes: Record<number,string> = {};
        data.forEach((o) => { notes[o.id] = o.notes; });
        setNoteMap(notes);
      }
    } finally { setLoading(false); }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError("");
    const r = await fetch(API + "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ password }) });
    if (r.ok) { setIsAdmin(true); } else { setLoginError("Contraseña incorrecta"); }
  };

  const logout = async () => {
    await fetch(API + "/api/auth/logout", { method: "POST", credentials: "include" });
    setIsAdmin(false); setOrders([]);
  };

  const updateStatus = async (id: number, status: string) => {
    const r = await fetch(`${API}/api/orders/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ status }) });
    if (r.ok) { setOrders((p) => p.map((o) => o.id === id ? { ...o, status } : o)); toast(`Estado → ${STATUS_LABELS[status]?.label ?? status}`); }
    else toast("Error al cambiar estado", "err");
  };

  const saveNote = async (id: number) => {
    setSavingNote(id);
    const r = await fetch(`${API}/api/orders/${id}/note`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ notes: noteMap[id] ?? "" }) });
    setSavingNote(null);
    if (r.ok) { setOrders((p) => p.map((o) => o.id === id ? { ...o, notes: noteMap[id] ?? "" } : o)); toast("Nota guardada"); }
    else toast("Error al guardar nota", "err");
  };

  const deleteOrder = async (id: number) => {
    const r = await fetch(`${API}/api/orders/${id}`, { method: "DELETE", credentials: "include" });
    if (r.ok) { setOrders((p) => p.filter((o) => o.id !== id)); setDeleteConfirm(null); toast("Encargo eliminado"); }
    else toast("Error al eliminar", "err");
  };

  const copyContact = (id: number, contact: string) => {
    navigator.clipboard.writeText(contact).then(() => {
      setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); toast("Contacto copiado");
    });
  };

  const loadCatalog = async () => {
    setCatalogLoading(true);
    try {
      const r = await fetch(API + "/api/catalog/all", { credentials: "include" });
      if (r.ok) setCatalogItems(await r.json() as CatalogApiItem[]);
    } finally { setCatalogLoading(false); }
  };

  const saveCatalogItem = async (item: Partial<CatalogApiItem>) => {
    if (item.id !== undefined && item.id > 0) {
      const r = await fetch(`${API}/api/catalog/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(item) });
      if (r.ok) { setEditingCatalog(null); await loadCatalog(); toast("Producto actualizado"); }
      else toast("Error al guardar", "err");
    } else {
      const r = await fetch(API + "/api/catalog", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(item) });
      if (r.ok) { setNewItem(null); await loadCatalog(); toast("Producto añadido"); }
      else toast("Error al añadir", "err");
    }
  };

  const deleteCatalogItem = async (id: number) => {
    const r = await fetch(`${API}/api/catalog/${id}`, { method: "DELETE", credentials: "include" });
    if (r.ok) { setCatalogItems((p) => p.filter((x) => x.id !== id)); toast("Producto eliminado"); }
    else toast("Error al eliminar", "err");
  };

  const toggleActive = async (item: CatalogApiItem) => {
    const r = await fetch(`${API}/api/catalog/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ active: !item.active }) });
    if (r.ok) setCatalogItems((p) => p.map((x) => x.id === item.id ? { ...x, active: !item.active } : x));
    else toast("Error al cambiar visibilidad", "err");
  };

  if (isAdmin === null) return (
    <div className="min-h-screen bg-background text-foreground dark flex items-center justify-center">
      <div className="flex items-center gap-3 font-mono text-muted-foreground">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Cargando...
      </div>
    </div>
  );

  if (!isAdmin) return (
    <div className="min-h-screen bg-background text-foreground dark flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 font-mono text-xl font-bold mb-1"><LogoMark size={26} />poisow 3d</div>
        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-8">Panel de administración</p>
        <div className="h-px bg-muted mb-8" />
        <form onSubmit={login} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Contraseña</Label>
            <Input type="password" className="rounded-none border-muted bg-card font-mono h-11" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus required />
          </div>
          {loginError && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 font-mono">{loginError}</motion.p>}
          <Button type="submit" className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-11">Entrar <ArrowRight className="ml-2 w-4 h-4" /></Button>
        </form>
      </div>
    </div>
  );

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    done: orders.filter((o) => o.status === "done").length,
  };

  const q = search.toLowerCase();
  const filtered = orders
    .filter((o) => filter === "all" || o.status === filter)
    .filter((o) => !q || o.name.toLowerCase().includes(q) || o.product.toLowerCase().includes(q) || o.contact.toLowerCase().includes(q) || o.details.toLowerCase().includes(q));

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}
            className={`font-mono text-xs px-4 py-2.5 border flex items-center gap-2 shadow-lg pointer-events-auto ${t.type === "ok" ? "bg-card border-secondary/40 text-secondary" : "bg-card border-red-400/40 text-red-400"}`}>
            {t.type === "ok" ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
            {t.msg}
          </motion.div>
        ))}
      </div>

      <nav className="border-b border-muted bg-card/90 backdrop-blur-sm sticky top-0 z-40 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-mono text-sm font-bold">
          <LogoMark size={20} />
          poisow 3d <span className="text-muted-foreground font-normal mx-1">/</span> <span className="text-muted-foreground font-normal">admin</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => exportCsv(orders)} className="font-mono text-xs px-3 py-1.5 border border-muted text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all flex items-center gap-1.5 rounded-none">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={loadOrders} className="font-mono text-xs px-3 py-1.5 border border-transparent text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 rounded-none ml-1">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-muted mx-1" />
          <button onClick={logout} className="font-mono text-xs px-3 py-1.5 border border-transparent text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 rounded-none">
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex border border-muted rounded-none overflow-hidden mb-8 w-fit">
          {([
            { key: "orders",  label: "Encargos" },
            { key: "catalog", label: "Catálogo" },
          ] as const).map((t) => (
            <button key={t.key} onClick={() => setAdminTab(t.key)}
              className={`font-mono text-sm px-5 py-2.5 transition-colors border-r border-muted last:border-r-0 ${adminTab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {adminTab === "catalog" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-lg font-bold">Gestión de catálogo</h2>
              <button onClick={() => { setNewItem({ name: "", description: "", detail: "", price: "", badge: "", badgeVariant: "orange", iconType: "custom", imageUrl: "", active: true, sortOrder: catalogItems.length }); setEditingCatalog(null); }}
                className="font-mono text-xs px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 transition-all">
                + Nuevo producto
              </button>
            </div>

            {newItem && (
              <div className="border border-primary/40 bg-card p-5 mb-6">
                <p className="font-mono text-xs text-primary uppercase tracking-widest mb-4">Nuevo producto</p>
                <CatalogItemForm item={newItem} onChange={setNewItem} onSave={() => saveCatalogItem(newItem)} onCancel={() => setNewItem(null)} />
              </div>
            )}

            {catalogLoading ? (
              <div className="flex items-center gap-2 font-mono text-sm text-muted-foreground py-8">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Cargando catálogo...
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {catalogItems.map((item) => (
                  <div key={item.id} className="border border-muted bg-card">
                    {editingCatalog?.id === item.id ? (
                      <div className="p-5">
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-4">Editando: {item.name}</p>
                        <CatalogItemForm item={editingCatalog} onChange={(v) => setEditingCatalog(v as CatalogApiItem)} onSave={() => saveCatalogItem(editingCatalog)} onCancel={() => setEditingCatalog(null)} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 p-4">
                        <div className="shrink-0 text-muted-foreground/60">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
                          ) : (
                            CATALOG_ICONS[item.iconType] ?? CATALOG_ICONS["custom"]
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono font-bold text-sm truncate">{item.name}</span>
                            <span className={`font-mono text-xs px-1.5 py-0.5 border ${badgeClass(item.badgeVariant)}`}>{item.badge}</span>
                            {!item.active && <span className="font-mono text-xs text-muted-foreground border border-muted px-1.5 py-0.5">oculto</span>}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        </div>
                        <div className="shrink-0 font-mono font-bold text-primary">{item.price}</div>
                        <div className="shrink-0 flex items-center gap-1">
                          <button onClick={() => toggleActive(item)} title={item.active ? "Ocultar" : "Mostrar"}
                            className={`font-mono text-xs px-2.5 py-1.5 border transition-all ${item.active ? "border-secondary/40 text-secondary hover:bg-secondary/10" : "border-muted text-muted-foreground hover:text-foreground"}`}>
                            {item.active ? "Visible" : "Oculto"}
                          </button>
                          <button onClick={() => { setEditingCatalog({ ...item }); setNewItem(null); }}
                            className="font-mono text-xs px-2.5 py-1.5 border border-muted text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all">
                            Editar
                          </button>
                          <button onClick={() => deleteCatalogItem(item.id)}
                            className="font-mono text-xs px-2.5 py-1.5 border border-red-400/30 text-red-400 hover:bg-red-400/10 transition-all">
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {adminTab === "orders" && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {([
              { key: "all",         label: "Total",      color: "text-foreground",  bg: "border-muted" },
              { key: "pending",     label: "Pendientes", color: "text-yellow-400",  bg: "border-yellow-400/20" },
              { key: "in_progress", label: "En proceso", color: "text-blue-400",    bg: "border-blue-400/20" },
              { key: "done",        label: "Listos",     color: "text-secondary",   bg: "border-secondary/20" },
            ] as const).map((s) => (
              <button key={s.key} onClick={() => setFilter(s.key)}
                className={`text-left p-4 border-2 transition-all rounded-none bg-card ${filter === s.key ? "border-primary" : s.bg + " hover:border-muted-foreground/30"}`}>
                <p className={`font-mono text-4xl font-black mb-1 ${s.color}`}>{counts[s.key]}</p>
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{s.label}</p>
                {s.key === "pending" && counts.pending > 0 && (
                  <p className="font-mono text-xs text-yellow-400/70 mt-1">requieren acción</p>
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Buscar por nombre, producto, contacto..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-card border border-muted font-mono text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 rounded-none" />
              {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>}
            </div>
            <div className="flex border border-muted rounded-none overflow-hidden">
              {[
                { key: "all", label: "Todos" },
                { key: "pending", label: "Pendiente" },
                { key: "in_progress", label: "Proceso" },
                { key: "done", label: "Listo" },
              ].map((tab) => (
                <button key={tab.key} onClick={() => setFilter(tab.key)}
                  className={`font-mono text-xs px-3 py-2 transition-colors border-r border-muted last:border-r-0 ${filter === tab.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <p className="font-mono text-xs text-muted-foreground/50 mb-4">
            {filtered.length} encargo{filtered.length !== 1 ? "s" : ""}{search ? ` · búsqueda: "${search}"` : ""}
          </p>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1,2,3].map((i) => <div key={i} className="h-28 border border-muted bg-card animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="border border-dashed border-muted p-20 text-center">
              <p className="font-mono text-muted-foreground text-sm">{search ? `Sin resultados para "${search}".` : "No hay encargos aquí todavía."}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((order) => {
                const s = STATUS_LABELS[order.status] ?? STATUS_LABELS["pending"]!;
                const hours = agingHours(order.createdAt);
                const isOld = order.status === "pending" && hours > 24;
                const isVeryOld = order.status === "pending" && hours > 72;
                const isExpanded = expandedId === order.id;
                const isDeleteConfirm = deleteConfirm === order.id;

                return (
                  <motion.div key={order.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className={`border bg-card border-l-4 ${s.border} ${isVeryOld ? "border-red-400/40" : isOld ? "border-yellow-400/30" : "border-muted"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0">
                      <div className="flex-1 min-w-0 p-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="font-mono text-xs text-muted-foreground/40">#{order.id}</span>
                          <span className="font-mono text-sm font-bold">{order.name}</span>
                          <Badge variant="outline" className={`font-mono text-xs rounded-none px-2 py-0 h-5 ${s.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${s.dot}`} />
                            {s.label}
                          </Badge>
                          {isVeryOld && <span className="flex items-center gap-1 font-mono text-xs text-red-400"><Flame className="w-3 h-3" />urgente</span>}
                          {isOld && !isVeryOld && <span className="flex items-center gap-1 font-mono text-xs text-yellow-400/80"><AlertTriangle className="w-3 h-3" />pendiente +24h</span>}
                          {order.notes && <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground/50"><StickyNote className="w-3 h-3" />nota</span>}
                          <span className="font-mono text-xs text-muted-foreground/30 ml-auto">{timeAgo(order.createdAt)}</span>
                        </div>
                        <p className="font-mono text-sm font-bold text-foreground mb-1">{order.product}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{order.details}</p>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-2 sm:border-l border-t sm:border-t-0 border-muted/50 shrink-0 bg-card/50">
                        <div className="flex flex-col gap-1 mr-2">
                          {STATUS_KEYS.map((key) => (
                            <button key={key} onClick={() => updateStatus(order.id, key)} disabled={order.status === key}
                              className={`font-mono text-xs px-2.5 py-1 transition-all border rounded-none w-24 text-center ${order.status === key ? STATUS_LABELS[key].badge + " cursor-default" : "border-muted text-muted-foreground hover:border-foreground/30 hover:text-foreground"}`}>
                              {STATUS_LABELS[key].label}
                            </button>
                          ))}
                        </div>
                        <div className="flex flex-col gap-1">
                          <button onClick={() => copyContact(order.id, order.contact)} title="Copiar contacto"
                            className="w-8 h-8 flex items-center justify-center border border-muted text-muted-foreground hover:text-primary hover:border-primary/40 transition-all rounded-none">
                            {copiedId === order.id ? <CheckCircle2 className="w-3.5 h-3.5 text-secondary" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => setExpandedId(isExpanded ? null : order.id)} title="Ver detalles y notas"
                            className={`w-8 h-8 flex items-center justify-center border transition-all rounded-none ${isExpanded ? "border-primary text-primary bg-primary/10" : "border-muted text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          {!isDeleteConfirm ? (
                            <button onClick={() => setDeleteConfirm(order.id)} title="Eliminar encargo"
                              className="w-8 h-8 flex items-center justify-center border border-muted text-muted-foreground hover:text-red-400 hover:border-red-400/40 transition-all rounded-none">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="flex gap-1">
                              <button onClick={() => deleteOrder(order.id)} className="w-8 h-8 flex items-center justify-center border border-red-400/50 text-red-400 hover:bg-red-400/10 transition-all rounded-none">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => setDeleteConfirm(null)} className="w-8 h-8 flex items-center justify-center border border-muted text-muted-foreground hover:text-foreground transition-all rounded-none">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="border-t border-muted bg-background/40">
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-mono text-xs text-muted-foreground/50 uppercase tracking-widest mb-2">Detalles completos</p>
                            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{order.details}</p>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-xs text-muted-foreground/50">Contacto:</p>
                              <span className="font-mono text-sm text-primary font-semibold">{order.contact}</span>
                              <button onClick={() => copyContact(order.id, order.contact)} className="text-muted-foreground hover:text-primary transition-colors">
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground/30 mt-2">
                              {new Date(order.createdAt).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <div>
                            <p className="font-mono text-xs text-muted-foreground/50 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <StickyNote className="w-3 h-3" /> Notas internas
                            </p>
                            <Textarea
                              value={noteMap[order.id] ?? ""}
                              onChange={(e) => setNoteMap((p) => ({ ...p, [order.id]: e.target.value }))}
                              placeholder="Precio acordado, plazo estimado, comentarios internos..."
                              className="rounded-none border-muted bg-card font-mono text-xs min-h-[80px] resize-none text-foreground"
                            />
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-mono text-xs text-muted-foreground/40">Solo visible para ti</span>
                              <button onClick={() => saveNote(order.id)} disabled={savingNote === order.id}
                                className="font-mono text-xs px-3 py-1.5 border border-muted text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all disabled:opacity-50 rounded-none flex items-center gap-1.5">
                                {savingNote === order.id ? <><div className="w-3 h-3 border border-t-transparent border-foreground rounded-full animate-spin" />Guardando...</> : <>Guardar nota</>}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-muted bg-card py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5 font-mono text-lg font-bold">
          <LogoMark size={24} />
          poisow 3d
        </div>
        <div className="flex items-center gap-4 text-sm font-mono text-muted-foreground">
          <span>Piezas 3D personalizadas</span>
        </div>
        <a data-testid="link-footer-instagram" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm">
          <SiInstagram className="w-5 h-5" />
          @poisow3d
        </a>
      </div>
      <div className="max-w-6xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground/40 font-mono">
        <span>© {new Date().getFullYear()} poisow 3d. Todos los derechos reservados.</span>
        <span>Impresión 3D · Piezas personalizadas</span>
      </div>
    </footer>
  );
}

/* ─── Home ───────────────────────────────────────────────────────────────── */
function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const openOrder = (product = "") => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground dark">
      <Navbar onOrderClick={() => openOrder()} />
      <main>
        <Hero onOrderClick={() => openOrder()} />
        <HowItWorks />
        <CustomOrder onOrderClick={() => openOrder()} />
        <Catalog onOrderClick={(p) => openOrder(p)} />
        <Materials />
        <FaqSection />
      </main>
      <Footer />
      <OrderModal open={modalOpen} onClose={() => setModalOpen(false)} productName={selectedProduct} />
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────── */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/admin" component={AdminPage} />
            <Route>
              <div className="min-h-screen flex items-center justify-center font-mono">Página no encontrada_</div>
            </Route>
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;