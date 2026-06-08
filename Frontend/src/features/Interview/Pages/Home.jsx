import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-[#f7f5f0] overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-[#e8e3db]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2d2a26] flex items-center justify-center">
              <span className="text-[12px] text-[#f7f5f0] font-bold">AI</span>
            </div>
            <span className="text-[15px] font-semibold text-[#2d2a26]">
              InterviewAI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[#9b9489] hidden sm:block">Dashboard</span>
            <div className="w-7 h-7 rounded-full bg-[#e0d9cd] flex items-center justify-center text-[11px] font-semibold text-[#6b6560]">
              SP
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-20">

        {/* Page Header */}
        <div className="mb-10">
          <p className="text-[12px] font-medium text-[#b48c5f] tracking-[0.15em] uppercase mb-2">New Report</p>
          <h1 className="text-[28px] sm:text-[34px] font-bold text-[#2d2a26] leading-snug">
            Let's prepare you for<br className="hidden sm:block" />your next interview.
          </h1>
          <p className="mt-2 text-[15px] text-[#9b9489] max-w-md leading-relaxed">
            Share the role details and your background — we'll craft a personalized coaching plan.
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Job Description — 3 cols */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#e8e3db] rounded-2xl p-6 shadow-sm">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-[11px] font-semibold text-[#b48c5f] tracking-wider">01</span>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#2d2a26]">Job Description</h3>
                  <p className="text-[12px] text-[#9b9489] mt-0.5">Paste the role you're targeting</p>
                </div>
              </div>
              <textarea
                id="jobDescription"
                name="jobDescription"
                placeholder="e.g. We are looking for a Junior Backend Developer with experience in Node.js, Express, and MongoDB..."
                className="w-full min-h-[300px] bg-[#faf8f4] border border-[#e8e3db] rounded-xl px-4 py-3.5 text-[14px] text-[#2d2a26] leading-relaxed resize-none outline-none focus:border-[#b48c5f]/40 focus:ring-2 focus:ring-[#b48c5f]/10 transition-all duration-200 placeholder-[#c5bfb5]"
              />
            </div>
          </div>

          {/* Right column — 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Upload Resume */}
            <div className="bg-white border border-[#e8e3db] rounded-2xl p-6 shadow-sm">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-[11px] font-semibold text-[#b48c5f] tracking-wider">02</span>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#2d2a26]">Resume</h3>
                  <p className="text-[12px] text-[#9b9489] mt-0.5">Upload your latest resume</p>
                </div>
              </div>
              <div className="border border-dashed border-[#d5cfc5] rounded-xl py-9 px-6 text-center cursor-pointer hover:border-[#b48c5f]/40 hover:bg-[#b48c5f]/[0.02] transition-all duration-300 group">
                <div className="w-11 h-11 mx-auto rounded-full bg-[#f0ebe3] flex items-center justify-center mb-3 group-hover:bg-[#ece4d7] transition-colors">
                  <svg className="w-[18px] h-[18px] text-[#b48c5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-[13px] text-[#6b6560]">
                  Drop file here or <span className="text-[#b48c5f] font-medium">browse</span>
                </p>
                <p className="text-[11px] text-[#b5afa5] mt-1.5">PDF only · Max 3MB</p>
                <input type="file" name="resume" id="resume" accept=".pdf" className="hidden" />
              </div>
            </div>

            {/* Self Description */}
            <div className="bg-white border border-[#e8e3db] rounded-2xl p-6 shadow-sm">
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-[11px] font-semibold text-[#b48c5f] tracking-wider">03</span>
                <div>
                  <h3 className="text-[15px] font-semibold text-[#2d2a26]">About You</h3>
                  <p className="text-[12px] text-[#9b9489] mt-0.5">Your skills & experience in brief</p>
                </div>
              </div>
              <textarea
                id="selfDescription"
                name="selfDescription"
                placeholder="e.g. I'm a developer with 1 year of experience in Node.js and React..."
                rows={5}
                className="w-full bg-[#faf8f4] border border-[#e8e3db] rounded-xl px-4 py-3.5 text-[14px] text-[#2d2a26] leading-relaxed resize-none outline-none focus:border-[#b48c5f]/40 focus:ring-2 focus:ring-[#b48c5f]/10 transition-all duration-200 placeholder-[#c5bfb5]"
              />
            </div>

          </div>
        </div>

        {/* Submit */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 rounded-xl text-[14px] font-semibold cursor-pointer bg-[#2d2a26] text-[#f7f5f0] hover:bg-[#3d3a35] active:scale-[0.97] transition-all duration-200"
          >
            Generate Report →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;