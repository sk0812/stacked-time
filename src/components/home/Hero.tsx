"use client";

import Container from "../ui/Container";

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 relative min-h-screen pt-16 sm:pt-20">
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>

      <Container className="relative">
        <div className="min-h-[calc(100vh-5rem)] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center py-8 sm:py-16 lg:py-24">
          {/* Text Content */}
          <div className="text-left space-y-6 lg:space-y-10 pt-8 sm:pt-12 lg:pt-0 order-first">
            {/* Content wrapper with reduced gap */}
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 border border-blue-200/10 backdrop-blur-sm">
                <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="text-sm sm:text-base text-blue-200 font-medium">
                  Smart Time Tracking
                </span>
              </div>

              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                  Track Time
                  <span className="block">
                    <span className="text-sky-400">Stack Success</span>
                  </span>
                </h1>
                <p className="text-base sm:text-lg lg:text-2xl text-blue-50/90 max-w-2xl leading-relaxed">
                  The perfect timer solution for freelancers juggling multiple
                  projects. Track time effortlessly and maximize your
                  productivity.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 lg:pt-6">
                <button className="btn btn-primary bg-white text-blue-900 hover:bg-blue-50 border-none btn-lg w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                  Start Tracking
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform"
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
                <button className="btn btn-outline text-white hover:bg-white hover:text-blue-900 btn-lg w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8">
                  Learn More
                </button>
              </div>

              {/* Feature Mini Cards - Replacing Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8 lg:pt-10 border-t border-white/10">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
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
                    <h3 className="font-semibold text-sm sm:text-base text-white">
                      Precise Tracking
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-200/80">
                    Track time down to the second with automatic syncing
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
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
                    <h3 className="font-semibold text-sm sm:text-base text-white">
                      Project Groups
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-200/80">
                    Sort timers by client or project type for better
                    organisation
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/20">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400"
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
                    <h3 className="font-semibold text-sm sm:text-base text-white">
                      Export Reports
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-200/80">
                    Generate detailed reports for billing and analysis
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Browser Mockup */}
          <div className="flex justify-center lg:justify-end order-last">
            <div className="relative w-full max-w-md lg:max-w-xl mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-8 sm:-top-16 -left-8 sm:-left-16 w-24 sm:w-32 h-24 sm:h-32 bg-blue-500/10 rounded-full blur-xl hidden sm:block"></div>
              <div className="absolute -bottom-8 sm:-bottom-12 -right-8 sm:-right-12 w-32 sm:w-40 h-32 sm:h-40 bg-indigo-500/10 rounded-full blur-xl hidden sm:block"></div>

              <div className="mockup-browser bg-slate-950 border border-slate-800 w-full scale-90 sm:scale-100">
                <div className="mockup-browser-toolbar"></div>
                <div className="bg-slate-900 px-4 sm:px-6 py-6 sm:py-8">
                  {/* Timer Cards Grid */}
                  <div className="space-y-3 sm:space-y-4">
                    {/* Today's Date */}
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <h2 className="text-slate-200 text-base sm:text-lg font-medium">
                        Today&apos;s Timers
                      </h2>
                      <span className="text-slate-400 text-xs sm:text-sm">
                        Mon, 18 March
                      </span>
                    </div>

                    {/* Active Timer Card */}
                    <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-xl border border-blue-500/20 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-blue-100 font-medium text-base sm:text-lg">
                            Mobile App Development
                          </h3>
                          <p className="text-blue-300/70 text-xs sm:text-sm">
                            Client: TechCorp Inc.
                          </p>
                        </div>
                        <span className="px-2 sm:px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium border border-emerald-500/20">
                          Running
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="font-mono text-2xl sm:text-4xl font-bold text-white tracking-wider">
                          03:42:15
                        </div>
                        <div className="flex gap-2 opacity-50">
                          <div className="h-6 sm:h-8 w-12 sm:w-16 bg-red-500/20 rounded flex items-center justify-center text-red-200 text-xs sm:text-sm">
                            Stop
                          </div>
                          <div className="h-6 sm:h-8 w-12 sm:w-16 bg-slate-700/30 rounded flex items-center justify-center text-slate-300 text-xs sm:text-sm">
                            Log
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Paused Timer Card */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-slate-200 font-medium text-base sm:text-lg">
                            Website Redesign
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm">
                            Client: Design Studio
                          </p>
                        </div>
                        <span className="px-2 sm:px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium border border-amber-500/20">
                          Paused
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="font-mono text-2xl sm:text-4xl font-bold text-slate-300 tracking-wider">
                          01:30:45
                        </div>
                        <div className="flex gap-2 opacity-50">
                          <div className="h-6 sm:h-8 w-12 sm:w-16 bg-emerald-500/20 rounded flex items-center justify-center text-emerald-200 text-xs sm:text-sm">
                            Start
                          </div>
                          <div className="h-6 sm:h-8 w-12 sm:w-16 bg-slate-700/30 rounded flex items-center justify-center text-slate-300 text-xs sm:text-sm">
                            Log
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add New Timer Button */}
                    <div className="flex items-center justify-center h-12 sm:h-14 rounded-xl border border-dashed border-slate-700 text-slate-400 bg-slate-800/30 text-sm sm:text-base">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2 opacity-50"
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
