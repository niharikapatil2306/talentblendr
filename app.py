import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import streamlit as st

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Initialize Firebase Admin SDK
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

# Global lists to store data
recruiter_job_postings = []
seeker_resumes = []

# Fetch recruiter job postings and update DataFrame
def fetch_recruiter_job_postings():
    global recruiter_job_postings
    recruiter_ref = db.collection('recruiter')
    
    for recruiter_doc in recruiter_ref.stream():
        recruiter_id = recruiter_doc.id
        job_postings_ref = db.collection(f'recruiter/{recruiter_id}/job_postings')
        job_postings = job_postings_ref.get()
        for job_posting in job_postings:
            job_posting_data = job_posting.to_dict()
            recruiter_job_postings.append({
                'Recruiter_ID': recruiter_id,
                'Job_Posting_Id': job_posting.id,
                'Job_Postings': job_posting_data.get('jd', '')
            })
    
    recruiter_job_df = pd.DataFrame(recruiter_job_postings)
    return recruiter_job_df

# Function to concatenate all fields into a single resume string
def create_resume(seeker_data):
    resume_fields = [
        seeker_data.get('name', ''),
        seeker_data.get('email', ''),
        seeker_data.get('qualification', ''),
        seeker_data.get('experienceInYears', ''),
        seeker_data.get('gpa', ''),
        seeker_data.get('stream', ''),
        seeker_data.get('project1', ''),
        seeker_data.get('technologiesUsedInProject1', ''),
        seeker_data.get('project2', ''),
        seeker_data.get('technologiesUsedInProject2', ''),
        seeker_data.get('publications', ''),
        seeker_data.get('certification', ''),
        ' '.join(seeker_data.get('skills', []))
    ]
    return ' '.join(resume_fields)

# Fetch job seeker resumes and update DataFrame
def fetch_seeker_resumes():
    global seeker_resumes
    seeker_ref = db.collection('seeker')
    
    for seeker_doc in seeker_ref.stream():
        seeker_data = seeker_doc.to_dict()
        resume = create_resume(seeker_data)
        seeker_resumes.append({
            'Seeker_ID': seeker_doc.id,
            'Resume': resume,
            'Name': seeker_data.get('name', ''),
            'Email': seeker_data.get('email', ''),
            'Qualification': seeker_data.get('qualification', ''),
            'Experience': seeker_data.get('experienceInYears', ''),
            'GPA': seeker_data.get('gpa', ''),
            'Stream': seeker_data.get('stream', ''),
            'Project1': seeker_data.get('project1', ''),
            'TechUsedProject1': seeker_data.get('technologiesUsedInProject1', ''),
            'Project2': seeker_data.get('project2', ''),
            'TechUsedProject2': seeker_data.get('technologiesUsedInProject2', ''),
            'Publications': seeker_data.get('publications', ''),
            'Certification': seeker_data.get('certification', ''),
            'Skills': ', '.join(seeker_data.get('skills', []))
        })
    
    seeker_resume_df = pd.DataFrame(seeker_resumes)
    return seeker_resume_df

# Fetch data and create DataFrames
recruiter_job_df = fetch_recruiter_job_postings()
seeker_resume_df = fetch_seeker_resumes()

# print(recruiter_job_df)
# print(seeker_resume_df)

# Vectorize job descriptions and resumes
vectorizer = TfidfVectorizer()
jd_vectors = vectorizer.fit_transform(recruiter_job_df['Job_Postings'])
resume_vectors = vectorizer.transform(seeker_resume_df['Resume'])

# Calculate similarity
similarity_matrix = cosine_similarity(jd_vectors, resume_vectors)

# Get top 5 recommendations for each job description
def get_top_5_recommendations(jd_index):
    similarity_scores = similarity_matrix[jd_index]
    top_5_indices = similarity_scores.argsort()[-5:][::-1]
    return [seeker_resume_df.iloc[i] for i in top_5_indices]

# Generate recommendations for each job posting
recommendations = {}
for idx, job_posting in recruiter_job_df.iterrows():
    job_id = job_posting['Job_Posting_Id']
    recommendations[job_id] = get_top_5_recommendations(idx)

# Print recommendations for each job posting
for job_id, recs in recommendations.items():
    print(f"Recommendations for Job ID {job_id}:")
    for rec in recs:
        print(rec['Seeker_ID'], rec['Name'])


st.title('Job Recommendation System')

def display_resume(resume):
    st.write(f"**Name:** {resume['Name']}")
    st.write(f"**Email:** {resume['Email']}")
    st.write(f"**Qualification:** {resume['Qualification']}")
    st.write(f"**Experience:** {resume['Experience']} years")
    st.write(f"**GPA:** {resume['GPA']}")
    st.write(f"**Stream:** {resume['Stream']}")
    st.write(f"**Project 1:** {resume['Project1']}")
    st.write(f"**Technologies Used in Project 1:** {resume['TechUsedProject1']}")
    st.write(f"**Project 2:** {resume['Project2']}")
    st.write(f"**Technologies Used in Project 2:** {resume['TechUsedProject2']}")
    st.write(f"**Publications:** {resume['Publications']}")
    st.write(f"**Certification:** {resume['Certification']}")
    st.write(f"**Skills:** {resume['Skills']}")

def display_job_descriptions():
    job_options = recruiter_job_df['Job_Postings'].tolist()
    jd_choice = st.selectbox('Select a Job Description', job_options)
    
    if jd_choice:
        jd_index = job_options.index(jd_choice)
        recommendations = get_top_5_recommendations(jd_index)
        
        st.write('Top 5 Recommendations:')
        for rec in recommendations:
            display_resume(rec)

if st.button('Get Recommendations'):
    display_job_descriptions()
