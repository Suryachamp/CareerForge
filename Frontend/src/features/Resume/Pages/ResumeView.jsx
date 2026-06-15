import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Navbar from "../../../components/Navbar";
import { getResume } from "../Services/resume.api";

// 1. LaTeX cleaner for visual preview text sanitization

// 1b. LaTeX Syntax Highlighter for visual separation of code and content
const highlightLatex = (code) => {
  if (!code) return "";
  
  // Escape HTML entities to prevent XSS and rendering errors
  let escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Highlight comments (starting with % to the end of the line)
  const comments = [];
  escaped = escaped.replace(/(^|[^\\])%.*/g, (match) => {
    comments.push(`<span class="text-gray-500 italic font-medium">${match}</span>`);
    return `___COMMENT_PLACEHOLDER_${comments.length - 1}___`;
  });

  // Highlight LaTeX commands (starts with \ and then letters, e.g., \documentclass)
  escaped = escaped.replace(/\\([a-zA-Z]+)/g, '<span class="text-rose-400 font-semibold">\\$1</span>');

  // Highlight brackets and braces
  escaped = escaped.replace(/([{}|[\]])/g, '<span class="text-amber-400 font-bold">$1</span>');

  // Highlight special escaped characters
  escaped = escaped.replace(/\\([&_$%#{}])/g, '<span class="text-rose-400 font-semibold">\\$1</span>');

  // Restore comments
  comments.forEach((commentSpan, idx) => {
    escaped = escaped.replace(`___COMMENT_PLACEHOLDER_${idx}___`, commentSpan);
  });

  return escaped;
};

// 2. Real-time LaTeX Parser to HTML representation
const parseLatexToHtml = (latex) => {
  if (!latex) {
    return { name: "", email: "", phone: "", location: "", links: [], sections: [] };
  }

  const cleanLatexStr = (str) => {
    if (!str) return "";
    return str
      .replace(/\\%/g, "%")
      .replace(/\\&/g, "&")
      .replace(/\\\$/g, "$")
      .replace(/\\#/g, "#")
      .replace(/\\_/g, "_")
      .replace(/\\{/g, "{")
      .replace(/\\}/g, "}")
      .replace(/\\textasciitilde\{\}/g, "~")
      .replace(/\\textasciicircum\{\}/g, "^")
      .replace(/\\textbackslash\{\}/g, "\\")
      .replace(/--/g, "–") // en dash
      .trim();
  };

  const formatText = (str) => {
    if (!str) return "";
    let formatted = str;
    
    // Bold, italics, underline, href, emph, small
    let prev;
    let iterations = 0;
    do {
      prev = formatted;
      formatted = formatted.replace(/\\textbf\s*\{([^{}]+)\}/g, "<strong>$1</strong>");
      formatted = formatted.replace(/\\textit\s*\{([^{}]+)\}/g, "<em>$1</em>");
      formatted = formatted.replace(/\\emph\s*\{([^{}]+)\}/g, "<em>$1</em>");
      formatted = formatted.replace(/\\underline\s*\{([^{}]+)\}/g, "<u>$1</u>");
      formatted = formatted.replace(/\\href\s*\{([^}]+)\}\s*\{([^}]+)\}/g, '<a href="$1" target="_blank" class="text-blue-900 underline">$2</a>');
      formatted = formatted.replace(/\\small/g, "");
      iterations++;
    } while (formatted !== prev && iterations < 10);

    return cleanLatexStr(formatted);
  };

  // Split lines and strip comments (lines/portions starting with % not escaped by \%)
  const lines = latex.split("\n");
  const cleanLines = lines.map(line => {
    let cleanLine = "";
    let isEscaped = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "\\" && !isEscaped) {
        isEscaped = true;
        cleanLine += line[i];
      } else if (line[i] === "%" && !isEscaped) {
        break; // Stop parsing this line, treat the rest as a comment
      } else {
        isEscaped = false;
        cleanLine += line[i];
      }
    }
    return cleanLine;
  });

  const cleanBody = cleanLines.join("\n");

  // Extract Document Body
  const docMatch = cleanBody.match(/\\begin\{document\}([\s\S]*)\\end\{document\}/);
  const body = docMatch ? docMatch[1] : cleanBody;

  // Extract Header details (everything before the first section command)
  const firstSectionIdx = body.indexOf("\\section");
  const headerText = firstSectionIdx !== -1 ? body.substring(0, firstSectionIdx) : body;
  const sectionsText = firstSectionIdx !== -1 ? body.substring(firstSectionIdx) : "";

  // Parse Name from Header
  let name = "";
  let nameMatch = null;
  const namePatterns = [
    /\{\s*(?:\\Huge|\\huge|\\Large|\\large)\s*\\textbf\s*\{([^}]+)\}\s*\}/i,
    /\\textbf\s*\{\s*(?:\\Huge|\\huge|\\Large|\\large)\s*\{?([^}]+)\}?\s*\}/i,
    /(?:\\Huge|\\huge|\\Large|\\large)\s*\\textbf\s*\{([^}]+)\}/i,
    /(?:\\Huge|\\huge|\\Large|\\large)\s*\{([^}]+)\}/i,
    /\\textbf\s*\{\s*(?:\\Huge|\\huge|\\Large|\\large)\s*([^}]+)\}/i
  ];

  for (const pattern of namePatterns) {
    const match = headerText.match(pattern);
    if (match) {
      nameMatch = match;
      name = cleanLatexStr(match[1]);
      break;
    }
  }

  // Parse Email
  const emailMatch = headerText.match(/\\href\s*\{\s*mailto:([^}]+)\s*\}\s*\{\s*([^}]+)\s*\}/i);
  const email = emailMatch ? emailMatch[1] : "";

  // Parse Links
  const links = [];
  const hrefRegex = /\\href\s*\{\s*([^}]+)\s*\}\s*\{\s*([^}]+)\s*\}/gi;
  let match;
  while ((match = hrefRegex.exec(headerText)) !== null) {
    if (!match[1].startsWith("mailto:")) {
      links.push({ url: match[1], label: cleanLatexStr(match[2]) });
    }
  }

  // Find Phone & Location
  let cleanHeaderParts = headerText;
  if (nameMatch) {
    cleanHeaderParts = cleanHeaderParts.replace(nameMatch[0], "");
  }

  cleanHeaderParts = cleanHeaderParts
    .replace(/(?:\\Huge|\\huge|\\Large|\\large)[\s\S]*?(?:\\\\|\\end\{center\}|$)/i, "")
    .replace(/\\href\s*\{[^}]+\}\s*\{[^}]+\}/gi, "")
    .replace(/\\begin\{center\}/gi, "")
    .replace(/\\end\{center\}/gi, "")
    .replace(/\\small/gi, "")
    .replace(/\\\\/gi, "")
    .replace(/\$/g, "") // Remove math-mode dollar signs
    .replace(/\s+/g, " ")
    .trim();

  const parts = cleanHeaderParts.split(/[••*|]|\$\|\$|\\cdot|\\textbullet/g)
    .map(p => cleanLatexStr(p))
    .filter(p => p.length > 2);

  let phone = "";
  let location = "";
  parts.forEach(p => {
    if (/\+?\d[\d\s-]{7,}/.test(p)) {
      phone = p;
    } else if (p.length > 3 && !location && !p.includes("mailto:") && !p.includes("http")) {
      location = p;
    }
  });

  // Parse Sections
  const sections = [];
  const sectionSplitRegex = /\\section\*?\s*\{([^}]+)\}/gi;
  let secMatch;
  let sectionIndices = [];
  while ((secMatch = sectionSplitRegex.exec(sectionsText)) !== null) {
    sectionIndices.push({
      title: secMatch[1],
      index: secMatch.index,
      contentStart: secMatch.index + secMatch[0].length
    });
  }

  for (let i = 0; i < sectionIndices.length; i++) {
    const start = sectionIndices[i].contentStart;
    const end = (i + 1 < sectionIndices.length) ? sectionIndices[i + 1].index : sectionsText.length;
    const secContent = sectionsText.substring(start, end);

    const parsedContent = parseSectionContent(secContent, formatText);
    sections.push({
      title: cleanLatexStr(sectionIndices[i].title),
      content: parsedContent
    });
  }

  return {
    name,
    email,
    phone,
    location,
    links,
    sections
  };
};

