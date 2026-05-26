import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { AboutBook } from "@/components/sections/AboutBook";
import { WhoFor } from "@/components/sections/WhoFor";
import { Klarify } from "@/components/sections/Klarify";
import { Foreword } from "@/components/sections/Foreword";
import { Author } from "@/components/sections/Author";
import { Launch } from "@/components/sections/Launch";
import { SocialProof } from "@/components/sections/SocialProof";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <AboutBook />
        <WhoFor />
        <Klarify />
        <Foreword />
        <Author />
        <Launch />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
