const API = import.meta.env.VITE_API_URL || "";
import React, { useState, useEffect, useRef } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { SiInstagram } from "react-icons/si";
import { ArrowRight, ChevronRight, Clock, Star, CheckCircle2, Trash2, Copy, Download, Search, ChevronDown, ChevronUp, StickyNote, LogOut, RefreshCw, X, AlertTriangle, Flame, Package, ShoppingBag, LayoutGrid, Eye, EyeOff, Plus, Edit3, Save, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const queryClient = new QueryClient();
const INSTAGRAM_URL = "https://www.instagram.com/poisow3d/";

function LogoMark({ size = 28, dark = false }: { size?: number; dark?: boolean }) {
  const c1 = dark ? "#D4D4D8" : "#3F3F46";
  const c2 = dark ? "#A1A1AA" : "#52525B";
  const c3 = dark ? "#18181B" : "#27272A";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M4 22 L16 28 L28 22 L16 16 Z" fill={c1} />
      <path d="M4 16 L16 22 L28 16 L16 10 Z" fill={c2} />
      <path d="M4 10 L16 16 L28 10 L16 4 Z" fill="#18181B" />
      <path d="M4 16 L4 22 L16 28 L16 22 Z" fill={c3} />
      <path d="M28 16 L28 22 L16 28 L16 22 Z" fill={c1} />
    </svg>
  );
}

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
  const NUM_LAYERS = 7; const LAYER_H = 10; const PRINT_FRAC = 0.80;
  const isPrinting = t < PRINT_FRAC;
  const printT = isPrinting ? t / PRINT_FRAC : 1;
  const totalPhase = printT * NUM_LAYERS;
  const layerIdx = Math.min(Math.floor(totalPhase), NUM_LAYERS - 1);
  const layerProg = totalPhase - Math.floor(totalPhase);
  const POST_L = 28; const POST_R = 308; const FRAME_TOP = 10;
  const BED_TOP = 236; const PL = 68; const PR = 270; const PW = PR - PL;
  const NOZZLE_DROP = 42;
  const goingRight = layerIdx % 2 === 0;
  const nozzleNorm = goingRight ? layerProg : 1 - layerProg;
  const nozzleX = isPrinting ? PL + nozzleNorm * PW : PR;
  const layerTopY = (idx: number) => BED_TOP - (idx + 1) * LAYER_H;
  const currentTopY = layerTopY(layerIdx);
  const nozzleTipY = isPrinting ? currentTopY : layerTopY(NUM_LAYERS - 1) - 6;
  const gantryY = nozzleTipY - NOZZLE_DROP;
  const curLayerX = goingRight ? PL : PL + layerProg * PW;
  const curLayerW = layerProg * PW;
  const layerColor = (i: number) => (i % 2 === 0 ? "#18181B" : "#27272A");
  const pct = Math.round(t * 100);
  const completedLayerCount = isPrinting ? layerIdx : NUM_LAYERS;
  return (
    <div className="relative w-full flex items-center justify-center p-6">
      <svg viewBox="0 0 370 280" fill="none" className="w-full max-w-[420px]" style={{ filter: "drop-shadow(0 8px 48px rgba(0,0,0,0.10))" }}>
        <defs>
          <linearGradient id="postG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#D4D4D8" /><stop offset="100%" stopColor="#A1A1AA" /></linearGradient>
          <linearGradient id="gantryG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E4E4E7" /><stop offset="100%" stopColor="#D4D4D8" /></linearGradient>
          <radialGradient id="nozzleGlowG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#18181B" stopOpacity={glowPulse * 0.25} /><stop offset="100%" stopColor="#18181B" stopOpacity="0" /></radialGradient>
          <radialGradient id="bedGlowG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#18181B" stopOpacity={bedPulse * 1.5} /><stop offset="100%" stopColor="#18181B" stopOpacity="0" /></radialGradient>
          <radialGradient id="layerGlowG" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#18181B" stopOpacity="0.25" /><stop offset="100%" stopColor="#18181B" stopOpacity="0" /></radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect x={POST_L} y={FRAME_TOP} width="12" height="240" rx="2" fill="url(#postG)" />
        <rect x={POST_R - 12} y={FRAME_TOP} width="12" height="240" rx="2" fill="#A1A1AA" />
        <rect x={POST_L} y={FRAME_TOP} width={POST_R - POST_L} height="10" rx="2" fill="#D4D4D8" />
        <rect x={POST_L - 8} y={250} width="40" height="8" rx="2" fill="#A1A1AA" />
        <rect x={POST_R - 32} y={250} width="40" height="8" rx="2" fill="#A1A1AA" />
        <rect x={POST_L + 4} y={FRAME_TOP + 12} width="3" height="226" fill="#D4D4D8" opacity="0.6" />
        <rect x={POST_R - 7} y={FRAME_TOP + 12} width="3" height="226" fill="#D4D4D8" opacity="0.6" />
        {Array.from({ length: 18 }, (_, i) => <line key={i} x1={POST_L + 4} y1={FRAME_TOP + 14 + i * 12} x2={POST_L + 7} y2={FRAME_TOP + 14 + i * 12} stroke="#A1A1AA" strokeWidth="0.5" opacity="0.5" />)}
        <rect x={POST_L + 16} y={FRAME_TOP + 2} width="56" height="32" rx="2" fill="#18181B" stroke="#3F3F46" strokeWidth="0.8" />
        <rect x={POST_L + 18} y={FRAME_TOP + 4} width="52" height="28" rx="1" fill="#0A0A0A" />
        <text x={POST_L + 20} y={FRAME_TOP + 12} fontFamily="monospace" fontSize="4.5" fill="#E4E4E7" letterSpacing="0.3">poisow 3d</text>
        <text x={POST_L + 20} y={FRAME_TOP + 19} fontFamily="monospace" fontSize="3.8" fill="#71717A">{`T:210 B:60\u00b0C`}</text>
        <rect x={POST_L + 20} y={FRAME_TOP + 22} width="46" height="3.5" rx="1.5" fill="#27272A" />
        <rect x={POST_L + 20} y={FRAME_TOP + 22} width={46 * t} height="3.5" rx="1.5" fill="#E4E4E7" />
        <text x={POST_L + 20} y={FRAME_TOP + 30} fontFamily="monospace" fontSize="3.5" fill="#52525B">{pct}% complet.</text>
        <circle cx={POST_R + 26} cy={FRAME_TOP + 36} r="26" fill="#F4F4F5" stroke="#D4D4D8" strokeWidth="1.5" />
        <circle cx={POST_R + 26} cy={FRAME_TOP + 36} r="22" fill="none" stroke="#18181B" strokeWidth="4" strokeDasharray="55 14" opacity="0.6" />
        <circle cx={POST_R + 26} cy={FRAME_TOP + 36} r="16" fill="none" stroke="#3F3F46" strokeWidth="2.5" strokeDasharray="36 12" opacity="0.4" />
        <circle cx={POST_R + 26} cy={FRAME_TOP + 36} r="8" fill="#E4E4E7" stroke="#D4D4D8" strokeWidth="1" />
        {[0, 60, 120, 180, 240, 300].map(deg => { const rad = deg * Math.PI / 180; return <line key={deg} x1={POST_R + 26 + Math.cos(rad) * 3} y1={FRAME_TOP + 36 + Math.sin(rad) * 3} x2={POST_R + 26 + Math.cos(rad) * 7} y2={FRAME_TOP + 36 + Math.sin(rad) * 7} stroke="#A1A1AA" strokeWidth="1" />; })}
        <circle cx={POST_R + 26} cy={FRAME_TOP + 36} r="3" fill="#D4D4D8" />
        <path d={`M${POST_R + 8} ${FRAME_TOP + 24} C${nozzleX + 60} ${gantryY - 50} ${nozzleX + 30} ${gantryY - 22} ${nozzleX + 10} ${gantryY + 2}`} stroke="#A1A1AA" strokeWidth="2" strokeDasharray="5 3" opacity="0.4" fill="none" />
        <rect x="44" y={BED_TOP + 7} width={POST_R - 44 + 12} height="8" rx="1" fill="#E4E4E7" />
        <rect x="52" y={BED_TOP + 1} width={PW + 16} height="8" rx="1" fill="#F4F4F5" />
        <rect x="55" y={BED_TOP - 4} width={PW + 10} height="7" rx="0.5" fill="#FAFAFA" stroke="#E4E4E7" strokeWidth="0.5" />
        {[PL + 20, PL + 46, PL + 72, PL + 98, PL + 124, PL + 150, PL + 176].map(gx => <line key={gx} x1={gx} y1={BED_TOP - 4} x2={gx} y2={BED_TOP + 3} stroke="#D4D4D8" strokeWidth="0.7" />)}
        <ellipse cx={(PL + PR) / 2} cy={BED_TOP} rx={PW / 2} ry="5" fill="url(#bedGlowG)" />
        {Array.from({ length: completedLayerCount }, (_, i) => { const ty = layerTopY(i); return <g key={i}><rect x={PL} y={ty} width={PW} height={LAYER_H} fill={layerColor(i)} /><rect x={PL} y={ty} width={PW} height="1.5" fill="white" opacity="0.07" /><rect x={PL} y={ty + LAYER_H - 1} width={PW} height="1" fill="black" opacity="0.12" /></g>; })}
        {completedLayerCount > 0 && <rect x={PL} y={layerTopY(completedLayerCount - 1)} width={PW} height="2" fill="#52525B" opacity="0.4" />}
        {isPrinting && curLayerW > 1 && <g><rect x={curLayerX} y={currentTopY} width={curLayerW} height={LAYER_H} fill="#18181B" /><rect x={curLayerX} y={currentTopY} width={curLayerW} height="1.5" fill="white" opacity="0.08" /></g>}
        <rect x={POST_L + 12} y={gantryY} width={POST_R - POST_L - 24} height="10" rx="1.5" fill="url(#gantryG)" />
        <rect x={POST_L + 12} y={gantryY + 1} width={POST_R - POST_L - 24} height="3" rx="0.5" fill="white" opacity="0.3" />
        <rect x={nozzleX - 19} y={gantryY - 4} width="38" height="22" rx="3" fill="#E4E4E7" stroke="#D4D4D8" strokeWidth="0.8" />
        <rect x={nozzleX - 16} y={gantryY - 2} width="32" height="8" rx="2" fill="#D4D4D8" />
        <rect x={nozzleX - 17} y={gantryY + 8} width="14" height="13" rx="2" fill="#F4F4F5" stroke="#D4D4D8" strokeWidth="0.5" />
        {[0, 60, 120, 180, 240, 300].map(deg => { const rad = (deg + fanAngle) * Math.PI / 180; return <line key={deg} x1={nozzleX - 10} y1={gantryY + 14.5} x2={nozzleX - 10 + Math.cos(rad) * 5} y2={gantryY + 14.5 + Math.sin(rad) * 5} stroke="#D4D4D8" strokeWidth="1.2" />; })}
        <circle cx={nozzleX - 10} cy={gantryY + 14.5} r="6" stroke="#D4D4D8" strokeWidth="0.8" fill="none" />
        <circle cx={nozzleX - 10} cy={gantryY + 14.5} r="2" fill="#E4E4E7" />
        <rect x={nozzleX - 2} y={gantryY + 6} width="7" height="12" rx="1" fill="#D4D4D8" />
        {[0, 3, 6, 9].map(fi => <rect key={fi} x={nozzleX - 4} y={gantryY + 7 + fi} width="11" height="1.5" rx="0.5" fill="#E4E4E7" />)}
        <rect x={nozzleX - 4} y={gantryY + 18} width="11" height="10" rx="1.5" fill="#3F3F46" />
        <rect x={nozzleX - 3} y={gantryY + 19} width="9" height="8" rx="1" fill="#52525B" opacity="0.8" />
        <path d={`M${nozzleX - 3} ${gantryY + 28} L${nozzleX + 3} ${gantryY + 28} L${nozzleX + 1.5} ${gantryY + 38} L${nozzleX - 1.5} ${gantryY + 38} Z`} fill="#71717A" />
        <path d={`M${nozzleX - 1.5} ${gantryY + 38} L${nozzleX + 1.5} ${gantryY + 38} L${nozzleX + 0.8} ${gantryY + 41} L${nozzleX - 0.8} ${gantryY + 41} Z`} fill="#A1A1AA" />
        <circle cx={nozzleX} cy={nozzleTipY} r="18" fill="url(#nozzleGlowG)" />
        <circle cx={nozzleX} cy={nozzleTipY} r="3.5" fill="#18181B" opacity={0.7 + glowPulse * 0.3} filter="url(#glow)" />
        <circle cx={nozzleX} cy={nozzleTipY} r="1.5" fill="#52525B" opacity={0.4 + glowPulse * 0.3} />
        {isPrinting && curLayerW > 2 && <line x1={nozzleX} y1={nozzleTipY} x2={nozzleX} y2={currentTopY} stroke="#18181B" strokeWidth="1.5" opacity={0.35 + glowPulse * 0.2} />}
        {isPrinting && <ellipse cx={nozzleX} cy={currentTopY + 2} rx="12" ry="4" fill="url(#layerGlowG)" opacity={glowPulse * 0.5} />}
      </svg>
    </div>
  );
}

