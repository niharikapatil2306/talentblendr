from sklearn.preprocessing import LabelEncoder
import re
import tensorflow_probability as tfp

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import tensorflow as tf
# import tensorflow_probability as tfp
import torch.nn as nn
import numpy as np
import time
# Initialize Flask app

import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
import pandas as pd

class PolicyModel(tf.keras.Model):
    def __init__(self, input_shape, num_actions):
        super(PolicyModel, self).__init__()
        self.dense1 = tf.keras.layers.Dense(128, activation='relu')
        self.dense2 = tf.keras.layers.Dense(64, activation='relu')
        self.dense3 = tf.keras.layers.Dense(num_actions, activation='softmax')

    def call(self, state):
        # Ensure input has at least two dimensions
        state = tf.expand_dims(state, axis=0)
        x = self.dense1(state)
        x = self.dense2(x)
        return self.dense3(x) 
    
recruiter_job_df = pd.DataFrame(columns=['Recruiter_ID', 'Job_Posting_Id', 'Job_Postings'])

recruiter_ref = db.collection('recruiter')

recruiter_job_postings = []

def on_job_postings_snapshot(doc_snapshot, changes, read_time):
    global recruiter_job_postings  # Declare the list as global to modify it inside the function
    for change in changes:
        if change.type.name == 'ADDED' or change.type.name == 'MODIFIED':
            recruiter_id = change.document.reference.parent.parent.id  # Get the parent recruiter ID
            job_posting_id = change.document.id
            job_posting_data = change.document.to_dict()
            
            # Append data to the list
            recruiter_job_postings.append({
                'Recruiter_ID': recruiter_id,
                'Job_Posting_Id': job_posting_id,
                'Job_Postings': job_posting_data.get('jd', '')
            })

# Listen for changes in the job_postings collection under each recruiter document
def listen_to_recruiters():
    # Listen for changes in the recruiter collection
    recruiter_watch = recruiter_ref.on_snapshot(on_recruiter_snapshot)


def on_recruiter_snapshot(snapshot, changes, read_time):
    global recruiter_job_postings  # Declare the list as global to modify it inside the function
    
    for change in changes:
        if change.type.name == 'ADDED':
            recruiter_id = change.document.id
            job_postings_ref = db.collection(f'recruiter/{recruiter_id}/job_postings')
            job_postings_watch = job_postings_ref.on_snapshot(on_job_postings_snapshot)

# Check if the DataFrame is initially empty and fetch existing job postings if needed
if not recruiter_job_postings:
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

docs = db.collection('seeker').stream()

data_list = []

# Iterate through each document in the 'docs' collection
for doc in docs:
    # Create a dictionary containing the document data
    doc_data = {
        "id": doc.id,
        "project2": doc.to_dict()["project2"],
        "project1": doc.to_dict()["project1"],
        "technologiesUsedInProject1": doc.to_dict()["technologiesUsedInProject1"],
        "qualification": doc.to_dict()["qualification"],
        "publications": doc.to_dict()["publications"],
        "gpa": doc.to_dict()["gpa"],
        "technologiesUsedInProject2": doc.to_dict()["technologiesUsedInProject2"],
        "experienceInYears": doc.to_dict()["experienceInYears"],
        "skills": doc.to_dict()["skills"],
        "stream": doc.to_dict()["stream"],
        "certification": doc.to_dict()["certification"],
        "name": doc.to_dict()["name"],

    }
    
    data_list.append(doc_data)

df = pd.DataFrame(data_list)
print(recruiter_job_df)

def replace_word(cell_value, replace_dict):
    for target_word, replacement in replace_dict.items():
        cell_value = cell_value.replace(target_word, replacement)
    return cell_value

def clean_text(text):
    text=str(text).lower()
    cleaned_text = re.sub(r'[\n\r]', ' ', text)
    cleaned_text = re.sub(r'[;.:''(),<>|]', ' ', text)
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()

    return cleaned_text
# Clean and preprocess text data
def clean_and_preprocess_data():
    words = {'c++': ' cpp ', ' ml ': ' machine learning ', ' dl ': ' deep learning ',' nlp ': ' natural language processing ','react js':'reactjs'
    ,' oop ':' object oriented programming ',' ai ':' artificial intelligence ',' chat gpt ':' chatgpt ','js':' javascript '}


    df['project1'] = df['project1'].apply(clean_text)
    df['technologiesUsedInProject1'] = df['technologiesUsedInProject1'].apply(clean_text)
    df['project2'] = df['project2'].apply(clean_text)
    df['technologiesUsedInProject2'] = df['technologiesUsedInProject2'].apply(clean_text)
    df['skills'] = df['skills'].apply(clean_text)
    df['qualification'] = df['qualification'].apply(clean_text)
    df['stream'] = df['stream'].apply(clean_text)
    df['experienceInYears'] = df['experienceInYears'].apply(clean_text)
    df['certification'] = df['certification'].apply(clean_text)
    df['publications'] = df['publications'].apply(clean_text)
    df['gpa'] = df['gpa'].apply(clean_text)
    df['cand'] = df['project1'] +" "+  df['technologiesUsedInProject1'] +" "+  df['project2'] +" "+df['technologiesUsedInProject2'] +" "+df['skills'] +" "+df['stream'] +" "+df['experienceInYears'] +" "+df['certification'] +" "+df['publications']+" "+df['gpa']+" "+df['qualification']


