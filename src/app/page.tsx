"use client";

import OpeningPanel from "@/components/OpeningPanel";
import Navbar from "@/components/Navbar";
import ServicePanel from "@/components/ServicePanel";
import CompanyPanel from "@/components/CompanyPanel";
import FeaturePopup from "@/components/FeaturePopup";
import { useState, useEffect } from "react";

export default function Home() {
  const [showFeaturePopup, setShowFeaturePopup] = useState(false);

  useEffect(() => {
    // Show popup on every page load
    setShowFeaturePopup(true);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <FeaturePopup 
        open={showFeaturePopup} 
        onClose={() => setShowFeaturePopup(false)} 
      />
      <main className="snap-y snap-mandatory h-screen overflow-y-auto">
      <div className="snap-start">
          <CompanyPanel />
        </div>
        <div className="snap-start">
          <ServicePanel
            title="AI Agents by Buteos Systems"
            description="Artificial Itelligence agents represent a significant evolution in software technology. They function as autonomous programs capable of perceiving their environment, making informed decisions and executing actions to acheive specific objectives."
            buttonText="Explore Agents"
            buttonLink="/ai-page"
            backgroundImages={[
              
              '/backgrounds/tech4.jpeg',
              '/backgrounds/tech5.jpeg',
              '/backgrounds/tech1.jpeg',
              '/backgrounds/tech2.jpeg',
              '/backgrounds/tech3.jpeg'
            ]}
            variant="ai-agent"
          />
        </div>
        <div className="snap-start">
          <OpeningPanel />
        </div>
        <div className="snap-start">
          <ServicePanel
            title="Design & Consulting"
            description="Our design and consulting services are tailored to help you build a strong, impactful brand identity and achieve your business objectives. We combine creative expertise with strategic thinking to deliver compelling visual solutions and insightful guidance."
            buttonText="Get Started"
            buttonLink="/design-consulting"
            backgroundImages={[
              '/backgrounds/design1.jpeg',
              '/backgrounds/design2.jpeg',
              '/backgrounds/design3.jpeg',
              '/backgrounds/design4.jpeg',
              '/backgrounds/design5.jpeg'
            ]}
            variant="design"
          />
        </div>
        <div className="snap-start">
          <ServicePanel
            title="Contact Us"
            description="We're eager to connect with you and discuss how we can help you achieve your goals. Whether you have questions about our services, want to request a quote, or simply want to learn more about what we do, we're here to assist you."
            buttonText="Get in Touch"
            buttonLink="/contact"
            backgroundImage="/backgrounds/contact2.jpeg"
            variant="contact"
          />
        </div>
      </main>
    </div>
  );
}
