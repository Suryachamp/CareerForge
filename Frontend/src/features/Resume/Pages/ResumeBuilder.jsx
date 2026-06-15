import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../../../components/Navbar";
import { generateResume } from "../Services/resume.api";

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Target Job
  const [jobDescription, setJobDescription] = useState("");

  // Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    links: [{ label: "LinkedIn", url: "" }, { label: "GitHub", url: "" }],
  });

  // Summary
  const [summary, setSummary] = useState("");

  // Skills
  const [skills, setSkills] = useState([
    { category: "Languages", items: [""] },
    { category: "Frameworks & Libraries", items: [""] },
    { category: "Tools & Technologies", items: [""] },
  ]);

  // Experience
  const [experience, setExperience] = useState([
    { company: "", position: "", location: "", dateRange: "", highlights: [""] },
  ]);

  // Projects
  const [projects, setProjects] = useState([
    { title: "", technologies: "", date: "", link: "", highlights: [""] },
  ]);

  // Education
  const [education, setEducation] = useState([
    { institution: "", degree: "", location: "", dateRange: "", gpa: "" },
  ]);

  // Certifications
  const [certifications, setCertifications] = useState([
    { name: "", issuer: "", date: "" },
  ]);

  // Form Section Control (Tabs)
  const [activeFormTab, setActiveFormTab] = useState("personal"); // personal | skills | experience | projects | education | job

  // Link Helpers
  const handleLinkChange = (index, field, value) => {
    const updated = [...personalInfo.links];
    updated[index][field] = value;
    setPersonalInfo({ ...personalInfo, links: updated });
  };
  const addLink = () => {
    setPersonalInfo({
      ...personalInfo,
      links: [...personalInfo.links, { label: "", url: "" }],
    });
  };
  const removeLink = (index) => {
    const updated = personalInfo.links.filter((_, i) => i !== index);
    setPersonalInfo({ ...personalInfo, links: updated });
  };

  // Skill Helpers
  const handleSkillCategoryChange = (catIdx, value) => {
    const updated = [...skills];
    updated[catIdx].category = value;
    setSkills(updated);
  };
  const handleSkillItemChange = (catIdx, itemIdx, value) => {
    const updated = [...skills];
    updated[catIdx].items[itemIdx] = value;
    setSkills(updated);
  };
  const addSkillItem = (catIdx) => {
    const updated = [...skills];
    updated[catIdx].items.push("");
    setSkills(updated);
  };
  const removeSkillItem = (catIdx, itemIdx) => {
    const updated = [...skills];
    updated[catIdx].items = updated[catIdx].items.filter((_, i) => i !== itemIdx);
    setSkills(updated);
  };
  const addSkillCategory = () => {
    setSkills([...skills, { category: "", items: [""] }]);
  };
  const removeSkillCategory = (catIdx) => {
    setSkills(skills.filter((_, i) => i !== catIdx));
  };

  // Experience Helpers
  const handleExperienceChange = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };
  const handleExperienceHighlightChange = (expIdx, hlIdx, value) => {
    const updated = [...experience];
    updated[expIdx].highlights[hlIdx] = value;
    setExperience(updated);
  };
  const addExperienceHighlight = (expIdx) => {
    const updated = [...experience];
    updated[expIdx].highlights.push("");
    setExperience(updated);
  };
  const removeExperienceHighlight = (expIdx, hlIdx) => {
    const updated = [...experience];
    updated[expIdx].highlights = updated[expIdx].highlights.filter((_, i) => i !== hlIdx);
    setExperience(updated);
  };
  const addExperience = () => {
    setExperience([
      ...experience,
      { company: "", position: "", location: "", dateRange: "", highlights: [""] },
    ]);
  };
  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Projects Helpers
  const handleProjectChange = (index, field, value) => {
    const updated = [...projects];
    updated[index][field] = value;
    setProjects(updated);
  };
  const handleProjectHighlightChange = (projIdx, hlIdx, value) => {
    const updated = [...projects];
    updated[projIdx].highlights[hlIdx] = value;
    setProjects(updated);
  };
  const addProjectHighlight = (projIdx) => {
    const updated = [...projects];
    updated[projIdx].highlights.push("");
    setProjects(updated);
  };
  const removeProjectHighlight = (projIdx, hlIdx) => {
    const updated = [...projects];
    updated[projIdx].highlights = updated[projIdx].highlights.filter((_, i) => i !== hlIdx);
    setProjects(updated);
  };
  const addProject = () => {
    setProjects([
      ...projects,
      { title: "", technologies: "", date: "", link: "", highlights: [""] },
    ]);
  };
  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  // Education Helpers
  const handleEducationChange = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };
  const addEducation = () => {
    setEducation([
      ...education,
      { institution: "", degree: "", location: "", dateRange: "", gpa: "" },
    ]);
  };
  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Certifications Helpers
  const handleCertificationChange = (index, field, value) => {
    const updated = [...certifications];
    updated[index][field] = value;
    setCertifications(updated);
  };
  const addCertification = () => {
    setCertifications([...certifications, { name: "", issuer: "", date: "" }]);
  };
  const removeCertification = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!personalInfo.name.trim() || !personalInfo.email.trim() || !personalInfo.phone.trim() || !personalInfo.location.trim()) {
      setError("Please complete your Personal Details under the 'Personal Info' tab.");
      setActiveFormTab("personal");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Clean up empty entries
      const cleanedSkills = skills
        .map((s) => ({
          category: s.category.trim(),
          items: s.items.map((i) => i.trim()).filter(Boolean),
        }))
        .filter((s) => s.category && s.items.length > 0);

      const cleanedExperience = experience
        .map((exp) => ({
          ...exp,
          company: exp.company.trim(),
          position: exp.position.trim(),
          location: exp.location.trim(),
          dateRange: exp.dateRange.trim(),
          highlights: exp.highlights.map((h) => h.trim()).filter(Boolean),
        }))
        .filter((exp) => exp.company && exp.position);

      const cleanedProjects = projects
        .map((p) => ({
          ...p,
          title: p.title.trim(),
          technologies: p.technologies.trim(),
          date: p.date.trim(),
          link: p.link.trim(),
          highlights: p.highlights.map((h) => h.trim()).filter(Boolean),
        }))
        .filter((p) => p.title);

      const cleanedEducation = education
        .map((edu) => ({
          ...edu,
          institution: edu.institution.trim(),
          degree: edu.degree.trim(),
          location: edu.location.trim(),
          dateRange: edu.dateRange.trim(),
          gpa: edu.gpa.trim(),
        }))
        .filter((edu) => edu.institution && edu.degree);

      const cleanedCertifications = certifications
        .map((c) => ({
          name: c.name.trim(),
          issuer: c.issuer.trim(),
          date: c.date.trim(),
        }))
        .filter((c) => c.name);

      const cleanedLinks = personalInfo.links.filter((l) => l.label.trim() && l.url.trim());

      const payload = {
        personalInfo: { ...personalInfo, links: cleanedLinks },
        summary: summary.trim(),
        skills: cleanedSkills,
        experience: cleanedExperience,
        projects: cleanedProjects,
        education: cleanedEducation,
        certifications: cleanedCertifications,
        jobDescription: jobDescription.trim(),
      };

      const response = await generateResume(payload);
      if (response && response.resume && (response.resume.uuid || response.resume._id)) {
        navigate(`/resume/${response.resume.uuid || response.resume._id}`);
      } else {
        setError("Invalid response received from the resume generation service.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Could not generate resume. Please verify the backend connection and API key."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-300 font-sans flex flex-col justify-between">
      <Navbar />

      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="text-rose-500">★</span> ATS Resume Builder
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Create a recruiter-friendly, single-column resume optimized to score 90+ on ATS parsers.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="self-start px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-[#111827] border border-gray-800 rounded-3xl shadow-xl">
            <svg className="animate-spin h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-bold text-white">Refining & Optimizing Resume...</p>
              <p className="text-[11px] text-gray-500 mt-1">Our AI is rewriting bullet points, injecting keywords, and compiling the resume structure.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar Tabs (3 Cols) */}
            <aside className="lg:col-span-3 flex flex-col gap-2.5">
              <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-col gap-1 shadow-xl">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-2">Sections</p>
                
                {[
                  { id: "personal", label: "Personal Info" },
                  { id: "skills", label: "Skills Categories" },
                  { id: "experience", label: "Work Experience" },
                  { id: "projects", label: "Projects" },
                  { id: "education", label: "Education & Certs" },
                  { id: "job", label: "Target Job (ATS)" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFormTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      activeFormTab === tab.id
                        ? "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                        : "bg-transparent border border-transparent text-gray-400 hover:bg-gray-800/30 hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-950/40 border border-red-900/30 rounded-2xl p-4 text-red-400 text-xs leading-relaxed">
                  {error}
                </div>
              )}
            </aside>

            {/* Main Form Fields (9 Cols) */}
            <form onSubmit={handleSubmit} className="lg:col-span-9 bg-[#111827] border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between min-h-[500px]">
              
              <div className="flex-grow">
                {/* 1. PERSONAL INFO */}
                {activeFormTab === "personal" && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={personalInfo.name}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={personalInfo.email}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                          placeholder="e.g. johndoe@gmail.com"
                          className="bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Phone Number *</label>
                        <input
                          type="text"
                          required
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                          placeholder="e.g. +1 234 567 890"
                          className="bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Location *</label>
                        <input
                          type="text"
                          required
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                          placeholder="e.g. San Francisco, CA"
                          className="bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Links / Portfolios</label>
                        <button
                          type="button"
                          onClick={addLink}
                          className="text-rose-500 hover:text-rose-400 text-[11px] font-bold"
                        >
                          + Add Link
                        </button>
                      </div>

                      {personalInfo.links.map((link, idx) => (
                        <div key={idx} className="flex gap-3 items-center">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleLinkChange(idx, "label", e.target.value)}
                            placeholder="Label (e.g. LinkedIn)"
                            className="w-1/3 bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50"
                          />
                          <input
                            type="url"
                            value={link.url}
                            onChange={(e) => handleLinkChange(idx, "url", e.target.value)}
                            placeholder="URL (e.g. https://linkedin.com/in/johndoe)"
                            className="flex-grow bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50"
                          />
                          <button
                            type="button"
                            onClick={() => removeLink(idx)}
                            className="text-gray-500 hover:text-red-400 text-xs font-bold px-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-1.5 mt-2">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Professional Summary (Optional)</label>
                      <textarea
                        rows={3}
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        placeholder="Introduce yourself. Leave blank if you want our AI to write a high-impact summary automatically based on your experiences."
                        className="bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50 resize-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. SKILLS */}
                {activeFormTab === "skills" && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <h3 className="text-sm font-bold text-white">Skills Categories</h3>
                      <button
                        type="button"
                        onClick={addSkillCategory}
                        className="text-rose-500 hover:text-rose-400 text-xs font-bold"
                      >
                        + Add Category
                      </button>
                    </div>

                    {skills.map((skillCat, catIdx) => (
                      <div key={catIdx} className="bg-[#0b0f19] border border-gray-800/80 rounded-2xl p-4 flex flex-col gap-4 relative">
                        <button
                          type="button"
                          onClick={() => removeSkillCategory(catIdx)}
                          className="absolute right-4 top-4 text-gray-500 hover:text-red-400 text-xs font-bold"
                        >
                          Delete Category
                        </button>
                        
                        <div className="w-2/3 flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase">Category Title</label>
                          <input
                            type="text"
                            value={skillCat.category}
                            onChange={(e) => handleSkillCategoryChange(catIdx, e.target.value)}
                            placeholder="e.g. Languages, Libraries, DevOps"
                            className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500/50"
                          />
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Skill Tags</label>
                            <button
                              type="button"
                              onClick={() => addSkillItem(catIdx)}
                              className="text-rose-400 hover:text-rose-300 text-[10px] font-bold"
                            >
                              + Add Skill
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {skillCat.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center gap-1.5 bg-[#111827] border border-gray-800 rounded-xl px-2 py-1.5">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => handleSkillItemChange(catIdx, itemIdx, e.target.value)}
                                  placeholder="e.g. React"
                                  className="w-full bg-transparent text-xs text-white focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeSkillItem(catIdx, itemIdx)}
                                  className="text-gray-500 hover:text-red-400 text-xs font-bold"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. WORK EXPERIENCE */}
                {activeFormTab === "experience" && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <h3 className="text-sm font-bold text-white">Work Experience</h3>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="text-rose-500 hover:text-rose-400 text-xs font-bold"
                      >
                        + Add Position
                      </button>
                    </div>

                    {experience.map((exp, idx) => (
                      <div key={idx} className="bg-[#0b0f19] border border-gray-800/80 rounded-2xl p-5 flex flex-col gap-4 relative">
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="absolute right-5 top-5 text-gray-500 hover:text-red-400 text-xs font-bold"
                        >
                          Delete Position
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Company/Organization</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                              placeholder="e.g. Google"
                              className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Job Title</label>
                            <input
                              type="text"
                              value={exp.position}
                              onChange={(e) => handleExperienceChange(idx, "position", e.target.value)}
                              placeholder="e.g. Software Engineer"
                              className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Location</label>
                            <input
                              type="text"
                              value={exp.location}
                              onChange={(e) => handleExperienceChange(idx, "location", e.target.value)}
                              placeholder="e.g. New York, NY (or Remote)"
                              className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Date Range</label>
                            <input
                              type="text"
                              value={exp.dateRange}
                              onChange={(e) => handleExperienceChange(idx, "dateRange", e.target.value)}
                              placeholder="e.g. Jun 2024 - Present"
                              className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Bullet Highlights */}
                        <div className="flex flex-col gap-3 mt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Key Achievements / Highlights</label>
                            <button
                              type="button"
                              onClick={() => addExperienceHighlight(idx)}
                              className="text-rose-400 hover:text-rose-300 text-[10px] font-bold"
                            >
                              + Add Bullet
                            </button>
                          </div>

                          {exp.highlights.map((hl, hlIdx) => (
                            <div key={hlIdx} className="flex gap-2 items-start">
                              <textarea
                                rows={2}
                                value={hl}
                                onChange={(e) => handleExperienceHighlightChange(idx, hlIdx, e.target.value)}
                                placeholder="Explain what you accomplished, metrics achieved, and libraries used."
                                className="flex-grow bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-700 resize-none focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => removeExperienceHighlight(idx, hlIdx)}
                                className="text-gray-500 hover:text-red-400 text-xs font-bold pt-2 px-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. PROJECTS */}
                {activeFormTab === "projects" && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                      <h3 className="text-sm font-bold text-white">Projects</h3>
                      <button
                        type="button"
                        onClick={addProject}
                        className="text-rose-500 hover:text-rose-400 text-xs font-bold"
                      >
                        + Add Project
                      </button>
                    </div>

                    {projects.map((p, idx) => (
                      <div key={idx} className="bg-[#0b0f19] border border-gray-800/80 rounded-2xl p-5 flex flex-col gap-4 relative">
                        <button
                          type="button"
                          onClick={() => removeProject(idx)}
                          className="absolute right-5 top-5 text-gray-500 hover:text-red-400 text-xs font-bold"
                        >
                          Delete Project
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Project Title</label>
                            <input
                              type="text"
                              value={p.title}
                              onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                              placeholder="e.g. Budget Box"
                              className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Technologies Used</label>
                            <input
                              type="text"
                              value={p.technologies}
                              onChange={(e) => handleProjectChange(idx, "technologies", e.target.value)}
                              placeholder="e.g. React, Node.js, PostgreSQL"
                              className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Date / Timeline</label>
                            <input
                              type="text"
                              value={p.date}
                              onChange={(e) => handleProjectChange(idx, "date", e.target.value)}
                              placeholder="e.g. Nov 2025"
                              className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Project Link (Optional)</label>
                            <input
                              type="text"
                              value={p.link}
                              onChange={(e) => handleProjectChange(idx, "link", e.target.value)}
                              placeholder="e.g. https://github.com/..."
                              className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Bullet Highlights */}
                        <div className="flex flex-col gap-3 mt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-gray-500 uppercase">Highlights / Tasks</label>
                            <button
                              type="button"
                              onClick={() => addProjectHighlight(idx)}
                              className="text-rose-400 hover:text-rose-300 text-[10px] font-bold"
                            >
                              + Add Bullet
                            </button>
                          </div>

                          {p.highlights.map((hl, hlIdx) => (
                            <div key={hlIdx} className="flex gap-2 items-start">
                              <textarea
                                rows={2}
                                value={hl}
                                onChange={(e) => handleProjectHighlightChange(idx, hlIdx, e.target.value)}
                                placeholder="Accomplished X, measured by Y, by doing Z."
                                className="flex-grow bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-700 resize-none focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => removeProjectHighlight(idx, hlIdx)}
                                className="text-gray-500 hover:text-red-400 text-xs font-bold pt-2 px-1"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. EDUCATION & CERTS */}
                {activeFormTab === "education" && (
                  <div className="flex flex-col gap-8 animate-fadeIn">
                    
                    {/* Education */}
                    <div className="flex flex-col gap-5">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <h3 className="text-sm font-bold text-white">Education</h3>
                        <button
                          type="button"
                          onClick={addEducation}
                          className="text-rose-500 hover:text-rose-400 text-xs font-bold"
                        >
                          + Add Education
                        </button>
                      </div>

                      {education.map((edu, idx) => (
                        <div key={idx} className="bg-[#0b0f19] border border-gray-800/80 rounded-2xl p-5 flex flex-col gap-4 relative">
                          <button
                            type="button"
                            onClick={() => removeEducation(idx)}
                            className="absolute right-5 top-5 text-gray-500 hover:text-red-400 text-xs font-bold"
                          >
                            Delete
                          </button>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">School / University</label>
                              <input
                                type="text"
                                value={edu.institution}
                                onChange={(e) => handleEducationChange(idx, "institution", e.target.value)}
                                placeholder="e.g. Stanford University"
                                className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Degree & Major</label>
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
                                placeholder="e.g. Bachelor of Science in Computer Science"
                                className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Location</label>
                              <input
                                type="text"
                                value={edu.location}
                                onChange={(e) => handleEducationChange(idx, "location", e.target.value)}
                                placeholder="e.g. Stanford, CA"
                                className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Date Range / Graduation</label>
                              <input
                                type="text"
                                value={edu.dateRange}
                                onChange={(e) => handleEducationChange(idx, "dateRange", e.target.value)}
                                placeholder="e.g. 2022 - 2026"
                                className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5 sm:col-span-2">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">GPA / Percentage / Score (Optional)</label>
                              <input
                                type="text"
                                value={edu.gpa}
                                onChange={(e) => handleEducationChange(idx, "gpa", e.target.value)}
                                placeholder="e.g. GPA: 3.8/4.0 or GPA: 8.5/10"
                                className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Certifications */}
                    <div className="flex flex-col gap-5">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <h3 className="text-sm font-bold text-white">Certifications</h3>
                        <button
                          type="button"
                          onClick={addCertification}
                          className="text-rose-500 hover:text-rose-400 text-xs font-bold"
                        >
                          + Add Certification
                        </button>
                      </div>

                      {certifications.map((cert, idx) => (
                        <div key={idx} className="bg-[#0b0f19] border border-gray-800/80 rounded-2xl p-5 flex flex-col gap-4 relative">
                          <button
                            type="button"
                            onClick={() => removeCertification(idx)}
                            className="absolute right-5 top-5 text-gray-500 hover:text-red-400 text-xs font-bold"
                          >
                            Delete
                          </button>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Certification Name</label>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => handleCertificationChange(idx, "name", e.target.value)}
                                placeholder="e.g. AWS Certified Solutions Architect"
                                className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Issuing Authority</label>
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => handleCertificationChange(idx, "issuer", e.target.value)}
                                placeholder="e.g. Amazon Web Services (AWS)"
                                className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold text-gray-500 uppercase">Date Issued</label>
                              <input
                                type="text"
                                value={cert.date}
                                onChange={(e) => handleCertificationChange(idx, "date", e.target.value)}
                                placeholder="e.g. Jan 2025"
                                className="bg-[#111827] border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. TARGET JOB DESCRIPTION */}
                {activeFormTab === "job" && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    <h3 className="text-sm font-bold text-white border-b border-gray-800 pb-2">Target Job Description</h3>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Target Role Job Description</label>
                      <textarea
                        rows={10}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description of the position you are targeting here. Our AI will analyze it, identify primary keywords, match competencies, and tailor the resume details so that it scores above 90 on recruitment algorithms."
                        className="bg-[#0b0f19] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-rose-500/50 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Actions Footer */}
              <div className="border-t border-gray-800 pt-6 mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ["personal", "skills", "experience", "projects", "education", "job"];
                    const currentIdx = tabs.indexOf(activeFormTab);
                    if (currentIdx > 0) setActiveFormTab(tabs[currentIdx - 1]);
                  }}
                  disabled={activeFormTab === "personal"}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous Tab
                </button>

                {activeFormTab === "job" ? (
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/10 flex items-center gap-1.5"
                  >
                    ★ Generate & Optimize ATS Resume
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const tabs = ["personal", "skills", "experience", "projects", "education", "job"];
                      const currentIdx = tabs.indexOf(activeFormTab);
                      if (currentIdx < tabs.length - 1) setActiveFormTab(tabs[currentIdx + 1]);
                    }}
                    className="px-4 py-2.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition-all"
                  >
                    Next Tab
                  </button>
                )}
              </div>

            </form>
          </div>
        )}

      </main>
    </div>
  );
};

export default ResumeBuilder;