type OrderModalProps = { open: boolean; onClose: () => void; productName?: string };
function OrderModal({ open, onClose, productName = "" }: OrderModalProps) {
  const [name, setName] = useState(""); const [product, setProduct] = useState(productName); const [details, setDetails] = useState(""); const [contact, setContact] = useState(""); const [sent, setSent] = useState(false); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState("");
  useEffect(() => { setProduct(productName); setSent(false); }, [productName, open]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true); setError("");
    try { const res = await fetch(API + "/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ name, product, details, contact }) }); if (res.ok) { setSent(true); } else { setError("Error al enviar el encargo. Intenta de nuevo."); } } catch { setError("Error de conexión."); } finally { setSubmitting(false); }
  };
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="rounded-2xl border-0 bg-white shadow-2xl max-w-lg w-full p-0 gap-0">
        <div className="p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2"><LogoMark size={24} /> Pedir encargo</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">Te respondo con precio y plazo en menos de 24h.</p>
          </DialogHeader>
          {sent ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8 flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center"><CheckCircle2 className="w-8 h-8 text-white" /></div>
              <h3 className="text-xl font-bold text-gray-900">¡Encargo recibido!</h3>
              <p className="text-gray-500 text-sm max-w-xs">Te respondo con precio y plazo en menos de 24 horas.</p>
              <button className="mt-2 px-6 py-2.5 border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors" onClick={onClose}>Cerrar</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Tu nombre</label><input className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors" placeholder="Nombre o alias" value={name} onChange={(e) => setName(e.target.value)} required /></div>
                <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Producto</label><input className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors" placeholder="Ej: Llavero" value={product} onChange={(e) => setProduct(e.target.value)} required /></div>
              </div>
              <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Cuéntame tu idea</label><textarea className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors min-h-[100px] resize-none" placeholder="Colores, medidas, referencia de imagen, fichero STL..." value={details} onChange={(e) => setDetails(e.target.value)} required /></div>
              <div><label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">¿Cómo te contacto?</label><input className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors" placeholder="tu@email.com o @tuinstagram" value={contact} onChange={(e) => setContact(e.target.value)} required /></div>
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 mt-2">
                {submitting ? "Enviando..." : <><span>Enviar encargo</span><ArrowRight className="w-4 h-4" /></>}
              </button>
              <p className="text-xs text-gray-400 text-center">Respuesta garantizada en menos de 24h</p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Navbar({ onOrderClick }: { onOrderClick: () => void }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 font-semibold text-gray-900 text-lg tracking-tight"><LogoMark size={26} /> poisow 3d</div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <button onClick={() => scrollTo("catalogo")} className="hover:text-gray-900 transition-colors">Catálogo</button>
          <button onClick={() => scrollTo("como-funciona")} className="hover:text-gray-900 transition-colors">Cómo funciona</button>
          <button onClick={() => scrollTo("encargo")} className="hover:text-gray-900 transition-colors">Encargo</button>
          <button onClick={() => scrollTo("materiales")} className="hover:text-gray-900 transition-colors">Materiales</button>
        </div>
        <button className="bg-gray-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors" onClick={onOrderClick}>Pedir encargo</button>
      </div>
    </nav>
  );
}

function Hero({ onOrderClick }: { onOrderClick: () => void }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="pt-28 pb-20 md:pt-44 md:pb-32 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 flex flex-col items-start space-y-8">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse" /> Impresión 3D personalizada · Bilbao
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-gray-900">
            Tu idea,<br />impresa<br /><span className="text-gray-400">capa a capa.</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-md leading-relaxed">Piezas 3D personalizadas con precisión. Hablas directamente conmigo, sin intermediarios ni esperas innecesarias.</p>
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3.5 h-3.5 text-gray-900" /> Respuesta en 24h</span>
            <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3.5 h-3.5 text-gray-900" /> Precio cerrado</span>
            <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3.5 h-3.5 text-gray-900" /> Envío o recogida</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-gray-900 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm" onClick={onOrderClick}>Pedir encargo <ArrowRight className="w-4 h-4" /></button>
            <button className="text-gray-600 font-semibold px-6 py-3.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-sm" onClick={() => scrollTo("catalogo")}>Ver catálogo</button>
          </div>
        </div>
        <div className="flex-1 w-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-100">
          <PrinterVisual />
        </div>
      </div>
    </section>
  );
}

const CATALOG_ICONS: Record<string, React.ReactNode> = {
  keychain: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><circle cx="22" cy="20" r="12" stroke="#18181B" strokeWidth="2.5" /><circle cx="22" cy="20" r="6" stroke="#18181B" strokeWidth="1.5" strokeDasharray="3 2" /><path d="M31 27 L52 48" stroke="#A1A1AA" strokeWidth="3" strokeLinecap="round" /><path d="M46 44 L56 44" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" /><rect x="30" y="45" width="18" height="8" rx="4" stroke="#71717A" strokeWidth="2" /></svg>),
  phone: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><rect x="20" y="8" width="24" height="38" rx="3" stroke="#18181B" strokeWidth="2.5" /><rect x="23" y="11" width="18" height="26" rx="1" fill="#E4E4E7" stroke="#D4D4D8" strokeWidth="1" /><circle cx="32" cy="42" r="2" stroke="#18181B" strokeWidth="1.5" /><path d="M20 48 L14 56" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" /><path d="M44 48 L50 56" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" /><path d="M10 56 L54 56" stroke="#D4D4D8" strokeWidth="2" strokeLinecap="round" /></svg>),
  figure: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><rect x="8" y="24" width="48" height="28" rx="8" stroke="#18181B" strokeWidth="2.5" /><path d="M20 36 L20 44" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" /><path d="M16 40 L24 40" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" /><circle cx="42" cy="39" r="2.5" fill="#18181B" /><circle cx="48" cy="35" r="2.5" fill="#71717A" /><path d="M22 24 C22 14 42 14 42 24" stroke="#A1A1AA" strokeWidth="2" strokeDasharray="3 2" /><circle cx="32" cy="11" r="5" stroke="#A1A1AA" strokeWidth="1.5" /></svg>),
  organizer: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><rect x="8" y="28" width="48" height="28" rx="2" stroke="#18181B" strokeWidth="2.5" /><path d="M24 28 L24 56" stroke="#18181B" strokeWidth="1.5" /><path d="M40 28 L40 56" stroke="#18181B" strokeWidth="1.5" /><path d="M16 10 L16 28" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M32 8 L32 28" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M48 13 L48 28" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /></svg>),
  pot: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><path d="M16 28 L20 52 L44 52 L48 28 Z" stroke="#18181B" strokeWidth="2.5" strokeLinejoin="round" /><path d="M12 28 L52 28" stroke="#18181B" strokeWidth="2" strokeLinecap="round" /><path d="M32 20 C26 16 22 11 28 8" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" /><path d="M32 17 C38 13 42 8 36 6" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" /></svg>),
  custom: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><path d="M12 20 L32 10 L52 20 L52 44 L32 54 L12 44 Z" stroke="#18181B" strokeWidth="2.5" strokeLinejoin="round" /><path d="M12 20 L32 30 L52 20" stroke="#18181B" strokeWidth="1.5" /><path d="M32 30 L32 54" stroke="#A1A1AA" strokeWidth="1.5" /><circle cx="46" cy="46" r="12" fill="#F4F4F5" stroke="#E4E4E7" strokeWidth="1.5" /><path d="M46 40 L46 52" stroke="#18181B" strokeWidth="2" strokeLinecap="round" /><path d="M40 46 L52 46" stroke="#18181B" strokeWidth="2" strokeLinecap="round" /></svg>),
  headphones: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><path d="M12 32 C12 18 21 8 32 8 C43 8 52 18 52 32" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" /><rect x="8" y="30" width="10" height="16" rx="4" stroke="#18181B" strokeWidth="2.5" /><rect x="46" y="30" width="10" height="16" rx="4" stroke="#18181B" strokeWidth="2.5" /></svg>),
  case_phone: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><rect x="16" y="6" width="32" height="52" rx="6" stroke="#18181B" strokeWidth="2.5" /><rect x="20" y="10" width="24" height="44" rx="4" stroke="#A1A1AA" strokeWidth="1.5" /><path d="M26 6 L38 6" stroke="#18181B" strokeWidth="3" strokeLinecap="round" /></svg>),
  nameplate: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><rect x="6" y="18" width="52" height="28" rx="3" stroke="#18181B" strokeWidth="2.5" /><path d="M14 32 L50 32" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" /><path d="M14 36 L40 36" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" /></svg>),
  clip: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><path d="M24 48 L24 20 C24 14 32 10 40 14 C48 18 48 28 40 32 L28 38" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" /><path d="M28 38 C22 41 20 48 26 52 C32 56 40 52 40 46 L40 32" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /></svg>),
  box: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><path d="M8 20 L32 10 L56 20 L56 48 L32 58 L8 48 Z" stroke="#18181B" strokeWidth="2.5" strokeLinejoin="round" /><path d="M8 20 L32 30 L56 20" stroke="#18181B" strokeWidth="1.5" /><path d="M32 30 L32 58" stroke="#A1A1AA" strokeWidth="1.5" /></svg>),
  animal: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><ellipse cx="32" cy="36" rx="16" ry="14" stroke="#18181B" strokeWidth="2.5" /><circle cx="32" cy="20" r="10" stroke="#18181B" strokeWidth="2.5" /><path d="M22 13 C18 6 10 8 12 14" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M42 13 C46 6 54 8 52 14" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><circle cx="28" cy="20" r="2" fill="#18181B" /><circle cx="36" cy="20" r="2" fill="#18181B" /></svg>),
  trophy: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><path d="M20 8 L44 8 L44 28 C44 38 36 44 32 44 C28 44 20 38 20 28 Z" stroke="#18181B" strokeWidth="2.5" /><path d="M44 14 C50 14 54 18 54 24 C54 30 50 32 46 32" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M20 14 C14 14 10 18 10 24 C10 30 14 32 18 32" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M32 44 L32 52" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M22 52 L42 52" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" /></svg>),
  hook: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><path d="M32 8 L32 36 C32 44 24 50 18 46 C12 42 14 34 20 32" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" /><rect x="6" y="4" width="52" height="8" rx="2" stroke="#18181B" strokeWidth="2" /></svg>),
  cable_organizer: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><rect x="10" y="24" width="44" height="20" rx="10" stroke="#18181B" strokeWidth="2.5" /><path d="M22 24 L22 16" stroke="#18181B" strokeWidth="2" strokeLinecap="round" /><path d="M32 24 L32 12" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M42 24 L42 16" stroke="#18181B" strokeWidth="2" strokeLinecap="round" /><path d="M22 44 L22 52" stroke="#18181B" strokeWidth="2" strokeLinecap="round" /><path d="M32 44 L32 56" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M42 44 L42 52" stroke="#18181B" strokeWidth="2" strokeLinecap="round" /></svg>),
  lamp: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><path d="M32 8 L32 28" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M18 28 L46 28 L40 46 L24 46 Z" stroke="#18181B" strokeWidth="2.5" strokeLinejoin="round" /><path d="M26 56 L38 56" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" /></svg>),
  dice: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><rect x="10" y="10" width="44" height="44" rx="8" stroke="#18181B" strokeWidth="2.5" /><circle cx="22" cy="22" r="3" fill="#18181B" /><circle cx="42" cy="22" r="3" fill="#18181B" /><circle cx="32" cy="32" r="3" fill="#71717A" /><circle cx="22" cy="42" r="3" fill="#18181B" /><circle cx="42" cy="42" r="3" fill="#18181B" /></svg>),
  ring: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><circle cx="32" cy="36" r="18" stroke="#18181B" strokeWidth="2.5" /><circle cx="32" cy="36" r="10" stroke="#A1A1AA" strokeWidth="2" /><path d="M28 18 L36 18 L34 28 L30 28 Z" stroke="#18181B" strokeWidth="2" strokeLinejoin="round" /></svg>),
  stamp: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><rect x="14" y="32" width="36" height="20" rx="2" stroke="#18181B" strokeWidth="2.5" /><rect x="22" y="16" width="20" height="18" rx="2" stroke="#A1A1AA" strokeWidth="2" /><path d="M26 38 L38 38" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" /></svg>),
  plant_hanger: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><path d="M32 6 L32 20" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M20 20 L44 20" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" /><path d="M20 20 L16 48" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" /><path d="M44 20 L48 48" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" /><path d="M14 48 L50 48" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" /><ellipse cx="32" cy="42" rx="12" ry="8" stroke="#18181B" strokeWidth="2" /></svg>),
  coin: (<svg viewBox="0 0 64 64" fill="none" className="w-16 h-16"><circle cx="32" cy="32" r="22" stroke="#18181B" strokeWidth="2.5" /><circle cx="32" cy="32" r="16" stroke="#A1A1AA" strokeWidth="1.5" strokeDasharray="4 2" /><text x="32" y="38" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="14" fontWeight="700" fill="#18181B">3D</text></svg>),
};

