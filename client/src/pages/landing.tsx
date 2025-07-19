import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/Hand-drawn sketch in electric vivid colors, rough textured pencil strokes. White background. Stacked, three-dimensional prism with subtle grayscale planes and a faint teal edge_1752939852785.jpg";
import { useEffect, useRef, useState } from "react";

function useScrollFadeIn(): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, isVisible];
}

export default function Landing() {
  const [heroRef, heroVisible] = useScrollFadeIn();
  const [featuresRef, featuresVisible] = useScrollFadeIn();
  const [designRef, designVisible] = useScrollFadeIn();
  const [ctaRef, ctaVisible] = useScrollFadeIn();
  return (
    <div className="bg-[#F5F5F0]">
      {/* Hero Section */}
      <section ref={heroRef} className={`relative py-20 md:py-32 px-3 md:px-5 overflow-hidden transition-opacity duration-700 ${heroVisible ? 'animate-fade-in opacity-100' : 'opacity-0'}`}>
        {/* Gradient Accent */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
          <div className="w-full h-full bg-gradient-to-br from-blue-100/60 via-yellow-50/60 to-transparent" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 text-left">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 text-black">
                Transforming Insight<br />into Action
              </h1>
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="bg-blue-700 text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-[#FFD700] hover:text-black transition-colors duration-200 focus:ring-4 focus:ring-blue-200"
              >
                Get Started
              </Button>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="bg-[#F0EDE6] p-8 rounded-3xl shadow-lg">
                <img
                  src={heroImage}
                  alt="Hand-drawn cube illustration representing structured learning"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className={`py-20 md:py-28 bg-gradient-to-b from-[#F5F5F0] to-white transition-opacity duration-700 ${featuresVisible ? 'animate-fade-in opacity-100' : 'opacity-0'}`}>
        <div className="max-w-3xl mx-auto px-3 md:px-5 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-black relative inline-block">
            No More <span className="italic">"What Was That Tool Again?"</span>
            <span className="block h-1 w-2/3 mx-auto mt-2 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"></span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-xl">
            You've done the program. Now it's time to use it.
          </p>

          <div className="relative w-full max-w-2xl">
            <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-[#FFD700] w-2 md:w-3 flex-shrink-0"></div>
              <div className="p-6 md:p-8 flex-1 text-left">
                <div className="font-bold text-xl md:text-2xl text-black mb-2">
                  LevelUp helps you lead on purpose.
                </div>
                <div className="text-gray-700 text-base md:text-lg">
                  Not just get through the day, but grow your team, coach through the hard stuff, and build habits that make you proud of how you manage—not just what you deliver.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple by Design Section */}
      <section ref={designRef} className={`py-20 md:py-28 bg-[#F5F5F0] transition-opacity duration-700 ${designVisible ? 'animate-fade-in opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto px-3 md:px-5">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-black">
            Simple by Design
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Add extra margin below for breathing room on mobile */}
            {/* Card 1 */}
            <div className="text-center transition-transform duration-200 hover:-translate-y-2 hover:shadow-xl hover:bg-blue-50 rounded-2xl">
              <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Learn on the Go</h3>
              <p className="text-gray-600 text-sm">
                5-minute lessons with videos and podcasts for busy schedules.
              </p>
            </div>

            {/* Card 2 */}
            <div className="text-center transition-transform duration-200 hover:-translate-y-2 hover:shadow-xl hover:bg-blue-50 rounded-2xl">
              <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Personalized Guidance</h3>
              <p className="text-gray-600 text-sm">
                Chat with an AI mentor to tackle real situations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="text-center transition-transform duration-200 hover:-translate-y-2 hover:shadow-xl hover:bg-blue-50 rounded-2xl">
              <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-lg">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Dive Deep</h3>
              <p className="text-gray-600 text-sm">
                Long-form summaries of the greatest management books.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className={`py-20 md:py-28 bg-[#1B365D] transition-opacity duration-700 ${ctaVisible ? 'animate-fade-in opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto px-3 md:px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white leading-tight">
            Action Does Not Predict Happiness, But There Is No<br />Happiness Without Action
          </h2>
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-[#FFD700] text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-700 hover:text-white transition-colors duration-200 focus:ring-4 focus:ring-yellow-200"
          >
            Begin Your Journey
          </Button>
        </div>
      </section>
      {/* Sticky CTA for mobile */}
      <div className="fixed bottom-4 left-0 w-full flex justify-center z-50 md:hidden pointer-events-none">
        <button
          onClick={() => window.location.href = "/api/login"}
          className="pointer-events-auto bg-blue-700 text-white font-bold px-8 py-3 rounded-full shadow-lg text-lg hover:bg-[#FFD700] hover:text-black transition-colors duration-200 focus:ring-4 focus:ring-blue-200"
          style={{maxWidth: '90vw'}}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}