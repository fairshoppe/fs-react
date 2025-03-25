"use client";

import React from 'react';
import ServicePageLayout from '@/components/ServicePageLayout';

export default function TechSolutions() {
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
      description: "Custom websites and web applications tailored to your business needs."
    },
    {
      title: "E-commerce Solutions",
      description: "Scalable online stores with secure payment processing and inventory management."
    },
    {
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android."
    },
    {
      title: "Software Development",
      description: "Custom software solutions to streamline your business operations."
    },
    {
      title: "IT Consulting",
      description: "Expert guidance on technology strategy and implementation."
    },
    {
      title: "Cloud Computing Solutions",
      description: "Cloud infrastructure setup, migration, and management services."
    },
    {
      title: "Data Analytics and Reporting",
      description: "Transform your data into actionable insights with advanced analytics."
    },
    {
      title: "Cybersecurity Services",
      description: "Protect your business with comprehensive security solutions."
    }
  ];

  return (
    <ServicePageLayout
      title="Tech Solutions"
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