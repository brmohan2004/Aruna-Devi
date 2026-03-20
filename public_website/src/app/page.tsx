"use client";

import { useState } from "react";
import Header from "@/app/components/landing_page/Header";
import Hero from "@/app/components/landing_page/Hero";
import SoftwareBar from "@/app/components/landing_page/SoftwareBar";
import Services from "@/app/components/landing_page/Services";
import Projects from "@/app/components/landing_page/Projects";
import About from "@/app/components/landing_page/About";
import Team from "@/app/components/landing_page/Team";
import Reviews from "@/app/components/landing_page/Reviews";
import Footer from "@/app/components/landing_page/Footer";
import BottomFooter from "@/app/components/landing_page/BottomFooter";
import CommunityPopup from "@/app/components/landing_page/CommunityPopup";

export default function Home() {
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);

  return (
    <>
      <Header onJoinCommunity={() => setIsCommunityOpen(true)} />
      <main>
        <Hero />
        <SoftwareBar />
        <Services />
        <Projects />
        <About onJoinCommunity={() => setIsCommunityOpen(true)} />
        <Team />
        <Reviews />
      </main>
      <Footer />
      <BottomFooter />

      <CommunityPopup
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
      />
    </>
  );
}
