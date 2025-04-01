"use client";

import React, { useState } from 'react';
import ServicePageLayout from '@/components/ServicePageLayout';
import ServicePopup from '@/components/ServicePopup';

export default function TechSolutions() {
  const [selectedService, setSelectedService] = useState<{ title: string; textFileName: string } | null>(null);
  const backgroundImages = [
    '/backgrounds/tech1.jpeg',
    '/backgrounds/tech2.jpeg',
    '/backgrounds/tech3.jpeg',
    '/backgrounds/tech4.jpeg',
    '/backgrounds/tech5.jpeg'
  ];

  const services = [
    {
      title: "Web Development",
      description: "Custom websites and web applications tailored to your business needs.",
      textFileName: "websites.txt"
    },
    {
      title: "E-commerce Solutions",
      description: "Scalable online stores with secure payment processing and inventory management.",
      textFileName: "ecommerce.txt"
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android.",
      textFileName: "mobile.txt"
    },
    {
      title: "Software Development",
      description: "Custom software solutions to streamline your business operations.",
      textFileName: "software.txt"
    },
    {
      title: "IT Consulting",
      description: "Expert guidance on technology strategy and implementation.",
      textFileName: "it.txt"
    },
    {
      title: "Cloud Computing Solutions",
      description: "Cloud infrastructure setup, migration, and management services.",
      textFileName: "cloud.txt"
    },
    {
      title: "Data Analytics and Reporting",
      description: "Transform your data into actionable insights with advanced analytics.",
      textFileName: "data.txt"
    },
    {
      title: "Cybersecurity Services",
      description: "Protect your business with comprehensive security solutions.",
      textFileName: "security.txt"
    }
  ];

  return (
    <ServicePageLayout
      title="Tech Solutions by Buteos Systems"
      backgroundImages={backgroundImages}
    >
      <div className="space-y-8 font-[var(--font-markazi)]">
        <p className="text-xl text-gray-700">
          Our comprehensive tech solutions are designed to empower your business with cutting-edge technology and innovation.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedService({ title: service.title, textFileName: service.textFileName })}
            >
              <h2 className="text-2xl font-bold text-[#1a0033] mb-2">{service.title}</h2>
              <p className="text-lg text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center p-5 bg-gray-100 border-t border-gray-300">
        <p>This website was proudly developed by Buteos Systems using React and Next.js. We believe in open-source collaboration and transparency.</p>
        <a href="https://github.com/fairshoppe/fs-react" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View the source code on GitHub</a>
        </div>
      </div>

      <ServicePopup
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
        textFileName={selectedService?.textFileName || ''}
        title={selectedService?.title || ''}
      />
    </ServicePageLayout>
  );
} 