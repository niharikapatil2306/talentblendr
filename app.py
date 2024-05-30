import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import streamlit as st

import re
import warnings
import google.generativeai as genai

import gensim
from gensim.models import Word2Vec
from gensim.utils import simple_preprocess

import os

import tensorflow as tf
import tensorflow_probability as tfp
import numpy as np

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

try:
    app = firebase_admin.get_app()
except ValueError as e:
    cred = credentials.Certificate('serviceAccountKey.json')
    firebase_admin.initialize_app(cred)

db = firestore.client()

recruiter_job_postings = []
seeker_resumes = []
recruiter_ids = []
job_posting_ids = []

def fetch_recruiter_job_postings():
    global recruiter_job_postings
    recruiter_ref = db.collection('job_postings')

    job_postings = recruiter_ref.get()
    for job_posting in job_postings:
        job_posting_data = job_posting.to_dict()
        recruiter_job_postings.append({
            'Recruiter_ID': job_posting_data.get('rec_id'),
            'Job_Posting_Id': job_posting.id,
            'Job_Postings': job_posting_data.get('jd', '')
        })

    for posting in recruiter_job_postings:
        recruiter_ids.append(posting['Recruiter_ID'])
        job_posting_ids.append(posting['Job_Posting_Id'])
    
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

def clean_and_preprocess_data(df):
    def clean_field(field):
        if isinstance(field, str) and field.strip().lower() in ['n/a', 'na', '']:
            return ""
        return field

    df['cand'] = (
        df['Project1'].fillna('') + " " + df['TechUsedProject1'].fillna('') + " " +
        df['Project2'].fillna('') + " " + df['TechUsedProject2'].fillna('') + " " +
        df['Skills'].fillna('') + " " + df['Stream'].fillna('') + " " +
        df['Experience'].fillna('') + " " + clean_field(df['Certification']) + " " +
        df['Publications'].fillna('') + " " + df['GPA'].fillna('') + " " +
        df['Qualification'].fillna('')
    ).str.strip()

    return df


def fetch_user_feedback(recruiter_id, job_posting_id):
    selected_ref = db.collection(f'selected')
    rejected_ref = db.collection(f'rejected')

    selected_docs = selected_ref.stream()
    rejected_docs = rejected_ref.stream()

    selected_candidates = [doc.id for doc in selected_docs if doc.to_dict()['Job_Posting_Id'] == job_posting_id]
    rejected_candidates = [doc.id for doc in rejected_docs if doc.to_dict()['Job_Posting_Id'] == job_posting_id]

    return selected_candidates, rejected_candidates

class ValueModel(tf.keras.Model):
    def __init__(self, input_shape):
        super(ValueModel, self).__init__()
        self.dense1 = tf.keras.layers.Dense(128, activation='relu')
        self.dense2 = tf.keras.layers.Dense(64, activation='relu')
        self.value_output = tf.keras.layers.Dense(1)  # Output layer for value estimation

    def call(self, state):
        x = self.dense1(state)
        x = self.dense2(x)
        return self.value_output(x)

class PolicyModel(tf.keras.Model):
    def __init__(self, input_shape, num_actions):
        super(PolicyModel, self).__init__()
        self.dense1 = tf.keras.layers.Dense(128, activation='relu')
        self.dense2 = tf.keras.layers.Dense(64, activation='relu')
        self.dense3 = tf.keras.layers.Dense(num_actions, activation='softmax')

    def call(self, state):
        x = self.dense1(state)
        x = self.dense2(x)
        return self.dense3(x)

# Initialize the model and optimizer
vectorizer = TfidfVectorizer()
df = clean_and_preprocess_data(seeker_resume_df)
jd_vector= vectorizer.fit_transform(recruiter_job_df["Job_Postings"])
resume_vector = vectorizer.transform(df['cand'])

# seeker_sentences = [simple_preprocess(text) for text in df['cand']]
# job_sentences = [simple_preprocess(text) for text in recruiter_job_df['Job_Postings']]

# combined_sentences = seeker_sentences + job_sentences

