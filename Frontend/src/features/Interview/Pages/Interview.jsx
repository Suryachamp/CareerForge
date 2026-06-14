import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { getInterviewReport } from "../Services/interview.api";
import Navbar from "../../../components/Navbar";

const Interview = () => {
  let { id } = useParams();
  // Support both normal ID and "interview:id" format
  if (id && id.startsWith("interview")) {
    id = id.substring("interview".length);
  }

  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("technical"); // 'technical' | 'behavioral' | 'roadmap'
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [completedDays, setCompletedDays] = useState({});

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getInterviewReport(id);
        if (data && data.interviewReport) {
          setReport(data.interviewReport);
        } else {
          setError("Failed to load interview report details.");
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Could not fetch the interview plan. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleDayComplete = (dayId) => {
    setCompletedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-gray-300 font-sans">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-semibold tracking-wide text-gray-400">Loading your interview plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center px-4 text-gray-300 font-sans">
        <div className="max-w-md w-full bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-2xl text-center">
          <svg className="w-12 h-12 text-rose-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-lg font-bold text-white mb-2">Failed to load plan</h2>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[13px] font-bold cursor-pointer transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-300 font-sans flex flex-col">
      <Navbar />
      {/* Top Navbar */}
      <header className="border-b border-gray-800 bg-[#111827]/60 backdrop-blur py-4">
        <div className="max-w-[1400px] w-full mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 bg-gray-800/40 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">AI Interview Coach</h1>
              <p className="text-[11px] text-rose-500 font-semibold tracking-wide uppercase">Custom Preparation Strategy</p>
            </div>
          </div>

          {/* Global Match Score Card */}
          <div className="flex items-center gap-4 bg-gray-900/60 border border-gray-800/80 px-4 py-2 rounded-xl">
            <div className="text-right">
              <span className="text-[10px] text-gray-500 block font-bold uppercase tracking-wider">Profile Match</span>
              <span className="text-sm font-extrabold text-white">{report.matchScore}%</span>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-rose-500/20 flex items-center justify-center relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="13"
                  className="stroke-rose-500"
                  strokeWidth="2.5"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 13}`}
                  strokeDashoffset={`${2 * Math.PI * 13 * (1 - report.matchScore / 100)}`}
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-grow max-w-[1400px] w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Navigation Sidebar (3 Cols) */}
        <aside className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-col gap-1.5 shadow-xl">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Sections</p>
            
            <button
              onClick={() => setActiveTab("technical")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                activeTab === "technical"
                  ? "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                  : "bg-transparent border border-transparent text-gray-400 hover:bg-gray-800/30 hover:text-gray-300"
              }`}
            >
              <span>Technical questions</span>
              <span className="text-xs bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-full text-gray-500">
                {report.technicalQuestions?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("behavioral")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                activeTab === "behavioral"
                  ? "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                  : "bg-transparent border border-transparent text-gray-400 hover:bg-gray-800/30 hover:text-gray-300"
              }`}
            >
              <span>Behavioral questions</span>
              <span className="text-xs bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-full text-gray-500">
                {report.behaviouralQuestionsSchema?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("roadmap")}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer ${
                activeTab === "roadmap"
                  ? "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                  : "bg-transparent border border-transparent text-gray-400 hover:bg-gray-800/30 hover:text-gray-300"
              }`}
            >
              <span>Road Map</span>
              <span className="text-xs bg-gray-900 border border-gray-800 px-2 py-0.5 rounded-full text-gray-500">
                {report.preparationPlanS?.length || 0} Days
              </span>
            </button>
          </div>
        </aside>

        {/* Center Column - Main Content Area (6 Cols) */}
        <main className="lg:col-span-6 flex flex-col gap-6">
          
          {/* Active Tab: Technical Questions */}
          {activeTab === "technical" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h2 className="text-lg font-bold text-white">Technical Questions</h2>
              </div>

              {report.technicalQuestions?.length === 0 ? (
                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center text-gray-500 text-sm">
                  No technical questions generated for this profile.
                </div>
              ) : (
                report.technicalQuestions?.map((q, idx) => {
                  const isExpanded = !!expandedQuestions[`tech_${idx}`];
                  return (
                    <div
                      key={idx}
                      className="bg-[#111827] border border-gray-800/80 rounded-2xl overflow-hidden transition-all duration-200 hover:border-gray-700/80"
                    >
                      <button
                        onClick={() => toggleQuestion(`tech_${idx}`)}
                        className="w-full text-left p-5 flex items-start gap-4 cursor-pointer focus:outline-none"
                      >
                        <span className="text-xs font-bold text-rose-500/80 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded shrink-0">
                          Q{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <div className="flex-grow">
                          <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>
                        </div>
                        <span className={`text-gray-500 mt-1 transition-transform duration-200 shrink-0 ${isExpanded ? "transform rotate-180" : ""}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-gray-800/60 bg-[#161f30]/20 flex flex-col gap-4 text-xs">
                          {/* Intention */}
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Assessing Intention</span>
                            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-blue-300/90 leading-relaxed">
                              {q.intention}
                            </div>
                          </div>

                          {/* Suggested Answer */}
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Suggested Talking Points</span>
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5 text-emerald-300/90 leading-relaxed font-sans">
                              {q.answer}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Active Tab: Behavioral Questions */}
          {activeTab === "behavioral" && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h2 className="text-lg font-bold text-white">Behavioral Questions</h2>
              </div>

              {report.behaviouralQuestionsSchema?.length === 0 ? (
                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center text-gray-500 text-sm">
                  No behavioral questions generated for this profile.
                </div>
              ) : (
                report.behaviouralQuestionsSchema?.map((q, idx) => {
                  const isExpanded = !!expandedQuestions[`behavior_${idx}`];
                  return (
                    <div
                      key={idx}
                      className="bg-[#111827] border border-gray-800/80 rounded-2xl overflow-hidden transition-all duration-200 hover:border-gray-700/80"
                    >
                      <button
                        onClick={() => toggleQuestion(`behavior_${idx}`)}
                        className="w-full text-left p-5 flex items-start gap-4 cursor-pointer focus:outline-none"
                      >
                        <span className="text-xs font-bold text-rose-500/80 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded shrink-0">
                          Q{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                        </span>
                        <div className="flex-grow">
                          <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>
                        </div>
                        <span className={`text-gray-500 mt-1 transition-transform duration-200 shrink-0 ${isExpanded ? "transform rotate-180" : ""}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-gray-800/60 bg-[#161f30]/20 flex flex-col gap-4 text-xs">
                          {/* Intention */}
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Assessing Intention</span>
                            <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-blue-300/90 leading-relaxed">
                              {q.intention}
                            </div>
                          </div>

                          {/* Suggested Answer */}
                          <div>
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">STAR Response Strategy</span>
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3.5 text-emerald-300/90 leading-relaxed font-sans">
                              {q.answer}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Active Tab: Road Map */}
          {activeTab === "roadmap" && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h2 className="text-lg font-bold text-white">7-Day Preparation Road Map</h2>
              </div>

              {report.preparationPlanS?.length === 0 ? (
                <div className="bg-[#111827] border border-gray-800 rounded-2xl p-8 text-center text-gray-500 text-sm">
                  No preparation plan generated.
                </div>
              ) : (
                <div className="relative border-l border-gray-800 ml-4 flex flex-col gap-8">
                  {report.preparationPlanS?.map((dayPlan, idx) => {
                    const isCompleted = !!completedDays[dayPlan._id?.$oid || idx];
                    return (
                      <div key={idx} className="relative pl-8 group">
                        
                        {/* Timeline Node Badge */}
                        <div
                          onClick={() => toggleDayComplete(dayPlan._id?.$oid || idx)}
                          className={`absolute -left-[18px] top-1.5 w-9 h-9 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md ${
                            isCompleted
                              ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/10"
                              : "bg-gray-950 border-gray-800 text-gray-500 group-hover:border-rose-500/50 group-hover:text-rose-400"
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-[11px] font-bold">D{dayPlan.day}</span>
                          )}
                        </div>

                        {/* Day Card */}
                        <div
                          className={`bg-[#111827] border rounded-2xl p-5 transition-all duration-300 ${
                            isCompleted
                              ? "border-emerald-500/20 opacity-70"
                              : "border-gray-800 hover:border-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-rose-500 tracking-wide uppercase">
                              Day {dayPlan.day}
                            </span>
                            <button
                              onClick={() => toggleDayComplete(dayPlan._id?.$oid || idx)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                isCompleted
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                  : "bg-gray-800/40 border-gray-800 hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                              }`}
                            >
                              {isCompleted ? "Completed" : "Mark Done"}
                            </button>
                          </div>

                          <h3 className="text-[14px] font-bold text-white mb-2.5 leading-tight">
                            {dayPlan.focus}
                          </h3>
                          
                          <p className="text-xs text-gray-400 leading-relaxed bg-[#0b0f19]/35 border border-gray-800/30 rounded-xl p-3.5">
                            {dayPlan.task}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </main>

        {/* Right Column - Skill Gaps (3 Cols) */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-bold text-white">Skill Gaps</h2>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                Identified areas of improvement based on job requirements.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {report.skillGap?.length === 0 ? (
                <div className="text-xs text-gray-500 italic p-3 text-center bg-gray-900/40 border border-gray-800/40 rounded-xl">
                  No skill gaps detected. You are fully ready!
                </div>
              ) : (
                report.skillGap?.map((gap, idx) => {
                  const severityColors =
                    gap.severity === "high"
                      ? "bg-red-500/10 border-red-500/20 text-red-400"
                      : gap.severity === "medium"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      : "bg-blue-500/10 border-blue-500/20 text-blue-400";
                  
                  return (
                    <div
                      key={idx}
                      className={`border rounded-xl p-3 flex flex-col gap-1.5 transition-all ${severityColors}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider">
                          {gap.severity} Priority
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                      </div>
                      <p className="text-xs font-semibold leading-relaxed text-white">
                        {gap.skill}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Interview;
