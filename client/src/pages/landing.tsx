import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/Hand-drawn sketch in electric vivid colors, rough textured pencil strokes. White background. Stacked, three-dimensional prism with subtle grayscale planes and a faint teal edge_1752939852785.jpg";

export default function Landing() {
  return (
    <div className="bg-[var(--bg-primary)]">
      {/* Hero Section */}
      <section className="py-16 md:py-32 px-3 md:px-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="hero-headline mb-6 text-3xl md:text-5xl leading-tight">
                Take Your Program Knowledge Into Work Life
              </h1>
              
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 md:px-12 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:-translate-y-1 transition-all duration-300 min-w-[180px]"
              >
                Get Started
              </Button>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <img 
                src={heroImage} 
                alt="Hand-drawn cube illustration representing structured learning" 
                className="w-64 h-64 md:w-80 md:h-80 object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-3 md:px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              No More <span className="italic">"What Was That Tool Again?"</span>
            </h2>
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-medium">
              You've done the program. Now it's time to use it.
            </p>
          </div>
          
          <div className="bg-[var(--accent-yellow)] p-8 md:p-12 rounded-3xl text-center">
            <p className="text-xl md:text-2xl text-[var(--text-primary)] font-bold mb-6 max-w-3xl mx-auto">
              LevelUp helps you lead on purpose.
            </p>
            <p className="text-lg md:text-xl text-[var(--text-primary)] font-medium leading-relaxed max-w-3xl mx-auto">
              Not just get through the day, but grow your team, coach through the hard stuff, and build habits that make you proud of how you manage—not just what you deliver.
            </p>
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