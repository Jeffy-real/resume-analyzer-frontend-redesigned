from typing import List, Dict
from models.schemas import FeedbackItem

class FeedbackEngine:
    def __init__(self):
        self.feedback_templates = {
            'contact': {
                'missing_email': FeedbackItem(
                    number='01',
                    category='Contact',
                    title='Add Email Address',
                    text='Include a professional email address for recruiters to contact you.',
                    impact='High Impact'
                ),
                'missing_phone': FeedbackItem(
                    number='02',
                    category='Contact',
                    title='Add Phone Number',
                    text='Include your phone number for direct contact opportunities.',
                    impact='High Impact'
                ),
                'missing_linkedin': FeedbackItem(
                    number='03',
                    category='Contact',
                    title='Add LinkedIn Profile',
                    text='Add your LinkedIn profile URL to showcase professional network.',
                    impact='Medium Impact'
                ),
                'missing_github': FeedbackItem(
                    number='04',
                    category='Contact',
                    title='Add GitHub Profile',
                    text='Include your GitHub profile to demonstrate coding projects.',
                    impact='Medium Impact'
                )
            },
            'summary': {
                'missing': FeedbackItem(
                    number='01',
                    category='Summary',
                    title='Add Professional Summary',
                    text='Write a compelling 2-3 sentence summary highlighting your key skills and experience.',
                    impact='High Impact'
                ),
                'too_short': FeedbackItem(
                    number='02',
                    category='Summary',
                    title='Expand Professional Summary',
                    text='Your summary is too brief. Add more details about your expertise and career goals.',
                    impact='Medium Impact'
                )
            },
            'skills': {
                'missing': FeedbackItem(
                    number='01',
                    category='Skills',
                    title='Add Technical Skills Section',
                    text='Create a dedicated skills section listing your technical competencies.',
                    impact='High Impact'
                ),
                'too_few': FeedbackItem(
                    number='02',
                    category='Skills',
                    title='Expand Skills Section',
                    text='Add more relevant technical skills. Aim for 10-15 skills related to your target role.',
                    impact='High Impact'
                )
            },
            'education': {
                'missing': FeedbackItem(
                    number='01',
                    category='Education',
                    title='Add Education Section',
                    text='Include your educational background with degree, institution, and graduation year.',
                    impact='High Impact'
                ),
                'incomplete': FeedbackItem(
                    number='02',
                    category='Education',
                    title='Complete Education Details',
                    text='Add more details to your education section including relevant coursework or achievements.',
                    impact='Medium Impact'
                )
            },
            'experience': {
                'missing': FeedbackItem(
                    number='01',
                    category='Experience',
                    title='Add Work Experience',
                    text='Include your work experience with job titles, companies, and employment dates.',
                    impact='High Impact'
                ),
                'no_metrics': FeedbackItem(
                    number='02',
                    category='Experience',
                    title='Add Quantified Achievements',
                    text='Include specific metrics and achievements. Use numbers to demonstrate impact.',
                    impact='High Impact'
                ),
                'too_brief': FeedbackItem(
                    number='03',
                    category='Experience',
                    title='Expand Experience Descriptions',
                    text='Provide more detail about your responsibilities and accomplishments in each role.',
                    impact='Medium Impact'
                )
            },
            'projects': {
                'missing': FeedbackItem(
                    number='01',
                    category='Projects',
                    title='Add Projects Section',
                    text='Include relevant projects to demonstrate practical skills and experience.',
                    impact='High Impact'
                ),
                'add_details': FeedbackItem(
                    number='02',
                    category='Projects',
                    title='Enhance Project Descriptions',
                    text='Add technologies used, your role, and measurable outcomes for each project.',
                    impact='Medium Impact'
                )
            },
            'formatting': {
                'length': FeedbackItem(
                    number='01',
                    category='Formatting',
                    title='Optimize Resume Length',
                    text='Keep your resume to 1-2 pages. Remove irrelevant information if too long.',
                    impact='Medium Impact'
                ),
                'structure': FeedbackItem(
                    number='02',
                    category='Formatting',
                    title='Improve Section Structure',
                    text='Organize sections clearly: Contact, Summary, Skills, Experience, Education, Projects.',
                    impact='Medium Impact'
                )
            },
            'keywords': {
                'missing': FeedbackItem(
                    number='01',
                    category='Keywords',
                    title='Add Industry Keywords',
                    text='Include more keywords relevant to your target role to improve ATS compatibility.',
                    impact='High Impact'
                ),
                'certifications': FeedbackItem(
                    number='02',
                    category='Certifications',
                    title='Add Relevant Certifications',
                    text='Include industry certifications to strengthen your profile.',
                    impact='Medium Impact'
                )
            }
        }

    def generate_feedback(self, analysis_data: Dict, ats_data: Dict = None) -> List[Dict]:
        feedback = []
        feedback_count = 1

        contact_info = analysis_data.get('contact_info', {})
        if not contact_info.get('email'):
            feedback.append(self._create_feedback_item(feedback_count, 'contact', 'missing_email'))
            feedback_count += 1
        if not contact_info.get('phone'):
            feedback.append(self._create_feedback_item(feedback_count, 'contact', 'missing_phone'))
            feedback_count += 1

        sections = analysis_data.get('sections', {})
        skills = analysis_data.get('skills', [])

        if 'summary' not in sections or not sections.get('summary'):
            feedback.append(self._create_feedback_item(feedback_count, 'summary', 'missing'))
            feedback_count += 1

        if not skills or len(skills) < 5:
            feedback.append(self._create_feedback_item(feedback_count, 'skills', 'too_few'))
            feedback_count += 1

        if 'education' not in sections or not sections.get('education'):
            feedback.append(self._create_feedback_item(feedback_count, 'education', 'missing'))
            feedback_count += 1

        if 'experience' not in sections or not sections.get('experience'):
            feedback.append(self._create_feedback_item(feedback_count, 'experience', 'missing'))
            feedback_count += 1

        if 'projects' not in sections or not sections.get('projects'):
            feedback.append(self._create_feedback_item(feedback_count, 'projects', 'missing'))
            feedback_count += 1

        if ats_data:
            missing_skills = ats_data.get('missing_skills', [])
            if missing_skills:
                feedback.append({
                    'number': str(feedback_count).zfill(2),
                    'category': 'Keywords',
                    'title': f'Add Missing Skills: {", ".join(missing_skills[:3])}',
                    'text': f'Include these relevant skills to improve ATS match: {", ".join(missing_skills[:5])}',
                    'impact': 'High Impact'
                })
                feedback_count += 1

        feedback.append({
            'number': str(feedback_count).zfill(2),
            'category': 'Formatting',
            'title': 'Optimize Resume Structure',
            'text': 'Ensure consistent formatting, clear headings, and bullet points for readability.',
            'impact': 'Medium Impact'
        })

        return feedback[:6]

    def _create_feedback_item(self, count: int, category: str, key: str) -> Dict:
        template = self.feedback_templates.get(category, {}).get(key)
        if template:
            return {
                'number': str(count).zfill(2),
                'category': template.category,
                'title': template.title,
                'text': template.text,
                'impact': template.impact
            }
        return {
            'number': str(count).zfill(2),
            'category': category.title(),
            'title': f'Improve {category.title()}',
            'text': f'Enhance your {category} section for better results.',
            'impact': 'Medium Impact'
        }