# # Train the Word2Vec model
# word2vec_model = Word2Vec(sentences=combined_sentences, vector_size=100, window=5, min_count=1, workers=4)

# import numpy as np

# def get_average_word2vec(tokens_list, model, vocabulary, size):
#     """Calculate the average word2vec for a given sentence."""
#     vector = np.zeros(size)
#     count = 0
#     for token in tokens_list:
#         if token in vocabulary:
#             vector += model.wv[token]
#             count += 1
#     if count != 0:
#         vector /= count
#     return vector

# # Vectorize job postings
# jd_vector = np.array([get_average_word2vec(sentence, word2vec_model, word2vec_model.wv.key_to_index, 100) for sentence in job_sentences])

# # Vectorize resumes
# resume_vector = np.array([get_average_word2vec(sentence, word2vec_model, word2vec_model.wv.key_to_index, 100) for sentence in seeker_sentences])

cand_dense = resume_vector.toarray()
jd_ndata_dense = jd_vector.toarray()

# cand_dense = resume_vector
# jd_ndata_dense = jd_vector

num_actions = len(cand_dense)
input_shape = jd_ndata_dense.shape[1]

# Initialize the value model and optimizer
value_model = ValueModel(input_shape)
value_optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)

# Initialize the model and optimizer
policy_model = PolicyModel(input_shape, num_actions)
optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
   
# Define PPO loss function
def ppo_loss(old_probs, new_probs, actions, advantages, epsilon=0.2):
    ratio = new_probs / old_probs
    clipped_ratio = tf.clip_by_value(ratio, 1 - epsilon, 1 + epsilon)
    surrogate1 = ratio * advantages
    surrogate2 = clipped_ratio * advantages
    loss = -tf.reduce_mean(tf.minimum(surrogate1, surrogate2))
    return loss

# Generalized Advantage Estimation (GAE) function
def calculate_advantages(rewards, values, gamma=0.99, lambda_=0.95):
    deltas = rewards + gamma * values[1:] - values[:-1]
    advantages = np.zeros_like(deltas, dtype=np.float32)
    running_add = 0
    for t in reversed(range(len(deltas))):
        running_add = deltas[t] + gamma * lambda_ * running_add
        advantages[t] = running_add
    return advantages

# Action mapping function
def map_candidates_to_actions(selected_candidates, rejected_candidates, seeker_resume_df):
    actions = []
    for selected in selected_candidates:
        action = seeker_resume_df[seeker_resume_df['Seeker_ID'] == selected].index[0]
        actions.append(action)
    for rejected in rejected_candidates:
        action = seeker_resume_df[seeker_resume_df['Seeker_ID'] == rejected].index[0]
        actions.append(action)
    return actions

# Training loop with PPO and GAE
def train_with_feedback(jd_vectors, resume_vectors, recruiter_job_df, seeker_resume_df):
    if jd_vectors.getnnz() == 0 or resume_vectors.getnnz() == 0:
        # Exit early if either jd_vectors or resume_vectors is empty
        return

    for idx, job_posting in recruiter_job_df.iterrows():
        recruiter_id = job_posting['Recruiter_ID']
        job_posting_id = job_posting['Job_Posting_Id']

        # Check if recommendations already exist for this job posting
        if recommendations_exist(recruiter_id, job_posting_id):
            continue  # Recommendations already exist, skip this job posting

        # # Check if idx is within the valid range of row indices in jd_vectors
        if idx >= jd_vectors.shape[0]:
            continue  # Invalid index, skip this job posting

        jd_vector = jd_vectors[idx].toarray()
        jd_vector_expanded = tf.expand_dims(jd_vector, axis=0)
        state = tf.convert_to_tensor(jd_vector, dtype=tf.float32)

        selected_candidates, rejected_candidates = fetch_user_feedback(recruiter_id, job_posting_id)

        if selected_candidates and rejected_candidates:
            actions = map_candidates_to_actions(selected_candidates, rejected_candidates, seeker_resume_df)
            rewards = np.zeros(len(actions))
            rewards[:len(selected_candidates)] = 1  # Assign positive reward for selected candidates
            rewards[len(selected_candidates):] = -1  # Assign negative reward for rejected candidates

            old_probs = policy_model(state)
            old_probs = tf.gather(old_probs, actions, axis=-1)

            with tf.GradientTape() as tape:
                new_probs = policy_model(state)
                new_probs = tf.gather(new_probs, actions, axis=-1)
                values = value_model(state)
                advantages = calculate_advantages(rewards, values)

                policy_loss = ppo_loss(old_probs, new_probs, actions, advantages)

            policy_grads = tape.gradient(policy_loss, policy_model.trainable_variables)
            optimizer.apply_gradients(zip(policy_grads, policy_model.trainable_variables))

            with tf.GradientTape() as tape:
                values = value_model(state)
                value_loss = tf.reduce_mean(tf.square(values - rewards))

            value_grads = tape.gradient(value_loss, value_model.trainable_variables)
            value_optimizer.apply_gradients(zip(value_grads, value_model.trainable_variables))

        recommendations = get_top_matching_candidates(state, resume_vectors, policy_model, recruiter_id, job_posting_id)
        store_recommendations(recruiter_id, job_posting_id, recommendations)

