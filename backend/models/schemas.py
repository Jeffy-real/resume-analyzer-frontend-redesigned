from dataclasses import dataclass, field
from typing import List, Dict, Optional

@dataclass
class ParsedResume:
    text: str
    filename: str
    file_type: str
    sections: Dict[str, str] = field(default_factory=dict)
    skills: List[str] = field(default_factory=list)
    contact_info: Dict[str, str] = field(default_factory=dict)
    education: List[str] = field(default_factory=list)
    experience: List[str] = field(default_factory=list)
    projects: List[str] = field(default_factory=list)

@dataclass
class SectionScore:
    label: str
    status: str
    text: str
    pts: int
    max: int

@dataclass
class FeedbackItem:
    number: str
    category: str
    title: str
    text: str
    impact: str

@dataclass
class AnalysisResult:
    overall_score: int
    ats_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    sections: List[SectionScore]
    feedback: List[FeedbackItem]

@dataclass
class RoleKeywords:
    name: str
    category: str
    required_skills: List[str]
    preferred_skills: List[str]
    keywords: List[str]
    tools: List[str]
    frameworks: List[str]
    certifications: List[str]