# Train policy model using reinforcement learning
def train_policy_model():
    vectorizer = TfidfVectorizer()
    cand = vectorizer.fit_transform(df['cand'])
    jd_data= vectorizer.transform(recruiter_job_df["Job_Postings"])

    cand_dense = cand.toarray()
    jd_ndata_dense = jd_data.toarray()

    cosine_sim = cosine_similarity(cand, jd_data)
    epochs = 300
    learning_rate = 0.001
    gamma = 0.95
    epsilon_clip = 0.2
    
    num_actions = len(cand_dense)
    input_shape = jd_ndata_dense.shape[1]
    policy_model = PolicyModel(input_shape, num_actions)
    optimizer = tf.keras.optimizers.Adam(learning_rate)

    for epoch in range(epochs):
        for i in range(jd_ndata_dense.shape[0]):
            state = tf.convert_to_tensor(jd_ndata_dense[i], dtype=tf.float32)
            with tf.GradientTape() as tape:
                # Get policy probabilities
                action_probabilities = policy_model(state)

                # Create a categorical distribution
                dist = tfp.distributions.Categorical(probs=action_probabilities)

                # Sample action
                action = dist.sample()

                # Compute cosine similarities for the selected action
                cosine_similarities = cosine_similarity(cand_dense[action.numpy()].reshape(1, -1), jd_ndata_dense[i].reshape(1, -1))
                reward = cosine_similarities[0][0]

                # match_percentage = (reward + 1) * 50
                # print(match_percentage)

                # Calculate advantage
                advantage = reward - np.mean(cosine_similarity(cand_dense[action.numpy()], jd_ndata_dense))

                # Calculate loss
                old_action_probabilities = tf.reduce_sum(tf.one_hot(action, num_actions) * action_probabilities, axis=1)
                ratio = tf.exp(tf.math.log(action_probabilities + 1e-10) - tf.math.log(old_action_probabilities + 1e-10))
                clipped_ratio = tf.clip_by_value(ratio, 1 - epsilon_clip, 1 + epsilon_clip)
                surrogate1 = ratio * advantage
                surrogate2 = clipped_ratio * advantage
                loss = -tf.reduce_mean(tf.minimum(surrogate1, surrogate2))

            # Update policy
            grads = tape.gradient(loss, policy_model.trainable_variables)
            optimizer.apply_gradients(zip(grads, policy_model.trainable_variables))

            if epoch % 50 == 0 and i == 0:
                print(f"Epoch: {epoch}, Loss: {loss.numpy()}, Reward: {reward}")

    for i in range(jd_ndata_dense.shape[0]):
        # Get the recruiter ID for this job posting
        recruiter_id = recruiter_job_df.iloc[i]['Recruiter_ID']
        job_posting_id = recruiter_job_df.iloc[i]['Job_Posting_Id']
        
        # Create a reference to the recruiter's recommendations collection
        recommendation_collection_ref = db.collection(f'recruiter/{recruiter_id}/job_postings/{job_posting_id}/recommendations')
        
        # Get the top 5 recommendations for this job posting
        state = tf.convert_to_tensor(jd_ndata_dense[i], dtype=tf.float32)
        action_probabilities = policy_model(state).numpy()
        top5_indices = np.argsort(action_probabilities[0])[::-1][:5]
        print(recruiter_id)
        print(top5_indices)
        for idx in top5_indices:            
            recommendation_data = {
                'id': df.iloc[idx]['id'],
                'name': df.iloc[idx]['name'],
                'selected': False,
                'rejected': False

            }
            print( recommendation_data )
    
            # Create a document reference for each recommendation
            recommendation_document_ref = recommendation_collection_ref.document(str(df.iloc[idx]['id']))
            
            # # Set the recommendation data in the document
            recommendation_document_ref.set(recommendation_data)
            
            print(f"Stored recommendation for recruiter {recruiter_id}: {recommendation_data}")
        
        

if __name__ == "__main__":
    
    listen_to_recruiters()

    # Clean and preprocess data
    clean_and_preprocess_data()
    
    # Train policy model
    train_policy_model()

