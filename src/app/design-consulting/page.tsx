"use client";

import React from 'react';
import ServicePageLayout from '@/components/ServicePageLayout';

export default function DesignConsulting() {
  const backgroundImages = [
    '/backgrounds/design1.jpeg',
    '/backgrounds/design2.jpeg',
    '/backgrounds/design3.jpeg',
    '/backgrounds/design4.jpeg',
    '/backgrounds/design5.jpeg'
  ];

  const services = [
    {
      title: "Branding and Identity Design",
      description: "Create a distinctive brand identity that resonates with your target audience."
    },
    {
      title: "Graphic Design",
      description: "Eye-catching visuals for print and digital media that elevate your brand."
    },
    {
      title: "UI/UX Design",
      description: "Intuitive and engaging user interfaces that enhance user experience."
    },
    {
      title: "Web Design",
      description: "Beautiful, responsive websites that capture your brand essence."
    },
    {
      title: "Marketing Strategy",
      description: "Data-driven marketing plans to reach and engage your target market."
    },
    {
      title: "Content Strategy",
      description: "Strategic content planning and creation to tell your brand story."
    },
    {
      title: "Social Media Management",
      description: "Engaging social media presence to build and grow your community."
    },
    {
      title: "SEO and SEM",
      description: "Optimize your online presence for maximum visibility and reach."
    }
  ];

  return (
    <ServicePageLayout
      title="Design & Consulting"
      backgroundImages={backgroundImages}
    >
      <div className="space-y-8 font-[var(--font-markazi)]">
        <p className="text-xl text-gray-700">
          Our design and consulting services combine creative expertise with strategic thinking to help you build a strong, impactful brand identity.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold text-[#1a0033] mb-2">{service.title}</h2>
              <p className="text-lg text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </ServicePageLayout>
  );
} 