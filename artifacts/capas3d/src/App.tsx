import React, { useState, useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, useInView } from "framer-motion";
import { SiInstagram } from "react-icons/si";
import { ArrowRight, ChevronRight, MapPin, Clock, Star, CheckCircle2 } from "lucide-react";
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
      {/* Bottom layer */}
      <path d="M4 22 L16 28 L28 22 L16 16 Z" fill="#3F3F46" />
      {/* Middle layer */}
      <path d="M4 16 L16 22 L28 16 L16 10 Z" fill="#52525B" />
      {/* Top layer - orange accent */}
      <path d="M4 10 L16 16 L28 10 L16 4 Z" fill="#FF5A2A" />
      {/* Left face bottom */}
      <path d="M4 16 L4 22 L16 28 L16 22 Z" fill="#27272A" />
      {/* Right face bottom */}
      <path d="M28 16 L28 22 L16 28 L16 22 Z" fill="#3F3F46" />
    </svg>
  );
}

/* ─── Printer Visual ─────────────────────────────────────────────────────── */
function PrinterVisual() {
  const [t, setT] = useState(0);
  const startRef = useRef<number>(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    startRef.current = performance.now();
    const loop = (ts: number) => {
      const LOOP_MS = 11000;
      setT(((ts - startRef.current) % LOOP_MS) / LOOP_MS);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const NUM_LAYERS = 6;
  const LAYER_H = 11;
  const PRINT_FRAC = 0.78; // first 78% = printing, rest = show complete + reset
  const isPrinting = t < PRINT_FRAC;

  const printT = isPrinting ? t / PRINT_FRAC : 1;
  const totalPhase = printT * NUM_LAYERS;
  const layerIdx = Math.min(Math.floor(totalPhase), NUM_LAYERS - 1);
  const layerProg = totalPhase - Math.floor(totalPhase);

  // Printer geometry
  const POST_L = 30;
  const POST_R = 330;
  const FRAME_TOP = 14;
  const BED_TOP = 238;
  const PL = 72;   // print area left
  const PR = 290;  // print area right
  const PW = PR - PL;
  const NOZZLE_DROP = 40; // gantry top to nozzle tip

  const goingRight = layerIdx % 2 === 0;
  const nozzleNorm = goingRight ? layerProg : 1 - layerProg;
  const nozzleX = isPrinting ? PL + nozzleNorm * PW : PR;

  const layerTopY = (idx: number) => BED_TOP - (idx + 1) * LAYER_H;
  const currentTopY = layerTopY(layerIdx);
  const nozzleTipY = isPrinting ? currentTopY : layerTopY(NUM_LAYERS - 1) - 8;
  const gantryY = nozzleTipY - NOZZLE_DROP;

  const curLayerX = goingRight ? PL : PL + layerProg * PW;
  const curLayerW = layerProg * PW;

  const layerColor = (i: number) => (i % 2 === 0 ? "#FF5A2A" : "#D94E22");
  const pct = Math.round(t * 100);

  return (
    <div className="relative w-full flex items-center justify-center p-4 md:p-6">
      <svg viewBox="0 0 360 280" fill="none" className="w-full max-w-[400px]"
        style={{ filter: "drop-shadow(0 4px 32px rgba(255,90,42,0.13))" }}>
        <defs>
          <linearGradient id="postG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3F3F46" />
            <stop offset="100%" stopColor="#27272A" />
          </linearGradient>
          <linearGradient id="gantryG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#52525B" />
            <stop offset="100%" stopColor="#3F3F46" />
          </linearGradient>
          <radialGradient id="nozzleGlowG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF5A2A" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FF5A2A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── FRAME ── */}
        {/* Left post */}
        <rect x={POST_L} y={FRAME_TOP} width="13" height="240" rx="2" fill="url(#postG)" />
        <rect x={POST_L + 2} y={FRAME_TOP + 2} width="2" height="236" fill="#52525B" opacity="0.35" />
        {/* Right post */}
        <rect x={POST_R - 13} y={FRAME_TOP} width="13" height="240" rx="2" fill="#27272A" />
        <rect x={POST_R - 5} y={FRAME_TOP + 2} width="2" height="236" fill="#52525B" opacity="0.35" />
        {/* Top bar */}
        <rect x={POST_L} y={FRAME_TOP} width={POST_R - POST_L} height="11" rx="2" fill="#3F3F46" />
        <rect x={POST_L + 3} y={FRAME_TOP + 2} width={POST_R - POST_L - 6} height="4" rx="1" fill="#52525B" opacity="0.45" />
        {/* Feet */}
        <rect x={POST_L - 10} y={252} width="44" height="9" rx="2" fill="#27272A" />
        <rect x={POST_L - 10} y={250} width="44" height="4" rx="1" fill="#3F3F46" />
        <rect x={POST_R - 34} y={252} width="44" height="9" rx="2" fill="#27272A" />
        <rect x={POST_R - 34} y={250} width="44" height="4" rx="1" fill="#3F3F46" />
        {/* Lead screws */}
        <rect x={POST_L + 5} y={FRAME_TOP + 13} width="3" height="224" fill="#52525B" opacity="0.5" />
        <rect x={POST_R - 8} y={FRAME_TOP + 13} width="3" height="224" fill="#52525B" opacity="0.5" />

        {/* ── LCD ── */}
        <rect x={POST_L + 18} y={FRAME_TOP + 3} width="46" height="28" rx="2" fill="#0C1010" stroke="#3F3F46" strokeWidth="0.5" />
        <rect x={POST_L + 20} y={FRAME_TOP + 5} width="42" height="24" rx="1" fill="#091209" />
        <text x={POST_L + 22} y={FRAME_TOP + 14} fontFamily="monospace" fontSize="4.5" fill="#9FD356" letterSpacing="0.5">poisow 3d</text>
        {/* Progress bar track */}
        <rect x={POST_L + 21} y={FRAME_TOP + 18} width="38" height="3" rx="1" fill="#1A2A1A" />
        {/* Progress bar fill */}
        <rect x={POST_L + 21} y={FRAME_TOP + 18} width={38 * t} height="3" rx="1" fill="#9FD356" />
        <text x={POST_L + 21} y={FRAME_TOP + 27} fontFamily="monospace" fontSize="4" fill="#3A5A3A">{pct}%</text>

        {/* ── FILAMENT SPOOL (top-right corner) ── */}
        <circle cx={POST_R + 12} cy={FRAME_TOP + 30} r="22" fill="#1C1C1F" stroke="#3F3F46" strokeWidth="1.5" />
        <circle cx={POST_R + 12} cy={FRAME_TOP + 30} r="9" fill="#27272A" stroke="#3F3F46" strokeWidth="1" />
        <circle cx={POST_R + 12} cy={FRAME_TOP + 30} r="4" fill="#3F3F46" />
        {/* Filament wound on spool */}
        <path d={`M${POST_R - 8} ${FRAME_TOP + 28} A22 22 0 0 1 ${POST_R + 12} ${FRAME_TOP + 8}`}
          stroke="#FF5A2A" strokeWidth="3.5" fill="none" opacity="0.8" />
        <path d={`M${POST_R - 8} ${FRAME_TOP + 22} A22 22 0 0 1 ${POST_R + 4} ${FRAME_TOP + 9}`}
          stroke="#CC3A11" strokeWidth="2" fill="none" opacity="0.5" />

        {/* PTFE tube from spool to carriage */}
        <path d={`M${POST_R + 2} ${FRAME_TOP + 14} C${nozzleX + 40} ${gantryY - 45} ${nozzleX + 20} ${gantryY - 20} ${nozzleX + 9} ${gantryY + 2}`}
          stroke="#D4D4D8" strokeWidth="2" strokeDasharray="5 3" opacity="0.3" fill="none" />

        {/* ── HEATED BED ── */}
        {/* Bed carriage */}
        <rect x="48" y={BED_TOP + 6} width="264" height="9" rx="1" fill="#27272A" />
        {/* Bed surface (heated) */}
        <rect x="55" y={BED_TOP - 2} width="250" height="9" rx="1" fill="#3F3F46" />
        {/* Glass/steel sheet */}
        <rect x="57" y={BED_TOP - 4} width="246" height="7" rx="0.5" fill="#52525B" />
        {/* Bed grid */}
        {[90, 120, 150, 180, 210, 240, 270].map(gx => (
          <line key={gx} x1={gx} y1={BED_TOP - 4} x2={gx} y2={BED_TOP + 3} stroke="#3F3F46" strokeWidth="0.6" />
        ))}
        {/* Bed warm tint */}
        <rect x="57" y={BED_TOP - 4} width="246" height="7" rx="0.5" fill="#FF2200" opacity="0.05" />

        {/* ── PRINTED OBJECT ── */}
        {/* Completed layers */}
        {Array.from({ length: isPrinting ? layerIdx : NUM_LAYERS }, (_, i) => (
          <g key={i}>
            <rect x={PL} y={layerTopY(i)} width={PW} height={LAYER_H} fill={layerColor(i)} />
            <rect x={PL} y={layerTopY(i)} width={PW} height="1.5" fill="white" opacity="0.07" />
            <rect x={PL} y={layerTopY(i) + LAYER_H - 1} width={PW} height="1" fill="black" opacity="0.18" />
          </g>
        ))}
        {/* Current partial layer */}
        {isPrinting && curLayerW > 1 && (
          <g>
            <rect x={curLayerX} y={currentTopY} width={curLayerW} height={LAYER_H} fill={layerColor(layerIdx)} />
            <rect x={curLayerX} y={currentTopY} width={curLayerW} height="1.5" fill="white" opacity="0.1" />
          </g>
        )}

        {/* ── GANTRY / X-AXIS BEAM ── */}
        <rect x={POST_L + 13} y={gantryY} width={POST_R - POST_L - 26} height="11" rx="1.5" fill="url(#gantryG)" />
        {/* Rail highlight */}
        <rect x={POST_L + 13} y={gantryY + 1} width={POST_R - POST_L - 26} height="3.5" rx="0.5" fill="#71717A" opacity="0.4" />
        {/* Rail groove */}
        <rect x={POST_L + 13} y={gantryY + 4} width={POST_R - POST_L - 26} height="2" rx="0.5" fill="#18181B" opacity="0.5" />

        {/* ── PRINT CARRIAGE & HOT END ── */}
        {/* Carriage body */}
        <rect x={nozzleX - 20} y={gantryY - 5} width="40" height="24" rx="3" fill="#232328" stroke="#3F3F46" strokeWidth="1" />
        {/* Top grip */}
        <rect x={nozzleX - 17} y={gantryY - 3} width="34" height="9" rx="2" fill="#3F3F46" />
        <rect x={nozzleX - 15} y={gantryY - 1} width="30" height="4" rx="1" fill="#52525B" opacity="0.5" />
        {/* Fan shroud (left side) */}
        <rect x={nozzleX - 18} y={gantryY + 7} width="15" height="14" rx="2" fill="#141418" stroke="#2A2A30" strokeWidth="0.5" />
        {/* Fan blade */}
        <circle cx={nozzleX - 10} cy={gantryY + 14} r="5.5" stroke="#2A2A30" strokeWidth="0.7" fill="none" />
        <circle cx={nozzleX - 10} cy={gantryY + 14} r="1.8" fill="#1C1C22" />
        {/* Fan blade spokes */}
        {[0, 60, 120, 180, 240, 300].map(deg => {
          const rad = (deg * Math.PI) / 180;
          return <line key={deg}
            x1={nozzleX - 10} y1={gantryY + 14}
            x2={nozzleX - 10 + Math.cos(rad) * 5} y2={gantryY + 14 + Math.sin(rad) * 5}
            stroke="#2A2A32" strokeWidth="0.8" />;
        })}
        {/* Heater block */}
        <rect x={nozzleX - 5} y={gantryY + 20} width="12" height="10" rx="1.5" fill="#C23000" />
        <rect x={nozzleX - 4} y={gantryY + 21} width="10" height="8" rx="1" fill="#E03800" opacity="0.7" />
        <rect x={nozzleX - 3} y={gantryY + 22} width="8" height="6" rx="0.5" fill="#FF5A2A" opacity="0.4" />
        {/* Heat creep block */}
        <rect x={nozzleX - 3} y={gantryY + 8} width="8" height="12" rx="1" fill="#27272A" stroke="#3F3F46" strokeWidth="0.5" />
        {/* Nozzle */}
        <path d={`M${nozzleX - 3.5} ${gantryY + 30} L${nozzleX + 3.5} ${gantryY + 30} L${nozzleX + 2} ${gantryY + 40} L${nozzleX - 2} ${gantryY + 40} Z`} fill="#71717A" />
        <path d={`M${nozzleX - 2} ${gantryY + 40} L${nozzleX + 2} ${gantryY + 40} L${nozzleX + 1} ${gantryY + 43} L${nozzleX - 1} ${gantryY + 43} Z`} fill="#A1A1AA" />

        {/* ── NOZZLE GLOW & TIP ── */}
        {/* Glow halo */}
        <circle cx={nozzleX} cy={nozzleTipY} r="18" fill="url(#nozzleGlowG)" />
        {/* Outer ring */}
        <circle cx={nozzleX} cy={nozzleTipY} r="6" fill="#FF5A2A" opacity="0.18" />
        {/* Tip */}
        <circle cx={nozzleX} cy={nozzleTipY} r="3.5" fill="#FF5A2A" opacity="0.95" />
        <circle cx={nozzleX} cy={nozzleTipY} r="1.5" fill="white" opacity="0.65" />

        {/* Extrusion thread (tiny line from nozzle to layer) */}
        {isPrinting && curLayerW > 2 && (
          <line
            x1={nozzleX} y1={nozzleTipY}
            x2={nozzleX} y2={currentTopY}
            stroke="#FF5A2A" strokeWidth="1.8" opacity="0.55"
          />
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
      const res = await fetch("/api/orders", {
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
          {/* Local trust badge */}
          <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground border border-muted px-3 py-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            Bilbao · Trato directo · Sin intermediarios
          </div>

          <h1 className="font-mono text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground">
            Tu idea,<br />impresa<br /><span className="text-primary">capa a capa.</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-md leading-relaxed">
            Piezas 3D personalizadas impresas con precisión. Hablas directamente conmigo, sin formularios perdidos ni esperas innecesarias.
          </p>

          {/* Trust signals */}
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
const PRODUCTS = [
  {
    name: "Llavero personalizado",
    desc: "Con tu nombre, initiales, logo o diseño favorito. Pequeño, ligero y resistente.",
    detail: "Perfecto como regalo o para identificar tus llaves con estilo.",
    price: "4,50€",
    badge: "Más pedido",
    badgeColor: "text-primary border-primary/40 bg-primary/10",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <circle cx="22" cy="20" r="12" stroke="#FF5A2A" strokeWidth="2.5" />
        <circle cx="22" cy="20" r="6" stroke="#FF5A2A" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M31 27 L52 48" stroke="#71717A" strokeWidth="3" strokeLinecap="round" />
        <path d="M46 44 L56 44" stroke="#FF5A2A" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="30" y="45" width="18" height="8" rx="4" stroke="#52525B" strokeWidth="2" />
      </svg>
    )
  },
  {
    name: "Soporte de móvil",
    desc: "Para escritorio o uso vertical. Estable, con el ángulo que necesites.",
    detail: "Diseño limpio que encaja en cualquier espacio de trabajo.",
    price: "7€",
    badge: "Popular",
    badgeColor: "text-secondary border-secondary/40 bg-secondary/10",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <rect x="20" y="8" width="24" height="38" rx="3" stroke="#9FD356" strokeWidth="2.5" />
        <rect x="23" y="11" width="18" height="26" rx="1" fill="#27272A" stroke="#3F3F46" strokeWidth="1" />
        <circle cx="32" cy="42" r="2" stroke="#9FD356" strokeWidth="1.5" />
        <path d="M20 48 L14 56" stroke="#52525B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M44 48 L50 56" stroke="#52525B" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 56 L54 56" stroke="#71717A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "Figura gaming / meme",
    desc: "Personajes, logos, memes en 3D desde tu imagen o diseño. Cada pieza es única.",
    detail: "Trae tu referencia y lo imprimimos tal cual.",
    price: "desde 6€",
    badge: "A medida",
    badgeColor: "text-primary border-primary/40 bg-primary/10",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <rect x="8" y="24" width="48" height="28" rx="8" stroke="#FF5A2A" strokeWidth="2.5" />
        <path d="M20 36 L20 44" stroke="#FF5A2A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 40 L24 40" stroke="#FF5A2A" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="42" cy="39" r="2.5" fill="#FF5A2A" />
        <circle cx="48" cy="35" r="2.5" fill="#9FD356" />
        <path d="M22 24 C22 14 42 14 42 24" stroke="#52525B" strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="32" cy="11" r="5" stroke="#71717A" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    name: "Organizador de escritorio",
    desc: "Compartimentos para bolígrafos, cables, notas o lo que necesites tener a mano.",
    detail: "Las medidas y divisiones, a tu gusto.",
    price: "9€",
    badge: "Personalizable",
    badgeColor: "text-secondary border-secondary/40 bg-secondary/10",
    icon: (
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
    )
  },
  {
    name: "Maceta decorativa",
    desc: "Geométrica, moderna o con diseño propio. Para plantas pequeñas o suculentas.",
    detail: "Con o sin agujero de drenaje, a elegir.",
    price: "desde 5€",
    badge: "Ecofriendly",
    badgeColor: "text-secondary border-secondary/40 bg-secondary/10",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <path d="M16 28 L20 52 L44 52 L48 28 Z" stroke="#9FD356" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M12 28 L52 28" stroke="#9FD356" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 28 C32 20 32 14 32 14" stroke="#52525B" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 20 C26 16 22 11 28 8" stroke="#9FD356" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M32 17 C38 13 42 8 36 6" stroke="#9FD356" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "Pieza a medida",
    desc: "¿Tienes un STL, una imagen o solo una idea? Lo imprimimos sin problema.",
    detail: "Presupuesto sin compromiso antes de confirmar.",
    price: "Consultar",
    badge: "100% personalizado",
    badgeColor: "text-primary border-primary/40 bg-primary/10",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16">
        <path d="M12 20 L32 10 L52 20 L52 44 L32 54 L12 44 Z" stroke="#FF5A2A" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M12 20 L32 30 L52 20" stroke="#FF5A2A" strokeWidth="1.5" />
        <path d="M32 30 L32 54" stroke="#FF5A2A" strokeWidth="1.5" />
        <circle cx="46" cy="46" r="12" fill="#18181B" />
        <path d="M46 40 L46 52" stroke="#9FD356" strokeWidth="2" strokeLinecap="round" />
        <path d="M40 46 L52 46" stroke="#9FD356" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
];

function Catalog({ onOrderClick }: { onOrderClick: (p: string) => void }) {
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
          {PRODUCTS.map((prod, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <Card
                data-testid={`card-product-${i}`}
                className="rounded-none border-muted bg-background hover:border-primary/60 transition-all duration-200 group flex flex-col h-full overflow-hidden"
              >
                {/* Card header with icon */}
                <div className="p-6 pb-4 bg-card border-b border-muted flex items-end justify-between">
                  <div className="p-2">{prod.icon}</div>
                  <Badge variant="outline" className={`font-mono text-xs rounded-none ${prod.badgeColor}`}>
                    {prod.badge}
                  </Badge>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-mono text-lg font-bold mb-1 group-hover:text-primary transition-colors">{prod.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2 leading-relaxed">{prod.desc}</p>
                  <p className="text-xs text-muted-foreground/60 font-mono mb-6 italic">{prod.detail}</p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-muted">
                    <div>
                      <span className="font-mono font-black text-xl text-foreground">{prod.price}</span>
                    </div>
                    <Button
                      data-testid={`button-order-product-${i}`}
                      variant="outline"
                      size="sm"
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
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="relative"
          >
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

          {/* Trust block */}
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
  {
    name: "PLA",
    tag: "El más común",
    desc: "Versátil y con acabado muy limpio. Ideal para decoración, figuras y accesorios del día a día. Amplia gama de colores.",
    accent: "bg-secondary",
    pros: ["Buen acabado", "Colores vivos", "Fácil de limpiar"],
  },
  {
    name: "PETG",
    tag: "Resistente",
    desc: "Aguanta calor y humedad mejor que el PLA. Perfecto para piezas funcionales, de exterior o que estén en contacto con agua.",
    accent: "bg-blue-400",
    pros: ["Resistente al calor", "Soporta humedad", "Alta durabilidad"],
  },
  {
    name: "TPU",
    tag: "Flexible",
    desc: "Filamento elástico y blando. Para fundas de móvil, protectores, juntas y cualquier pieza que necesite flexibilidad.",
    accent: "bg-primary",
    pros: ["Elástico y suave", "Absorbe impactos", "Resistente al desgaste"],
  },
  {
    name: "ABS",
    tag: "Técnico",
    desc: "Alta resistencia mecánica y térmica. Para piezas que trabajan en entornos exigentes o requieren mecanizado posterior.",
    accent: "bg-zinc-400",
    pros: ["Alta resistencia", "Fácil de lijar", "Acabado liso"],
  }
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
  { q: "¿Hacéis envíos fuera de Bilbao?", a: "Sí. Hago envíos a toda España. Si estás en Bilbao también puedes recogerlo en mano y nos ahorramos el envío." },
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

function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d: { isAdmin: boolean }) => setIsAdmin(d.isAdmin))
      .catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    if (isAdmin) loadOrders();
  }, [isAdmin]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const r = await fetch("/api/orders", { credentials: "include" });
      if (r.ok) setOrders(await r.json() as Order[]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });
    if (r.ok) { setIsAdmin(true); } else { setLoginError("Contraseña incorrecta"); }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setIsAdmin(false);
    setOrders([]);
  };

  const updateStatus = async (id: number, status: string) => {
    const r = await fetch(`/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (r.ok) setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background text-foreground dark flex items-center justify-center">
        <div className="flex items-center gap-3 font-mono text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Cargando...
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground dark flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 font-mono text-xl font-bold mb-2">
            <LogoMark size={26} />
            poisow 3d
          </div>
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-8">Panel de administración</p>
          <div className="h-px bg-muted mb-8" />
          <form onSubmit={login} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Contraseña</Label>
              <Input
                type="password"
                className="rounded-none border-muted bg-card font-mono h-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            {loginError && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 font-mono">
                {loginError}
              </motion.p>
            )}
            <Button type="submit" className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-11">
              Entrar <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    done: orders.filter((o) => o.status === "done").length,
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Top nav */}
      <nav className="border-b border-muted bg-card/80 backdrop-blur-sm sticky top-0 z-40 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-mono text-sm font-bold">
          <LogoMark size={20} />
          poisow 3d <span className="text-muted-foreground font-normal">/ admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="font-mono rounded-none text-muted-foreground hover:text-foreground h-8 px-3 text-xs" onClick={loadOrders}>
            ↻ Actualizar
          </Button>
          <div className="w-px h-4 bg-muted" />
          <Button variant="ghost" size="sm" className="font-mono rounded-none text-muted-foreground hover:text-foreground h-8 px-3 text-xs" onClick={logout}>
            Salir
          </Button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { key: "all",         label: "Total",      count: counts.all,         color: "text-foreground",   bg: "bg-card" },
            { key: "pending",     label: "Pendientes", count: counts.pending,     color: "text-yellow-400",   bg: "bg-yellow-400/5" },
            { key: "in_progress", label: "En proceso", count: counts.in_progress, color: "text-blue-400",     bg: "bg-blue-400/5" },
            { key: "done",        label: "Listos",     count: counts.done,        color: "text-secondary",    bg: "bg-secondary/5" },
          ].map((s) => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`text-left p-4 border transition-all rounded-none ${
                filter === s.key ? "border-primary bg-primary/5" : "border-muted " + s.bg + " hover:border-muted-foreground/40"
              }`}
            >
              <p className={`font-mono text-3xl font-black mb-0.5 ${s.color}`}>{s.count}</p>
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-muted pb-0">
          {[
            { key: "all", label: "Todos" },
            { key: "pending", label: "Pendientes" },
            { key: "in_progress", label: "En proceso" },
            { key: "done", label: "Listos" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`font-mono text-xs px-4 py-2.5 transition-colors border-b-2 -mb-px ${
                filter === tab.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.key !== "all" && counts[tab.key as keyof typeof counts] > 0 && (
                <span className="ml-1.5 font-mono text-xs opacity-60">{counts[tab.key as keyof typeof counts]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {loadingOrders ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-muted bg-card h-32 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-muted p-16 text-center">
            <p className="font-mono text-muted-foreground text-sm">
              {filter === "all" ? "Todavía no hay encargos." : `No hay encargos con estado "${STATUS_LABELS[filter]?.label ?? filter}".`}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => {
              const s = STATUS_LABELS[order.status] ?? STATUS_LABELS["pending"]!;
              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border border-muted border-l-4 ${s.border} bg-card flex flex-col sm:flex-row`}
                >
                  {/* Main info */}
                  <div className="flex-1 min-w-0 p-5">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground/50">#{order.id}</span>
                      <span className="font-mono text-sm font-bold">{order.name}</span>
                      <Badge variant="outline" className={`font-mono text-xs rounded-none px-2 py-0 h-5 ${s.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${s.dot}`} />
                        {s.label}
                      </Badge>
                      <span className="font-mono text-xs text-muted-foreground/40 ml-auto">{timeAgo(order.createdAt)}</span>
                    </div>

                    <p className="font-mono text-base font-bold text-foreground mb-1.5">{order.product}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-xl">{order.details}</p>

                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <span className="text-muted-foreground/50">Contacto:</span>
                      <span className="text-primary font-semibold">{order.contact}</span>
                    </div>
                  </div>

                  {/* Status actions */}
                  <div className="flex sm:flex-col gap-1 p-3 sm:border-l border-t sm:border-t-0 border-muted bg-background/30 justify-end sm:justify-start">
                    {STATUS_KEYS.map((key) => (
                      <button
                        key={key}
                        onClick={() => updateStatus(order.id, key)}
                        disabled={order.status === key}
                        className={`font-mono text-xs px-3 py-1.5 transition-all border rounded-none ${
                          order.status === key
                            ? `${STATUS_LABELS[key].badge} cursor-default`
                            : "border-muted text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                        }`}
                      >
                        {STATUS_LABELS[key].label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
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
          <MapPin className="w-3.5 h-3.5" />
          Bilbao, España
        </div>
        <a data-testid="link-footer-instagram" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-mono text-sm">
          <SiInstagram className="w-5 h-5" />
          @poisow3d
        </a>
      </div>
      <div className="max-w-6xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground/40 font-mono">
        <span>© {new Date().getFullYear()} poisow 3d. Todos los derechos reservados.</span>
        <span>Impresión 3D · Piezas personalizadas · Bilbao</span>
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
        <Catalog onOrderClick={(p) => openOrder(p)} />
        <HowItWorks />
        <CustomOrder onOrderClick={() => openOrder()} />
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
