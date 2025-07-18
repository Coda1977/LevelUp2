import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="py-16 md:py-32 px-3 md:px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hero-headline mb-6 text-3xl md:text-5xl leading-tight">
            Take Your Program Knowledge Into Work Life
          </h1>
          <p className="text-lg md:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
            Review and chat with program materials on your terms and your situation.
          </p>
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 md:px-12 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-w-[180px]"
          >
            Get Started
          </Button>
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
                Core principles every manager needs. Define your role and build confidence.
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
              <h3 className="text-xl font-bold mb-3">Short Lessons</h3>
              <p className="text-[var(--text-secondary)]">5min. lessons with videos and podcasts for learners</p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">AI Coach</h3>
              <p className="text-[var(--text-secondary)]">Chat with program materials</p>
            </div>
            <div className="bg-white p-8 rounded-2xl text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">Microtools</h3>
              <p className="text-[var(--text-secondary)]">Small tools to use on a daily basis</p>
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
