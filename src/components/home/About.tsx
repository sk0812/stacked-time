import Container from "../ui/Container";
import { Clock, Layers, CloudSun } from "lucide-react";
import Footer from "../layout/Footer";

const features = [
  {
    title: "Time is Money",
    description:
      "Stop guessing your work hours. Track time accurately and bill clients with confidence.",
    icon: <Clock className="w-6 h-6" />,
  },
  {
    title: "Multi-Project Ready",
    description:
      "Juggling multiple clients? Switch between projects with a single click.",
    icon: <Layers className="w-6 h-6" />,
  },
  {
    title: "Never Lose Track",
    description:
      "Cloud sync means your timers are always up to date across all your devices.",
    icon: <CloudSun className="w-6 h-6" />,
  },
];

export default function About() {
  return (
    <>
      <div className="bg-slate-100 relative py-20">
        <Container className="relative">
          {/* Stats Section */}
          <div className="stats shadow bg-white w-full mb-16">
            <div className="stat place-items-center">
              <div className="stat-title text-slate-600">Active Users</div>
              <div className="stat-value text-blue-600">2.5K+</div>
              <div className="stat-desc text-slate-500">
                From 100+ countries
              </div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title text-slate-600">Hours Tracked</div>
              <div className="stat-value text-blue-600">150K+</div>
              <div className="stat-desc text-slate-500">Last 30 days</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title text-slate-600">
                Client Satisfaction
              </div>
              <div className="stat-value text-blue-600">98%</div>
              <div className="stat-desc text-slate-500">Based on reviews</div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="card-body">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                    {feature.icon}
                  </div>
                  <h2 className="card-title text-slate-800">{feature.title}</h2>
                  <p className="text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}

          {/* CTA Section */}
          <div className="text-center">
            <div className="card bg-white shadow-lg max-w-2xl mx-auto">
              <div className="card-body items-center">
                <h2 className="card-title text-2xl text-slate-800 mb-2">
                  Ready to maximize your productivity?
                </h2>
                <p className="text-slate-600 mb-6">
                  Join thousands of professionals who've already streamlined
                  their time tracking.
                </p>
                <div className="card-actions">
                  <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white border-none">
                    Get Started
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-slate-500 mt-4">
                  100% Free Forever!
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
