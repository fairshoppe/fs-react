"use client";

import React from 'react';
import ServicePageLayout from '@/components/ServicePageLayout';

export default function TechSolutions() {
  const backgroundImages = [
    '/backgrounds/tech4.jpeg',
    '/backgrounds/tech5.jpeg',
    '/backgrounds/tech1.jpeg',
    '/backgrounds/tech2.jpeg',
    '/backgrounds/tech3.jpeg'
  ];

  const services = [
    {
      title: "Customer Service and Support",
      description: "Handle customer inquiries, provide product information, resolve isssues, offer technical support"
    },
    {
      title: "Productivity and Assistants",
      description: "Manage schedules, automate routine tasks, summarize documents, assist with research"
    },
    {
      title: "Data Analysis and Reporting",
      description: "Financial forecasting, market analysis, risk assesment, scientific data interpretation"
    },
    {
      title: "Content Creation and Marketing",
      description: "Writing marketing copy, creating social media posts, generate product descriptions, generate images"
    },
    {
      title: "Industry-Specific Needs",
      description: "Domain specific knowledge, regulatory compliance, industry specific software and system integrations"
    },
    {
      title: "Unlimited Options",
      description: "The applications and uses of AI agents are near limitless. Let's create together!"
    },
  ];

  return (
    <ServicePageLayout
      title="AI Agents by Buteos Systems"
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
        <div className="text-center p-5 bg-gray-100 border-t border-gray-300">
        <p>This website was proudly developed by Buteos Systems using React and Next.js. We believe in open-source collaboration and transparency.</p>
        <a href="https://github.com/fairshoppe/fs-react" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View the source code on GitHub</a>
        </div>
      </div>
    </ServicePageLayout>
  );
} 