type CatalogApiItem = { id: number; name: string; description: string; detail: string; price: string; badge: string; badgeVariant: string; iconType: string; imageUrl: string; active: boolean; sortOrder: number; createdAt: string; };

const STATIC_PRODUCTS: CatalogApiItem[] = [
  { id: 0, name: "Llavero personalizado", description: "Con tu nombre, iniciales, logo o diseño favorito.", detail: "Perfecto como regalo o para identificar tus llaves.", price: "4,50€", badge: "Más pedido", badgeVariant: "orange", iconType: "keychain", imageUrl: "", active: true, sortOrder: 0, createdAt: "" },
  { id: 1, name: "Soporte de móvil", description: "Para escritorio o uso vertical. Estable, con el ángulo que necesites.", detail: "Diseño limpio que encaja en cualquier espacio de trabajo.", price: "7€", badge: "Popular", badgeVariant: "orange", iconType: "phone", imageUrl: "", active: true, sortOrder: 1, createdAt: "" },
  { id: 2, name: "Figura gaming / meme", description: "Personajes, logos, memes en 3D desde tu imagen o diseño.", detail: "Trae tu referencia y lo imprimimos tal cual.", price: "desde 6€", badge: "A medida", badgeVariant: "orange", iconType: "figure", imageUrl: "", active: true, sortOrder: 2, createdAt: "" },
  { id: 3, name: "Organizador de escritorio", description: "Compartimentos para bolígrafos, cables, notas o lo que necesites.", detail: "Las medidas y divisiones, a tu gusto.", price: "9€", badge: "Personalizable", badgeVariant: "orange", iconType: "organizer", imageUrl: "", active: true, sortOrder: 3, createdAt: "" },
  { id: 4, name: "Maceta decorativa", description: "Geométrica, moderna o con diseño propio. Para plantas pequeñas.", detail: "Con o sin agujero de drenaje, a elegir.", price: "desde 5€", badge: "Ecofriendly", badgeVariant: "orange", iconType: "pot", imageUrl: "", active: true, sortOrder: 4, createdAt: "" },
  { id: 5, name: "Pieza a medida", description: "¿Tienes un STL, una imagen o solo una idea? Lo imprimimos.", detail: "Presupuesto sin compromiso antes de confirmar.", price: "Consultar", badge: "100% personalizado", badgeVariant: "orange", iconType: "custom", imageUrl: "", active: true, sortOrder: 5, createdAt: "" },
];

