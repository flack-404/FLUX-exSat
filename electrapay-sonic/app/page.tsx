"use client"

import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import {
  ArrowRight,
  Wallet,
  Clock,
  LineChart,
  Shield,
  Brain,
  Sparkles,
  Layers,
  Zap,
  Bitcoin,
  Workflow,
  Lock,
  ChevronRight,
  ExternalLink,
  BarChart3,
  Cpu,
  Landmark,
  Lightbulb,
  Rocket,
  Repeat,
  Check,
} from "lucide-react"

export default function Home() {
  // For animations and effects
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const howItWorksRef = useRef<HTMLElement>(null)
  const aiEngineRef = useRef<HTMLElement>(null)
  const yieldRef = useRef<HTMLElement>(null)
  const securityRef = useRef<HTMLElement>(null)

  // Handle scroll events for animations and active section tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Determine active section based on scroll position
      const sections = [
        { id: "hero", ref: heroRef },
        { id: "features", ref: featuresRef },
        { id: "how-it-works", ref: howItWorksRef },
        { id: "ai-engine", ref: aiEngineRef },
        { id: "yield", ref: yieldRef },
        { id: "security", ref: securityRef },
      ]

      for (const section of sections) {
        if (section.ref.current) {
          const rect = section.ref.current.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    setMounted(true)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      setMounted(false)
    }
  }, [])

  // Parallax effect calculation
  const getParallaxStyle = (factor: number) => {
    return {
      transform: `translateY(${scrollY * factor}px)`,
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      {mounted && (
        <>
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-emerald-500/20 blur-xl"
                style={{
                  width: `${Math.random() * 300 + 100}px`,
                  height: `${Math.random() * 300 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3,
                  animation: `float ${Math.random() * 20 + 20}s linear infinite`,
                  animationDelay: `${Math.random() * 20}s`,
                  transform: `translate(-50%, -50%)`,
                }}
              />
            ))}
          </div>

          {/* Additional focused floating elements in the hero section */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Specifically positioned elements behind the hero title */}
            <div
              className="absolute rounded-full bg-emerald-600/30 blur-xl"
              style={{
                width: "400px",
                height: "400px",
                top: "40%",
                left: "30%",
                opacity: 0.25,
                animation: "float 25s linear infinite",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              className="absolute rounded-full bg-emerald-500/20 blur-xl"
              style={{
                width: "300px",
                height: "300px",
                top: "35%",
                left: "70%",
                opacity: 0.3,
                animation: "float 30s linear infinite reverse",
                animationDelay: "5s",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              className="absolute rounded-full bg-emerald-700/25 blur-xl"
              style={{
                width: "250px",
                height: "250px",
                top: "50%",
                left: "50%",
                opacity: 0.2,
                animation: "pulseAndFloat 20s ease-in-out infinite",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Smaller accent elements */}
            <div
              className="absolute rounded-full bg-emerald-400/30 blur-md"
              style={{
                width: "100px",
                height: "100px",
                top: "42%",
                left: "25%",
                opacity: 0.4,
                animation: "pulse 8s ease-in-out infinite",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              className="absolute rounded-full bg-emerald-300/20 blur-md"
              style={{
                width: "80px",
                height: "80px",
                top: "38%",
                left: "80%",
                opacity: 0.3,
                animation: "pulse 6s ease-in-out infinite",
                animationDelay: "2s",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
            style={{
              backgroundPosition: "0 0, 0 0",
              opacity: 0.2,
            }}
          />

          {/* Radial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-70 pointer-events-none" />
        </>
      )}

      {/* Header/Navigation */}
      <header className="fixed top-0 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-black" />
              </div>
              <div
                className="absolute -inset-1 bg-emerald-500/30 rounded-full blur-sm animate-pulse"
                style={{ animationDuration: "3s" }}
              ></div>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
              FLUX
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { name: "Features", href: "#features" },
              { name: "How it Works", href: "#how-it-works" },
              { name: "AI Engine", href: "#ai-engine" },
              { name: "Yield Optimization", href: "#yield" },
              { name: "Security", href: "#security" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm transition-colors hover:scale-105 relative ${
                  activeSection === item.href.substring(1)
                    ? "text-emerald-400 font-medium"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.name}
                {activeSection === item.href.substring(1) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-emerald-500/70 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <Link
              href="/auth/employee"
              className="inline-flex items-center justify-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-all"
            >
              Login 
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} id="hero" className="pt-40 pb-32 relative">
        {/* Hero-specific glow effect */}
        <div className="absolute left-1/2 top-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md hover:border-emerald-500/30 transition-colors"
            style={getParallaxStyle(-0.02)}
          >
            <span
              className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
              style={{ animationDuration: "2s" }}
            ></span>
            <span className="text-sm">Powered by exSat</span>
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-white/80 bg-clip-text text-transparent animate-gradient-x relative z-20 tracking-tight"
            style={getParallaxStyle(-0.03)}
          >
            The Future of <br className="hidden sm:block" />
              Smart Finance

          </h1>
          <p
            className="text-xl md:text-2xl text-zinc-300 max-w-3xl mx-auto mb-8 backdrop-blur-sm leading-relaxed"
            style={getParallaxStyle(-0.02)}
          >
            FLUX is an AI-powered decentralized payments ecosystem that brings intelligent automation and yield
            optimization to digital finance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12" style={getParallaxStyle(-0.01)}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all">
              <Brain className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">AI-Driven Optimization</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all">
              <Bitcoin className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">Bitcoin Ecosystem</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-300">Non-Custodial Security</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" style={getParallaxStyle(0)}>
            <Link
              href="/auth/organization"
              className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black px-8 py-4 rounded-lg font-medium hover:from-emerald-400 hover:to-emerald-500 transition-all transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <Link
              href="/demo"
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-medium border border-white/10 hover:bg-white/5 transition-all transform hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10">Watch Demo</span>
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
          </div>

          {/* Floating dashboard preview */}
          <div className="relative mt-20 max-w-5xl mx-auto" style={getParallaxStyle(0.05)}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 rounded-xl blur"></div>
            <div className="relative bg-black/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <div className="h-8 bg-black/80 border-b border-white/10 flex items-center px-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                </div>
                <div className="mx-auto text-xs text-zinc-400">FLUX Dashboard</div>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">Payment Schedule</h3>
                    <div className="text-xs text-emerald-400 flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      AI Optimized
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Payroll Distribution", amount: "$24,500", date: "May 30" },
                      { name: "Vendor Payment", amount: "$8,750", date: "Jun 02" },
                      { name: "Subscription Renewal", amount: "$1,200", date: "Jun 05" },
                    ].map((payment, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center p-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="text-xs">{payment.name}</div>
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-emerald-300">{payment.amount}</div>
                          <div className="text-xs text-zinc-500">{payment.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h3 className="text-sm font-medium mb-4">Yield Generation</h3>
                  <div className="h-32 relative">
                    <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
                      <div className="w-1/3 h-[60%] bg-gradient-to-t from-emerald-500/80 to-emerald-500/20 rounded-t"></div>
                      <div className="w-1/3 h-[75%] bg-gradient-to-t from-emerald-500/80 to-emerald-500/20 rounded-t"></div>
                      <div className="w-1/3 h-[90%] bg-gradient-to-t from-emerald-500/80 to-emerald-500/20 rounded-t"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/20"></div>
                    <div className="absolute bottom-1/3 left-0 right-0 h-[1px] bg-white/10"></div>
                    <div className="absolute bottom-2/3 left-0 right-0 h-[1px] bg-white/10"></div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-xs text-zinc-400">Current Yield</div>
                    <div className="text-xl font-bold text-emerald-400">4.2%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <div className="text-xs text-zinc-500 mb-2">Scroll to explore</div>
          <div className="h-6 w-[1px] bg-gradient-to-b from-emerald-500/0 to-emerald-500/50"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} id="features" className="py-32 border-t border-white/10 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">Revolutionary Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              Intelligent Financial Automation
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              FLUX combines AI intelligence with blockchain security to revolutionize how you manage recurring payments
              and financial workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Workflow,
                title: "Programmable Payments",
                description:
                  "Schedule and automate complex financial workflows—payroll, subscriptions, and invoice settlements—through smart contracts.",
              },
              {
                icon: Brain,
                title: "AI-Powered Optimization",
                description:
                  "Our AI system monitors scheduling logic, analyzes gas fees, and dispatches transactions at optimal times for cost-efficiency.",
              },
              {
                icon: Sparkles,
                title: "Passive Yield Generation",
                description:
                  "Idle funds reserved for future payments are automatically allocated to short-term liquidity strategies to earn passive yield.",
              },
              {
                icon: Layers,
                title: "Stacks Bitcoin L2 Integration",
                description: "Built on the Stacks Bitcoin Layer 2 ecosystem for maximum security and scalability.",
              },
              {
                icon: Shield,
                title: "Non-Custodial Security",
                description:
                  "All user funds remain non-custodial and are secured through audited smart contracts with transparent execution.",
              },
              {
                icon: Zap,
                title: "Webhook-Driven Triggers",
                description:
                  "Lightweight webhook server listens for on-chain events and user-defined conditions to trigger smart actions.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
              >
                <div className="relative mb-6 inline-block">
                  <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
                    <feature.icon className="h-6 w-6 text-emerald-400 relative z-10" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        ref={howItWorksRef}
        id="how-it-works"
        className="py-32 border-t border-white/10 bg-white/[0.02] relative"
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-4">
              <Cpu className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">Seamless Architecture</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              How FLUX Works
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Our decentralized architecture combines three powerful components to deliver a seamless payment
              experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {[
              {
                title: "Modern Web Application",
                description:
                  "User-friendly interface for scheduling and tracking transactions with real-time updates and analytics.",
                icon: Layers,
              },
              {
                title: "AI Agent",
                description:
                  "Performs automation and optimization logic in real-time, analyzing market conditions and adapting investment decisions.",
                icon: Brain,
              },
              {
                title: "Webhook Server",
                description:
                  "Connects blockchain events with off-chain decision-making systems to trigger smart contract executions.",
                icon: Zap,
              },
            ].map((component, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className="relative mb-6 inline-block">
                  <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
                    <component.icon className="h-6 w-6 text-emerald-400 relative z-10" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-300 transition-colors">
                  {component.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">{component.description}</p>

                {/* Connection line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent z-0"></div>
                )}
              </div>
            ))}
          </div>

          {/* Process steps */}
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/50 via-emerald-500/50 to-emerald-500/50 transform -translate-y-1/2 hidden lg:block"></div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "Connect Wallet",
                  description: "Link your wallet for secure access to the FLUX ecosystem",
                  icon: Wallet,
                },
                {
                  step: "02",
                  title: "Configure Workflow",
                  description: "Set up your payment schedule and automation rules",
                  icon: Clock,
                },
                {
                  step: "03",
                  title: "AI Optimization",
                  description: "Our AI analyzes and optimizes transaction timing and yield strategies",
                  icon: Brain,
                },
                {
                  step: "04",
                  title: "Automated Execution",
                  description: "Smart contracts execute payments while idle funds generate yield",
                  icon: Zap,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 backdrop-blur-sm"
                >
                  <div className="absolute -top-5 -left-5 h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-black flex items-center justify-center text-sm font-bold z-10">
                    {item.step}
                  </div>
                  <div
                    className="absolute -top-5 -left-5 h-10 w-10 rounded-full bg-emerald-400 blur-sm animate-pulse"
                    style={{ animationDuration: "3s" }}
                  ></div>

                  <div className="relative mb-6 inline-block">
                    <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
                      <item.icon className="h-6 w-6 text-emerald-400 relative z-10" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI Engine Section */}
      <section ref={aiEngineRef} id="ai-engine" className="py-32 border-t border-white/10 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-6">
                <Brain className="h-3.5 w-3.5 animate-pulse" style={{ animationDuration: "4s" }} />
                <span className="text-sm font-medium">Intelligent Decision Making</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                AI-Powered Financial Intelligence
              </h2>
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                FLUX's AI agent continuously monitors and optimizes your financial workflows, ensuring maximum
                efficiency and returns through sophisticated algorithms and real-time market analysis.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Smart Scheduling",
                    description:
                      "AI analyzes network conditions to execute transactions at optimal times for lowest gas fees.",
                    icon: Clock,
                  },
                  {
                    title: "Risk Management",
                    description:
                      "Intelligent risk assessment for yield strategies based on market conditions and user preferences.",
                    icon: Shield,
                  },
                  {
                    title: "Performance Adaptation",
                    description:
                      "Self-improving algorithms that learn from transaction history to enhance future decisions.",
                    icon: Repeat,
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group flex gap-5 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all hover:bg-white/[0.07]"
                  >
                    <div className="relative shrink-0">
                      <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
                        <feature.icon className="h-5 w-5 text-emerald-400 relative z-10" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1 group-hover:text-emerald-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-zinc-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* AI Visualization */}
              <div className="relative h-[500px] rounded-2xl bg-black/40 border border-white/10 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_70%)]"></div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <Brain className="h-24 w-24 text-emerald-500 relative z-10" />
                    <div
                      className="absolute -inset-8 rounded-full bg-emerald-500/20 blur-xl animate-pulse"
                      style={{ animationDuration: "4s" }}
                    ></div>
                  </div>
                </div>

                {/* Neural network visualization */}
                <div className="absolute inset-0 opacity-40">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-0.5 bg-gradient-to-r from-emerald-500 to-transparent"
                      style={{
                        width: `${Math.random() * 200 + 50}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                        opacity: Math.random() * 0.5 + 0.2,
                        animation: `pulse ${Math.random() * 4 + 2}s ease-in-out infinite`,
                      }}
                    />
                  ))}

                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute h-2 w-2 rounded-full bg-emerald-400"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        opacity: Math.random() * 0.7 + 0.3,
                        animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
                      }}
                    />
                  ))}
                </div>

                {/* Data points */}
                <div className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-xs text-zinc-400">AI Performance Metrics</div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <div className="text-xs text-emerald-400">Live</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Gas Optimization", value: "32.4%", trend: "up" },
                      { label: "Yield Efficiency", value: "96.7%", trend: "up" },
                      { label: "Risk Score", value: "Low", trend: "stable" },
                    ].map((metric, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <div className="text-xs text-zinc-500 mb-1">{metric.label}</div>
                        <div className="text-lg font-medium text-emerald-300">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-12 w-12 rounded-full border border-emerald-500/30 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border border-emerald-500/30 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-emerald-500/30"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 h-12 w-12 rounded-full border border-emerald-500/30 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border border-emerald-500/30 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-emerald-500/30"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yield Optimization Section */}
      <section ref={yieldRef} id="yield" className="py-32 border-t border-white/10 bg-white/[0.02] relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              {/* Yield Visualization */}
              <div className="relative h-[500px] rounded-2xl bg-black/40 border border-white/10 overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0,transparent_70%)]"></div>

                {/* Chart visualization */}
                <div className="absolute inset-0 flex items-end p-8">
                  <div className="w-full h-[70%] relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-full h-[1px] bg-white/10"
                          style={{ top: `${i * 25}%` }}
                        ></div>
                      ))}
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute h-full w-[1px] bg-white/10"
                          style={{ left: `${i * 16.6}%` }}
                        ></div>
                      ))}
                    </div>

                    {/* Chart line */}
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.5" />
                          <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,80 C10,75 20,85 30,70 C40,55 50,65 60,50 C70,35 80,45 90,30 C95,22 100,25 100,20"
                        fill="none"
                        stroke="rgb(16, 185, 129)"
                        strokeWidth="2"
                        className="animate-draw-line"
                      />
                      <path
                        d="M0,80 C10,75 20,85 30,70 C40,55 50,65 60,50 C70,35 80,45 90,30 C95,22 100,25 100,20 L100,100 L0,100 Z"
                        fill="url(#chartGradient)"
                        className="animate-fill-chart"
                      />
                    </svg>

                    {/* Data points */}
                    <div className="absolute h-full w-full">
                      {[80, 75, 85, 70, 55, 65, 50, 35, 45, 30, 20].map((y, i) => (
                        <div
                          key={i}
                          className="absolute h-3 w-3 rounded-full bg-emerald-500 border-2 border-black"
                          style={{
                            left: `${i * 10}%`,
                            top: `${y}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        >
                          <div className="absolute -inset-1 rounded-full bg-emerald-500/50 animate-ping opacity-75"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-4 left-4 text-sm font-medium text-emerald-400">Yield Optimization</div>
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-emerald-400">Live Optimization</span>
                </div>

                {/* Stats panel */}
                <div className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Current Yield", value: "4.2%", trend: "up" },
                      { label: "Total Generated", value: "$12,450", trend: "up" },
                      { label: "Efficiency", value: "98.3%", trend: "stable" },
                    ].map((metric, i) => (
                      <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <div className="text-xs text-zinc-500 mb-1">{metric.label}</div>
                        <div className="text-lg font-medium text-emerald-300">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full border border-emerald-500/30 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border border-emerald-500/30 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-emerald-500/30"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 h-12 w-12 rounded-full border border-emerald-500/30 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border border-emerald-500/30 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-emerald-500/30"></div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-6">
                <LineChart className="h-3.5 w-3.5 animate-pulse" style={{ animationDuration: "4s" }} />
                <span className="text-sm font-medium">Maximize Idle Capital</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                AI-Driven Liquidity Acquisition
              </h2>
              <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                FLUX's intelligent system automatically allocates idle funds to short-term liquidity strategies,
                generating passive yield while awaiting disbursement.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Dynamic Allocation",
                    description:
                      "AI continuously evaluates market conditions to allocate funds to the most profitable short-term strategies.",
                    icon: BarChart3,
                  },
                  {
                    title: "Risk-Adjusted Returns",
                    description:
                      "Sophisticated algorithms balance yield potential with risk tolerance and payment schedules.",
                    icon: Shield,
                  },
                  {
                    title: "Capital Efficiency",
                    description:
                      "Maximize the productivity of your capital without compromising availability for scheduled payments.",
                    icon: Landmark,
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group flex gap-5 p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all hover:bg-white/[0.07]"
                  >
                    <div className="relative shrink-0">
                      <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
                        <feature.icon className="h-5 w-5 text-emerald-400 relative z-10" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1 group-hover:text-emerald-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-zinc-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-1">
                    <Lightbulb className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-emerald-300 mb-1">Intelligent Yield Strategies</h4>
                    <p className="text-sm text-zinc-300">
                      FLUX's AI continuously monitors market conditions to maximize returns while maintaining the
                      liquidity needed for your scheduled payments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section ref={securityRef} id="security" className="py-32 border-t border-white/10 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-6">
            <Shield className="h-3.5 w-3.5 animate-pulse" style={{ animationDuration: "4s" }} />
            <span className="text-sm font-medium">Enterprise-Grade Protection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
            Secured by Blockchain Technology
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto backdrop-blur-sm mb-16 leading-relaxed">
            FLUX leverages the power of exSat network and Stacks Bitcoin Layer 2 ecosystem to ensure your funds remain
            secure, non-custodial, and under your control at all times.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Lock,
                title: "Audited Smart Contracts",
                description:
                  "All financial operations are executed through thoroughly audited smart contracts with transparent execution.",
              },
              {
                icon: Bitcoin,
                title: "Bitcoin L2 Security",
                description:
                  "Built on Stacks Bitcoin Layer 2 for the ultimate security and reliability of the Bitcoin network.",
              },
              {
                icon: Shield,
                title: "Non-Custodial Architecture",
                description:
                  "Your funds remain under your control at all times, with no central authority having access to your assets.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
              >
                <div className="relative mb-6 inline-block">
                  <div className="absolute -inset-2 rounded-full bg-emerald-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30">
                    <feature.icon className="h-6 w-6 text-emerald-400 relative z-10" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-emerald-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Security visual element */}
          <div className="relative max-w-md mx-auto">
            <div className="relative h-64 w-64 mx-auto">
              <div
                className="absolute inset-0 rounded-full bg-emerald-500/10 animate-pulse"
                style={{ animationDuration: "6s" }}
              ></div>
              <div
                className="absolute inset-4 rounded-full border border-emerald-500/30 animate-spin"
                style={{ animationDuration: "15s" }}
              ></div>
              <div
                className="absolute inset-8 rounded-full border border-emerald-500/20 animate-spin"
                style={{ animationDuration: "25s", animationDirection: "reverse" }}
              ></div>
              <div
                className="absolute inset-12 rounded-full border border-emerald-500/10 animate-spin"
                style={{ animationDuration: "35s" }}
              ></div>
              <div
                className="absolute inset-16 rounded-full border border-emerald-500/5 animate-spin"
                style={{ animationDuration: "45s", animationDirection: "reverse" }}
              ></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <Shield className="h-16 w-16 text-emerald-500 relative z-10" />
                  <div className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-lg"></div>
                </div>
              </div>
            </div>

            {/* Security badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {["256-bit Encryption", "Multi-sig Security", "Audited Contracts", "Decentralized Control"].map(
                (badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs text-zinc-300">{badge}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 border-t border-white/10 bg-white/[0.02] relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">Success Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              See how organizations are transforming their financial operations with FLUX's intelligent automation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "FLUX has revolutionized how we manage our payroll. The AI optimization has saved us thousands in gas fees while generating yield on our idle capital.",
                author: "Sarah Johnson",
                role: "CFO, TechVentures Inc.",
                rating: 5,
              },
              {
                quote:
                  "The security and transparency of FLUX gives us peace of mind. Our recurring payments are executed flawlessly, and the yield generation is an incredible bonus.",
                author: "Michael Chen",
                role: "Director of Finance, Quantum Solutions",
                rating: 5,
              },
              {
                quote:
                  "Implementing FLUX was seamless. The AI-driven optimization has exceeded our expectations, and the non-custodial architecture aligns perfectly with our security requirements.",
                author: "Elena Rodriguez",
                role: "Head of Operations, BlockFuture",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
              >
                <div className="flex mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-300 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <div className="font-medium text-white">{testimonial.author}</div>
                  <div className="text-sm text-zinc-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Stats */}
      <section className="py-20 border-t border-white/10 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Total Transactions", value: "1M+", icon: Repeat },
              { label: "Organizations", value: "500+", icon: Landmark },
              { label: "Avg. Yield Generated", value: "4.2%", icon: LineChart },
              { label: "Gas Fees Saved", value: "30%+", icon: Zap },
            ].map((stat, index) => (
              <div
                key={index}
                className="group text-center transform hover:scale-105 transition-transform p-8 rounded-xl backdrop-blur-sm hover:bg-white/5 border border-transparent hover:border-white/10"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 mb-4 border border-emerald-500/30">
                  <stat.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-white/10 bg-white/[0.02] relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 mb-6">
              <Rocket className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">Get Started Today</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              Ready to Transform Your Financial Operations?
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Join the decentralized finance revolution with FLUX's AI-powered payment ecosystem. Automate payments,
              earn yield, and maintain full control over your assets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/organization"
                className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black px-8 py-4 rounded-lg font-medium hover:from-emerald-400 hover:to-emerald-500 transition-all transform hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10">Get Started Now</span>
                <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/demo"
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-medium borderder border-white/10 hover:bg-white/5 transition-all transform hover:-translate-y-1 overflow-hidden"
              >
                <span className="relative z-10">Watch Demo</span>
                <ExternalLink className="h-4 w-4 relative z-10" />
                <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </div>

            {/* Additional CTA elements */}
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
              <Link href="/docs" className="flex items-center gap-1 hover:text-emerald-300 transition-colors">
                <span>Documentation</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
              <Link href="/case-studies" className="flex items-center gap-1 hover:text-emerald-300 transition-colors">
                <span>Case Studies</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
              <Link href="/partners" className="flex items-center gap-1 hover:text-emerald-300 transition-colors">
                <span>Partners</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-black/50 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-black" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">
                  FLUX
                </span>
              </div>
              <p className="text-sm text-zinc-400 mb-6">
                The AI-powered decentralized payments ecosystem built on exSat network and Stacks Bitcoin Layer 2.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-zinc-400 hover:text-emerald-300 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-emerald-300 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-zinc-400 hover:text-emerald-300 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase mb-4">Product</h3>
              <ul className="space-y-3">
                {["Features", "Security", "Pricing", "Case Studies", "Integrations", "API"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-emerald-300 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase mb-4">Resources</h3>
              <ul className="space-y-3">
                {["Documentation", "Guides", "Tutorials", "Blog", "Support Center", "Partners"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-emerald-300 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white uppercase mb-4">Company</h3>
              <ul className="space-y-3">
                {["About", "Team", "Careers", "Press", "Contact", "Legal"].map((item, i) => (
                  <li key={i}>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-emerald-300 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-zinc-500">© {new Date().getFullYear()} FLUX. All rights reserved.</div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-zinc-500 hover:text-emerald-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-zinc-500 hover:text-emerald-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-zinc-500 hover:text-emerald-300 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-100px) rotate(180deg);
          }
          100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.5;
          }
        }
        
        @keyframes pulseAndFloat {
          0% {
            transform: translate(-50%, -50%) translateY(0px) scale(1);
            opacity: 0.2;
          }
          25% {
            transform: translate(-50%, -50%) translateY(-50px) scale(1.3);
            opacity: 0.4;
          }
          50% {
            transform: translate(-50%, -50%) translateY(-70px) scale(1.1);
            opacity: 0.3;
          }
          75% {
            transform: translate(-50%, -50%) translateY(-30px) scale(1.2);
            opacity: 0.25;
          }
          100% {
            transform: translate(-50%, -50%) translateY(0px) scale(1);
            opacity: 0.2;
          }
        }
        
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes dash {
          to {
            stroke-dashoffset: 1000;
          }
        }
        
        @keyframes draw-line {
          0% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes fill-chart {
          0% {
            opacity: 0;
          }
          60% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-draw-line {
          animation: draw-line 3s ease-in-out forwards;
        }
        
        .animate-fill-chart {
          animation: fill-chart 4s ease-in-out forwards;
        }
        
        .animate-dash {
          stroke-dasharray: 5;
          animation: dash 20s linear infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 100%;
          animation: gradient-x 15s ease infinite;
        }
        
        .bg-gradient-radial {
          background-image: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
        }
        
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  )
}


// "use client";

// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import { ArrowRight, Wallet, Clock, LineChart, Shield, Boxes, Coins } from 'lucide-react';

// export default function Home() {
//   // For the floating particles animation
//   const [mounted, setMounted] = useState(false);
  
//   useEffect(() => {
//     setMounted(true);
    
//     // Clean up on unmount
//     return () => setMounted(false);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white relative overflow-hidden">
//       {/* Animated Background Elements */}
//       {mounted && (
//         <>
//           {/* Floating particles */}
//           <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             {Array.from({ length: 20 }).map((_, i) => (
//               <div 
//                 key={i}
//                 className="absolute rounded-full bg-emerald-500/20 blur-xl"
//                 style={{
//                   width: `${Math.random() * 300 + 100}px`,
//                   height: `${Math.random() * 300 + 100}px`,
//                   top: `${Math.random() * 100}%`,
//                   left: `${Math.random() * 100}%`,
//                   opacity: Math.random() * 0.3,
//                   animation: `float ${Math.random() * 20 + 20}s linear infinite`,
//                   animationDelay: `${Math.random() * 20}s`,
//                   transform: `translate(-50%, -50%)`
//                 }}
//               />
//             ))}
//           </div>
          
//           {/* Additional focused floating elements in the hero section */}
//           <div className="absolute inset-0 overflow-hidden pointer-events-none">
//             {/* Specifically positioned elements behind the hero title */}
//             <div 
//               className="absolute rounded-full bg-emerald-600/30 blur-xl"
//               style={{
//                 width: '400px',
//                 height: '400px',
//                 top: '40%',
//                 left: '30%',
//                 opacity: 0.25,
//                 animation: 'float 25s linear infinite',
//                 transform: 'translate(-50%, -50%)'
//               }}
//             />
//             <div 
//               className="absolute rounded-full bg-emerald-500/20 blur-xl"
//               style={{
//                 width: '300px',
//                 height: '300px',
//                 top: '35%',
//                 left: '70%',
//                 opacity: 0.3,
//                 animation: 'float 30s linear infinite reverse',
//                 animationDelay: '5s',
//                 transform: 'translate(-50%, -50%)'
//               }}
//             />
//             <div 
//               className="absolute rounded-full bg-emerald-700/25 blur-xl"
//               style={{
//                 width: '250px',
//                 height: '250px',
//                 top: '50%',
//                 left: '50%',
//                 opacity: 0.2,
//                 animation: 'pulseAndFloat 20s ease-in-out infinite',
//                 transform: 'translate(-50%, -50%)'
//               }}
//             />
            
//             {/* Smaller accent elements */}
//             <div 
//               className="absolute rounded-full bg-emerald-400/30 blur-md"
//               style={{
//                 width: '100px',
//                 height: '100px',
//                 top: '42%',
//                 left: '25%',
//                 opacity: 0.4,
//                 animation: 'pulse 8s ease-in-out infinite',
//                 transform: 'translate(-50%, -50%)'
//               }}
//             />
//             <div 
//               className="absolute rounded-full bg-emerald-300/20 blur-md"
//               style={{
//                 width: '80px',
//                 height: '80px',
//                 top: '38%',
//                 left: '80%',
//                 opacity: 0.3,
//                 animation: 'pulse 6s ease-in-out infinite',
//                 animationDelay: '2s',
//                 transform: 'translate(-50%, -50%)'
//               }}
//             />
//           </div>
          
//           {/* Grid overlay */}
//           <div 
//             className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
//             style={{
//               backgroundPosition: '0 0, 0 0',
//               opacity: 0.2
//             }}
//           />
          
//           {/* Radial gradient overlay */}
//           <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-70 pointer-events-none" />
//         </>
//       )}

//       {/* Header/Navigation */}
//       <header className="fixed top-0 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl z-50">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="relative">
//               <Coins className="h-6 w-6 text-emerald-500" />
//               <div className="absolute -inset-1 bg-emerald-500/30 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
//             </div>
//             <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-300">FLUX</span>
//           </div>
//           <nav className="hidden md:flex items-center gap-8">
//             <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">Features</Link>
//             <Link href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">How it Works</Link>
//             <Link href="#security" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">Security</Link>
//             <Link href="#faq" className="text-sm text-zinc-400 hover:text-white transition-colors hover:scale-105">FAQ</Link>
//           </nav>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="pt-32 pb-20 relative">
//         {/* Additional hero-specific glow effect */}
//         <div className="absolute left-1/2 top-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        
//         <div className="container mx-auto px-4 text-center relative z-10">
          
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-8 backdrop-blur-md hover:border-emerald-500/30 transition-colors">
//             <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse " style={{ animationDuration: '2s' }}></span>
//             <span className="text-sm">Powered by exSat</span>
//           </div>
//           <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-emerald-200 to-white/60 bg-clip-text text-transparent animate-gradient-x relative z-20">
//             Revolutionize Your Recurring Payments with Blockchain
//           </h1>
//           <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-12 backdrop-blur-sm">
//             FLUX is a decentralized platform that automates and secures your recurring payments using smart contracts on the exSat. Perfect for organizations managing employee payments.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               href="/auth/organization"
//               className="inline-flex items-center justify-center gap-2 bg-emerald-500 text-black px-8 py-3 rounded-lg font-medium hover:bg-emerald-400 transition-colors group hover:shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-1 transition-all"
//             >
//               Organization Login
//               <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//             </Link>
//             <Link
//               href="/auth/employee"
//               className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg font-medium border border-white/10 hover:bg-white/5 transition-colors hover:border-emerald-500/50 transform hover:-translate-y-1 transition-all"
//             >
//               Employee Login
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Features Grid */}
//       <section id="features" className="py-20 border-t border-white/10 relative">
//         <div className="container mx-auto px-4 relative z-10">
//           <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">Key Features</h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Clock,
//                 title: "Automated Payments",
//                 description: "Set up recurring payments with smart contracts that execute automatically and reliably."
//               },
//               {
//                 icon: LineChart,
//                 title: "Real-time Tracking",
//                 description: "Monitor payment status and history with real-time updates and detailed analytics."
//               },
//               {
//                 icon: Wallet,
//                 title: "RainbowKit Integration",
//                 description: "Seamless wallet connection and management with built-in RainbowKit support."
//               }
//             ].map((feature, index) => (
//               <div 
//                 key={index}
//                 className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 group"
//               >
//                 <div className="relative mb-4 inline-block">
//                   <feature.icon className="h-8 w-8 text-emerald-500 relative z-10" />
//                   <div className="absolute -inset-1 rounded-full bg-emerald-500/20 blur-sm transform scale-0 group-hover:scale-100 transition-transform duration-300"></div>
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-300 transition-colors">{feature.title}</h3>
//                 <p className="text-zinc-400">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="how-it-works" className="py-20 border-t border-white/10 bg-white/5 relative">
//         <div className="container mx-auto px-4 relative z-10">
//           <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">How It Works</h2>
//           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
//             {[
//               {
//                 step: "1",
//                 title: "Connect Wallet",
//                 description: "Link your wallet using RainbowKit for secure access",
//                 icon: Wallet
//               },
//               {
//                 step: "2",
//                 title: "Setup Payments",
//                 description: "Configure recurring payment details and schedule",
//                 icon: Clock
//               },
//               {
//                 step: "3",
//                 title: "Smart Contract",
//                 description: "Payments are automated via exSatsmart contracts",
//                 icon: Boxes
//               },
//               {
//                 step: "4",
//                 title: "Monitor",
//                 description: "Track and manage all payments in real-time",
//                 icon: LineChart
//               }
//             ].map((item, index) => (
//               <div key={index} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 backdrop-blur-sm">
//                 <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-emerald-500 text-black flex items-center justify-center text-sm font-bold z-10">
//                   {item.step}
//                 </div>
//                 <div className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-emerald-400 blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
//                 <item.icon className="h-8 w-8 mb-4 text-emerald-500" />
//                 <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
//                 <p className="text-zinc-400">{item.description}</p>
//                 {/* Connection line */}
//                 {index < 3 && (
//                   <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-transparent z-0"></div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Security Section */}
//       <section id="security" className="py-20 border-t border-white/10 relative">
//         <div className="container mx-auto px-4 text-center relative z-10">
//           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 mb-8 hover:bg-emerald-500/20 transition-colors">
//             <Shield className="h-4 w-4 animate-pulse" style={{ animationDuration: '4s' }} />
//             <span className="text-sm font-medium">Enterprise-Grade Security</span>
//           </div>
//           <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">Secured by Blockchain Technology</h2>
//           <p className="text-lg text-zinc-400 max-w-2xl mx-auto backdrop-blur-sm">
//             FLUX leverages the power of exSat and smart contracts to ensure your recurring payments are secure, transparent, and immutable.
//           </p>
          
//           {/* Added security visual element */}
//           <div className="mt-12 relative max-w-md mx-auto">
//             <div className="w-32 h-32 rounded-full bg-emerald-500/20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-xl animate-pulse" style={{ animationDuration: '6s' }}></div>
//             <div className="w-48 h-48 rounded-full border border-emerald-500/30 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '15s' }}></div>
//             <div className="w-64 h-64 rounded-full border border-emerald-500/20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
//             <Shield className="h-16 w-16 text-emerald-500 mx-auto relative" />
//           </div>
//         </div>
//       </section>

//       {/* Network Stats */}
//       <section className="py-20 border-t border-white/10 bg-white/5 relative">
//         <div className="container mx-auto px-4 relative z-10">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { label: "Total Transactions", value: "1M+" },
//               { label: "Organizations", value: "500+" },
//               { label: "Success Rate", value: "99.9%" },
//               { label: "GAS Processed", value: "100K+" }
//             ].map((stat, index) => (
//               <div key={index} className="text-center transform hover:scale-105 transition-transform p-6 rounded-xl backdrop-blur-sm hover:bg-white/5">
//                 <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">{stat.value}</div>
//                 <div className="text-sm text-zinc-400">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Add CSS animations */}
//       <style jsx global>{`
//         @keyframes float {
//           0% {
//             transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
//           }
//           50% {
//             transform: translate(-50%, -50%) translateY(-100px) rotate(180deg);
//           }
//           100% {
//             transform: translate(-50%, -50%) translateY(0px) rotate(360deg);
//           }
//         }
        
//         @keyframes pulse {
//           0%, 100% {
//             transform: translate(-50%, -50%) scale(1);
//             opacity: 0.3;
//           }
//           50% {
//             transform: translate(-50%, -50%) scale(1.5);
//             opacity: 0.5;
//           }
//         }
        
//         @keyframes pulseAndFloat {
//           0% {
//             transform: translate(-50%, -50%) translateY(0px) scale(1);
//             opacity: 0.2;
//           }
//           25% {
//             transform: translate(-50%, -50%) translateY(-50px) scale(1.3);
//             opacity: 0.4;
//           }
//           50% {
//             transform: translate(-50%, -50%) translateY(-70px) scale(1.1);
//             opacity: 0.3;
//           }
//           75% {
//             transform: translate(-50%, -50%) translateY(-30px) scale(1.2);
//             opacity: 0.25;
//           }
//           100% {
//             transform: translate(-50%, -50%) translateY(0px) scale(1);
//             opacity: 0.2;
//           }
//         }
        
//         @keyframes gradient-x {
//           0% {
//             background-position: 0% 50%;
//           }
//           50% {
//             background-position: 100% 50%;
//           }
//           100% {
//             background-position: 0% 50%;
//           }
//         }
        
//         .animate-gradient-x {
//           background-size: 200% 100%;
//           animation: gradient-x 15s ease infinite;
//         }
        
//         .bg-gradient-radial {
//           background-image: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
//         }
//       `}</style>
//     </div>
//   );
// }
