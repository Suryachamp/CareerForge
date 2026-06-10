import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import Navbar from "../../../components/Navbar";
import { getAllInterviewReports } from "../Services/interview.api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCount: 0,
    avgMatchScore: 0,
    totalGaps: 0,
    severityBreakdown: { high: 0, medium: 0, low: 0 },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getAllInterviewReports();
        if (data && data.reports) {
          const fetchedReports = data.reports;
          setReports(fetchedReports);

          // Calculate stats
          const totalCount = fetchedReports.length;
          let sumScore = 0;
          let totalGaps = 0;
          const severityBreakdown = { high: 0, medium: 0, low: 0 };

          fetchedReports.forEach((report) => {
            sumScore += report.matchScore || 0;
            const gaps = report.skillGap || [];
            totalGaps += gaps.length;
            gaps.forEach((g) => {
              const sev = (g.severity || "medium").toLowerCase();
              if (severityBreakdown[sev] !== undefined) {
                severityBreakdown[sev]++;
              } else {
                severityBreakdown.medium++;
              }
            });
          });

          setStats({
            totalCount,
            avgMatchScore: totalCount > 0 ? Math.round(sumScore / totalCount) : 0,
            totalGaps,
            severityBreakdown,
          });
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Preparation Dashboard
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Analyze your performance, track key skill gaps, and manage your custom plans.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/history"
              className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
            >
              View History
            </Link>
            <Link
              to="/"
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/10"
            >
              ★ Start New Plan
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
            <span className="text-xs text-gray-500 font-medium">Loading analytics...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            
            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Stat Card: Total Reports */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                  Plans Generated
                </span>
                <p className="text-2xl font-extrabold text-white">{stats.totalCount}</p>
                <div className="h-1 bg-gray-800 rounded-full mt-3 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full w-full" />
                </div>
              </div>

              {/* Stat Card: Avg Score */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                  Average Match Score
                </span>
                <p className="text-2xl font-extrabold text-white">{stats.avgMatchScore}%</p>
                <div className="h-1 bg-gray-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${stats.avgMatchScore}%` }}
                  />
                </div>
              </div>

              {/* Stat Card: Skill Gaps */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                  Total Skill Gaps
                </span>
                <p className="text-2xl font-extrabold text-white">{stats.totalGaps}</p>
                <div className="h-1 bg-gray-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${Math.min(stats.totalGaps * 10, 100)}%` }}
                  />
                </div>
              </div>

              {/* Stat Card: High Severity Gaps */}
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-lg">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
                  Critical Gaps
                </span>
                <p className="text-2xl font-extrabold text-rose-500">{stats.severityBreakdown.high}</p>
                <div className="h-1 bg-gray-800 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${stats.totalGaps > 0 ? (stats.severityBreakdown.high / stats.totalGaps) * 100 : 0}%` }}
                  />
                </div>
              </div>

            </div>

            {/* Split layout: Recent reports vs Skill Gaps */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Plans Column (7 Cols) */}
              <div className="lg:col-span-7 bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-white">Recent Interview Plans</h2>
                  <Link to="/history" className="text-xs text-rose-500 hover:text-rose-400 font-semibold transition-colors">
                    View All
                  </Link>
                </div>

                {reports.length === 0 ? (
                  <div className="text-center py-10 text-xs text-gray-500 border border-dashed border-gray-800 rounded-xl">
                    No reports generated yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {reports.slice(0, 4).map((report) => (
                      <div
                        key={report._id}
                        onClick={() => navigate(`/interview/${report._id}`)}
                        className="bg-gray-900/40 hover:bg-gray-900/80 border border-gray-800/80 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors group"
                      >
                        <div className="min-w-0 flex-grow pr-4">
                          <h3 className="text-xs font-bold text-white leading-normal truncate group-hover:text-rose-400 transition-colors">
                            {report.jobDescription}
                          </h3>
                          <span className="text-[10px] text-gray-500 font-semibold block mt-1">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                            {report.matchScore}% Match
                          </span>
                          <svg className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skill Gaps Breakdown (5 Cols) */}
              <div className="lg:col-span-5 bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
                <div>
                  <h2 className="text-sm font-extrabold text-white">Skill Gaps Priority</h2>
                  <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                    Severity breakdown of all detected skill gaps.
                  </p>
                </div>

                {stats.totalGaps === 0 ? (
                  <div className="text-center py-10 text-xs text-gray-500 border border-dashed border-gray-800 rounded-xl">
                    No skill gaps found. You're in great shape!
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {/* High Severity */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">High Priority</span>
                        <span className="text-gray-400 font-semibold">{stats.severityBreakdown.high} Gaps</span>
                      </div>
                      <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800/40">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${stats.totalGaps > 0 ? (stats.severityBreakdown.high / stats.totalGaps) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Medium Severity */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">Medium Priority</span>
                        <span className="text-gray-400 font-semibold">{stats.severityBreakdown.medium} Gaps</span>
                      </div>
                      <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800/40">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${stats.totalGaps > 0 ? (stats.severityBreakdown.medium / stats.totalGaps) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Low Severity */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px]">Low Priority</span>
                        <span className="text-gray-400 font-semibold">{stats.severityBreakdown.low} Gaps</span>
                      </div>
                      <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800/40">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${stats.totalGaps > 0 ? (stats.severityBreakdown.low / stats.totalGaps) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