function Catalog({ onOrderClick }: { onOrderClick: (p: string) => void }) {
  const [products, setProducts] = useState<CatalogApiItem[]>(STATIC_PRODUCTS);
  useEffect(() => { fetch(API + "/api/catalog").then((r) => r.ok ? r.json() : null).then((data: CatalogApiItem[] | null) => { if (data && data.length > 0) setProducts(data); }).catch(() => {}); }, []);
  return (
    <section id="catalogo" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Lo que imprimo</p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Catálogo</h2>
        </motion.div>
        <p className="text-gray-500 mb-12 max-w-xl">Productos habituales con precio fijo. Si lo que buscas no está aquí, escríbeme y lo hablamos.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((prod, i) => (
            <motion.div key={prod.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full overflow-hidden">
                <div className="p-6 pb-4 flex items-end justify-between">
                  <div>{prod.imageUrl ? <img src={prod.imageUrl} alt={prod.name} className="w-16 h-16 object-cover rounded-xl" /> : (CATALOG_ICONS[prod.iconType] ?? CATALOG_ICONS["custom"])}</div>
                  {prod.badge && <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{prod.badge}</span>}
                </div>
                <div className="px-6 pb-6 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-gray-600 transition-colors">{prod.name}</h3>
                  <p className="text-gray-500 text-sm mb-1 leading-relaxed">{prod.description}</p>
                  <p className="text-xs text-gray-400 italic mb-6">{prod.detail}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="font-bold text-xl text-gray-900">{prod.price}</span>
                    <button className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-gray-800 transition-colors" onClick={() => onOrderClick(prod.name)}>Encargar</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [{ num: "01", title: "Rellena el formulario", desc: "Cuéntame qué necesitas — producto, medidas, colores o el fichero STL." }, { num: "02", title: "Precio y plazo cerrado", desc: "Te confirmo el coste exacto y cuándo estará listo. Sin sorpresas." }, { num: "03", title: "Lo imprimo con cuidado", desc: "Cada pieza se revisa antes de salir. Si algo no está bien, lo repito." }, { num: "04", title: "Lo recibes", desc: "Recogida en mano o envío a tu dirección. Tú eliges." }];
  return (
    <section id="como-funciona" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">El proceso</p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Cómo funciona</h2>
      </motion.div>
      <p className="text-gray-500 mb-16 max-w-xl">Sencillo y sin complicaciones. De tu idea a tu puerta en unos pocos pasos.</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-5"><span className="font-bold text-white text-sm">{step.num}</span></div>
            <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CustomOrder({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <section id="encargo" className="py-24 px-6 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Encargo a medida</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">¿Tienes una<br /><span className="text-gray-400">idea en mente?</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">Si tienes un diseño STL, una imagen de referencia o simplemente una idea en la cabeza, lo hago realidad.</p>
            <div className="flex flex-wrap items-center gap-3 mb-10 text-sm text-gray-500">
              {["Describe tu idea", "Precio cerrado", "Lo imprimo", "Lo recibes"].map((s, i) => (
                <React.Fragment key={i}><span className="flex items-center gap-1.5"><span className="text-white font-bold">{String(i + 1).padStart(2, "0")}.</span> {s}</span>{i < 3 && <ChevronRight className="w-3.5 h-3.5 text-gray-700 hidden sm:block" />}</React.Fragment>
              ))}
            </div>
            <button className="bg-white text-gray-900 font-semibold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm" onClick={onOrderClick}>Pedir encargo <ArrowRight className="w-4 h-4" /></button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex flex-col gap-4">
            {[{ icon: <Clock className="w-5 h-5" />, title: "Respuesta en menos de 24h", desc: "Te confirmo si puedo hacerlo y a qué precio antes de que pasen 24 horas." }, { icon: <CheckCircle2 className="w-5 h-5" />, title: "Precio cerrado antes de imprimir", desc: "No hay sorpresas. Acordamos el precio y no cambia." }, { icon: <Star className="w-5 h-5" />, title: "Calidad o lo repito", desc: "Si la pieza no te convence, la volvemos a imprimir." }].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 bg-gray-800 rounded-2xl"><div className="mt-0.5 shrink-0 text-gray-400">{item.icon}</div><div><h4 className="font-semibold text-white text-sm mb-1">{item.title}</h4><p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p></div></div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const MATERIALS = [
  { name: "PLA", tag: "El más común", desc: "Versátil y con acabado muy limpio. Ideal para decoración, figuras y accesorios del día a día.", pros: ["Buen acabado", "Colores vivos", "Fácil de limpiar"] },
  { name: "PETG", tag: "Resistente", desc: "Aguanta calor y humedad mejor que el PLA. Perfecto para piezas funcionales o de exterior.", pros: ["Resistente al calor", "Soporta humedad", "Alta durabilidad"] },
  { name: "TPU", tag: "Flexible", desc: "Filamento elástico y blando. Para fundas de móvil, protectores, juntas y piezas flexibles.", pros: ["Elástico y suave", "Absorbe impactos", "Resistente al desgaste"] },
  { name: "ABS", tag: "Técnico", desc: "Alta resistencia mecánica y térmica. Para piezas que trabajan en entornos exigentes.", pros: ["Alta resistencia", "Fácil de lijar", "Acabado liso"] },
];

function Materials() {
  return (
    <section id="materiales" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Con qué imprimo</p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Materiales</h2>
      </motion.div>
      <p className="text-gray-500 mb-12 max-w-xl">Cada material tiene sus ventajas. Si no sabes cuál elegir, te asesoro sin coste.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MATERIALS.map((mat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full hover:shadow-md transition-all">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mb-4"><span className="font-bold text-white text-xs">{mat.name}</span></div>
              <div className="flex items-baseline gap-2 mb-3"><h3 className="font-bold text-gray-900 text-lg">{mat.name}</h3><span className="text-xs text-gray-400">{mat.tag}</span></div>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{mat.desc}</p>
              <ul className="space-y-1.5">{mat.pros.map((pro, j) => <li key={j} className="flex items-center gap-2 text-xs text-gray-500"><span className="w-1 h-1 rounded-full bg-gray-900 shrink-0" />{pro}</li>)}</ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  { q: "¿Cuánto tarda un encargo?", a: "Depende del tamaño y la complejidad. Piezas pequeñas o medianas suelen estar listas en 2–5 días." },
  { q: "¿Puedo enviar mi propio fichero STL?", a: "Sí, perfectamente. Si tienes el fichero listo, solo tienes que enviármelo junto con el material y el acabado que quieres." },
  { q: "¿Cuánto cuesta?", a: "El precio depende del material, el tiempo de impresión y el acabado. Manda tu idea y te doy un presupuesto cerrado." },
  { q: "¿Hacéis envíos?", a: "Sí. Hago envíos a toda España. También puedes recogerlo en mano si lo prefieres." },
  { q: "¿Qué materiales usáis?", a: "Trabajo principalmente con PLA, PETG, TPU y ABS. Si no sabes cuál elegir, te recomiendo el que mejor le va." },
  { q: "¿Qué pasa si la pieza sale mal?", a: "Si el resultado no cumple lo que acordamos, la vuelvo a imprimir sin coste adicional." },
];

function FaqSection() {
  return (
    <section id="faq" className="py-24 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Dudas frecuentes</p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">FAQ</h2>
        </motion.div>
        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 overflow-hidden">
              <AccordionTrigger className="text-sm font-semibold text-gray-900 text-left hover:text-gray-600 hover:no-underline py-5">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-gray-500 leading-relaxed pb-5">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

type Order = { id: number; name: string; product: string; details: string; contact: string; status: string; notes: string; createdAt: string; };
const STATUS_LABELS: Record<string, { label: string; badge: string; border: string; dot: string }> = {
  pending:     { label: "Pendiente",  badge: "text-yellow-600 border-yellow-300 bg-yellow-50", border: "border-l-yellow-400", dot: "bg-yellow-400" },
  in_progress: { label: "En proceso", badge: "text-blue-600 border-blue-300 bg-blue-50",       border: "border-l-blue-400",   dot: "bg-blue-400" },
  done:        { label: "Listo",      badge: "text-gray-600 border-gray-300 bg-gray-50",       border: "border-l-gray-400",   dot: "bg-gray-400" },
};
const STATUS_KEYS = ["pending", "in_progress", "done"] as const;
function timeAgo(dateStr: string): string { const diff = Date.now() - new Date(dateStr).getTime(); const mins = Math.floor(diff / 60000); if (mins < 1) return "ahora mismo"; if (mins < 60) return `hace ${mins}m`; const hrs = Math.floor(mins / 60); if (hrs < 24) return `hace ${hrs}h`; return `hace ${Math.floor(hrs / 24)}d`; }
function agingHours(dateStr: string): number { return (Date.now() - new Date(dateStr).getTime()) / 3600000; }
function exportCsv(orders: Order[]) { const headers = ["ID","Nombre","Producto","Detalles","Contacto","Estado","Notas","Fecha"]; const rows = orders.map((o) => [o.id,o.name,o.product,`"${o.details.replace(/"/g,'""')}"`,o.contact,STATUS_LABELS[o.status]?.label??o.status,`"${o.notes.replace(/"/g,'""')}"`,new Date(o.createdAt).toLocaleString("es-ES")]); const csv=[headers,...rows].map((r)=>r.join(",")).join("\n"); const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=`encargos-poisow3d-${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url); }
type ToastMsg = { id: number; msg: string; type: "ok" | "err" };
let toastId = 0;

const ICON_OPTIONS = [{value:"keychain",label:"Llavero"},{value:"phone",label:"Soporte"},{value:"figure",label:"Figura"},{value:"organizer",label:"Organizador"},{value:"pot",label:"Maceta"},{value:"custom",label:"Personalizado"},{value:"headphones",label:"Auriculares"},{value:"case_phone",label:"Carcasa"},{value:"nameplate",label:"Placa"},{value:"clip",label:"Clip"},{value:"box",label:"Caja"},{value:"animal",label:"Animal"},{value:"trophy",label:"Trofeo"},{value:"hook",label:"Gancho"},{value:"cable_organizer",label:"Cables"},{value:"lamp",label:"Lámpara"},{value:"dice",label:"Dado"},{value:"ring",label:"Anillo"},{value:"stamp",label:"Sello"},{value:"plant_hanger",label:"Macetero"},{value:"coin",label:"Moneda"}];

function CatalogItemForm({ item, onChange, onSave, onCancel }: { item: Partial<CatalogApiItem>; onChange: (v: Partial<CatalogApiItem>) => void; onSave: () => void; onCancel: () => void; }) {
  const [uploading, setUploading] = useState(false);
  const f = (field: keyof CatalogApiItem, val: string | boolean | number) => onChange({ ...item, [field]: val });
  const inputCls = "w-full h-10 px-3 bg-zinc-900 border border-zinc-700 font-mono text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-primary rounded-sm transition-colors";
  const labelCls = "font-mono text-xs uppercase tracking-widest text-zinc-500 mb-1.5 block";
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; setUploading(true);
    try { const formData = new FormData(); formData.append("file", file); formData.append("upload_preset", "poisow3d"); const res = await fetch("https://api.cloudinary.com/v1_1/evjciqji/image/upload", { method: "POST", body: formData }); const data = await res.json(); if (data.secure_url) f("imageUrl", data.secure_url); } finally { setUploading(false); }
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><label className={labelCls}>Nombre *</label><input className={inputCls} value={item.name??""} onChange={(e)=>f("name",e.target.value)} placeholder="Nombre del producto" /></div>
        <div className="sm:col-span-2"><label className={labelCls}>Descripción</label><input className={inputCls} value={item.description??""} onChange={(e)=>f("description",e.target.value)} placeholder="Una línea descriptiva" /></div>
        <div className="sm:col-span-2"><label className={labelCls}>Detalle (cursiva)</label><input className={inputCls} value={item.detail??""} onChange={(e)=>f("detail",e.target.value)} placeholder="Texto adicional en cursiva" /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><label className={labelCls}>Precio *</label><input className={inputCls} value={item.price??""} onChange={(e)=>f("price",e.target.value)} placeholder="ej. 4,50€" /></div>
        <div><label className={labelCls}>Badge</label><input className={inputCls} value={item.badge??""} onChange={(e)=>f("badge",e.target.value)} placeholder="ej. Más pedido" /></div>
        <div><label className={labelCls}>Color badge</label><select className={inputCls} value={item.badgeVariant??"orange"} onChange={(e)=>f("badgeVariant",e.target.value)}><option value="orange">Naranja</option><option value="green">Verde</option></select></div>
      </div>
      <div><label className={labelCls}>Icono</label>
        <div className="grid grid-cols-7 gap-1.5">
          {ICON_OPTIONS.map((opt)=>(<button key={opt.value} type="button" onClick={()=>f("iconType",opt.value)} className={`flex flex-col items-center gap-1 p-1.5 border rounded-sm transition-all ${item.iconType===opt.value?"border-primary bg-primary/10":"border-zinc-700 hover:border-zinc-500"}`}><div className="w-7 h-7 flex items-center justify-center" style={{transform:"scale(0.45)"}}>{CATALOG_ICONS[opt.value]??CATALOG_ICONS["custom"]}</div><span className="font-mono text-[8px] text-zinc-500 leading-none text-center truncate w-full">{opt.label}</span></button>))}
        </div>
      </div>
      <div><label className={labelCls}>Imagen</label>
        <div className="flex gap-3 items-start">
          <input className={`${inputCls} flex-1`} value={item.imageUrl??""} onChange={(e)=>f("imageUrl",e.target.value)} placeholder="https://..." />
          <label className={`flex items-center gap-2 h-10 px-4 border font-mono text-xs cursor-pointer whitespace-nowrap rounded-sm transition-colors ${uploading?"border-zinc-600 text-zinc-600":"border-primary text-primary hover:bg-primary/10"}`}>{uploading?"Subiendo...":"📁 Subir"}<input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} /></label>
        </div>
        {item.imageUrl&&(<div className="mt-3 flex items-center gap-3"><img src={item.imageUrl} alt="preview" className="w-20 h-20 object-cover border border-zinc-700 rounded-sm" /><button type="button" onClick={()=>f("imageUrl","")} className="font-mono text-xs text-red-400 hover:text-red-300 flex items-center gap-1"><XCircle className="w-3.5 h-3.5"/>Quitar</button></div>)}
      </div>
      <div className="flex items-center gap-6">
        <div className="w-28"><label className={labelCls}>Orden</label><input type="number" className={inputCls} value={item.sortOrder??0} onChange={(e)=>f("sortOrder",parseInt(e.target.value)||0)} /></div>
        <div className="flex items-center gap-2 mt-5">
          <button type="button" onClick={()=>f("active",!item.active)} className={`w-11 h-6 rounded-full transition-colors relative ${item.active?"bg-primary":"bg-zinc-700"}`}><div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${item.active?"translate-x-6":"translate-x-1"}`}/></button>
          <span className="font-mono text-xs text-zinc-400">{item.active?"Visible":"Oculto"}</span>
        </div>
      </div>
      <div className="flex gap-3 pt-2 border-t border-zinc-800">
        <button onClick={onSave} className="flex items-center gap-2 font-mono text-sm px-5 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-sm transition-colors"><Save className="w-4 h-4"/>Guardar</button>
        <button onClick={onCancel} className="flex items-center gap-2 font-mono text-sm px-5 py-2.5 border border-zinc-700 text-zinc-400 hover:text-foreground rounded-sm transition-colors"><X className="w-4 h-4"/>Cancelar</button>
      </div>
    </div>
  );
}

function AdminPage() {
  const [isAdmin,setIsAdmin]=useState<boolean|null>(null);const[password,setPassword]=useState("");const[loginError,setLoginError]=useState("");const[orders,setOrders]=useState<Order[]>([]);const[loading,setLoading]=useState(false);const[filter,setFilter]=useState<string>("all");const[search,setSearch]=useState("");const[expandedId,setExpandedId]=useState<number|null>(null);const[noteMap,setNoteMap]=useState<Record<number,string>>({});const[savingNote,setSavingNote]=useState<number|null>(null);const[deleteConfirm,setDeleteConfirm]=useState<number|null>(null);const[copiedId,setCopiedId]=useState<number|null>(null);const[toasts,setToasts]=useState<ToastMsg[]>([]);const[adminTab,setAdminTab]=useState<"orders"|"catalog">("orders");const[catalogItems,setCatalogItems]=useState<CatalogApiItem[]>([]);const[catalogLoading,setCatalogLoading]=useState(false);const[editingCatalog,setEditingCatalog]=useState<CatalogApiItem|null>(null);const[newItem,setNewItem]=useState<Partial<CatalogApiItem>|null>(null);
  const toast=(msg:string,type:"ok"|"err"="ok")=>{const id=++toastId;setToasts((p)=>[...p,{id,msg,type}]);setTimeout(()=>setToasts((p)=>p.filter((t)=>t.id!==id)),3000);};
  useEffect(()=>{fetch(API+"/api/auth/me",{credentials:"include"}).then((r)=>r.json()).then((d:{isAdmin:boolean})=>setIsAdmin(d.isAdmin)).catch(()=>setIsAdmin(false));},[]);
  useEffect(()=>{if(isAdmin)loadOrders();},[isAdmin]);
  useEffect(()=>{if(isAdmin&&adminTab==="catalog")loadCatalog();},[isAdmin,adminTab]);
  const loadOrders=async()=>{setLoading(true);try{const r=await fetch(API+"/api/orders",{credentials:"include"});if(r.ok){const data=await r.json() as Order[];setOrders(data);const notes:Record<number,string>={};data.forEach((o)=>{notes[o.id]=o.notes;});setNoteMap(notes);}}finally{setLoading(false);}};
  const login=async(e:React.FormEvent)=>{e.preventDefault();setLoginError("");const r=await fetch(API+"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({password})});if(r.ok){setIsAdmin(true);}else{setLoginError("Contraseña incorrecta");}};
  const logout=async()=>{await fetch(API+"/api/auth/logout",{method:"POST",credentials:"include"});setIsAdmin(false);setOrders([]);};
  const updateStatus=async(id:number,status:string)=>{const r=await fetch(`${API}/api/orders/${id}/status`,{method:"PATCH",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({status})});if(r.ok){setOrders((p)=>p.map((o)=>o.id===id?{...o,status}:o));toast(`Estado → ${STATUS_LABELS[status]?.label??status}`);}else toast("Error al cambiar estado","err");};
  const saveNote=async(id:number)=>{setSavingNote(id);const r=await fetch(`${API}/api/orders/${id}/note`,{method:"PATCH",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({notes:noteMap[id]??""})});setSavingNote(null);if(r.ok){setOrders((p)=>p.map((o)=>o.id===id?{...o,notes:noteMap[id]??""}:o));toast("Nota guardada");}else toast("Error al guardar nota","err");};
  const deleteOrder=async(id:number)=>{const r=await fetch(`${API}/api/orders/${id}`,{method:"DELETE",credentials:"include"});if(r.ok){setOrders((p)=>p.filter((o)=>o.id!==id));setDeleteConfirm(null);toast("Encargo eliminado");}else toast("Error al eliminar","err");};
  const copyContact=(id:number,contact:string)=>{navigator.clipboard.writeText(contact).then(()=>{setCopiedId(id);setTimeout(()=>setCopiedId(null),2000);toast("Contacto copiado");});};
  const loadCatalog=async()=>{setCatalogLoading(true);try{const r=await fetch(API+"/api/catalog/all",{credentials:"include"});if(r.ok)setCatalogItems(await r.json() as CatalogApiItem[]);}finally{setCatalogLoading(false);}};
  const saveCatalogItem=async(item:Partial<CatalogApiItem>)=>{if(item.id!==undefined&&item.id>0){const r=await fetch(`${API}/api/catalog/${item.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(item)});if(r.ok){setEditingCatalog(null);await loadCatalog();toast("Producto actualizado");}else toast("Error al guardar","err");}else{const r=await fetch(API+"/api/catalog",{method:"POST",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify(item)});if(r.ok){setNewItem(null);await loadCatalog();toast("Producto añadido");}else toast("Error al añadir","err");}};
  const deleteCatalogItem=async(id:number)=>{const r=await fetch(`${API}/api/catalog/${id}`,{method:"DELETE",credentials:"include"});if(r.ok){setCatalogItems((p)=>p.filter((x)=>x.id!==id));toast("Producto eliminado");}else toast("Error al eliminar","err");};
  const toggleActive=async(item:CatalogApiItem)=>{const r=await fetch(`${API}/api/catalog/${item.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},credentials:"include",body:JSON.stringify({active:!item.active})});if(r.ok)setCatalogItems((p)=>p.map((x)=>x.id===item.id?{...x,active:!item.active}:x));else toast("Error al cambiar visibilidad","err");};

  if(isAdmin===null)return(<div className="min-h-screen bg-zinc-950 text-foreground flex items-center justify-center"><div className="flex items-center gap-3 font-mono text-zinc-500"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"/>Cargando...</div></div>);
  if(!isAdmin)return(<div className="min-h-screen bg-zinc-950 text-foreground flex items-center justify-center p-6"><div className="w-full max-w-sm"><div className="flex items-center gap-3 mb-2"><LogoMark size={32} dark/><span className="font-mono text-2xl font-bold">poisow 3d</span></div><p className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-8">Panel de administración</p><div className="h-px bg-zinc-800 mb-8"/><form onSubmit={login} className="flex flex-col gap-4"><div><Label className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-1.5 block">Contraseña</Label><Input type="password" className="rounded-sm border-zinc-700 bg-zinc-900 font-mono h-11 focus:border-primary" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} autoFocus required/></div>{loginError&&<p className="text-xs text-red-400 font-mono">{loginError}</p>}<Button type="submit" className="font-mono bg-primary hover:bg-primary/90 rounded-sm h-11">Entrar <ArrowRight className="ml-2 w-4 h-4"/></Button></form></div></div>);

  const counts={all:orders.length,pending:orders.filter((o)=>o.status==="pending").length,in_progress:orders.filter((o)=>o.status==="in_progress").length,done:orders.filter((o)=>o.status==="done").length};
  const q=search.toLowerCase();
  const filtered=orders.filter((o)=>filter==="all"||o.status===filter).filter((o)=>!q||o.name.toLowerCase().includes(q)||o.product.toLowerCase().includes(q)||o.contact.toLowerCase().includes(q)||o.details.toLowerCase().includes(q));

  return(
    <div className="min-h-screen bg-zinc-950 text-foreground">
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t)=>(<motion.div key={t.id} initial={{opacity:0,x:40,scale:0.9}} animate={{opacity:1,x:0,scale:1}} className={`font-mono text-xs px-4 py-3 rounded-sm border flex items-center gap-2 shadow-xl pointer-events-auto ${t.type==="ok"?"bg-zinc-900 border-primary/40 text-primary":"bg-zinc-900 border-red-400/40 text-red-400"}`}>{t.type==="ok"?<CheckCircle2 className="w-3.5 h-3.5 shrink-0"/>:<X className="w-3.5 h-3.5 shrink-0"/>}{t.msg}</motion.div>))}
      </div>
      <div className="flex min-h-screen">
        <aside className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
          <div className="p-5 border-b border-zinc-800"><div className="flex items-center gap-2"><LogoMark size={22} dark/><span className="font-mono text-sm font-bold">poisow 3d</span></div><p className="font-mono text-xs text-zinc-600 mt-0.5">admin</p></div>
          <nav className="flex-1 p-3 space-y-1">
            {[{key:"orders",label:"Encargos",icon:<ShoppingBag className="w-4 h-4"/>,count:counts.pending>0?counts.pending:null},{key:"catalog",label:"Catálogo",icon:<LayoutGrid className="w-4 h-4"/>}].map((item)=>(<button key={item.key} onClick={()=>setAdminTab(item.key as "orders"|"catalog")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-mono text-sm transition-colors ${adminTab===item.key?"bg-primary/10 text-primary":"text-zinc-400 hover:text-foreground hover:bg-zinc-800"}`}>{item.icon}<span className="flex-1 text-left">{item.label}</span>{item.count&&<span className="bg-yellow-400 text-zinc-900 text-xs font-bold px-1.5 py-0.5 rounded-sm">{item.count}</span>}</button>))}
          </nav>
          <div className="p-3 border-t border-zinc-800 space-y-1">
            <button onClick={()=>exportCsv(orders)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-mono text-sm text-zinc-400 hover:text-foreground hover:bg-zinc-800 transition-colors"><Download className="w-4 h-4"/>Exportar CSV</button>
            <button onClick={loadOrders} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-mono text-sm text-zinc-400 hover:text-foreground hover:bg-zinc-800 transition-colors"><RefreshCw className="w-4 h-4"/>Actualizar</button>
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm font-mono text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"><LogOut className="w-4 h-4"/>Cerrar sesión</button>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="border-b border-zinc-800 bg-zinc-900/50 px-8 py-5 flex items-center justify-between">
            <div><h1 className="font-mono text-xl font-bold">{adminTab==="orders"?"Encargos":"Catálogo"}</h1><p className="font-mono text-xs text-zinc-500 mt-0.5">{adminTab==="orders"?`${counts.all} total · ${counts.pending} pendientes`:`${catalogItems.length} productos`}</p></div>
            {adminTab==="catalog"&&(<button onClick={()=>{setNewItem({name:"",description:"",detail:"",price:"",badge:"",badgeVariant:"orange",iconType:"custom",imageUrl:"",active:true,sortOrder:catalogItems.length});setEditingCatalog(null);}} className="flex items-center gap-2 font-mono text-sm px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-sm transition-colors"><Plus className="w-4 h-4"/>Nuevo producto</button>)}
          </div>
          <div className="p-8">
            {adminTab==="catalog"&&(
              <div>
                {newItem&&(<div className="border border-primary/30 bg-zinc-900 rounded-sm p-6 mb-6"><div className="flex items-center gap-2 mb-5"><Plus className="w-4 h-4 text-primary"/><h3 className="font-mono text-sm font-bold text-primary">Nuevo producto</h3></div><CatalogItemForm item={newItem} onChange={setNewItem} onSave={()=>saveCatalogItem(newItem)} onCancel={()=>setNewItem(null)}/></div>)}
                {catalogLoading?(<div className="flex items-center gap-3 py-16 justify-center font-mono text-sm text-zinc-500"><div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"/>Cargando...</div>):catalogItems.length===0?(<div className="border border-dashed border-zinc-800 rounded-sm p-16 text-center"><Package className="w-10 h-10 text-zinc-700 mx-auto mb-3"/><p className="font-mono text-sm text-zinc-500">No hay productos.</p></div>):(
                  <div className="space-y-3">
                    {catalogItems.map((item)=>(<div key={item.id} className="border border-zinc-800 bg-zinc-900 rounded-sm overflow-hidden">
                      {editingCatalog?.id===item.id?(<div className="p-6"><div className="flex items-center gap-2 mb-5"><Edit3 className="w-4 h-4 text-zinc-400"/><h3 className="font-mono text-sm font-bold text-zinc-300">Editando: {item.name}</h3></div><CatalogItemForm item={editingCatalog} onChange={(v)=>setEditingCatalog(v as CatalogApiItem)} onSave={()=>saveCatalogItem(editingCatalog)} onCancel={()=>setEditingCatalog(null)}/></div>):(
                        <div className="flex items-center gap-4 p-4">
                          <div className="w-14 h-14 flex items-center justify-center bg-zinc-800 rounded-sm shrink-0 overflow-hidden">{item.imageUrl?<img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>:<div style={{transform:"scale(0.5)"}}>{CATALOG_ICONS[item.iconType]??CATALOG_ICONS["custom"]}</div>}</div>
                          <div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-0.5 flex-wrap"><span className="font-mono font-bold text-sm">{item.name}</span>{item.badge&&<span className="font-mono text-xs px-1.5 py-0.5 border rounded-sm border-zinc-700 text-zinc-400">{item.badge}</span>}{!item.active&&<span className="font-mono text-xs text-zinc-600 border border-zinc-700 px-1.5 py-0.5 rounded-sm flex items-center gap-1"><EyeOff className="w-3 h-3"/>oculto</span>}</div><p className="text-xs text-zinc-500 truncate">{item.description}</p></div>
                          <div className="font-mono font-bold text-primary shrink-0">{item.price}</div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button onClick={()=>toggleActive(item)} className={`p-2 border rounded-sm transition-all ${item.active?"border-primary/40 text-primary hover:bg-primary/10":"border-zinc-700 text-zinc-500 hover:text-foreground"}`}>{item.active?<Eye className="w-3.5 h-3.5"/>:<EyeOff className="w-3.5 h-3.5"/>}</button>
                            <button onClick={()=>{setEditingCatalog({...item});setNewItem(null);}} className="p-2 border border-zinc-700 text-zinc-400 hover:text-foreground rounded-sm transition-all"><Edit3 className="w-3.5 h-3.5"/></button>
                            <button onClick={()=>deleteCatalogItem(item.id)} className="p-2 border border-red-400/20 text-red-400/60 hover:text-red-400 hover:border-red-400/40 rounded-sm transition-all"><Trash2 className="w-3.5 h-3.5"/></button>
                          </div>
                        </div>
                      )}
                    </div>))}
                  </div>
                )}
              </div>
            )}
            {adminTab==="orders"&&(
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {([{key:"all",label:"Total",color:"text-foreground",num:counts.all},{key:"pending",label:"Pendientes",color:"text-yellow-400",num:counts.pending},{key:"in_progress",label:"En proceso",color:"text-blue-400",num:counts.in_progress},{key:"done",label:"Listos",color:"text-primary",num:counts.done}] as const).map((s)=>(<button key={s.key} onClick={()=>setFilter(s.key)} className={`text-left p-4 border rounded-sm transition-all bg-zinc-900 ${filter===s.key?"border-primary":"border-zinc-800 hover:border-zinc-600"}`}><p className={`font-mono text-4xl font-black mb-1 ${s.color}`}>{s.num}</p><p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">{s.label}</p>{s.key==="pending"&&counts.pending>0&&<p className="font-mono text-xs text-yellow-400/70 mt-1">requieren acción</p>}</button>))}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"/><input type="text" placeholder="Buscar..." value={search} onChange={(e)=>setSearch(e.target.value)} className="w-full h-10 pl-9 pr-4 bg-zinc-900 border border-zinc-700 rounded-sm font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary"/>{search&&<button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-foreground"><X className="w-3.5 h-3.5"/></button>}</div>
                  <div className="flex border border-zinc-700 rounded-sm overflow-hidden">{[{key:"all",label:"Todos"},{key:"pending",label:"Pendiente"},{key:"in_progress",label:"Proceso"},{key:"done",label:"Listo"}].map((tab)=>(<button key={tab.key} onClick={()=>setFilter(tab.key)} className={`font-mono text-xs px-3 py-2 transition-colors border-r border-zinc-700 last:border-r-0 ${filter===tab.key?"bg-primary text-white":"text-zinc-400 hover:text-foreground hover:bg-zinc-800"}`}>{tab.label}</button>))}</div>
                </div>
                <p className="font-mono text-xs text-zinc-600 mb-4">{filtered.length} encargo{filtered.length!==1?"s":""}</p>
                {loading?(<div className="space-y-3">{[1,2,3].map((i)=><div key={i} className="h-24 border border-zinc-800 bg-zinc-900 rounded-sm animate-pulse"/>)}</div>):filtered.length===0?(<div className="border border-dashed border-zinc-800 rounded-sm p-16 text-center"><ShoppingBag className="w-10 h-10 text-zinc-700 mx-auto mb-3"/><p className="font-mono text-sm text-zinc-500">{search?`Sin resultados para "${search}".`:"No hay encargos todavía."}</p></div>):(
                  <div className="space-y-2">
                    {filtered.map((order)=>{
                      const s=STATUS_LABELS[order.status]??STATUS_LABELS["pending"]!;const hours=agingHours(order.createdAt);const isOld=order.status==="pending"&&hours>24;const isVeryOld=order.status==="pending"&&hours>72;const isExpanded=expandedId===order.id;const isDeleteConfirm=deleteConfirm===order.id;
                      return(<motion.div key={order.id} layout initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} className={`border bg-zinc-900 rounded-sm border-l-4 ${s.border} ${isVeryOld?"border-red-400/30":isOld?"border-yellow-400/20":"border-zinc-800"}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <div className="flex-1 min-w-0 p-4 cursor-pointer" onClick={()=>setExpandedId(isExpanded?null:order.id)}>
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap"><span className="font-mono text-xs text-zinc-600">#{order.id}</span><span className="font-mono text-sm font-bold">{order.name}</span><span className={`font-mono text-xs px-2 py-0.5 border rounded-sm flex items-center gap-1 ${s.badge}`}><span className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/>{s.label}</span>{isVeryOld&&<span className="flex items-center gap-1 font-mono text-xs text-red-400"><Flame className="w-3 h-3"/>urgente</span>}{isOld&&!isVeryOld&&<span className="flex items-center gap-1 font-mono text-xs text-yellow-400/80"><AlertTriangle className="w-3 h-3"/>+24h</span>}{order.notes&&<span className="flex items-center gap-1 font-mono text-xs text-zinc-600"><StickyNote className="w-3 h-3"/></span>}<span className="font-mono text-xs text-zinc-600 ml-auto">{timeAgo(order.createdAt)}</span></div>
                            <p className="font-mono text-sm font-bold mb-0.5">{order.product}</p><p className="text-xs text-zinc-500 line-clamp-1">{order.details}</p>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-3 border-t sm:border-t-0 sm:border-l border-zinc-800 shrink-0">
                            <select value={order.status} onChange={(e)=>updateStatus(order.id,e.target.value)} className={`font-mono text-xs px-2 py-1.5 border rounded-sm bg-zinc-800 cursor-pointer focus:outline-none focus:border-primary ${s.badge}`}>{STATUS_KEYS.map((key)=><option key={key} value={key} className="bg-zinc-900 text-foreground">{STATUS_LABELS[key].label}</option>)}</select>
                            <button onClick={()=>copyContact(order.id,order.contact)} className="p-2 border border-zinc-700 text-zinc-400 hover:text-primary hover:border-primary/40 rounded-sm transition-all">{copiedId===order.id?<CheckCircle2 className="w-3.5 h-3.5 text-primary"/>:<Copy className="w-3.5 h-3.5"/>}</button>
                            <button onClick={()=>setExpandedId(isExpanded?null:order.id)} className={`p-2 border rounded-sm transition-all ${isExpanded?"border-primary text-primary bg-primary/10":"border-zinc-700 text-zinc-400 hover:text-foreground"}`}>{isExpanded?<ChevronUp className="w-3.5 h-3.5"/>:<ChevronDown className="w-3.5 h-3.5"/>}</button>
                            {!isDeleteConfirm?(<button onClick={()=>setDeleteConfirm(order.id)} className="p-2 border border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-400/40 rounded-sm transition-all"><Trash2 className="w-3.5 h-3.5"/></button>):(<div className="flex gap-1"><button onClick={()=>deleteOrder(order.id)} className="p-2 border border-red-400/50 text-red-400 hover:bg-red-400/10 rounded-sm transition-all"><CheckCircle2 className="w-3.5 h-3.5"/></button><button onClick={()=>setDeleteConfirm(null)} className="p-2 border border-zinc-700 text-zinc-400 rounded-sm transition-all"><X className="w-3.5 h-3.5"/></button></div>)}
                          </div>
                        </div>
                        {isExpanded&&(<motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} className="border-t border-zinc-800 bg-zinc-950/50"><div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5"><div><p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-2">Detalles</p><p className="text-sm text-zinc-300 leading-relaxed mb-4">{order.details}</p><div className="flex items-center gap-2"><p className="font-mono text-xs text-zinc-600">Contacto:</p><span className="font-mono text-sm text-primary font-semibold">{order.contact}</span><button onClick={()=>copyContact(order.id,order.contact)} className="text-zinc-500 hover:text-primary transition-colors"><Copy className="w-3 h-3"/></button></div><p className="font-mono text-xs text-zinc-700 mt-2">{new Date(order.createdAt).toLocaleDateString("es-ES",{weekday:"long",day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}</p></div><div><p className="font-mono text-xs text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-1.5"><StickyNote className="w-3 h-3"/>Notas internas</p><Textarea value={noteMap[order.id]??""} onChange={(e)=>setNoteMap((p)=>({...p,[order.id]:e.target.value}))} placeholder="Precio acordado, plazo, comentarios..." className="rounded-sm border-zinc-700 bg-zinc-900 font-mono text-xs min-h-[80px] resize-none text-foreground focus:border-primary"/><div className="flex justify-end mt-2"><button onClick={()=>saveNote(order.id)} disabled={savingNote===order.id} className="font-mono text-xs px-3 py-1.5 border border-zinc-700 text-zinc-400 hover:text-foreground hover:border-zinc-500 rounded-sm transition-all disabled:opacity-50 flex items-center gap-1.5">{savingNote===order.id?<><div className="w-3 h-3 border border-t-transparent border-foreground rounded-full animate-spin"/>Guardando...</>:<><Save className="w-3 h-3"/>Guardar nota</>}</button></div></div></div></motion.div>)}
                      </motion.div>);
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2.5 text-white font-semibold text-lg"><LogoMark size={24} dark />poisow 3d</div>
        <div className="text-sm text-gray-500">Piezas 3D personalizadas · Bilbao</div>
        <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"><SiInstagram className="w-5 h-5" /> @poisow3d</a>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-600">
        <span>© {new Date().getFullYear()} poisow 3d. Todos los derechos reservados.</span>
        <span>Impresión 3D · Piezas personalizadas</span>
      </div>
    </footer>
  );
}

function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const openOrder = (product = "") => { setSelectedProduct(product); setModalOpen(true); };
  return (
    <div className="min-h-screen bg-white text-gray-900">
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/admin" component={AdminPage} />
            <Route><div className="min-h-screen flex items-center justify-center text-gray-500">Página no encontrada</div></Route>
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;