def get_top_matching_candidates(jd_vector, resume_vectors, policy_model, recruiter_id, job_posting_id, threshold=0.5, top_k=5):
    # Calculate action probabilities using the policy model
    jd_vector = tf.expand_dims(jd_vector, axis=0)  # Add a batch dimension

    action_probabilities = policy_model(jd_vector).numpy().flatten()  # Convert to NumPy array and flatten
    
    # Normalize and reshape the job description vector for cosine similarity calculation
    jd_vector_normalized = jd_vector / tf.norm(jd_vector)
    jd_vector_normalized = tf.reshape(jd_vector_normalized, (1, -1))

    # Calculate similarity scores between resume vectors and the normalized job description vector
    similarity_scores = cosine_similarity(resume_vectors, jd_vector_normalized).flatten()

    # Combine action probabilities and similarity scores to get combined scores
    combined_scores =  0.5 * action_probabilities +   similarity_scores

    # Sort indices based on combined scores in descending order and take the top_k indices
    sorted_indices = np.argsort(combined_scores)[::-1]
    
    top_candidates = [
        seeker_resume_df.iloc[idx] 
        for idx in sorted_indices[:top_k] 
    ]
    recommendations_data = []
    for candidate_data in top_candidates:
        seeker_index = candidate_data.name  # Assuming the index in seeker_resume_df is the seeker ID
        recommendation_data = {
            'Recruiter_ID': recruiter_id,
            'Job_Posting_Id': job_posting_id,
            'Seeker_ID': seeker_resume_df.loc[seeker_index, 'Seeker_ID'],
            'Name': seeker_resume_df.loc[seeker_index, 'Name'],
            'Similarity_Score': similarity_scores[seeker_index]
        }
        recommendations_data.append(recommendation_data)

    return recommendations_data

def recommendations_exist(recruiter_id, job_posting_id):
    recommendations_ref = db.collection('recommendations').document(recruiter_id).collection(job_posting_id)
    recommendations = recommendations_ref.stream()
    return any(recommendations)


def store_recommendations(recruiter_id, job_posting_id, recommendations):
    recommendations_ref = db.collection('recommendations').document(recruiter_id).collection(job_posting_id)
    existing_recommendations = recommendations_exist(recruiter_id, job_posting_id)
    ref = db.collection('job_postings').document(job_posting_id)
    doc = ref.get()
    # job_description = doc.get('description') 
    # questions = generate_questions_from_jd(job_description)

    for candidate_data in recommendations:
        candidate_id = candidate_data['Seeker_ID']  # Assuming 'Seeker_ID' is the candidate's unique identifier
        recommendation_document_ref = recommendations_ref.document(candidate_id)
        recommendation_data = {
            'Job_Posting_Id': job_posting_id,
            'Name': candidate_data['Name'],
            'Recruiter_ID': recruiter_id,
            'Seeker_ID': candidate_id,
            'Similarity_Score': candidate_data['Similarity_Score']
        }
        if existing_recommendations and candidate_id in existing_recommendations:
            # Update the existing recommendation
            recommendation_document_ref.update(recommendation_data)
        else:
            # Store the new recommendation
            recommendation_document_ref.set(recommendation_data)
        
        # questions_collection_ref = db.collection('screening_test').document(candidate_id).collection(job_posting_id).document(candidate_id).collection('questions')
        # for i, question in enumerate(questions):
        #     questions_document_ref = questions_collection_ref.document(str(i))
        #     questions_document_ref.set(question)


