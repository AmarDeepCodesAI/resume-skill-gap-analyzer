"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import ProgressRing from "../components/ProgressRing";
import SkillBadge from "../components/SkillBadge";
import { analyzeResumeSkills } from "../utils/analyzer";
import { Result } from "../types/result";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Home() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(420);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setPageWidth(Math.min(window.innerWidth * 0.35, 520));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const extractPdfText = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
    }).promise;

    let fullText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const pageText = content.items
        .map((item: any) => item.str)
        .join(" ");

      fullText += pageText + " ";
    }

    return fullText;
  };

  const handleResumeUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload only PDF file");
      return;
    }

    setResumeFile(file);
    setResult(null);
    setIsExtracting(true);

    try {
      const text = await extractPdfText(file);
      setResume(text);
    } catch (error) {
      console.error("PDF text extraction error:", error);
      alert("Failed to extract PDF text");
    } finally {
      setIsExtracting(false);
    }
  };

  const analyzeSkills = async () => {
    if (!resume.trim()) {
      alert("Please upload resume PDF or paste resume text");
      return;
    }

    if (!jd.trim()) {
      alert("Please paste job description");
      return;
    }

    const analysis = analyzeResumeSkills(resume, jd);
    setResult(analysis);
  };

  const downloadReport = () => {
    if (!result) return;

    const report = `
Resume Skill Gap Report

Match Score: ${result.percentage}%

Matched Skills:
${result.matchedSkills.join(", ") || "No matched skills found"}

Missing Skills:
${result.missingSkills.join(", ") || "No missing skills found"}

Suggestions:
${result.missingSkills.map((skill) => `Learn or improve ${skill}`).join("\n")}

Built by Amar Deep
Email: amard0819@gmail.com
`;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-skill-gap-report.txt";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <section className="max-w-7xl mx-auto">
        <div className="text-center">
          <p className="text-blue-400 font-semibold">Free Career Tool</p>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            Resume Skill Gap Analyzer
          </h1>

          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Upload your resume PDF or paste resume text, compare it with a job
            description, and instantly find matched skills, missing skills, and
            improvement areas.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-10">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <h2 className="font-semibold mb-3">Upload Resume PDF</h2>

            <input
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
              className="mb-4 block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-blue-700"
            />

            {isExtracting && (
              <p className="mb-3 text-yellow-400 text-sm">
                Extracting resume text...
              </p>
            )}

            {resumeFile && (
              <p className="mb-3 text-green-400 text-sm">
                Uploaded: {resumeFile.name}
              </p>
            )}

            {resumeFile && (
              <div className="mb-5 max-h-[600px] overflow-auto rounded-xl bg-slate-950 border border-slate-800 p-4">
                <Document
                  file={resumeFile}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={<p className="text-slate-400">Loading preview...</p>}
                  error={<p className="text-red-400">Failed to load PDF.</p>}
                >
                  {Array.from({ length: numPages }, (_, index) => (
                    <div
                      key={index}
                      className="mb-4 flex justify-center bg-white rounded-lg p-2"
                    >
                      <Page
                        pageNumber={index + 1}
                        width={pageWidth}
                        renderTextLayer
                        renderAnnotationLayer
                      />
                    </div>
                  ))}
                </Document>
              </div>
            )}

            <h2 className="font-semibold mb-3">Resume Text</h2>

            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={10}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              placeholder="Upload PDF or paste your resume text here..."
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="font-semibold">Paste Job Description</h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() =>
                  setJd("React Next.js TypeScript Redux Tailwind REST API Git")
                }
                className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-sm"
              >
                Frontend
              </button>

              <button
                onClick={() =>
                  setJd(
                    "React Node.js Express MongoDB JWT Redis Docker AWS Microservices"
                  )
                }
                className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-sm"
              >
                MERN
              </button>

              <button
                onClick={() =>
                  setJd("React Next.js Node.js PostgreSQL Docker AWS Git")
                }
                className="bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-sm"
              >
                Full Stack
              </button>
            </div>

            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={22}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white outline-none focus:border-blue-500"
              placeholder="Paste job description here..."
            />
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={analyzeSkills}
            disabled={isExtracting}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed px-8 py-3 rounded-xl font-semibold"
          >
            {isExtracting ? "Extracting..." : "Analyze Skills"}
          </button>
        </div>

        {result && (
          <div className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-950 rounded-xl p-6 text-center border border-slate-800">
                <ProgressRing percentage={result.percentage} />
              </div>

              <div className="bg-slate-950 rounded-xl p-6 border border-slate-800">
                <h3 className="font-semibold text-green-400">
                  Matched Skills
                </h3>

                <div className="flex flex-wrap gap-2 mt-4">
                  {result.matchedSkills.length > 0 ? (
                    result.matchedSkills.map((skill) => (
                      <SkillBadge key={skill} skill={skill} type="matched" />
                    ))
                  ) : (
                    <p className="text-slate-400">No matched skills found.</p>
                  )}
                </div>
              </div>

              <div className="bg-slate-950 rounded-xl p-6 border border-slate-800">
                <h3 className="font-semibold text-red-400">Missing Skills</h3>

                <div className="flex flex-wrap gap-2 mt-4">
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill) => (
                      <SkillBadge key={skill} skill={skill} type="missing" />
                    ))
                  ) : (
                    <p className="text-slate-400">No missing skills found.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-slate-950 rounded-xl p-6 border border-slate-800">
              <h3 className="text-xl font-semibold">Suggestions</h3>

              {result.missingSkills.length > 0 ? (
                <ul className="mt-4 space-y-2 text-slate-300">
                  {result.missingSkills.map((skill) => (
                    <li key={skill}>✅ Improve or learn {skill}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-green-400">
                  Great! Your resume matches the required skills well.
                </p>
              )}

              <button
                onClick={downloadReport}
                className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold"
              >
                Download Report
              </button>
            </div>
          </div>
        )}

        <footer className="mt-14 text-center text-slate-400">
          <p className="font-semibold text-white">Amar Deep</p>
          <p>amard0819@gmail.com</p>

          <a
            href="https://digitalheroesco.com"
            target="_blank"
            className="inline-block mt-5 bg-white text-black px-6 py-3 rounded-xl font-semibold"
          >
            Built for Digital Heroes
          </a>
        </footer>
      </section>
    </main>
  );
}