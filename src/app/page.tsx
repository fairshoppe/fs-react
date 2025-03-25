import OpeningPanel from "@/components/OpeningPanel";
import Navbar from "@/components/Navbar";
import ServicePanel from "@/components/ServicePanel";
import ProductsPanel from "@/components/ProductsPanel";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="snap-y snap-mandatory h-screen overflow-y-auto">
        <div className="snap-start">
          <OpeningPanel />
        </div>
        <div className="snap-start">
          <ProductsPanel />
        </div>
        <div className="snap-start">
          <ServicePanel
            title="Tech Solutions"
            description="Innovative tech solutions tailored to your business needs. We provide cutting-edge technology solutions designed to empower your business and drive growth. Our team of experienced developers and engineers specializes in creating custom software, web applications, and digital platforms that address your unique challenges."
            buttonText="Explore Solutions"
            buttonLink="/tech-solutions"
            backgroundImages={[
              '/backgrounds/tech1.jpeg',
              '/backgrounds/tech2.jpeg',
              '/backgrounds/tech3.jpeg',
              '/backgrounds/tech4.jpeg',
              '/backgrounds/tech5.jpeg'
            ]}
            variant="tech"
          />
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
            backgroundImage="/backgrounds/contact1.jpeg"
            variant="contact"
          />
        </div>
      </main>
    </div>
  );
}
