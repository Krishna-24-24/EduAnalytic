import { useState, useMemo } from "react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, ScatterChart, Scatter, ZAxis, ReferenceLine, Legend,
  AreaChart, Area
} from "recharts";
import "./App.css";

/* ═══════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════ */
const DATA = {
  institution: "Vellore Institute of Technology",
  department: "Computer Science & Engineering",
  class: "B.Tech CSE",
  semester: "Semester IV",
  academicYear: "2025–26",
  examType: "End Semester Examination",
  maxMarks: 100,
  passMarks: 40,
  subjects: [
    { code: "CS501", name: "Design & Analysis of Algorithms", short: "DAA", faculty: "Dr. Meenakshi R." },
    { code: "CS502", name: "Database Management Systems",    short: "DBMS", faculty: "Prof. Suresh K." },
    { code: "CS503", name: "Operating Systems",             short: "OS",   faculty: "Dr. Priya N." },
    { code: "CS504", name: "Computer Networks",             short: "CN",   faculty: "Prof. Anand V." },
    { code: "CS505", name: "Software Engineering",          short: "SE",   faculty: "Dr. Lakshmi P." },
    { code: "CS506", name: "Theory of Computation",         short: "TOC",  faculty: "Prof. Rajan M." },
  ],
  students: [
    { id: "24BCE110", name: "Aditya Krishnamurthy", gender: "M", attendance: 94, marks: [82, 91, 78, 88, 85, 72] },
    { id: "24BCE111", name: "Ananya Subramanian",   gender: "F", attendance: 98, marks: [95, 97, 93, 92, 96, 90] },
    { id: "24BCE112", name: "Arjun Balakrishnan",   gender: "M", attendance: 71, marks: [48, 55, 42, 51, 60, 38] },
    { id: "24BCE113", name: "Bhavya Venkatesh",     gender: "F", attendance: 89, marks: [76, 82, 73, 79, 71, 68] },
    { id: "24BCE114", name: "Chandan Rao",          gender: "M", attendance: 65, marks: [38, 44, 35, 47, 41, 32] },
    { id: "24BCE115", name: "Deepika Mohan",        gender: "F", attendance: 92, marks: [88, 84, 90, 86, 83, 79] },
    { id: "24BCE116", name: "Ganesh Iyer",          gender: "M", attendance: 78, marks: [62, 68, 57, 70, 64, 59] },
    { id: "24BCE117", name: "Harini Nair",          gender: "F", attendance: 96, marks: [91, 93, 87, 95, 90, 88] },
    { id: "24BCE118", name: "Ishaan Pillai",        gender: "M", attendance: 83, marks: [70, 74, 66, 72, 75, 63] },
    { id: "24BCE119", name: "Janaki Devi",          gender: "F", attendance: 99, marks: [98, 96, 99, 97, 95, 94] },
    { id: "24BCE120", name: "Karthik Sundaram",     gender: "M", attendance: 74, marks: [54, 60, 49, 58, 55, 46] },
    { id: "24BCE121", name: "Lavanya Chakravarti",  gender: "F", attendance: 91, marks: [84, 87, 81, 89, 80, 77] },
    { id: "24BCE122", name: "Madhan Selvam",        gender: "M", attendance: 62, marks: [35, 41, 33, 45, 38, 30] },
    { id: "24BCE123", name: "Nithya Shankar",       gender: "F", attendance: 87, marks: [78, 80, 75, 83, 77, 71] },
    { id: "24BCE124", name: "Praveen Kumaran",      gender: "M", attendance: 80, marks: [65, 71, 60, 68, 66, 57] },
    { id: "24BCE125", name: "Ranjitha Menon",       gender: "F", attendance: 95, marks: [90, 88, 92, 86, 89, 85] },
    { id: "24BCE126", name: "Sanjay Gopal",         gender: "M", attendance: 68, marks: [46, 52, 40, 54, 48, 37] },
    { id: "24BCE127", name: "Swathi Ramachandran",  gender: "F", attendance: 93, marks: [86, 90, 83, 91, 84, 80] },
    { id: "24BCE128", name: "Tamil Selvam",         gender: "M", attendance: 76, marks: [58, 63, 53, 65, 61, 50] },
    { id: "24BCE129", name: "Uma Devi Krishnan",    gender: "F", attendance: 88, marks: [80, 85, 76, 84, 78, 74] },
    { id: "24BCE130", name: "Vivek Anandan",        gender: "M", attendance: 85, marks: [72, 77, 68, 76, 73, 65] },
    { id: "24BCE131", name: "Yamini Srinivasan",    gender: "F", attendance: 97, marks: [93, 95, 91, 94, 92, 89] },
  ],
};

