import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/Hand-drawn sketch in electric vivid colors, rough textured pencil strokes. White background. Stacked, three-dimensional prism with subtle grayscale planes and a faint teal edge_1752939852785.jpg";

export default function Landing() {
  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="py-16 md:py-32 px-3 md:px-5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center md:text-left">
              <h1 className="hero-headline mb-6 text-3xl md:text-5xl leading-tight">
                Take Your Program Knowledge Into Work Life
              </h1>
              <p className="text-lg md:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto md:mx-0">Review and chat with program content on your terms.</p>
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 md:px-12 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-w-[180px]"
              >
                Get Started
              </Button>
            </div>
            
            {/* Right side - Logo and Hero image */}
            <div className="flex flex-col items-center md:items-end space-y-6">
              <div className="flex justify-center items-center">
                <span className="text-4xl md:text-6xl font-extrabold tracking-tight">
                  Level
                  <span className="relative inline-block">
                    <span className="z-10 relative">Up</span>
                    <span
                      className="absolute left-0 bottom-0 w-full h-1/2 bg-yellow-300 z-0 rounded"
                      style={{ height: '50%', bottom: 0, zIndex: 0 }}
                    ></span>
                  </span>
                </span>
              </div>
              <div className="relative">
                <img 
                  src={heroImage} 
                  alt="Colorful 3D cube representing structured learning and growth" 
                  className="w-64 md:w-80 lg:w-96 h-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-[var(--accent-yellow)] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-3 md:px-5">
          <h2 className="section-header text-center mb-12 md:mb-16">Learn What Matters</h2>
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 overflow-x-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--accent-yellow)] rounded-2xl flex items-center justify-center text-3xl font-black mb-6 mx-auto">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Foundations</h3>
              <p className="text-[var(--text-secondary)]">
                Master core principles to define your role and lead confidently
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--accent-yellow)] rounded-2xl flex items-center justify-center text-3xl font-black mb-6 mx-auto">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">Growing Teams</h3>
              <p className="text-[var(--text-secondary)]">
                Motivate, coach, and delegate effectively. Turn potential into performance.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[var(--accent-yellow)] rounded-2xl flex items-center justify-center text-3xl font-black mb-6 mx-auto">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Meeting People</h3>
              <p className="text-[var(--text-secondary)]">
                Master conversations that matter. Build influence through better communication.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-16 md:py-32 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto px-3 md:px-5">
          <h2 className="section-header text-center mb-12 md:mb-16">Simple by Design</h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto">
            <div className="bg-white p-8 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">Learn on the Go</h3>
              <p className="text-[var(--text-secondary)]">5-minute lessons with videos and podcasts for busy schedules.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">Get Personalized Guidance</h3>
              <p className="text-[var(--text-secondary)]">Chat with an AI mentor to tackle real-world challenges.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">Apply Skills Instantly</h3>
              <p className="text-[var(--text-secondary)]">Use microtools to put learning into action right away.</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 md:py-32 bg-[var(--accent-blue)] text-white">
        <div className="max-w-4xl mx-auto px-3 md:px-5 text-center">
          <h2 className="section-header mb-8 md:mb-12 text-white text-2xl md:text-4xl">
            Action Does Not Predict Happiness, But There Is No Happiness Without Action
          </h2>
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-[var(--accent-yellow)] text-[var(--text-primary)] px-8 md:px-12 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-w-[180px]"
          >
            Begin Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
}
