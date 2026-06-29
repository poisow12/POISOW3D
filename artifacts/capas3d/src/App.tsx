import React, { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { SiInstagram, SiEtsy } from "react-icons/si";
import { ArrowRight, ChevronRight, PenTool, Layers, Droplet, Zap, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const queryClient = new QueryClient();

const INSTAGRAM_URL = "https://www.instagram.com/poisow3d/";
const ETSY_URL = "https://www.etsy.com/shop/poisow3d";

type OrderModalProps = {
  open: boolean;
  onClose: () => void;
  productName?: string;
};

function OrderModal({ open, onClose, productName = "" }: OrderModalProps) {
  const [name, setName] = useState("");
  const [product, setProduct] = useState(productName);
  const [details, setDetails] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  React.useEffect(() => {
    setProduct(productName);
    setSent(false);
  }, [productName, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Hola! Me llamo ${name} y quiero encargar: ${product}.\n\nDetalles: ${details}\n\nContacto: ${contact}`;
    const subject = encodeURIComponent(`Encargo poisow 3d — ${product}`);
    const bodyEncoded = encodeURIComponent(body);
    window.open(`mailto:poisow3d@gmail.com?subject=${subject}&body=${bodyEncoded}`, "_blank");
    setSent(true);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="rounded-none border-primary bg-card max-w-lg w-full p-0 gap-0">
        <div className="h-1 w-full bg-primary" />
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="font-mono text-2xl font-bold">
              Pedir encargo<span className="text-primary">_</span>
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Rellena el formulario y te contactamos con precio y plazo.
            </p>
          </DialogHeader>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 border-2 border-primary flex items-center justify-center">
                <span className="font-mono text-primary text-3xl font-black">✓</span>
              </div>
              <h3 className="font-mono text-xl font-bold">Encargo enviado</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Se ha abierto tu cliente de correo con los detalles. Te responderemos lo antes posible.
              </p>
              <Button
                variant="outline"
                className="font-mono rounded-none border-muted mt-2"
                onClick={onClose}
              >
                Cerrar
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Tu nombre</Label>
                <Input
                  data-testid="input-order-name"
                  className="rounded-none border-muted bg-background font-mono focus-visible:ring-primary"
                  placeholder="Nombre o alias"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Producto</Label>
                <Input
                  data-testid="input-order-product"
                  className="rounded-none border-muted bg-background font-mono focus-visible:ring-primary"
                  placeholder="Ej: Llavero personalizado"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Detalles del encargo</Label>
                <Textarea
                  data-testid="input-order-details"
                  className="rounded-none border-muted bg-background font-mono focus-visible:ring-primary min-h-[100px] resize-none"
                  placeholder="Describe tu idea, colores, medidas, referencia de imagen..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Tu contacto (email o Instagram)</Label>
                <Input
                  data-testid="input-order-contact"
                  className="rounded-none border-muted bg-background font-mono focus-visible:ring-primary"
                  placeholder="tu@email.com o @tuinstagram"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>
              <Button
                data-testid="button-order-submit"
                type="submit"
                size="lg"
                className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none mt-2 h-12"
              >
                Enviar encargo <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Navbar({ onOrderClick }: { onOrderClick: () => void }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1 font-mono text-xl font-bold tracking-tight">
          poisow 3d<span className="text-primary">_</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-mono text-sm">
          <button data-testid="link-nav-catalogo" onClick={() => scrollTo("catalogo")} className="text-muted-foreground hover:text-foreground transition-colors">Catálogo</button>
          <button data-testid="link-nav-como-funciona" onClick={() => scrollTo("como-funciona")} className="text-muted-foreground hover:text-foreground transition-colors">Cómo funciona</button>
          <button data-testid="link-nav-encargo" onClick={() => scrollTo("encargo")} className="text-muted-foreground hover:text-foreground transition-colors">Encargo a medida</button>
          <button data-testid="link-nav-materiales" onClick={() => scrollTo("materiales")} className="text-muted-foreground hover:text-foreground transition-colors">Materiales</button>
        </div>
        <Button
          data-testid="button-nav-order"
          className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-10 px-6"
          onClick={onOrderClick}
        >
          Pedir encargo
        </Button>
      </div>
    </nav>
  );
}

function LayerAnimation() {
  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center p-8">
      <div className="relative w-64 h-64 perspective-1000 transform-style-3d rotate-x-60 rotate-z-45">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-secondary/50 bg-secondary/10 backdrop-blur-sm"
            style={{ transformOrigin: "center center" }}
            animate={{ translateZ: [0, (i + 1) * 20], opacity: [0, 1, 1] }}
            transition={{ duration: 2, delay: i * 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          />
        ))}
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full blur-sm"
          animate={{ x: [-50, 50, 50, -50, -50], y: [-50, -50, 50, 50, -50], translateZ: [130, 130, 130, 130, 130] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

function Hero({ onOrderClick }: { onOrderClick: () => void }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 flex flex-col items-start space-y-6">
        <h1 className="font-mono text-5xl md:text-7xl font-bold tracking-tight leading-tight text-foreground">
          Tu idea,<br />impresa<br />capa a capa.
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-md">
          Diseño y fabricación de piezas 3D personalizadas. Calidad Bambu Lab, precio justo.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Button
            data-testid="button-hero-catalog"
            size="lg"
            className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"
            onClick={() => scrollTo("catalogo")}
          >
            Ver catálogo
          </Button>
          <Button
            data-testid="button-hero-order"
            size="lg"
            variant="outline"
            className="font-mono rounded-none border-muted bg-transparent hover:bg-muted"
            onClick={onOrderClick}
          >
            Pedir encargo a medida
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full flex justify-center border border-muted bg-card">
        <LayerAnimation />
      </div>
    </section>
  );
}

const PRODUCTS = [
  {
    name: "Llavero personalizado",
    desc: "Tu nombre, logo o diseño favorito. Mini y duradero.",
    price: "4,50€",
    badge: "Más vendido",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-primary">
        <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M11 9l9 9" />
        <path d="M17 18l3-3" />
      </svg>
    )
  },
  {
    name: "Soporte de móvil",
    desc: "Para escritorio o coche. Ajustable y sólido.",
    price: "7€",
    badge: "Popular",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-secondary">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <path d="M12 18h.01" />
      </svg>
    )
  },
  {
    name: "Figura gaming / meme",
    desc: "Personajes, logos, memes impresos en 3D. Desde diseño propio o tuyo.",
    price: "desde 6€",
    badge: "Personalizable",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-primary">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4" />
        <path d="M8 10v4" />
        <circle cx="15" cy="13" r="1" />
        <circle cx="18" cy="11" r="1" />
      </svg>
    )
  },
  {
    name: "Organizador de escritorio",
    desc: "Compartimentos para cables, bolígrafos y lo que quieras.",
    price: "9€",
    badge: "Personalizable",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-secondary">
        <rect x="3" y="14" width="18" height="8" rx="1" />
        <path d="M7 14v-6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6" />
        <path d="M12 14v-4" />
      </svg>
    )
  },
  {
    name: "Maceta / decoración",
    desc: "Diseños geométricos, modernos o a medida. Para plantas pequeñas.",
    price: "desde 5€",
    badge: "Ecofriendly",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 text-primary">
        <path d="M12 10v12" />
        <path d="M12 10a4 4 0 0 0-8 0" />
        <path d="M12 10a4 4 0 0 1 8 0" />
        <path d="M7 22h10" />
      </svg>
    )
  },
  {
    name: "Diseño a medida",
    desc: "¿Tienes una idea? La imprimo. Trae tu STL o cuéntame qué necesitas.",
    price: "Consultar",
    badge: "Personalizado",
    icon: <PenTool className="w-12 h-12 text-secondary" />
  }
];

function Catalog({ onOrderClick }: { onOrderClick: (product: string) => void }) {
  return (
    <section id="catalogo" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="font-mono text-3xl font-bold tracking-tight">Catálogo<span className="text-primary">_</span></h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((prod, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card data-testid={`card-product-${i}`} className="rounded-none border-muted bg-card hover:border-primary/50 transition-colors p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-muted/30 border border-muted">{prod.icon}</div>
                <Badge variant="secondary" className="font-mono text-xs rounded-none bg-muted text-muted-foreground">{prod.badge}</Badge>
              </div>
              <h3 className="font-mono text-xl font-bold mb-2">{prod.name}</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-6">{prod.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-mono font-bold text-lg">{prod.price}</span>
                <Button
                  data-testid={`button-order-product-${i}`}
                  variant="outline"
                  className="font-mono rounded-none border-muted hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  onClick={() => onOrderClick(prod.name)}
                >
                  Encargar
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Rellena el formulario", desc: "Cuéntame qué necesitas desde esta misma página." },
    { num: "02", title: "Te paso precio y plazo", desc: "Te confirmo el coste y cuándo estará listo." },
    { num: "03", title: "Imprimo la pieza", desc: "La Bambu Lab A1 Combo hace el trabajo con precisión." },
    { num: "04", title: "Recoges o te la envío", desc: "Recogida en persona o envío a tu dirección." }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-card border-y border-muted">
      <div className="px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-mono text-3xl font-bold tracking-tight">Cómo funciona un encargo<span className="text-secondary">_</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-muted" />
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-card"
            >
              <div className="font-mono text-6xl font-black text-primary/20 mb-6">{step.num}</div>
              <h3 className="font-mono text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CustomOrder({ onOrderClick }: { onOrderClick: () => void }) {
  return (
    <section id="encargo" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Card className="rounded-none border-primary bg-primary/5 p-8 md:p-12 text-center flex flex-col items-center">
          <h2 className="font-mono text-sm mb-4 text-primary uppercase tracking-widest font-bold">Encargo a medida</h2>
          <h3 className="font-mono text-4xl md:text-5xl font-bold mb-6">¿Tienes una idea en mente?</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8">
            Si tienes un diseño STL, una imagen de referencia, o simplemente una idea, puedo hacerlo realidad. Rellena el formulario y te respondo con precio y plazo.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-mono text-muted-foreground mb-10">
            <span>Describe tu idea</span>
            <ChevronRight className="w-4 h-4 hidden sm:block text-primary" />
            <span>Te confirmo precio</span>
            <ChevronRight className="w-4 h-4 hidden sm:block text-primary" />
            <span>Lo imprimo</span>
            <ChevronRight className="w-4 h-4 hidden sm:block text-primary" />
            <span>Te lo envío</span>
          </div>
          <Button
            data-testid="button-custom-order"
            size="lg"
            className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-lg px-8 h-14"
            onClick={onOrderClick}
          >
            Pedir encargo <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Card>
      </motion.div>
    </section>
  );
}

const MATERIALS = [
  {
    name: "PLA",
    desc: "El más común y versátil. Acabado limpio, buena resistencia y fácil de imprimir. Ideal para decoración, figuras y accesorios del día a día.",
    accent: "bg-secondary",
    icon: <Layers className="w-8 h-8 text-secondary mb-4" />,
  },
  {
    name: "PETG",
    desc: "Más resistente al calor y la humedad que el PLA. Perfecto para piezas funcionales, de exterior o que estén en contacto con agua.",
    accent: "bg-blue-400",
    icon: <Droplet className="w-8 h-8 text-blue-400 mb-4" />,
  },
  {
    name: "TPU",
    desc: "Filamento flexible y elástico. Ideal para fundas de móvil, protectores, juntas y cualquier pieza que necesite absorber impactos.",
    accent: "bg-primary",
    icon: <Zap className="w-8 h-8 text-primary mb-4" />,
  },
  {
    name: "ABS",
    desc: "Alta resistencia mecánica y térmica. Para piezas técnicas o funcionales que trabajan en entornos exigentes. Acabado liso y duradero.",
    accent: "bg-zinc-400",
    icon: <Shield className="w-8 h-8 text-zinc-400 mb-4" />,
  }
];

function Materials() {
  return (
    <section id="materiales" className="py-24 px-6 max-w-6xl mx-auto border-t border-muted">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="font-mono text-3xl font-bold tracking-tight">Materiales<span className="text-primary">_</span></h2>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MATERIALS.map((mat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Card data-testid={`card-material-${i}`} className="rounded-none border-muted bg-card overflow-hidden h-full">
              <div className={`h-1.5 w-full ${mat.accent}`} />
              <div className="p-6">
                {mat.icon}
                <h3 className="font-mono text-xl font-bold mb-3">{mat.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{mat.desc}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-muted bg-card py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-mono text-xl font-bold tracking-tight">
          poisow 3d<span className="text-primary">_</span>
        </div>
        <div className="flex items-center gap-6">
          <a data-testid="link-footer-instagram" href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiInstagram className="w-6 h-6" />
            <span className="sr-only">Instagram</span>
          </a>
          <a data-testid="link-footer-etsy" href={ETSY_URL} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiEtsy className="w-6 h-6" />
            <span className="sr-only">Etsy</span>
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 text-center text-xs text-muted-foreground/50 font-mono">
        © {new Date().getFullYear()} poisow 3d. Todos los derechos reservados.
      </div>
    </footer>
  );
}

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
      </main>
      <Footer />
      <OrderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        productName={selectedProduct}
      />
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
            <Route>
              <div className="min-h-screen flex items-center justify-center font-mono">
                Página no encontrada_
              </div>
            </Route>
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