/* ═══════════════════════════════════════════════════════
   GRADE LOGIC
═══════════════════════════════════════════════════════ */
const gradeOf = (m) =>
  m >= 90 ? "S" : m >= 80 ? "A" : m >= 70 ? "B" : m >= 60 ? "C" :
  m >= 50 ? "D" : m >= 40 ? "E" : "F";

const gradeColor = (m) =>
  m >= 80 ? "#16a34a" : m >= 60 ? "#d97706" : m >= 40 ? "#ea580c" : "#dc2626";

const gradeAccent = {
  S: "#15803d", A: "#16a34a", B: "#65a30d",
  C: "#d97706", D: "#ea580c", E: "#f97316", F: "#dc2626",
};

const avg = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;

const SUBJECT_COLORS = ["#d97706", "#16a34a", "#2563eb", "#7c3aed", "#db2777", "#0891b2"];

/* ═══════════════════════════════════════════════════════
   ANALYTICS HOOK
═══════════════════════════════════════════════════════ */
function useAnalytics() {
  return useMemo(() => {
    const { students, subjects } = DATA;

    const studentStats = students.map((s) => {
      const total = s.marks.reduce((a, b) => a + b, 0);
      const pct = total / subjects.length;
      return { ...s, total, pct, grade: gradeOf(pct), passed: s.marks.filter((m) => m >= DATA.passMarks).length };
    }).sort((a, b) => b.pct - a.pct);

    const subjectStats = subjects.map((sub, si) => {
      const marks = students.map((s) => s.marks[si]);
      const average = avg(marks);
      const max = Math.max(...marks);
      const min = Math.min(...marks);
      const passing = marks.filter((m) => m >= DATA.passMarks).length;
      const passRate = (passing / marks.length) * 100;
      const dist = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
      marks.forEach((m) => dist[gradeOf(m)]++);
      return { ...sub, average, max, min, passRate, dist, marks, passing };
    });

    const classAvg = avg(studentStats.map((s) => s.pct));
    const overallPassRate = (studentStats.filter((s) => s.passed === subjects.length).length / students.length) * 100;
    const atRisk = studentStats.filter((s) => s.pct < 50);
    const distinction = studentStats.filter((s) => s.pct >= 90);
    const weakSubject = subjectStats.reduce((a, b) => (a.average < b.average ? a : b));
    const strongSubject = subjectStats.reduce((a, b) => (a.average > b.average ? a : b));

    const gradeDist = { S: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    studentStats.forEach((s) => gradeDist[s.grade]++);

    const radarData = subjectStats.map((s) => ({ subject: s.short, average: +s.average.toFixed(1), fullMark: 100 }));
    const scatterData = studentStats.map((s) => ({ x: s.attendance, y: +s.pct.toFixed(1), name: s.name, id: s.id }));

    const mkBuckets = (marks) => [
      { range: "0–39",   count: marks.filter((m) => m < 40).length,            fill: "#dc2626" },
      { range: "40–49",  count: marks.filter((m) => m >= 40 && m < 50).length, fill: "#ea580c" },
      { range: "50–59",  count: marks.filter((m) => m >= 50 && m < 60).length, fill: "#d97706" },
      { range: "60–69",  count: marks.filter((m) => m >= 60 && m < 70).length, fill: "#ca8a04" },
      { range: "70–79",  count: marks.filter((m) => m >= 70 && m < 80).length, fill: "#65a30d" },
      { range: "80–89",  count: marks.filter((m) => m >= 80 && m < 90).length, fill: "#16a34a" },
      { range: "90–100", count: marks.filter((m) => m >= 90).length,            fill: "#15803d" },
    ];
    const classBuckets = mkBuckets(studentStats.map((s) => s.pct));

    return {
      studentStats, subjectStats, classAvg, overallPassRate, atRisk,
      distinction, weakSubject, strongSubject, gradeDist, radarData,
      scatterData, mkBuckets, classBuckets,
    };
  }, []);
}

/* ═══════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════ */
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e8dfd2", borderRadius: 8, padding: "10px 14px", fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", fontFamily: "IBM Plex Sans, sans-serif" }}>
      {label && <div style={{ color: "#78614a", marginBottom: 4, fontSize: 11 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#1a1207", display: "flex", gap: 8, justifyContent: "space-between" }}>
          <span>{p.name || p.dataKey}</span>
          <strong style={{ fontFamily: "IBM Plex Mono, monospace" }}>
            {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
          </strong>
        </div>
      ))}
    </div>
  );
};