const parseSectionContent = (text, formatText) => {
  const lines = text.split("\n");
  const parsed = [];

  const subheadingRegex = /\\resumeSubheading\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}/i;
  const projectHeadingRegex = /\\resumeProjectHeading\s*\{([^}]*)\}\s*\{([^}]*)\}/i;
  const itemRegex = /\\resumeItem\s*\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/i;
  const standardItemRegex = /\\item\s*([\s\S]*)/i;

  let currentSubheading = null;
  let currentProject = null;
  let currentBullets = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Subheading (Company, Date, Role, Location)
    const subMatch = line.match(subheadingRegex);
    if (subMatch) {
      if (currentSubheading || currentProject || currentBullets.length > 0) {
        parsed.push({
          type: currentSubheading ? "subheading" : (currentProject ? "project" : "bullets"),
          data: currentSubheading || currentProject || null,
          bullets: currentBullets
        });
        currentProject = null;
        currentBullets = [];
      }
      currentSubheading = {
        company: formatText(subMatch[1]),
        date: formatText(subMatch[2]),
        position: formatText(subMatch[3]),
        location: formatText(subMatch[4])
      };
      continue;
    }

    // Project Heading (Title, Tech, Date)
    const projMatch = line.match(projectHeadingRegex);
    if (projMatch) {
      if (currentSubheading || currentProject || currentBullets.length > 0) {
        parsed.push({
          type: currentSubheading ? "subheading" : (currentProject ? "project" : "bullets"),
          data: currentSubheading || currentProject || null,
          bullets: currentBullets
        });
        currentSubheading = null;
        currentBullets = [];
      }
      currentProject = {
        title: formatText(projMatch[1]),
        date: formatText(projMatch[2])
      };
      continue;
    }

    // Bullet Point Item
    const itemMatch = line.match(itemRegex) || line.match(standardItemRegex);
    if (itemMatch) {
      currentBullets.push(formatText(itemMatch[1]));
      continue;
    }

    // General Paragraph or Skills Grid line
    if (!line.startsWith("\\") && !line.startsWith("}")) {
      if (currentSubheading || currentProject || currentBullets.length > 0) {
        parsed.push({
          type: currentSubheading ? "subheading" : (currentProject ? "project" : "bullets"),
          data: currentSubheading || currentProject || null,
          bullets: currentBullets
        });
        currentSubheading = null;
        currentProject = null;
        currentBullets = [];
      }
      parsed.push({
        type: "text",
        text: formatText(line)
      });
    }
  }

  // Flush remaining
  if (currentSubheading || currentProject || currentBullets.length > 0) {
    parsed.push({
      type: currentSubheading ? "subheading" : (currentProject ? "project" : "bullets"),
      data: currentSubheading || currentProject || null,
      bullets: currentBullets
    });
  }

  return parsed;
};

