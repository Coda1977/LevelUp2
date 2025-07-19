import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/Hand-drawn sketch in electric vivid colors, rough textured pencil strokes. White background. Stacked, three-dimensional prism with subtle grayscale planes and a faint teal edge_1752939852785.jpg";

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

      {/* Redesigned Midsection */}
      <section className="bg-[#FFF9E9] w-full py-12 md:py-18 px-2 md:px-0">
        <div className="max-w-[960px] mx-auto flex flex-col items-center space-y-8 md:space-y-12">
          {/* Kicker */}
          <div className="uppercase tracking-wider font-semibold text-[13px] text-[#0B2F74]/70 mb-2">
            AFTER THE PROGRAM
          </div>
          {/* Headline (variant 1) */}
          <h2 className="font-extrabold text-[2.1rem] md:text-[2.5rem] text-center leading-tight mb-3">
            <span className="inline-block relative">
              Turn Every Tool Into Daily Habit
              <span
                className="absolute left-1/2 -translate-x-1/2 bottom-[-8px] w-2/5 h-1 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #FFD400 0%, #0B2F74 100%)",
                  opacity: 0.7,
                }}
                aria-hidden="true"
              />
            </span>
          </h2>
          {/* Subhead */}
          <p className="text-[18px] md:text-[20px] text-[#444] max-w-[650px] text-center leading-snug mb-8">
            Stop thinking “What was that framework again?” and actually use the methods when it counts.
          </p>

          {/* Value Card */}
          <div className="w-full flex flex-col md:flex-row items-center bg-[#FFE058] rounded-[20px] shadow-[0_4px_14px_rgba(0,0,0,0.06)] p-6 md:p-10 mb-10 relative overflow-hidden">
            {/* Left Accent Bar */}
            <div className="absolute left-0 top-6 bottom-6 w-1.5 rounded-full bg-gradient-to-b from-[#0B2F74] to-[#FFD400] md:static md:mr-8" aria-hidden="true" />
            {/* Icon */}
            <div className="flex-shrink-0 z-10 mb-4 md:mb-0 md:mr-8">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <svg aria-hidden="true" width="36" height="36" fill="none" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" stroke="#0B2F74" strokeWidth="2" fill="#FFD400" />
                  <path d="M12 18h12M18 12v12" stroke="#0B2F74" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            {/* Content */}
            <div className="flex-1 z-10">
              <h3 className="font-bold text-[22px] mb-2 text-[#111]">Lead on Purpose</h3>
              <p className="mb-3 text-[#222]">Build habits that stick and lead with intention every day.</p>
              <ul className="list-disc pl-5 space-y-1 text-[15px] text-[#222]">
                <li>Choose the right tool in the moment</li>
                <li>Coach through the tough conversations</li>
                <li>Build habits you’re proud of</li>
              </ul>
            </div>
            {/* Optional subtle texture */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "repeating-linear-gradient(135deg, #fff9e9 0 2px, transparent 2px 8px)",
              opacity: 0.05,
            }} aria-hidden="true" />
          </div>

          {/* Journey Features */}
          <div className="w-full flex flex-col items-center">
            {/* Progress line (Option A) */}
            <div className="relative w-full flex items-center justify-between mb-8 md:mb-10">
              <div className="absolute left-8 right-8 top-1/2 h-1 bg-[#0B2F74]/10 rounded-full z-0" />
              <div className="flex w-full justify-between z-10">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="w-10 h-10 bg-[#FFE058] border-2 border-[#0B2F74] rounded-full flex items-center justify-center font-bold text-[#0B2F74] text-lg shadow-sm" aria-label={`Step ${step}`} />
                ))}
              </div>
            </div>
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#0B2F74]">
                <div className="w-12 h-12 bg-[#FFE058] rounded-full flex items-center justify-center mb-3 border-2 border-[#0B2F74]">
                  <span className="text-[#0B2F74] text-xl font-bold" aria-hidden="true">▶</span>
                </div>
                <h4 className="font-semibold text-[18px] mb-1 text-center">Learn on the Go</h4>
                <p className="text-[15px] text-[#555] text-center mb-2">5‑min micro lessons fit the edges of your day.</p>
              </div>
              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#0B2F74]">
                <div className="w-12 h-12 bg-[#FFE058] rounded-full flex items-center justify-center mb-3 border-2 border-[#0B2F74]">
                  <span className="text-[#0B2F74] text-xl font-bold" aria-hidden="true">💬</span>
                </div>
                <h4 className="font-semibold text-[18px] mb-1 text-center">Personalized Guidance</h4>
                <p className="text-[15px] text-[#555] text-center mb-2">Chat with an AI mentor about real situations.</p>
              </div>
              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-[#0B2F74]">
                <div className="w-12 h-12 bg-[#FFE058] rounded-full flex items-center justify-center mb-3 border-2 border-[#0B2F74]">
                  <span className="text-[#0B2F74] text-xl font-bold" aria-hidden="true">📘</span>
                </div>
                <h4 className="font-semibold text-[18px] mb-1 text-center">Dive Deep</h4>
                <p className="text-[15px] text-[#555] text-center mb-2">Concise playbooks of the best management ideas.</p>
              </div>
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
