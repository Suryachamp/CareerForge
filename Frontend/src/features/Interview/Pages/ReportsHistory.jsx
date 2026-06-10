import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../../components/Navbar";
import { getAllInterviewReports } from "../Services/interview.api";

const ReportsHistory = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null); // Modal state

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getAllInterviewReports();
        if (data && data.reports) {
          setReports(data.reports);
        } else {
          setError("Failed to fetch your reports.");
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "An error occurred while loading your history."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const openModal = (report) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Interview Plans History
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Review and access all the preparation strategies you have generated.
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[12px] font-bold cursor-pointer transition-colors shadow-lg shadow-rose-600/10"
          >
            ★ Create New Plan
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
        ) : reports.length === 0 ? (
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
          /* Reports Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div
                key={report._id}
                onClick={() => openModal(report)}
                className="bg-[#111827] border border-gray-800 rounded-2xl p-5 hover:border-gray-700/80 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Bar inside card */}
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

                  {/* Job Description Title Snippet */}
                  <h3 className="text-[13px] font-bold text-white mb-2 leading-snug line-clamp-2 group-hover:text-rose-400 transition-colors">
                    {report.jobDescription}
                  </h3>

                  {/* Summary of what was provided */}
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-4">
                    {report.selfDescription || "Resume uploaded"}
                  </p>
                </div>

                {/* Counters / Footer */}
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
        )}
      </main>

      {/* Modal Popup */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div
            className="bg-[#111827] border border-gray-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#161f30]/40">
              <div>
                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest block mb-1">
                  Report Detail Overview
                </span>
                <h2 className="text-base font-extrabold text-white">Generated Plan Summary</h2>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 bg-gray-800/50 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
              
              {/* Match Score Gauge */}
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

              {/* Job Description Full details */}
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Target Job Description
                </span>
                <div className="bg-[#0b0f19] border border-gray-800 rounded-xl p-4 text-xs leading-relaxed text-gray-300 max-h-36 overflow-y-auto whitespace-pre-line font-mono">
                  {selectedReport.jobDescription}
                </div>
              </div>

              {/* Profile Details */}
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

              {/* Content Breakdown */}
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

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-800 bg-[#161f30]/40 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Close Summary
              </button>
              <button
                onClick={() => {
                  closeModal();
                  navigate(`/interview/${selectedReport._id}`);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-rose-600/10"
              >
                Open Detailed Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsHistory;
