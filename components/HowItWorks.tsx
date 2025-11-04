import { MessageSquare, Zap, PenTool, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Enter Your Topic",
    description: "Simply type in any topic you want to learn about - from React Hooks to Ancient History.",
    step: "01",
  },
  {
    icon: PenTool,
    title: "Choose Difficulty",
    description: "Select easy, medium, or hard based on your current knowledge level.",
    step: "02",
  },
  {
    icon: Zap,
    title: "AI Generates Quiz",
    description: "Our AI creates a personalized 10-question quiz tailored to your specifications.",
    step: "03",
  },
  {
    icon: TrendingUp,
    title: "Track Your Progress",
    description: "Take the quiz, get instant feedback, and see your scores in your dashboard.",
    step: "04",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in just a few simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="relative text-center">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 text-6xl font-bold text-primary/10">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="relative w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <step.icon className="w-10 h-10 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