// 3. Render HTML visual resume sheet
const renderParsedLatex = (parsed) => {
  if (!parsed) return null;

  return (
    <div id="resume-sheet" className="max-w-[800px] mx-auto text-left font-serif leading-relaxed text-sm">
      {/* Header */}
      <div className="header-center text-center pb-2 mb-4">
        <div className="header-name text-2xl font-bold uppercase tracking-wide">
          {parsed.name || "YOUR NAME"}
        </div>
        <div className="header-links text-xs text-gray-700 flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
          {parsed.phone && <span>{parsed.phone}</span>}
          {parsed.phone && parsed.email && <span>•</span>}
          {parsed.email && (
            <a href={`mailto:${parsed.email}`} className="text-blue-900 underline">
              {parsed.email}
            </a>
          )}
          {(parsed.phone || parsed.email) && parsed.location && <span>•</span>}
          {parsed.location && <span>{parsed.location}</span>}
          {parsed.links?.map((link, idx) => (
            <React.Fragment key={idx}>
              <span>•</span>
              <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-900 underline">
                {link.label}
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Sections */}
      {parsed.sections?.map((section, secIdx) => {
        if (!section.title) return null;

        return (
          <div key={secIdx} className="mb-4">
            <div className="section-title text-[11px] font-bold uppercase border-b border-black pb-0.5 mb-2 mt-4 tracking-wider">
              {section.title}
            </div>

            {section.content?.map((item, itemIdx) => {
              if (item.type === "text") {
                return (
                  <div
                    key={itemIdx}
                    className="summary-text text-xs text-justify mb-2"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                );
              }

              if (item.type === "subheading" && item.data) {
                return (
                  <div key={itemIdx} className="mb-3">
                    <div className="item-header flex justify-between font-bold text-xs">
                      <span dangerouslySetInnerHTML={{ __html: item.data.company }} />
                      <span dangerouslySetInnerHTML={{ __html: item.data.date }} />
                    </div>
                    <div className="item-subheader flex justify-between italic text-xs text-gray-700">
                      <span dangerouslySetInnerHTML={{ __html: item.data.position }} />
                      <span dangerouslySetInnerHTML={{ __html: item.data.location }} />
                    </div>
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="list-disc pl-5 mt-1">
                        {item.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="text-xs text-justify mb-0.5"
                            dangerouslySetInnerHTML={{ __html: bullet }}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

              if (item.type === "project" && item.data) {
                return (
                  <div key={itemIdx} className="mb-3">
                    <div className="item-header flex justify-between font-bold text-xs">
                      <span dangerouslySetInnerHTML={{ __html: item.data.title }} />
                      <span dangerouslySetInnerHTML={{ __html: item.data.date }} />
                    </div>
                    {item.bullets && item.bullets.length > 0 && (
                      <ul className="list-disc pl-5 mt-1">
                        {item.bullets.map((bullet, bIdx) => (
                          <li
                            key={bIdx}
                            className="text-xs text-justify mb-0.5"
                            dangerouslySetInnerHTML={{ __html: bullet }}
                          />
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

              if (item.type === "bullets" && item.bullets && item.bullets.length > 0) {
                return (
                  <ul key={itemIdx} className="list-disc pl-5 mb-2">
                    {item.bullets.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="text-xs text-justify mb-0.5"
                        dangerouslySetInnerHTML={{ __html: bullet }}
                      />
                    ))}
                  </ul>
                );
              }

              return null;
            })}
          </div>
        );
      })}
    </div>
  );
};

const ResumeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePane, setActivePane] = useState("preview"); // 'preview' | 'ats'
  const [copied, setCopied] = useState(false);
  const [latexCode, setLatexCode] = useState("");
  const [parsedResume, setParsedResume] = useState(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleCompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      try {
        const parsed = parseLatexToHtml(latexCode);
        setParsedResume(parsed);
        setActivePane("preview");
      } catch (err) {
        console.error("LaTeX compilation error:", err);
      } finally {
        setIsCompiling(false);
      }
    }, 450);
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const data = await getResume(id);
        if (data && data.resume) {
          setResume(data.resume);
          setLatexCode(data.resume.latexCode);
          try {
            const parsed = parseLatexToHtml(data.resume.latexCode);
            setParsedResume(parsed);
          } catch (e) {
            console.error("Initial LaTeX parsing failed:", e);
          }
        } else {
          setError("Failed to load resume details.");
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            "Could not fetch resume details. Please ensure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResume();
    }
  }, [id]);

  const handleCopyCode = () => {
    if (!latexCode) return;
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    if (!latexCode) return;
    const blob = new Blob([latexCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(parsedResume?.name || "Resume").replace(/\s+/g, "_")}_Resume.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    const printContent = document.getElementById("resume-sheet");
    if (!printContent) return;

    // Create an iframe to hold the print layout, styling it correctly for print
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${parsedResume?.name || "Resume"} - Printed Output</title>
          <style>
            @page {
              size: letter;
              margin: 0; /* Clear default browser headers & footers */
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              color: #000;
              margin: 0;
              padding: 0.5in 0.6in; /* Standard paper margin spacing */
              line-height: 1.35;
              font-size: 10pt;
            }
            .header-center {
              text-align: center !important;
              margin-bottom: 12px !important;
            }
            .header-name {
              font-size: 18pt !important;
              font-weight: bold !important;
              text-transform: uppercase !important;
              letter-spacing: 0.5px !important;
              margin-bottom: 3px !important;
              text-align: center !important;
            }
            .header-links {
              font-size: 9pt !important;
              color: #333 !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              flex-wrap: wrap !important;
              gap: 8px !important;
              margin-top: 4px !important;
            }
            .header-links a, a {
              color: #000 !important;
              text-decoration: none !important;
            }
            .section-title {
              font-size: 11.5pt !important;
              font-weight: bold !important;
              text-transform: uppercase !important;
              border-bottom: 1px solid #000 !important;
              margin-top: 14px !important;
              margin-bottom: 6px !important;
              padding-bottom: 2px !important;
              letter-spacing: 0.5px !important;
            }
            .summary-text {
              font-size: 9.5pt !important;
              text-align: justify !important;
              margin-bottom: 8px !important;
              line-height: 1.35 !important;
            }
            .item-header {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              font-weight: bold !important;
              font-size: 9.5pt !important;
              margin-top: 6px !important;
            }
            .item-subheader {
              display: flex !important;
              justify-content: space-between !important;
              align-items: center !important;
              font-style: italic !important;
              font-size: 9pt !important;
              color: #444 !important;
              margin-bottom: 2px !important;
            }
            .skills-grid {
              font-size: 9.5pt !important;
              margin-top: 4px !important;
            }
            .skills-row {
              margin-bottom: 3px !important;
            }
            .skills-category {
              font-weight: bold !important;
            }
            .edu-gpa {
              font-size: 9.5pt !important;
              margin-top: 2px !important;
            }
            ul {
              margin: 2px 0 6px 0 !important;
              padding-left: 20px !important;
              list-style-type: disc !important;
            }
            li {
              font-size: 9.5pt !important;
              line-height: 1.35 !important;
              margin-bottom: 2px !important;
              text-align: justify !important;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    doc.close();

    // Trigger print
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      
      // Delay iframe removal on iOS / mobile Safari to prevent blank print dialogs
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch (e) {
          // Ignore if already removed
        }
      }, 2000);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-gray-300 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-10 w-10 border-2 border-rose-500/20 border-t-rose-500 rounded-full" />
          <p className="text-sm font-semibold tracking-wide text-gray-400">Loading your optimized resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center px-4 text-gray-300 font-sans">
        <div className="max-w-md w-full bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-2xl text-center">
          <h2 className="text-lg font-bold text-white mb-2">Failed to load resume</h2>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[13px] font-bold cursor-pointer transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <header className="border-b border-gray-800 bg-[#111827]/60 backdrop-blur px-6 py-4">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between" style={{padding:"0 20px"}}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 bg-gray-800/40 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">{parsedResume?.name || resume.personalInfo.name}</h1>
              <p className="text-[11px] text-rose-500 font-semibold tracking-wide uppercase">ATS Real-Time Workspace</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrintPDF}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/10 cursor-pointer flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main split workspace grid */}
      <div className="flex-grow max-w-[1440px] w-full mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column - LaTeX Code Editor */}
        <div className="flex flex-col gap-4 bg-[#111827] border border-gray-800 rounded-2xl p-5 shadow-xl min-h-[75vh]">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Source Editor</span>
              <span className="text-[9px] bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 font-bold">Editable</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                {copied ? "✓ Copied!" : "Copy Code"}
              </button>
              <button
                onClick={handleDownloadTex}
                className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Download .tex
              </button>
            </div>
          </div>

          <div className="flex-grow w-full bg-[#0b0f19] border border-gray-800 rounded-xl relative min-h-[65vh] overflow-hidden focus-within:border-rose-500/30">
            {/* Highlight Overlay (Pre-rendered content aligned underneath) */}
            <pre
              className="absolute inset-0 p-5 text-[12px] font-mono leading-relaxed whitespace-pre-wrap break-all overflow-y-auto select-none pointer-events-none text-gray-200 z-0 bg-[#0b0f19] border-none"
              dangerouslySetInnerHTML={{ __html: highlightLatex(latexCode) + "\n" }}
              id="latex-highlight-overlay"
            />

            {/* Actual Editable Input Textarea (Transparent but captures inputs/scrolling) */}
            <textarea
              value={latexCode}
              onChange={(e) => {
                setLatexCode(e.target.value);
              }}
              onScroll={(e) => {
                const overlay = document.getElementById("latex-highlight-overlay");
                if (overlay) {
                  overlay.scrollTop = e.target.scrollTop;
                  overlay.scrollLeft = e.target.scrollLeft;
                }
              }}
              className="absolute inset-0 w-full h-full bg-transparent p-5 text-[12px] font-mono text-transparent caret-rose-500 leading-relaxed focus:outline-none resize-none overflow-y-auto z-10 whitespace-pre-wrap break-all"
              placeholder="Type or paste your resume source code here..."
              spellCheck="false"
            />
          </div>
        </div>

        {/* Right Column - Live Preview / ATS Tabs */}
        <div className="flex flex-col gap-4 min-h-[75vh]">
          
          {/* Header Controls for Live view */}
          <div className="bg-[#111827] border border-gray-800 rounded-2xl p-3 flex items-center justify-between shadow-xl">
            <div className="flex gap-2">
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                title="Compile Resume Source"
                className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center ${
                  activePane === "preview"
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                {isCompiling ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setActivePane("ats")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activePane === "ats"
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/10"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-300"
                }`}
              >
                ATS Optimization Info
              </button>
            </div>

            {/* ATS Score display */}
            <div className="flex items-center gap-3 pr-2 border-l border-gray-800 pl-4">
              <div className="text-right">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">ATS SCORE</p>
                <p className="text-[10px] text-gray-400">Estimate</p>
              </div>
              <span className={`text-lg font-black px-2.5 py-1 rounded-lg ${
                resume.atsScoreEstimate >= 90 
                  ? "bg-emerald-950/40 border border-emerald-500/20 text-emerald-400" 
                  : "bg-amber-950/40 border border-amber-500/20 text-amber-400"
              }`}>
                {resume.atsScoreEstimate}%
              </span>
            </div>
          </div>

          {/* Active Pane: Visual Preview */}
          {activePane === "preview" && (
            <div className="flex-grow flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500 uppercase">Compiled Sheet Preview</span>
                <span className="text-[10px] text-gray-400 italic">Adjust scale if document is multiple pages. Standard target is 1 page.</span>
              </div>
              
              {/* Sheet container */}
              <div className="bg-white border border-gray-200 shadow-2xl p-8 rounded-xl text-black select-text overflow-y-auto max-h-[70vh]">
                {renderParsedLatex(parsedResume)}
              </div>
            </div>
          )}

          {/* Active Pane: ATS Score & Feedback */}
          {activePane === "ats" && (
            <div className="flex-grow bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col gap-6 animate-fadeIn max-h-[75vh] overflow-y-auto">
              <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
                <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <h3 className="text-sm font-bold text-white">ATS Optimization Review</h3>
              </div>

              {/* Feedback Points */}
              <div className="flex flex-col gap-4">
                <div className="bg-emerald-950/20 border border-emerald-500/15 rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-emerald-400 mb-2">Why this layout passes ATS:</h4>
                  <ul className="list-disc pl-5 text-[11px] text-gray-400 space-y-1">
                    <li>Single-column layout ensures correct reading order on simple table/grid systems.</li>
                    <li>Clean section rules (titlerule) and clear subheadings match indexing patterns.</li>
                    <li>Clean ASCII character encoding avoids custom typeface parsing failures.</li>
                    <li>No complex tables, images, chart bars, or multi-column grids that confuse parsers.</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Key Tailoring Suggestions</span>
                  {resume.atsFeedback && resume.atsFeedback.length > 0 ? (
                    resume.atsFeedback.map((fb, idx) => (
                      <div key={idx} className="bg-gray-900/40 border border-gray-800 p-4 rounded-xl text-xs leading-relaxed text-gray-300">
                        {fb}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 italic p-3 text-center bg-gray-900/40 border border-gray-800 rounded-xl">
                      No further ATS feedback generated. The resume is fully tailored and ready to submit!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default ResumeView;
