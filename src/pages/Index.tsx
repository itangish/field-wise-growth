import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sprout,
  Cloud,
  Brain,
  ShoppingCart,
  BarChart3,
  Shield,
  ArrowRight,
  Wheat,
  Droplets,
  Sun,
} from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";
import Logo from "@/components/Logo";

const features = [
  {
    icon: <Sprout className="h-6 w-6" />,
    title: "Farm Management",
    desc: "GPS mapping, crop planning, field segmentation, and growth monitoring.",
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: "Climate Intelligence",
    desc: "Real-time weather, drought & flood alerts, seasonal forecasts.",
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI Advisory",
    desc: "Pest detection, yield prediction, fertilizer dosage optimization.",
  },
  {
    icon: <ShoppingCart className="h-6 w-6" />,
    title: "Marketplace",
    desc: "Digital selling, escrow payments, delivery tracking, price AI.",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Analytics & Reports",
    desc: "National dashboards, production graphs, risk maps, PDF exports.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Finance & Security",
    desc: "Tax automation, mobile money, bank integration, audit logs.",
  },
];

const stats = [
  { value: "12K+", label: "Active Farms" },
  { value: "98%", label: "Uptime" },
  { value: "30+", label: "Districts" },
  { value: "2.4M", label: "Hectares Managed" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Impact</a>
          </div>
          <Link to="/dashboard">
            <Button size="sm" className="bg-gradient-hero text-primary-foreground border-0 hover:opacity-90">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Smart agriculture landscape with drones monitoring green terraced farmland at sunrise"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/60 to-foreground/30" />
        </div>

        <div className="container relative z-10 flex min-h-[85vh] flex-col justify-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="mb-6 flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 w-fit">
              <Wheat className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-secondary">National Smart Agriculture Platform</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Transform Agriculture
              <br />
              <span className="text-secondary">Into a Digital Ecosystem</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-primary-foreground/80">
              AI-powered tools for planning, monitoring, selling, and managing agriculture — from seed to market, farm to nation.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-gold text-secondary-foreground border-0 font-semibold hover:opacity-90 gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  Explore Features
                </Button>
              </a>
            </div>

            <div className="mt-12 flex gap-8">
              {[
                { icon: <Sun className="h-5 w-5" />, text: "Weather Intel" },
                { icon: <Droplets className="h-5 w-5" />, text: "IoT Sensors" },
                { icon: <Brain className="h-5 w-5" />, text: "AI Engine" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-primary-foreground/70">
                  {item.icon}
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-b border-border bg-card">
        <div className="container">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 divide-x divide-border md:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="px-6 py-10 text-center">
                <p className="font-display text-3xl font-extrabold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Everything You Need to
              <span className="text-gradient-hero"> Grow Smarter</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A complete ecosystem connecting farmers, managers, buyers, and government with intelligent tools.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-gradient-hero group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-hero py-20">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl">
              Ready to Modernize Agriculture?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
              Join thousands of farms already using AMS to increase yields, reduce losses, and grow sustainably.
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="mt-8 bg-gradient-gold text-secondary-foreground border-0 font-semibold hover:opacity-90 gap-2">
                Launch Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © 2026 Agriculture Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
