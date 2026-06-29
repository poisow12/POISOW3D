import React from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { SiInstagram, SiEtsy } from "react-icons/si";
import { ArrowRight, ChevronRight, PenTool, Layers, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const queryClient = new QueryClient();

function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1 font-mono text-xl font-bold tracking-tight">
          capas.3d<span className="text-primary">_</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-mono text-sm">
          <button onClick={() => scrollTo("catalogo")} className="text-muted-foreground hover:text-foreground transition-colors">Catálogo</button>
          <button onClick={() => scrollTo("como-funciona")} className="text-muted-foreground hover:text-foreground transition-colors">Cómo funciona</button>
          <button onClick={() => scrollTo("encargo")} className="text-muted-foreground hover:text-foreground transition-colors">Encargo a medida</button>
          <button onClick={() => scrollTo("materiales")} className="text-muted-foreground hover:text-foreground transition-colors">Materiales</button>
        </div>
        <Button 
          className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-10 px-6"
          onClick={() => window.open("https://www.instagram.com/capas.3d/", "_blank")}
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
            style={{
              transformOrigin: "center center",
            }}
            animate={{
              translateZ: [0, (i + 1) * 20],
              opacity: [0, 1, 1],
            }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
        {/* Extruder nozzle simulation */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full blur-sm"
          animate={{
            x: [-50, 50, 50, -50, -50],
            y: [-50, -50, 50, 50, -50],
            translateZ: [130, 130, 130, 130, 130]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    </div>
  );
}

function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
      <div className="flex-1 flex flex-col items-start space-y-6">
        <Badge variant="outline" className="font-mono text-secondary border-secondary bg-secondary/10 rounded-none px-3 py-1">
          Impreso en Bilbao · A1 Combo
        </Badge>
        <h1 className="font-mono text-5xl md:text-7xl font-bold tracking-tight leading-tight text-foreground">
          Tu idea,<br/>impresa<br/>capa a capa.
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-md">
          Diseño y fabricación de piezas 3D personalizadas. Multicolor, calidad Bambu Lab, precio justo.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Button 
            size="lg" 
            className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none"
            onClick={() => scrollTo("catalogo")}
          >
            Ver catálogo
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="font-mono rounded-none border-muted bg-transparent hover:bg-muted"
            onClick={() => window.open("https://www.instagram.com/capas.3d/", "_blank")}
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
    name: "Figura gaming/meme",
    desc: "Personajes, logos, memes impresos en 3D. Desde diseño propio o tuyo.",
    price: "desde 6€",
    badge: "Multicolor",
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

function Catalog() {
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
            <Card className="rounded-none border-muted bg-card hover:border-primary/50 transition-colors p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-muted/30 border border-muted">{prod.icon}</div>
                <Badge variant="secondary" className="font-mono text-xs rounded-none bg-muted text-muted-foreground">{prod.badge}</Badge>
              </div>
              <h3 className="font-mono text-xl font-bold mb-2">{prod.name}</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-6">{prod.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-mono font-bold text-lg">{prod.price}</span>
                <Button 
                  variant="outline" 
                  className="font-mono rounded-none border-muted hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  onClick={() => window.open("https://www.instagram.com/capas.3d/", "_blank")}
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
    { num: "01", title: "Cuéntame tu idea", desc: "Escríbeme por Instagram o Etsy con lo que necesitas." },
    { num: "02", title: "Te paso precio y plazo", desc: "Te confirmo el coste y cuándo estará listo." },
    { num: "03", title: "Imprimo la pieza", desc: "La Bambu Lab A1 Combo hace el trabajo con precisión." },
    { num: "04", title: "Recoges o te la envío", desc: "Recogida en Bilbao o envío a tu dirección." }
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

function CustomOrder() {
  return (
    <section id="encargo" className="py-24 px-6 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <Card className="rounded-none border-primary bg-primary/5 p-8 md:p-12 text-center flex flex-col items-center">
          <h2 className="font-mono text-2xl mb-4 text-primary uppercase tracking-widest text-sm font-bold">Encargo a medida</h2>
          <h3 className="font-mono text-4xl md:text-5xl font-bold mb-6">¿Tienes una idea en mente?</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mb-8">
            Si tienes un diseño STL, una imagen de referencia, o simplemente una idea, puedo hacerlo realidad. Solo escríbeme por Instagram y lo hablamos.
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
            size="lg" 
            className="font-mono bg-primary text-primary-foreground hover:bg-primary/90 rounded-none text-lg px-8 h-14"
            onClick={() => window.open("https://www.instagram.com/capas.3d/", "_blank")}
          >
            Escribir por Instagram <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Card>
      </motion.div>
    </section>
  );
}

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="rounded-none border-muted bg-card overflow-hidden h-full">
            <div className="h-2 w-full bg-secondary" />
            <div className="p-6">
              <Layers className="w-8 h-8 text-secondary mb-4" />
              <h3 className="font-mono text-xl font-bold mb-3">PLA</h3>
              <p className="text-sm text-muted-foreground">
                El más común. Buena resistencia, acabado limpio. Ideal para decoración y accesorios del día a día.
              </p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <Card className="rounded-none border-muted bg-card overflow-hidden h-full">
            <div className="h-2 w-full bg-foreground/20" />
            <div className="p-6">
              <Droplet className="w-8 h-8 text-foreground/40 mb-4" />
              <h3 className="font-mono text-xl font-bold mb-3">PETG</h3>
              <p className="text-sm text-muted-foreground">
                Más resistente al calor y la humedad. Perfecto para piezas funcionales o de exterior.
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <Card className="rounded-none border-muted bg-card overflow-hidden h-full relative">
            <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-blue-500" />
            <div className="p-6">
              <div className="flex gap-1 mb-4">
                <div className="w-3 h-8 bg-primary rounded-sm" />
                <div className="w-3 h-8 bg-secondary rounded-sm" />
                <div className="w-3 h-8 bg-blue-500 rounded-sm" />
                <div className="w-3 h-8 bg-white rounded-sm" />
              </div>
              <h3 className="font-mono text-xl font-bold mb-3">Multicolor AMS</h3>
              <p className="text-sm text-muted-foreground">
                Hasta 4 colores en una sola pieza gracias al AMS de la Bambu Lab. Ideal para figuras y diseños creativos.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-muted bg-card py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start">
          <div className="font-mono text-xl font-bold tracking-tight mb-2">
            capas.3d<span className="text-primary">_</span>
          </div>
          <p className="text-sm text-muted-foreground">Impreso en Bilbao</p>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/capas.3d/" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiInstagram className="w-6 h-6" />
            <span className="sr-only">Instagram</span>
          </a>
          <a href="https://www.etsy.com/shop/capas3d" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <SiEtsy className="w-6 h-6" />
            <span className="sr-only">Etsy</span>
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 text-center text-xs text-muted-foreground/50 font-mono">
        © {new Date().getFullYear()} capas.3d. Todos los derechos reservados.
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground dark">
      <Navbar />
      <main>
        <Hero />
        <Catalog />
        <HowItWorks />
        <CustomOrder />
        <Materials />
      </main>
      <Footer />
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
