import { useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { UploadSection } from './components/UploadSection';
import { ResultsSection } from './components/ResultsSection';
import { HowItWorks } from './components/HowItWorks';
import { Footer } from './components/Footer';
import { AmbientBackground } from './components/AmbientBackground';

const roles = ['AI / ML Engineer', 'Data Analyst', 'Web Developer', 'Cloud Engineer'];

const roleDatasets = {
  'AI / ML Engineer': {
    score: 84,
    ats: 78,
    matchedSkills: ['Python', 'TensorFlow', 'Pandas', 'SQL', 'Git', 'PyTorch'],
    missingSkills: ['MLOps', 'Docker', 'AWS SageMaker', 'scikit-learn'],
    tips: [
      {
        number: '01',
        category: 'Formatting',
        title: 'Optimize Section Hierarchy for Technical Summaries',
        text: 'Mention your machine learning focus, primary frameworks (TensorFlow, PyTorch), and one quantified model achievement in the first 3 lines.',
        impact: 'High Impact',
      },
      {
        number: '02',
        category: 'Keywords',
        title: 'Incorporate Missing MLOps & Cloud Keywords',
        text: 'Include Docker, AWS SageMaker, and MLOps pipeline experience in your projects section where applicable.',
        impact: 'High Impact',
      },
      {
        number: '03',
        category: 'Projects',
        title: 'Quantify Model Training & Evaluation Metrics',
        text: 'Replace vague descriptions with concrete metrics such as accuracy, F1-score, latency improvement, or dataset size (e.g., 200k samples).',
        impact: 'Medium Impact',
      },
    ],
  },
  'Data Analyst': {
    score: 88,
    ats: 82,
    matchedSkills: ['SQL', 'Python', 'Pandas', 'Power BI', 'Excel', 'Data Visualization'],
    missingSkills: ['Tableau', 'BigQuery', 'A/B Testing', 'Statistics'],
    tips: [
      {
        number: '01',
        category: 'Keywords',
        title: 'Add Cloud Data Warehouse Experience',
        text: 'Explicitly state experience with BigQuery or Snowflake to pass modern data analyst ATS screens.',
        impact: 'High Impact',
      },
      {
        number: '02',
        category: 'Projects',
        title: 'Highlight Business Impact & Dashboard Deliverables',
        text: 'Quantify dashboard adoption rates, query optimization efficiency, or revenue insights generated for stakeholders.',
        impact: 'High Impact',
      },
      {
        number: '03',
        category: 'Certifications',
        title: 'Include Recognized Data Analyst Certifications',
        text: 'Mention Google Data Analytics, Microsoft Power BI Data Analyst, or AWS Data Analytics credentials.',
        impact: 'Medium Impact',
      },
    ],
  },
  'Web Developer': {
    score: 79,
    ats: 72,
    matchedSkills: ['JavaScript', 'HTML5', 'CSS3', 'React.js', 'Git', 'REST API'],
    missingSkills: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'],
    tips: [
      {
        number: '01',
        category: 'Keywords',
        title: 'Add Modern Frontend Framework Keywords',
        text: 'Include TypeScript, Tailwind CSS, and Next.js to match current frontend developer job descriptions.',
        impact: 'High Impact',
      },
      {
        number: '02',
        category: 'Formatting',
        title: 'Add Live Project & GitHub Repository Links',
        text: 'Provide clickable URLs to deployed web applications and public GitHub code repositories.',
        impact: 'High Impact',
      },
      {
        number: '03',
        category: 'Experience',
        title: 'Highlight Performance & Accessibility Optimization',
        text: 'Mention Web Vitals improvements, Lighthouse audit scores, or responsive cross-browser testing.',
        impact: 'Medium Impact',
      },
    ],
  },
  'Cloud Engineer': {
    score: 81,
    ats: 75,
    matchedSkills: ['Linux', 'Python', 'Networking', 'Git', 'Bash Scripting'],
    missingSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    tips: [
      {
        number: '01',
        category: 'Keywords',
        title: 'Add Infrastructure as Code & Containerization Skills',
        text: 'Feature Terraform, Docker, and Kubernetes prominently in your technical skills and project descriptions.',
        impact: 'High Impact',
      },
      {
        number: '02',
        category: 'Certifications',
        title: 'Display AWS / Azure / GCP Certifications',
        text: 'Add AWS Solutions Architect or Associate Cloud Engineer credentials at the top of your resume.',
        impact: 'High Impact',
      },
      {
        number: '03',
        category: 'Projects',
        title: 'Detail Automated Deployment Pipelines',
        text: 'Describe CI/CD automation steps, uptime SLA metrics, and cloud cost reduction outcomes.',
        impact: 'Medium Impact',
      },
    ],
  },
};

const baseSections = [
  { label: 'Contact Information', status: 'complete', text: 'Complete & Verifiable', pts: 15, max: 15 },
  { label: 'Professional Summary', status: 'review', text: 'Needs Role Focus', pts: 10, max: 15 },
  { label: 'Skills & Technologies', status: 'complete', text: 'Well Structured', pts: 20, max: 25 },
  { label: 'Projects & Experience', status: 'review', text: 'Add Quantified Metrics', pts: 14, max: 20 },
  { label: 'Education & Certifications', status: 'complete', text: 'Complete', pts: 15, max: 15 },
  { label: 'Resume Completeness', status: 'complete', text: 'Standard Layout', pts: 10, max: 10 },
];

function App() {
  const inputRef = useRef(null);
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  const chooseFile = (chosenFile) => {
    if (!chosenFile) return;
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(chosenFile.type) && !/\.(pdf|docx)$/i.test(chosenFile.name)) {
      window.alert('Please upload a valid PDF or DOCX resume document.');
      return;
    }
    setFile(chosenFile);
    setHasAnalysis(false);
  };

  const loadSampleResume = () => {
    const mockFile = {
      name: 'Aarav-Patel-Resume.pdf',
      size: 1.8 * 1024 * 1024,
      type: 'application/pdf',
    };
    setFile(mockFile);
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalysis(true);
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  };

  const analyzeResume = () => {
    if (!file) {
      loadSampleResume();
      return;
    }
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalysis(true);
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 700);
  };

  const activeData = roleDatasets[selectedRole] || roleDatasets[roles[0]];
  const currentAnalysis = {
    score: activeData.score,
    ats: activeData.ats,
    resumeName: file?.name ?? 'Aarav-Patel-Resume.pdf',
    matchedSkills: activeData.matchedSkills,
    missingSkills: activeData.missingSkills,
    sections: baseSections,
    tips: activeData.tips,
  };

  return (
    <div className="min-h-screen flex flex-col text-[var(--text-primary)] font-sans antialiased">
      <AmbientBackground />

      {/* Navigation Header */}
      <Navbar loadSampleResume={loadSampleResume} />

      <main id="top" className="flex-1">
        {/* Project Overview / Hero */}
        <Hero loadSampleResume={loadSampleResume} />

        {/* Module 1 & 3: File Upload & Role Selector */}
        <UploadSection
          inputRef={inputRef}
          file={file}
          setFile={setFile}
          chooseFile={chooseFile}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          roles={roles}
          isAnalyzing={isAnalyzing}
          analyzeResume={analyzeResume}
          setHasAnalysis={setHasAnalysis}
          loadSampleResume={loadSampleResume}
        />

        {/* Feature Overview Strip */}
        <TrustStrip />

        {/* Modules 2, 3, 4, 5: Interactive Dashboard & Reports */}
        <ResultsSection
          hasAnalysis={hasAnalysis}
          visibleName={currentAnalysis.resumeName}
          analysis={currentAnalysis}
          selectedRole={selectedRole}
        />

        {/* Module Workflow / How It Works */}
        <HowItWorks />
      </main>

      {/* Capstone Project Footer */}
      <Footer />
    </div>
  );
}

export default App;

