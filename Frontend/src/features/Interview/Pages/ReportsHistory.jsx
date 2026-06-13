import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../../components/Navbar";
import { getAllInterviewReports } from "../Services/interview.api";
import { getAllResumes } from "../../Resume/Services/resume.api";

const cleanTextForPreview = (text) => {
  if (typeof text !== "string") return text;
  return text
    .replace(/\\%/g, "%")
    .replace(/\\&/g, "&")
    .replace(/\\\$/g, "$")
    .replace(/\\#/g, "#")
    .replace(/\\_/g, "_")
    .replace(/\\{/g, "{")
    .replace(/\\}/g, "}")
    .replace(/\\textasciitilde\{\}/g, "~")
    .replace(/\\textasciicircum\{\}/g, "^")
    .replace(/\\textbackslash\{\}/g, "\\");
};

const ReportsHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("interviews"); // 'interviews' | 'resumes'
  const [reports, setReports] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null); // Modal state for interview plans
  const [selectedResume, setSelectedResume] = useState(null); // Modal state for resumes

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        
        const [reportsData, resumesData] = await Promise.all([
          getAllInterviewReports().catch((err) => {
            console.error("Failed to fetch interview reports:", err);
            return { reports: [] };
          }),
          getAllResumes().catch((err) => {
            console.error("Failed to fetch resumes:", err);
            return { resumes: [] };
          }),
        ]);

        if (reportsData && reportsData.reports) {
          setReports(reportsData.reports);
        }
        if (resumesData && resumesData.resumes) {
          setResumes(resumesData.resumes);
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while loading your history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const openReportModal = (report) => {
    setSelectedReport(report);
  };

  const closeReportModal = () => {
    setSelectedReport(null);
  };

  const openResumeModal = (resume) => {
    setSelectedResume(resume);
  };

  const closeResumeModal = () => {
    setSelectedResume(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              My Workspace History
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Review, access, and download all your preparation roadmaps and tailored ATS resumes.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-colors shadow-lg shadow-rose-600/10"
            >
              ★ Create New Plan
            </button>
            <button
              onClick={() => navigate("/resume/new")}
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 rounded-xl text-[12px] font-bold cursor-pointer transition-colors"
            >
              Build Resume
            </button>
          </div>
        </div>

        {/* Workspace History Tabs */}
        <div className="flex border-b border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab("interviews")}
            className={`px-6 py-3 border-b-2 text-xs font-bold transition-all ${
              activeTab === "interviews"
                ? "border-rose-500 text-rose-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            Interview Plans ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab("resumes")}
            className={`px-6 py-3 border-b-2 text-xs font-bold transition-all ${
              activeTab === "resumes"
                ? "border-rose-500 text-rose-400"
                : "border-transparent text-gray-400 hover:text-gray-300"
            }`}
          >
            ATS Resumes ({resumes.length})
          </button>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
            <span className="text-xs text-gray-500 font-medium">Retrieving history...</span>
          </div>
        ) : error ? (
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 text-center max-w-md mx-auto">
            <p className="text-rose-500 text-sm mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : activeTab === "interviews" ? (
          /* Interview Reports Grid */
          reports.length === 0 ? (
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xl">
              <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-base font-bold text-white mb-2">No Reports Generated Yet</h3>
              <p className="text-xs text-gray-400 mb-6">
                Provide a job description and your profile to get a personalized interview roadmap.
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-all"
              >
                Start Preparing Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report.uuid || report._id}
                  onClick={() => openReportModal(report)}
                  className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:border-gray-700/80 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-[11px] text-gray-500 font-semibold">
                        {new Date(report.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-lg">
                        {report.matchScore}% Match
                      </span>
                    </div>

                    <h3 className="text-[13px] font-bold text-white mb-2 leading-snug line-clamp-2 group-hover:text-rose-400 transition-colors">
                      {report.jobDescription}
                    </h3>

                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {report.selfDescription || "Resume uploaded"}
                    </p>
                  </div>

                  <div className="border-t border-gray-800/60 pt-3.5 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                    <div className="flex items-center gap-3">
                      <span>{report.technicalQuestions?.length || 0} Tech</span>
                      <span className="w-1 h-1 rounded-full bg-gray-700" />
                      <span>{report.behaviouralQuestionsSchema?.length || 0} Behav</span>
                    </div>
                    <span className="text-rose-500 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider">
                      View Plan →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Resumes Grid */
          resumes.length === 0 ? (
            <div className="bg-[#111827] border border-gray-800 rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xl">
              <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-base font-bold text-white mb-2">No Resumes Generated Yet</h3>
              <p className="text-xs text-gray-400 mb-6">
                Fill in your skills, experience, and certifications to generate a single-column, professional ATS resume.
              </p>
              <button
                onClick={() => navigate("/resume/new")}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-all"
              >
                Create First Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resumeItem) => (
                <div
                  key={resumeItem.uuid || resumeItem._id}
                  onClick={() => openResumeModal(resumeItem)}
                  className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:border-gray-700/80 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="text-[11px] text-gray-500 font-semibold">
                        {new Date(resumeItem.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                        {resumeItem.atsScoreEstimate}% ATS Score
                      </span>
                    </div>

                    <h3 className="text-[13px] font-bold text-white mb-2 leading-snug line-clamp-1 group-hover:text-rose-400 transition-colors">
                      {cleanTextForPreview(resumeItem.personalInfo?.name)}
                    </h3>

                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {cleanTextForPreview(resumeItem.summary) || "No summary provided."}
                    </p>
                  </div>

                  <div className="border-t border-gray-800/60 pt-3.5 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                    <div className="flex items-center gap-3">
                      <span>{resumeItem.experience?.length || 0} Exp</span>
                      <span className="w-1 h-1 rounded-full bg-gray-700" />
                      <span>{resumeItem.projects?.length || 0} Projects</span>
                    </div>
                    <span className="text-rose-500 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider">
                      Open Workspace →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* Interview Plan Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div
            className="bg-[#111827] border border-gray-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#161f30]/40">
              <div>
                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest block mb-1">
                  Report Detail Overview
                </span>
                <h2 className="text-base font-extrabold text-white">Generated Plan Summary</h2>
              </div>
              <button
                onClick={closeReportModal}
                className="p-1.5 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between bg-gray-900/60 border border-gray-800 p-4 rounded-2xl">
                <div>
                  <span className="text-xs font-semibold text-gray-300">Profile Match Rating</span>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                    Matches skills against target job description.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-rose-500">{selectedReport.matchScore}%</span>
                  <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${selectedReport.matchScore}%` }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Target Job Description
                </span>
                <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-4 text-xs leading-relaxed text-gray-300 max-h-36 overflow-y-auto whitespace-pre-line font-mono">
                  {selectedReport.jobDescription}
                </div>
              </div>

              {selectedReport.selfDescription && (
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Self Description
                  </span>
                  <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-4 text-xs leading-relaxed text-gray-300 max-h-32 overflow-y-auto">
                    {selectedReport.selfDescription}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-900/40 border border-gray-800/60 rounded-xl p-3 text-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Tech Qs</span>
                  <span className="text-sm font-extrabold text-white">{selectedReport.technicalQuestions?.length || 0}</span>
                </div>
                <div className="bg-gray-900/40 border border-gray-800/60 rounded-xl p-3 text-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Behav Qs</span>
                  <span className="text-sm font-extrabold text-white">{selectedReport.behaviouralQuestionsSchema?.length || 0}</span>
                </div>
                <div className="bg-gray-900/40 border border-gray-800/60 rounded-xl p-3 text-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">Skill Gaps</span>
                  <span className="text-sm font-extrabold text-white">{selectedReport.skillGap?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 bg-[#161f30]/40 flex items-center justify-end gap-3">
              <button
                onClick={closeReportModal}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Summary
              </button>
              <button
                onClick={() => {
                  closeReportModal();
                  navigate(`/interview/${selectedReport.uuid || selectedReport._id}`);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-rose-600/10"
              >
                Open Detailed Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {selectedResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div
            className="bg-[#111827] border border-gray-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#161f30]/40">
              <div>
                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest block mb-1">
                  Resume Overview
                </span>
                <h2 className="text-base font-extrabold text-white">
                  {cleanTextForPreview(selectedResume.personalInfo?.name) || "Resume Summary"}
                </h2>
              </div>
              <button
                onClick={closeResumeModal}
                className="p-1.5 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between bg-gray-900/60 border border-gray-800 p-4 rounded-2xl">
                <div>
                  <span className="text-xs font-semibold text-gray-300">ATS Match Score</span>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                    Estimated compatibility rating.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-rose-500">{selectedResume.atsScoreEstimate}%</span>
                  <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full"
                      style={{ width: `${selectedResume.atsScoreEstimate}%` }}
                    />
                  </div>
                </div>
              </div>

              {selectedResume.summary && (
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Professional Summary
                  </span>
                  <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-4 text-xs leading-relaxed text-gray-300 max-h-36 overflow-y-auto">
                    {cleanTextForPreview(selectedResume.summary)}
                  </div>
                </div>
              )}

              <div className="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                  Contact Details
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Email</span>
                    <span className="text-gray-300 truncate block">
                      {cleanTextForPreview(selectedResume.personalInfo?.email) || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Phone</span>
                    <span className="text-gray-300">
                      {cleanTextForPreview(selectedResume.personalInfo?.phone) || "N/A"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 block">Location</span>
                    <span className="text-gray-300">
                      {cleanTextForPreview(selectedResume.personalInfo?.location) || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-800 bg-[#161f30]/40 flex items-center justify-end gap-3">
              <button
                onClick={closeResumeModal}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Overview
              </button>
              <button
                onClick={() => {
                  closeResumeModal();
                  navigate(`/resume/${selectedResume.uuid || selectedResume._id}`);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-rose-600/10"
              >
                Open Real-time Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsHistory;
