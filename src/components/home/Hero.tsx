"use client";

import Link from "next/link";
import Container from "../ui/Container";

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 relative min-h-screen">
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>

      {/* Navbar integrated into hero */}
      <div className="relative">
        <Container>
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="text-2xl font-bold text-white">
              TimeStack
            </Link>
            <Link
              href="/auth"
              className="btn btn-ghost border border-white/20 text-white hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </Container>
        {/* Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <Container className="relative">
        <div className="min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-24">
          {/* Text Content */}
          <div className="text-left space-y-8 lg:space-y-10 pt-20 lg:pt-0">
            {/* Content wrapper with reduced gap */}
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-200/10 backdrop-blur-sm">
                <span className="w-3 h-3 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-base text-blue-200 font-medium">
                  Smart Time Tracking
                </span>
              </div>

              <div className="space-y-6 lg:space-y-8">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                  Track Time
                  <span className="block">
                    <span className="text-sky-400">Stack Success</span>
                  </span>
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-blue-50/90 max-w-2xl leading-relaxed">
                  The perfect timer solution for freelancers juggling multiple
                  projects. Track time effortlessly and maximize your
                  productivity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 lg:pt-6">
                <button className="btn btn-primary bg-white text-blue-900 hover:bg-blue-50 border-none btn-lg w-full sm:w-auto text-lg px-8">
                  Start Tracking
                  <svg
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </button>
                <button className="btn btn-outline text-white hover:bg-white hover:text-blue-900 btn-lg w-full sm:w-auto text-lg px-8">
                  Learn More
                </button>
              </div>

              {/* Feature Mini Cards - Replacing Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 lg:pt-10 border-t border-white/10">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white">
                      Precise Tracking
                    </h3>
                  </div>
                  <p className="text-sm text-blue-200/80">
                    Track time down to the second with automatic syncing
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white">Project Groups</h3>
                  </div>
                  <p className="text-sm text-blue-200/80">
                    Sort timers by client or project type for better
                    organisation
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <svg
                        className="w-5 h-5 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-white">Export Reports</h3>
                  </div>
                  <p className="text-sm text-blue-200/80">
                    Generate detailed reports for billing and analysis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Mockup */}
          <div className="flex justify-center lg:justify-end order-first lg:order-last">
            <div className="relative w-full max-w-lg lg:max-w-xl">
              {/* Decorative elements */}
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-xl hidden sm:block"></div>
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl hidden sm:block"></div>

              <div className="mockup-browser bg-slate-950 border border-slate-800">
                <div className="mockup-browser-toolbar"></div>
                <div className="bg-slate-900 px-6 py-8">
                  {/* Timer Cards Grid */}
                  <div className="space-y-4">
                    {/* Today's Date */}
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-slate-200 text-lg font-medium">
                        Today's Timers
                      </h2>
                      <span className="text-slate-400 text-sm">
                        Mon, 18 March
                      </span>
                    </div>

                    {/* Active Timer Card */}
                    <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl border border-blue-500/20 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-blue-100 font-medium text-lg">
                            Mobile App Development
                          </h3>
                          <p className="text-blue-300/70 text-sm">
                            Client: TechCorp Inc.
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">
                          Running
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="font-mono text-4xl font-bold text-white tracking-wider">
                          03:42:15
                        </div>
                        <div className="flex gap-2 opacity-50">
                          <div className="h-8 w-16 bg-red-500/20 rounded flex items-center justify-center text-red-200 text-sm">
                            Stop
                          </div>
                          <div className="h-8 w-16 bg-slate-700/30 rounded flex items-center justify-center text-slate-300 text-sm">
                            Log
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Paused Timer Card */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-slate-200 font-medium text-lg">
                            Website Redesign
                          </h3>
                          <p className="text-slate-400 text-sm">
                            Client: Design Studio
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20">
                          Paused
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="font-mono text-4xl font-bold text-slate-300 tracking-wider">
                          01:30:45
                        </div>
                        <div className="flex gap-2 opacity-50">
                          <div className="h-8 w-16 bg-emerald-500/20 rounded flex items-center justify-center text-emerald-200 text-sm">
                            Start
                          </div>
                          <div className="h-8 w-16 bg-slate-700/30 rounded flex items-center justify-center text-slate-300 text-sm">
                            Log
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add New Timer Button */}
                    <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-slate-700 text-slate-400 bg-slate-800/30">
                      <svg
                        className="w-5 h-5 mr-2 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      New Timer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
