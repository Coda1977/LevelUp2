import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/Hand-drawn sketch in electric vivid colors, rough textured pencil strokes. White background. Stacked, three-dimensional prism with subtle grayscale planes and a faint teal edge_1752939852785.jpg";

export default function Landing() {
  return (
    <div className="bg-[#F5F5F0]">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-3 md:px-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 text-left">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-8 text-black">
                Transforming Insight<br />into Action
              </h1>
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="bg-black text-white px-8 py-3 rounded-full font-medium text-lg hover:bg-gray-800"
              >
                Get Started
              </Button>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="bg-[#F0EDE6] p-8 rounded-3xl shadow-lg">
                <img 
                  src={heroImage} 
                  alt="Hand-drawn cube illustration representing structured learning" 
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-3 md:px-5 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            No More <span className="italic">"What Was That Tool Again?"</span>
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            You've done the program. Now it's time to use it.
          </p>
          
          <div className="bg-[#FFD700] p-8 md:p-12 rounded-2xl text-center max-w-2xl mx-auto">
            <p className="text-lg font-bold text-black mb-4">
              LevelUp helps you lead on purpose.
            </p>
            <p className="text-sm text-black leading-relaxed">
              Not just get through the day, but grow your team, coach through the hard stuff, and build habits that make you proud of how you manage—not just what you deliver.
            </p>
          </div>
        </div>
      </section>

      {/* Simple by Design Section */}
      <section className="py-16 md:py-24 bg-[#F5F5F0]">
        <div className="max-w-6xl mx-auto px-3 md:px-5">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-black">
            Simple by Design
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-lg">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Learn on the Go</h3>
              <p className="text-gray-600 text-sm">
                5-minute lessons with videos and podcasts for busy schedules.
              </p>
            </div>

            {/* Card 2 */}
            <div className="text-center">
              <div className="w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-black font-bold text-lg">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">Personalized Guidance</h3>
              <p className="text-gray-600 text-sm">
                Chat with an AI mentor to tackle real situations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="text-center">
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
      <section className="py-16 md:py-24 bg-[#1B365D]">
        <div className="max-w-4xl mx-auto px-3 md:px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white leading-tight">
            Action Does Not Predict Happiness, But There Is No<br />Happiness Without Action
          </h2>
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-[#FFD700] text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400"
          >
            Begin Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
}