st.title('Job Recommendation System')

import time

def check_for_new_job_postings(interval_seconds=60):
    while True:
        # Fetch the latest job postings from Firebase
        recruiter_job_df = fetch_recruiter_job_postings()

        # Check each job posting for new recommendations
        for idx, job_posting in recruiter_job_df.iterrows():
            recruiter_id = job_posting['Recruiter_ID']
            job_posting_id = job_posting['Job_Posting_Id']

            # Check if recommendations already exist for this job posting
            if recommendations_exist(recruiter_id, job_posting_id):
                continue  # Recommendations already exist, skip this job posting

            # No recommendations exist, generate recommendations
            train_with_feedback(jd_vector, resume_vector, recruiter_job_df, seeker_resume_df)
            policy_model.save_weights('policy_model_weights.weights.h5')
            value_model.save_weights('value_model_weights.weights.h5')
            time.sleep(1)  # Sleep for 1 second to avoid overloading the system

        time.sleep(interval_seconds)  # Sleep for the specified interval before checking again


# warnings.filterwarnings("ignore", category=DeprecationWarning)

# # Configure API key
# api_key = "AIzaSyD0c_Eteg7ozapXdGE9XOY4pt11IOGep5o"
# genai.configure(api_key=api_key)

# # Generation configuration
# generation_config = {
#     "temperature": 0.9,
#     "top_p": 1,
#     "top_k": 1,
#     "max_output_tokens": 2048,
# }

# # Initialize the model
# model = genai.GenerativeModel("gemini-1.0-pro", generation_config=generation_config)

# Function to generate questions from job description
# def generate_questions_from_jd(job_description):
#     prompt = f"""
#     [INST] ### Instruction: This is the job description
    
#     {job_description}

#     Use above job description to generate 15 multiple choice questions for a screening test, questions should be based on mentioned technologies, you can ask practical questions as well, generate questions with correct answer in the following format:
#     question:
#     Options:
#     Answer: {{Answer in words, Don't write option name}} [/INST]
#     """
#     chat = model.start_chat(history=[])
#     llm_output = chat.send_message(prompt)
    
#     # Define the pattern to extract questions, options, and answers
#     question_pattern = r'\*\*Question \d+:\*\*\n(.*?)\nOptions:\n((?:\(.*?\) .*?\n)+)Answer: (.*?)\n'
#     option_pattern = r'\((.*?)\) (.*?)\n'
    
#     # Function to extract questions, options, and answers
#     def extract_questions(chunk_texts):
#         questions = []
#         for chunk in chunk_texts:
#             match = re.findall(question_pattern, chunk)
#             if match:
#                 for q in match:
#                     question_text = q[0].strip()
#                     options = re.findall(option_pattern, q[1])
#                     options = {option[0]: option[1] for option in options}
#                     answer = q[2].strip()
#                     questions.append({
#                         'question': question_text,
#                         'options': options,
#                         'answer': answer
#                     })
#         return questions

#     questions = extract_questions([chunk.text for chunk in llm_output])
#     return questions


def main():
    if os.path.exists('policy_model_weights.weights.h5'):
        policy_model.load_weights('policy_model_weights.weights.h5')
    if os.path.exists('value_model_weights.weights.h5'):
        value_model.load_weights('value_model_weights.weights.h5')
    # Start the function to check for new job postings
    check_for_new_job_postings()

if __name__ == "__main__":
    main()