const KPI = ({ label, value, sub, color, badge }) => (
  <div className="kpi-card">
    <div className="kpi-card-top-border" style={{ background: color || "#d97706" }} />
    <div className="kpi-label">{label}</div>
    <div className="kpi-value" style={{ color: color || "#1a1207" }}>{value}</div>
    {sub && <div className="kpi-sub">{sub}</div>}
    {badge && (
      <div className="kpi-badge" style={{ background: `${color}18`, color, border: `1px solid ${color}44` }}>
        {badge}
      </div>
    )}
  </div>
);

const GradePill = ({ mark }) => {
  const g = gradeOf(mark);
  const c = gradeAccent[g];
  return <span className="grade-pill" style={{ background: `${c}18`, color: c }}>{g}</span>;
};

/* ═══════════════════════════════════════════════════════
   VIEW: OVERVIEW
═══════════════════════════════════════════════════════ */
function OverviewView({ a }) {
  const { classAvg, overallPassRate, atRisk, distinction, gradeDist, radarData, subjectStats, classBuckets } = a;

  const gradeArr = Object.entries(gradeDist).map(([g, c]) => ({ grade: g, count: c, fill: gradeAccent[g] }));
  const subjectAvgArr = subjectStats.map((s, i) => ({ name: s.short, Avg: +s.average.toFixed(1), fill: SUBJECT_COLORS[i] }));

  return (
    <div>
      <div className="page-banner section-gap">
        <div>
          <div className="page-banner-label">Class Performance Report</div>
          <div className="page-banner-title">{DATA.class} · {DATA.semester}</div>
          <div className="page-banner-sub">{DATA.department} · {DATA.examType} · {DATA.academicYear}</div>
        </div>
        <div className="page-banner-accent">∑</div>
      </div>

      <div className="grid-4 section-gap">
        <KPI label="Class Average"   value={`${classAvg.toFixed(1)}%`}          sub={`${DATA.students.length} students`}                                   color="#d97706" />
        <KPI label="Distinction ≥90%" value={distinction.length}                 sub={`${distinction.length} out of ${DATA.students.length} students`}      color="#16a34a" badge="High Achievers" />
        <KPI label="At Risk <50%"    value={atRisk.length}                       sub="Need intervention"                                                    color="#dc2626" badge="Immediate Attention" />
        <KPI label="Full Pass Rate"  value={`${overallPassRate.toFixed(0)}%`}    sub="Passed all subjects"                                                  color="#2563eb" />
      </div>

      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title">Subject-wise Average Score</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={subjectAvgArr} barSize={30}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd2" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#78614a", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#b09880", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <ReferenceLine y={40} stroke="#dc2626" strokeDasharray="4 3" strokeWidth={1.5} label={{ value: "Pass", fill: "#dc2626", fontSize: 10, position: "right" }} />
              <Bar dataKey="Avg" radius={[5, 5, 0, 0]}>
                {subjectAvgArr.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Class Performance Radar</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#e8dfd2" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#78614a", fontSize: 11 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#b09880", fontSize: 9 }} />
              <Radar name="Class Avg" dataKey="average" stroke="#d97706" fill="#d97706" fillOpacity={0.18} strokeWidth={2.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title">Score Distribution — Class Overall</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={classBuckets} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd2" vertical={false} />
              <XAxis dataKey="range" tick={{ fill: "#78614a", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#b09880", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {classBuckets.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Grade Distribution</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gradeArr} barSize={34}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd2" vertical={false} />
              <XAxis dataKey="grade" tick={{ fill: "#78614a", fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#b09880", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {gradeArr.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-3 section-gap">
        <div className="card" style={{ gridColumn: "span 2" }}>
          <div className="card-title">Subject Pass Rate & Averages</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {subjectStats.map((s, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: SUBJECT_COLORS[i], flexShrink: 0 }} />
                  <div style={{ fontSize: 12, color: "#3d2e12", fontWeight: 600 }}>
                    {s.short} <span style={{ color: "#b09880", fontWeight: 400 }}>— {s.name}</span>
                  </div>
                </div>
                <div style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: "#78614a", fontWeight: 600, letterSpacing: "0.06em" }}>AVG SCORE</span>
                    <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: SUBJECT_COLORS[i], fontWeight: 700 }}>{s.average.toFixed(1)}</span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: `${s.average}%`, background: SUBJECT_COLORS[i] }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: "#78614a", fontWeight: 600, letterSpacing: "0.06em" }}>PASS RATE</span>
                    <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: SUBJECT_COLORS[i], fontWeight: 700, opacity: 0.75 }}>{s.passRate.toFixed(0)}%</span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: `${s.passRate}%`, background: SUBJECT_COLORS[i], opacity: 0.45 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ flex: 1 }}>
            <div className="card-title">HOD Insights</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                <div style={{ fontSize: 10, color: "#1e3a8a", fontWeight: 700, letterSpacing: "0.08em" }}>🏆 CLASS TOPPER</div>
                <div style={{ fontSize: 13, color: "#1d4ed8", fontWeight: 700, marginTop: 3 }}>{a.studentStats[0].name}</div>
                <div style={{ fontSize: 11, color: "#3b82f6" }}>{a.studentStats[0].id} · {a.studentStats[0].pct.toFixed(1)}% · Grade {a.studentStats[0].grade}</div>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "#fef3c7", border: "1px solid #fde68a" }}>
                <div style={{ fontSize: 10, color: "#92400e", fontWeight: 700, letterSpacing: "0.08em" }}>⚠ WEAK SUBJECT</div>
                <div style={{ fontSize: 13, color: "#78350f", fontWeight: 600, marginTop: 3 }}>{a.weakSubject.name}</div>
                <div style={{ fontSize: 11, color: "#b45309" }}>Avg {a.weakSubject.average.toFixed(1)} · Pass {a.weakSubject.passRate.toFixed(0)}%</div>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "#dcfce7", border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: 10, color: "#14532d", fontWeight: 700, letterSpacing: "0.08em" }}>✦ STRONG SUBJECT</div>
                <div style={{ fontSize: 13, color: "#15803d", fontWeight: 600, marginTop: 3 }}>{a.strongSubject.name}</div>
                <div style={{ fontSize: 11, color: "#16a34a" }}>Avg {a.strongSubject.average.toFixed(1)} · Pass {a.strongSubject.passRate.toFixed(0)}%</div>
              </div>
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "#fef2f2", border: "1px solid #fecaca" }}>
                <div style={{ fontSize: 10, color: "#7f1d1d", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>🔧 IMPROVEMENT NEEDED</div>
                {(() => {
                  const weak = [...a.subjectStats].filter((s) => s.passRate < 90).sort((x, y) => x.passRate - y.passRate);
                  return weak.length === 0 ? (
                    <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>✓ All subjects above 90% pass rate</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {weak.map((s, i) => (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 12, color: "#3d2e12", fontWeight: 600 }}>
                              {s.short} <span style={{ fontWeight: 400, color: "#b09880" }}>— {s.name}</span>
                            </span>
                            <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, fontWeight: 700, color: s.passRate >= 75 ? "#d97706" : "#dc2626" }}>
                              {s.passRate.toFixed(0)}%
                            </span>
                          </div>
                          <div className="prog-track">
                            <div className="prog-fill" style={{ width: `${s.passRate}%`, background: s.passRate >= 75 ? "#d97706" : "#dc2626", opacity: 0.7 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VIEW: FACULTY (SUBJECTS)
═══════════════════════════════════════════════════════ */
function SubjectsView({ a }) {
  const [si, setSi] = useState(0);
  const sub = a.subjectStats[si];
  const { mkBuckets } = a;
  const buckets = mkBuckets(sub.marks);
  const distArr = Object.entries(sub.dist).map(([g, c]) => ({ grade: g, count: c, fill: gradeAccent[g] }));
  const compData = a.subjectStats.map((s, i) => ({ name: s.short, Avg: +s.average.toFixed(1), Max: s.max, Min: s.min, fill: SUBJECT_COLORS[i] }));

  return (
    <div>
      <div className="page-banner section-gap">
        <div>
          <div className="page-banner-label">Faculty Analysis</div>
          <div className="page-banner-title">Subject Deep Dive</div>
          <div className="page-banner-sub">Granular subject performance — identify gaps, celebrate strengths</div>
        </div>
        <div className="page-banner-accent">∂</div>
      </div>

      <div className="card section-gap">
        <div className="tab-strip">
          {a.subjectStats.map((s, i) => (
            <button key={i} className={`tab-btn${si === i ? " active" : ""}`} onClick={() => setSi(i)}>
              {s.short}
              <span style={{ marginLeft: 6, fontFamily: "IBM Plex Mono", fontSize: 10, opacity: 0.7 }}>{s.average.toFixed(0)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid-4 section-gap">
        <KPI label="Average Score" value={sub.average.toFixed(1)} sub={sub.name} color={SUBJECT_COLORS[si]} />
        <KPI label="Highest" value={sub.max} color="#16a34a" badge="Top score" />
        <KPI label="Lowest" value={sub.min} color="#dc2626" badge={sub.min < 40 ? "Below pass" : "Above pass"} />
        <KPI label="Pass Rate" value={`${sub.passRate.toFixed(0)}%`} sub={`${sub.passing}/${DATA.students.length} students`}
          color={sub.passRate >= 80 ? "#16a34a" : sub.passRate >= 60 ? "#d97706" : "#dc2626"} />
      </div>

      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title">Score Distribution — {sub.short}</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={buckets} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd2" vertical={false} />
              <XAxis dataKey="range" tick={{ fill: "#78614a", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "#b09880", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                {buckets.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Grade Breakdown — {sub.short}</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distArr} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd2" vertical={false} />
              <XAxis dataKey="grade" tick={{ fill: "#78614a", fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: "#b09880", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                {distArr.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-title">All Subjects — Min / Avg / Max Comparison</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={compData} barGap={3} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd2" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#78614a", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#b09880", fontSize: 10 }} axisLine={false} tickLine={false} />
            <ReferenceLine y={40} stroke="#dc2626" strokeDasharray="3 3" strokeWidth={1.5} />
            <Tooltip content={<ChartTip />} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#78614a" }} />
            <Bar dataKey="Min" fill="#fca5a5" radius={[3, 3, 0, 0]} />
            <Bar dataKey="Avg" radius={[3, 3, 0, 0]}>
              {compData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            </Bar>
            <Bar dataKey="Max" fill="#bbf7d0" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-3 section-gap">
        {a.subjectStats.map((s, i) => (
          <div className="card" key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1207" }}>{s.short}</div>
                <div style={{ fontSize: 11, color: "#78614a" }}>{s.faculty}</div>
              </div>
              <span style={{ fontFamily: "IBM Plex Mono", fontSize: 18, fontWeight: 700, color: SUBJECT_COLORS[i] }}>{s.average.toFixed(0)}</span>
            </div>
            <div className="prog-track" style={{ marginBottom: 8 }}>
              <div className="prog-fill" style={{ width: `${s.average}%`, background: SUBJECT_COLORS[i] }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
              <span style={{ color: "#dc2626" }}>Fail: {s.dist.F}</span>
              <span style={{ color: "#d97706" }}>Pass: {s.passing}</span>
              <span style={{ color: "#16a34a" }}>Dist: {s.dist.S + s.dist.A}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VIEW: STUDENTS
═══════════════════════════════════════════════════════ */
function StudentsView({ a }) {
  const [search, setSearch] = useState("");
  const [selId, setSelId] = useState(null);
  const [sortBy, setSortBy] = useState("rank");
  const { studentStats, scatterData } = a;

  const filtered = useMemo(() => {
    let s = studentStats;
    if (search) s = s.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()) || x.id.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "name") s = [...s].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "attendance") s = [...s].sort((a, b) => b.attendance - a.attendance);
    return s;
  }, [studentStats, search, sortBy]);

  const sel = selId ? studentStats.find((s) => s.id === selId) : null;
  const avatarBg = (name) => `hsl(${name.charCodeAt(0) * 53 % 360},45%,65%)`;

  return (
    <div>
      <div className="page-banner section-gap">
        <div>
          <div className="page-banner-label">Student Intelligence</div>
          <div className="page-banner-title">Individual Performance</div>
          <div className="page-banner-sub">Rank profiles, subject scores, attendance correlation</div>
        </div>
        <div className="page-banner-accent">μ</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="search-box" placeholder="Search by name or roll no..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div style={{ display: "flex", gap: 6 }}>
            {[["rank", "By Rank"], ["name", "Name"], ["attendance", "Attend"]].map(([v, l]) => (
              <button key={v} className={`tab-btn${sortBy === v ? " active" : ""}`} style={{ flex: 1, padding: "5px 8px", fontSize: 11 }} onClick={() => setSortBy(v)}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 540, overflowY: "auto", paddingRight: 4 }}>
            {filtered.map((s) => {
              const rank = studentStats.findIndex((x) => x.id === s.id) + 1;
              return (
                <div key={s.id} className={`student-list-item${selId === s.id ? " selected" : ""}`} onClick={() => setSelId(selId === s.id ? null : s.id)}>
                  <div className="avatar" style={{ background: avatarBg(s.name), color: "#fff" }}>
                    {s.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1207", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: "#b09880" }}>{s.id} · Att {s.attendance}%</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "IBM Plex Mono", fontSize: 13, fontWeight: 700, color: gradeColor(s.pct) }}>{s.pct.toFixed(0)}%</div>
                    <div style={{ fontSize: 9, color: "#b09880" }}>#{rank}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {sel ? (
            <>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div className="avatar" style={{ width: 50, height: 50, fontSize: 16, background: avatarBg(sel.name), color: "#fff" }}>
                      {sel.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 20, color: "#1a1207" }}>{sel.name}</div>
                      <div style={{ fontSize: 12, color: "#78614a" }}>{sel.id} · Rank #{studentStats.findIndex((s) => s.id === sel.id) + 1}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "IBM Plex Mono", fontSize: 32, fontWeight: 700, color: gradeColor(sel.pct), lineHeight: 1 }}>{sel.grade}</div>
                    <div style={{ fontSize: 12, color: "#78614a" }}>{sel.pct.toFixed(1)}% overall</div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20, padding: "12px 0", borderTop: "1px solid #e8dfd2", borderBottom: "1px solid #e8dfd2" }}>
                  {[["ATTENDANCE", `${sel.attendance}%`], ["TOTAL MARKS", sel.total], ["SUBJECTS PASSED", `${sel.passed}/${DATA.subjects.length}`]].map(([lbl, val], i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "IBM Plex Mono", fontSize: 20, fontWeight: 700, color: i === 2 && sel.passed !== DATA.subjects.length ? "#dc2626" : "#1a1207" }}>{val}</div>
                      <div style={{ fontSize: 10, color: "#78614a", letterSpacing: "0.08em" }}>{lbl}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {DATA.subjects.map((sub, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 48, fontSize: 10, fontWeight: 700, color: SUBJECT_COLORS[i], flexShrink: 0 }}>{sub.short}</div>
                      <div className="prog-track" style={{ flex: 1 }}>
                        <div className="prog-fill" style={{ width: `${sel.marks[i]}%`, background: gradeColor(sel.marks[i]) }} />
                      </div>
                      <div style={{ width: 28, fontFamily: "IBM Plex Mono", fontSize: 12, fontWeight: 700, color: gradeColor(sel.marks[i]), textAlign: "right", flexShrink: 0 }}>{sel.marks[i]}</div>
                      <GradePill mark={sel.marks[i]} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid-2">
                <div className="card">
                  <div className="card-title">Subject Radar</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadarChart data={DATA.subjects.map((s, i) => ({ subject: s.short, score: sel.marks[i] }))} cx="50%" cy="50%" outerRadius="65%">
                      <PolarGrid stroke="#e8dfd2" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#78614a", fontSize: 10 }} />
                      <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#b09880", fontSize: 8 }} />
                      <Radar dataKey="score" stroke="#d97706" fill="#d97706" fillOpacity={0.2} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card">
                  <div className="card-title">vs. Class Average</div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={DATA.subjects.map((s, i) => ({ name: s.short, Student: sel.marks[i], "Class Avg": +a.subjectStats[i].average.toFixed(1) }))} barGap={3} barSize={14}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd2" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: "#78614a", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: "#b09880", fontSize: 9 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTip />} />
                      <Legend wrapperStyle={{ fontSize: 10, color: "#78614a" }} />
                      <Bar dataKey="Student" fill="#d97706" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Class Avg" fill="#93c5fd" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="card">
                <div className="card-title">Attendance vs. Performance Correlation</div>
                <ResponsiveContainer width="100%" height={280}>
                  <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd2" />
                    <XAxis dataKey="x" name="Attendance" type="number" domain={["dataMin - 3", "dataMax + 3"]}
                      tick={{ fill: "#78614a", fontSize: 11 }} axisLine={false} tickLine={false}
                      label={{ value: "Attendance %", position: "insideBottom", offset: -15, fill: "#b09880", fontSize: 11 }} />
                    <YAxis dataKey="y" name="Score" type="number" domain={["dataMin - 5", "dataMax + 5"]}
                      tick={{ fill: "#78614a", fontSize: 11 }} axisLine={false} tickLine={false}
                      label={{ value: "Avg Score %", angle: -90, position: "insideLeft", offset: 15, fill: "#b09880", fontSize: 11 }} />
                    <ZAxis range={[60, 60]} />
                    <ReferenceLine y={50} stroke="#dc2626" strokeDasharray="3 3" strokeWidth={1} label={{ value: "Pass Line", fill: "#dc2626", fontSize: 10, position: "insideTopRight" }} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: "#fff", border: "1px solid #e8dfd2", borderRadius: 8, padding: "8px 12px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                          <div style={{ fontWeight: 600, color: "#1a1207" }}>{d.name}</div>
                          <div style={{ color: "#78614a" }}>Attendance: {d.x}% · Score: {d.y}%</div>
                        </div>
                      );
                    }} />
                    <Scatter data={scatterData} fill="#d97706" opacity={0.85} />
                  </ScatterChart>
                </ResponsiveContainer>
                <div style={{ textAlign: "center", fontSize: 11, color: "#b09880", marginTop: 4 }}>
                  Select a student on the left to view their detailed profile
                </div>
              </div>

              <div className="card">
                <div className="card-title">Class Rank Table</div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Rank</th><th>Student</th><th>Roll No.</th>
                        {DATA.subjects.map((s) => <th key={s.code}>{s.short}</th>)}
                        <th>Avg%</th><th>Grade</th><th>Attend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentStats.slice(0, 10).map((s, i) => (
                        <tr key={s.id} onClick={() => setSelId(s.id)} style={{ cursor: "pointer" }}>
                          <td>
                            <span className="rank-chip" style={{
                              background: i === 0 ? "#fef3c7" : i === 1 ? "#f1f5f9" : i === 2 ? "#fdf4e7" : "#f8f8f8",
                              color: i === 0 ? "#d97706" : i === 1 ? "#64748b" : i === 2 ? "#b45309" : "#78614a"
                            }}>{i + 1}</span>
                          </td>
                          <td style={{ fontWeight: 600, color: "#1a1207", whiteSpace: "nowrap" }}>{s.name}</td>
                          <td style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: "#78614a" }}>{s.id}</td>
                          {s.marks.map((m, mi) => (
                            <td key={mi} style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: gradeColor(m), fontWeight: 600 }}>{m}</td>
                          ))}
                          <td style={{ fontFamily: "IBM Plex Mono", fontSize: 13, fontWeight: 700, color: gradeColor(s.pct) }}>{s.pct.toFixed(1)}</td>
                          <td><GradePill mark={s.pct} /></td>
                          <td style={{ fontSize: 12, color: s.attendance >= 75 ? "#16a34a" : "#dc2626", fontFamily: "IBM Plex Mono" }}>{s.attendance}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VIEW: HOD REPORT
═══════════════════════════════════════════════════════ */
function HODView({ a }) {
  const { subjectStats, studentStats, classAvg, overallPassRate, atRisk, distinction } = a;
  const passRateTrend = subjectStats.map((s) => ({ name: s.short, passRate: +s.passRate.toFixed(1), avg: +s.average.toFixed(1) }));

  return (
    <div>
      <div className="page-banner section-gap">
        <div>
          <div className="page-banner-label">HOD Executive Summary</div>
          <div className="page-banner-title">Department Analytics</div>
          <div className="page-banner-sub">Strategic overview for academic decision-making</div>
        </div>
        <div className="page-banner-accent">Σ</div>
      </div>

      <div className="grid-4 section-gap">
        <KPI label="Class Average"  value={`${classAvg.toFixed(1)}%`}         sub="Overall performance"                                               color="#d97706" />
        <KPI label="Full Pass Rate" value={`${overallPassRate.toFixed(0)}%`}   sub="All 6 subjects"                                                    color="#16a34a" />
        <KPI label="Distinction"    value={distinction.length}                 sub={`≥90% · ${distinction.length} of ${DATA.students.length} students`} color="#2563eb" />
        <KPI label="At Risk"        value={atRisk.length}                      sub="Below 50%"                                                         color="#dc2626" badge="Needs Intervention" />
      </div>

      <div className="card section-gap">
        <div className="card-title">Subject Performance Trend</div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={passRateTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd2" />
            <XAxis dataKey="name" tick={{ fill: "#78614a", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#b09880", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip />} />
            <ReferenceLine y={40} stroke="#dc2626" strokeDasharray="3 3" label={{ value: "Pass Line", fill: "#dc2626", fontSize: 10 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#78614a" }} />
            <Line type="monotone" dataKey="avg" name="Avg Score" stroke="#d97706" strokeWidth={2.5} dot={{ fill: "#d97706", r: 4 }} />
            <Line type="monotone" dataKey="passRate" name="Pass Rate" stroke="#16a34a" strokeWidth={2.5} dot={{ fill: "#16a34a", r: 4 }} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2 section-gap">
        <div className="card">
          <div className="card-title" style={{ color: "#dc2626" }}>At-Risk Students (Below 50%)</div>
          {atRisk.length === 0 ? (
            <div style={{ color: "#16a34a", fontSize: 13 }}>✓ No students at risk</div>
          ) : (
            <table style={{ fontSize: 12 }}>
              <thead><tr><th>Student</th><th>Avg%</th><th>Failed</th><th>Attend</th></tr></thead>
              <tbody>
                {atRisk.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.name}</td>
                    <td style={{ fontFamily: "IBM Plex Mono", color: "#dc2626", fontWeight: 700 }}>{s.pct.toFixed(1)}</td>
                    <td style={{ color: "#dc2626" }}>{DATA.subjects.length - s.passed} sub.</td>
                    <td style={{ fontFamily: "IBM Plex Mono", color: s.attendance < 75 ? "#dc2626" : "#16a34a" }}>{s.attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="card-title">Subject Health Scorecard</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {subjectStats.map((s, i) => {
              const health = s.passRate >= 80 ? "Good" : s.passRate >= 60 ? "Average" : "Poor";
              const hc = s.passRate >= 80 ? "#16a34a" : s.passRate >= 60 ? "#d97706" : "#dc2626";
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #e8dfd2" }}>
                  <div style={{ width: 4, height: 36, borderRadius: 2, background: SUBJECT_COLORS[i] }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1207" }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: "#78614a" }}>{s.faculty}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "IBM Plex Mono", fontSize: 13, fontWeight: 700, color: SUBJECT_COLORS[i] }}>{s.average.toFixed(1)}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: hc }}>● {health}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-title">Class Rank Progression (Top → Bottom)</div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={studentStats.map((s, i) => ({ rank: `#${i + 1}`, score: +s.pct.toFixed(1) }))}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#d97706" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8dfd2" />
            <XAxis dataKey="rank" tick={{ fill: "#b09880", fontSize: 9 }} axisLine={false} tickLine={false} interval={3} />
            <YAxis domain={[20, 100]} tick={{ fill: "#b09880", fontSize: 10 }} axisLine={false} tickLine={false} />
            <ReferenceLine y={90} stroke="#16a34a" strokeDasharray="3 3" />
            <ReferenceLine y={50} stroke="#dc2626" strokeDasharray="3 3" />
            <Tooltip content={<ChartTip />} />
            <Area type="monotone" dataKey="score" stroke="#d97706" strokeWidth={2} fill="url(#scoreGrad)" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 20, marginTop: 8, justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: "#16a34a" }}>— 90% distinction line</span>
          <span style={{ fontSize: 10, color: "#dc2626" }}>— 50% intervention line</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("overview");
  const analytics = useAnalytics();

  const tabs = [
    { id: "overview", label: "📊 Overview" },
    { id: "students", label: "🎓 Student" },
    { id: "subjects", label: "👩‍🏫 Faculty" },
    { id: "hod",      label: "🏛 HOD" },
  ];

  return (
    <div className="dash-root">
      <header className="dash-header">
        <div className="dash-header-brand">
          <div className="dash-header-logo">🎓</div>
          <div>
            <div className="dash-header-title">EduAnalytics</div>
            <div className="dash-header-meta">{DATA.institution}</div>
          </div>
        </div>

        <nav className="dash-header-nav">
          {tabs.map((t) => (
            <button key={t.id} className={`dash-nav-btn${view === t.id ? " active" : ""}`} onClick={() => setView(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="dash-header-right">
          <strong>{DATA.class}</strong>
          {DATA.semester} · {DATA.academicYear}
        </div>
      </header>

      <main className="dash-content">
        {view === "overview" && <OverviewView a={analytics} />}
        {view === "subjects" && <SubjectsView a={analytics} />}
        {view === "students" && <StudentsView a={analytics} />}
        {view === "hod"      && <HODView      a={analytics} />}
      </main>
    </div>
  );
}