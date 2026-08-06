ALLOWED_EXTENSIONS = {'pdf', 'docx'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

SECTION_KEYWORDS = {
    'contact': ['contact', 'email', 'phone', 'address', 'linkedin', 'github'],
    'summary': ['summary', 'objective', 'profile', 'about', 'professional summary'],
    'skills': ['skills', 'technologies', 'technical skills', 'programming', 'tools'],
    'education': ['education', 'academic', 'degree', 'university', 'college', 'school'],
    'experience': ['experience', 'work', 'employment', 'professional', 'career'],
    'projects': ['projects', 'portfolio', 'github', 'applications'],
    'certifications': ['certifications', 'certified', 'credentials', 'courses']
}

SKILL_KEYWORDS = [
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby', 'go', 'rust', 'kotlin', 'swift',
    'react', 'angular', 'vue', 'node.js', 'django', 'flask', 'spring', 'express', 'fastapi',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sqlite',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'linux', 'terraform',
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch', 'pandas',
    'data analysis', 'data science', 'tableau', 'power bi', 'excel', 'statistics',
    'api', 'rest', 'graphql', 'microservices', 'ci/cd', 'agile', 'scrum'
]

CONTACT_PATTERNS = {
    'email': r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}',
    'phone': r'(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})',
    'linkedin': r'linkedin\.com/in/[a-zA-Z0-9-]+',
    'github': r'github\.com/[a-zA-Z0-9-]+'
}

DEFAULT_ROLES = [
    'Software Engineer',
    'Web Developer',
    'Data Analyst',
    'AI Engineer',
    'Cloud Engineer'
]
