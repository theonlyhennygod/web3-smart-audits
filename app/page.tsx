import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, CheckCircle, Code, FileText, Shield, Zap, ChevronRight } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { SlideIn } from "@/components/animations/slide-in"
import { StaggerChildren, StaggerItem } from "@/components/animations/stagger-children"
import { ScaleIn } from "@/components/animations/scale-in"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section - Updated Styling */}
        <section className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden"> {/* Adjusted padding */}
          {/* Enhanced Background Elements */}
          <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
              <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
              <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
          </div>
           <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:30px_30px] mask-gradient-hero" /> {/* Adjusted grid size and added mask */}
          <div className="container relative z-10">
            {/* Centered content with adjusted max-width */}
            <div className="max-w-4xl mx-auto text-center space-y-8"> {/* Increased spacing */}
              <FadeIn delay={0.1}>
                 {/* Slightly smaller badge */}
                <Badge variant="outline" className="mb-4 border-border bg-background/50 backdrop-blur-sm">
                  Now supporting Polkadot parachains
                </Badge>
              </FadeIn>
              <SlideIn direction="up" delay={0.2}>
                {/* Updated Headline */}
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
                  Secure Your Smart Contracts, <span className="gradient-text">Instantly</span>.
                </h1>
              </SlideIn>
              <FadeIn delay={0.3}>
                 {/* Updated Description */}
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
                  Automated security audits and cost analysis for EVM & Polkadot contracts. Get peace of mind in seconds.
                 </p>
               </FadeIn>
               {/* Add CTA Buttons */}
               <FadeIn delay={0.4}>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Button size="lg" asChild>
                     <Link href="/analyze">
                       Get Started <ArrowRight className="ml-2 h-4 w-4" />
                     </Link>
                   </Button>
                   {/* Add Secondary Button */}
                   <Button size="lg" variant="outline" asChild>
                     <Link href="/marketplace">
                       Browse Marketplace
                     </Link>
                   </Button>
                 </div>
               </FadeIn>
               {/* Placeholder for Animated Dashboard Preview */}
               <FadeIn delay={0.5}> {/* Adjusted delay */}
                 <div className="mt-12 aspect-video w-full max-w-3xl mx-auto bg-background/40 border border-border/50 rounded-lg shadow-lg flex items-center justify-center backdrop-blur-sm"> {/* Increased margin-top and max-width, adjusted styling */}
                   <p className="text-muted-foreground">[Animated Dashboard Preview Here]</p>
                 </div>
               </FadeIn>
             </div>
           </div>
        </section>

        {/* Roadmap Section - Updated Styling (Removed bg-muted/30) */}
        <section className="relative py-20 md:py-28 overflow-hidden"> {/* Match hero padding and add relative/overflow */}
          {/* Add Background Elements */}
          <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20 dark:opacity-10"> {/* Reduced opacity */}
              <div className="blur-[106px] h-56 bg-gradient-to-br from-purple-400 to-primary dark:from-blue-700"></div> {/* Swapped colors slightly */}
              <div className="blur-[106px] h-32 bg-gradient-to-r from-sky-300 to-cyan-400 dark:to-indigo-600"></div> {/* Swapped colors slightly */}
          </div>
           <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:30px_30px] mask-gradient-roadmap" /> {/* Adjusted grid opacity and mask class */}
          <div className="container relative z-10"> {/* Add relative z-10 */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Roadmap</h2>
                <p className="text-muted-foreground text-lg">
                  Our journey to build the most comprehensive smart contract security platform
                </p>
              </FadeIn>
            </div>
            <div className="relative">
              {/* Restore Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-secondary/30 via-primary/30 to-accent/30" />

              {/* Restore vertical alternating layout */}
              <StaggerChildren className="relative z-10">
                 {[
                  {
                    title: "Phase 1: Launch",
                    description: "Initial platform launch with basic contract analysis and vulnerability detection.",
                    date: "Q2 2025",
                    icon: <Zap className="h-6 w-6" />,
                    color: "secondary", // Use color for badge/icon background
                  },
                  {
                    title: "Phase 2: Advanced Analysis",
                    description: "Enhanced analysis engine with AI-powered vulnerability detection.",
                    date: "Q3 2025",
                    icon: <Shield className="h-6 w-6" />,
                    color: "primary",
                  },
                  {
                    title: "Phase 3: Marketplace",
                    description: "Launch of the auditor marketplace with bounty system.",
                    date: "Q4 2025",
                    icon: <Code className="h-6 w-6" />,
                    color: "accent",
                  },
                  {
                    title: "Phase 4: Enterprise",
                    description: "Enterprise solutions with custom audit workflows and team collaboration.",
                    date: "Q1 2026",
                    icon: <FileText className="h-6 w-6" />,
                    color: "blue-500", // Use Tailwind color name directly
                  },
                ].map((phase, index) => (
                  <StaggerItem key={index}>
                    {/* Restore alternating flex layout */}
                    <div className={`flex ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-center mb-12 group`}>
                      {/* Content Block */}
                      <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}>
                         {/* Use Card for content styling */}
                        <Card className="inline-block p-6 bg-background/60 backdrop-blur-sm border-border/50 group-hover:border-border transition-colors">
                          <div className="mb-2">
                            {/* Use Tailwind classes directly for badge color */}
                            <Badge variant="outline" className={`border-border bg-${phase.color}/10 text-${phase.color}`}>
                              {phase.date}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
                          <p className="text-muted-foreground">{phase.description}</p>
                        </Card>
                      </div>
                      {/* Central Icon */}
                      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                         {/* Use Tailwind classes directly for icon background */}
                        <div className={`w-12 h-12 rounded-full bg-${phase.color} flex items-center justify-center text-primary-foreground shadow-lg border-4 border-background`}>
                          {phase.icon}
                        </div>
                      </div>
                      {/* Spacer */}
                      <div className="w-1/2"></div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            </div>
          </div>
        </section>

        {/* Features Section - Updated Styling (Removed section background) */}
        <section className="relative py-20 md:py-28 overflow-hidden"> {/* Add relative/overflow and match padding */}
           {/* Add Background Elements (Subtler) */}
           <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-10 dark:opacity-5">
              <div className="blur-[106px] h-32 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
              <div className="blur-[106px] h-24 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
          </div>
           <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] mask-gradient-features" /> {/* Define mask-gradient-features later */}
          <div className="container relative z-10"> {/* Add relative z-10 */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                <p className="text-muted-foreground text-lg">
                  Our platform makes smart contract security accessible to everyone
                </p>
              </FadeIn>
            </div>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StaggerItem>
                 {/* Updated Card Styling */}
                <Card className="h-full bg-background/60 backdrop-blur-sm border-border/50 hover:border-secondary/70 transition-colors text-left">
                  <CardHeader>
                     {/* Adjusted Icon Container */}
                    <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 border border-secondary/20">
                      <FileText className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle>1. Submit</CardTitle> {/* Added Numbering */}
                    <CardDescription>Provide your contract code or address</CardDescription>
                  </CardHeader>
                  <CardContent>
                     {/* Simplified list */}
                    <p className="text-muted-foreground">
                      Easily upload Solidity, ink!, or Rust code, or simply provide a deployed contract address on supported chains. Optionally add a bounty to attract auditors.
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
              <StaggerItem>
                 {/* Updated Card Styling */}
                <Card className="h-full bg-background/60 backdrop-blur-sm border-border/50 hover:border-primary/70 transition-colors text-left">
                   <CardHeader>
                     {/* Adjusted Icon Container */}
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 border border-primary/20">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>2. Audit</CardTitle> {/* Added Numbering */}
                    <CardDescription>Receive instant analysis & insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                     {/* Simplified list */}
                     <p className="text-muted-foreground">
                       Our engine performs static analysis and (soon) AI-powered checks, plus gas/weight simulation, delivering a risk score and actionable findings.
                     </p>
                  </CardContent>
                </Card>
              </StaggerItem>
              <StaggerItem>
                 {/* Updated Card Styling */}
                <Card className="h-full bg-background/60 backdrop-blur-sm border-border/50 hover:border-accent/70 transition-colors text-left">
                   <CardHeader>
                     {/* Adjusted Icon Container */}
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 border border-accent/20">
                      <Zap className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle>3. Earn</CardTitle> {/* Added Numbering */}
                    <CardDescription>Auditors can earn bounties</CardDescription>
                  </CardHeader>
                  <CardContent>
                     {/* Simplified list */}
                     <p className="text-muted-foreground">
                       Browse the marketplace, find contracts with bounties, submit your findings, and get rewarded for enhancing Web3 security.
                     </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            </StaggerChildren>
            <div className="mt-12 text-center">
              <ScaleIn delay={0.6}>
                <Button size="lg" asChild className="animate-pulse-slow">
                  <Link href="/analyze">
                    Start Analyzing Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </ScaleIn>
            </div>
          </div>
        </section>

        {/* For Auditors Section - Updated Styling (Removed bg-muted/30) */}
        <section className="relative py-20 md:py-28 overflow-hidden"> {/* Add relative/overflow and match padding */}
           {/* Add Background Elements (Mirrored) */}
           <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-10 dark:opacity-5">
              <div className="blur-[106px] h-32 bg-gradient-to-l from-cyan-400 to-sky-300 dark:to-indigo-600"></div> {/* Mirrored gradient */}
              <div className="blur-[106px] h-56 bg-gradient-to-bl from-primary to-purple-400 dark:from-blue-700"></div> {/* Mirrored gradient */}
          </div>
           <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px] mask-gradient-auditors" /> {/* Define mask-gradient-auditors later */}
          <div className="container relative z-10"> {/* Add relative z-10 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <SlideIn direction="left">
                <div>
                  <Badge className="mb-4 bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors">
                    For Security Auditors
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Earn Bounties for Your Expertise</h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    Join our network of security auditors and earn bounties by reviewing smart contracts and identifying
                    vulnerabilities that our automated tools might miss.
                  </p>
                  <ul className="space-y-4 mb-8">
                    {[
                      "Access to a steady stream of contracts to review",
                      "Earn bounties for finding critical vulnerabilities",
                      "Build your reputation in the Web3 security space",
                      "Flexible work schedule and remote opportunities",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 text-secondary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild>
                    <Link href="/auditors/apply">Apply as an Auditor</Link>
                  </Button>
                </div>
              </SlideIn>
              <SlideIn direction="right">
                 {/* Updated Card Styling */}
                <div className="bg-background/60 backdrop-blur-sm rounded-lg p-8 border border-border/50">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       {/* Adjusted Icon Container */}
                      <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
                        <Code className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Review Contracts</h3>
                        <p className="text-sm text-muted-foreground">Analyze contracts for vulnerabilities</p> {/* Slightly shorter */}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       {/* Adjusted Icon Container */}
                      <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20">
                        <Shield className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium">Report Issues</h3>
                        <p className="text-sm text-muted-foreground">Document findings with detailed reports</p> {/* Slightly shorter */}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       {/* Adjusted Icon Container */}
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Earn Rewards</h3>
                        <p className="text-sm text-muted-foreground">Get paid for each verified vulnerability</p>
                      </div>
                    </div>
                  </div>
                </div>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* CTA Section - Updated Styling (Removed section background) */}
        <section className="relative py-20 md:py-28 overflow-hidden"> {/* Add relative/overflow and match padding */}
           {/* Add Background Elements (Similar to Hero) */}
           <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
              <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
              <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
          </div>
           <div className="absolute inset-0 bg-grid-white/[0.04] bg-[size:30px_30px] mask-gradient-cta" /> {/* Define mask-gradient-cta later */}
          <div className="container relative z-10"> {/* Add relative z-10 */}
            <ScaleIn>
               {/* Add Card Styling */}
              <div className="max-w-4xl mx-auto text-center space-y-6 bg-background/60 backdrop-blur-sm border border-border/50 p-8 md:p-12 rounded-lg">
                <h2 className="text-3xl md:text-4xl font-bold">Ready to Secure Your Smart Contracts?</h2>
                <p className="text-xl text-muted-foreground">
                  Get instant security analysis and cost optimization for your smart contracts today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                   {/* Updated Button Text */}
                  <Button size="lg" asChild className="animate-pulse-slow">
                    <Link href="/analyze">
                      Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                   {/* Removed "Try Without Account" button for simplicity */}
                  {/* <Button size="lg" variant="outline" asChild>
                    <Link href="/analyze">Try Without Account</Link>
                  </Button> */}
                </div>
              </div>
            </ScaleIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
