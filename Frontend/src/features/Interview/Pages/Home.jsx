import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { generateInterviewReport } from "../Services/interview.api";
import Navbar from "../../../components/Navbar";

const Home = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }
    if (!resumeFile && !selfDescription.trim()) {
      setError("Please upload a resume or provide a quick self-description.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      if (selfDescription.trim()) {
        formData.append("selfDescription", selfDescription.trim());
      }
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await generateInterviewReport(formData);
      if (response && response.interviewReport && (response.interviewReport.uuid || response.interviewReport._id)) {
        navigate(`/interview/${response.interviewReport.uuid || response.interviewReport._id}`);
      } else {
        setError("Failed to generate interview report. Invalid response received.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "An error occurred while generating your report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResumeFile(file);
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] flex flex-col justify-between overflow-x-hidden text-gray-300 font-sans">
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Create Your Custom <span className="text-rose-500">Interview Plan</span>
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Let our AI analyze the job requirements and your unique profile to build a winning strategy.
          </p>
        </div>

        {/* Card Container */}
        <form onSubmit={handleSubmit} className="w-full max-w-[950px] bg-[#111827] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          
          {/* Main split grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">
            
            {/* Left Side - Target Job Description */}
            <div className="p-6 sm:p-8 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  {/* Briefcase Icon */}
                  <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-base font-bold text-white tracking-wide">Target Job Description</h2>
                </div>
                <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                  Required
                </span>
              </div>

              <div className="relative flex-grow flex flex-col">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value.slice(0, 5000))}
                  placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
                  className="w-full min-h-[340px] flex-grow bg-[#0b0f19] border border-gray-800/80 rounded-xl px-4 py-3.5 text-[14px] text-gray-200 leading-relaxed outline-none focus:border-rose-500/30 transition-colors duration-200 placeholder-gray-600/70 resize-none"
                />
                <span className="absolute bottom-3 right-4 text-[11px] text-gray-500">
                  {jobDescription.length} / 5000 chars
                </span>
              </div>
            </div>

            {/* Right Side - Your Profile */}
            <div className="p-6 sm:p-8 flex flex-col gap-5">
              <div className="flex items-center gap-2.5">
                {/* Profile Icon */}
                <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-base font-bold text-white tracking-wide">Your Profile</h2>
              </div>

              {/* Upload Resume Section */}
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-[13px] font-semibold text-gray-300">Upload Resume</span>
                  <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Best Results
                  </span>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                    isDragging
                      ? "border-rose-500 bg-rose-500/5"
                      : resumeFile
                      ? "border-rose-500/40 bg-rose-500/[0.02]"
                      : "border-gray-800 bg-[#0b0f19] hover:border-gray-700"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {/* Cloud Upload Icon */}
                    <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {resumeFile ? (
                      <>
                        <p className="text-[13px] text-rose-400 font-medium">{resumeFile.name}</p>
                        <p className="text-[11px] text-gray-500">{(resumeFile.size / 1024).toFixed(1)} KB • Click to change</p>
                      </>
                    ) : (
                      <>
                        <p className="text-[13px] text-gray-300 font-medium">Click to upload or drag & drop</p>
                        <p className="text-[11px] text-gray-500">PDF or DOCX (Max 5MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-grow h-px bg-gray-800"></div>
                <span className="text-[11px] font-bold text-gray-500 tracking-wider">OR</span>
                <div className="flex-grow h-px bg-gray-800"></div>
              </div>

              {/* Quick Self-Description Section */}
              <div>
                <label htmlFor="selfDescription" className="block text-[13px] font-semibold text-gray-300 mb-2.5">
                  Quick Self-Description
                </label>
                <textarea
                  id="selfDescription"
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                  rows={3}
                  className="w-full bg-[#0b0f19] border border-gray-800/80 rounded-xl px-4 py-3 text-[13px] text-gray-200 leading-relaxed outline-none focus:border-rose-500/30 transition-colors duration-200 placeholder-gray-600/70 resize-none"
                />
              </div>

              {/* Blue Alert Info Box */}
              <div className="bg-[#17253d]/40 border border-blue-900/30 rounded-xl p-3.5 flex items-start gap-3 text-blue-300/95">
                {/* Info Icon */}
                <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[12px] leading-relaxed">
                  Either a <span className="font-semibold text-white">Resume</span> or a <span className="font-semibold text-white">Self Description</span> is required to generate a personalized plan.
                </p>
              </div>

              {/* Error Box */}
              {error && (
                <div className="bg-red-950/40 border border-red-900/30 rounded-xl p-3.5 text-red-400 text-[12px] leading-relaxed">
                  {error}
                </div>
              )}

            </div>

          </div>

          {/* Footer Bar inside the card */}
          <div className="bg-[#161f30]/40 border-t border-gray-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[12px] text-gray-500">
              AI-Powered Strategy Generation • Approx 30s
            </span>
            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto px-5 py-2.5 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg active:scale-[0.98] ${
                loading
                  ? "bg-rose-800/50 cursor-not-allowed text-gray-400 shadow-none"
                  : "bg-rose-600 hover:bg-rose-500 cursor-pointer shadow-rose-600/10"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>★</span>
                  <span>Generate My Interview Strategy</span>
                </>
              )}
            </button>
          </div>

        </form>

      </main>

      {/* Footer Links */}
      <footer className="py-6 border-t border-gray-800/40 text-center">
        <div className="flex justify-center gap-6 text-[12px] text-gray-500">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Help Center</a>
        </div>
      </footer>

    </div>
  );
};

export default Home;