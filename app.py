from flask import Flask, request, jsonify, render_template
from sklearn.preprocessing import LabelEncoder
import re
import tensorflow_probability as tfp

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import tensorflow as tf
# import tensorflow_probability as tfp
import torch.nn as nn
import numpy as np
# Initialize Flask app
app = Flask(__name__)

import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
import pandas as pd

# # Initialize an empty DataFrame to store recruiter ID and job postings
# recruiter_job_df = pd.DataFrame(columns=['Recruiter_ID', 'Job_Postings'])

# # Define the callback function to handle snapshot changes
# def on_job_postings_snapshot(doc_snapshot, changes, read_time):
#     for change in changes:
#         if change.type.name == 'ADDED' or change.type.name == 'MODIFIED':
#             job_posting_data = change.document.to_dict()
#             # Process the job posting data here
#             print("New job posting:")
#             print(job_posting_data)

# # Reference to the recruiter collection
# recruiter_ref = db.collection('recruiter')

# # Listen for changes in the job_postings collection under each recruiter document
# def listen_to_recruiters():
#     # Listen for changes in the recruiter collection
#     recruiter_watch = recruiter_ref.on_snapshot(on_recruiter_snapshot)

# def on_recruiter_snapshot(snapshot, changes, read_time):
#     for change in changes:
#         if change.type.name == 'ADDED':
#             recruiter_id = change.document.id
#             job_postings_ref = db.collection(f'recruiter/{recruiter_id}/job_postings')
#             job_postings_watch = job_postings_ref.on_snapshot(on_job_postings_snapshot)

# # Start listening for changes in the recruiter collection
# listen_to_recruiters()

# # Define the callback function to handle snapshot changes for job postings
# def on_job_postings_snapshot(doc_snapshot, changes, read_time):
#     global recruiter_job_df

#     for change in changes:
#         i=0
#         if change.type.name == 'ADDED' or change.type.name == 'MODIFIED':
#             recruiter_id = change.document.reference.parent.parent.id
#             job_posting_data = change.document.to_dict()
#             # print(job_posting_data)
#             # print(i)
#             # i=i+1
#             job_description = job_posting_data.get('jd', '')
#             print(recruiter_id,job_description)
#             # Check if the recruiter ID already exists in the DataFrame
#             recruiter_job_df["Recruiter_ID"]=recruiter_id 
#             recruiter_job_df["Job_Postings"]=job_description

#             # print("Recruiter ID:", recruiter_id, "Job Description:", job_description)

# # Define the callback function to handle changes in the recruiter collection
# def on_recruiter_snapshot(snapshot, changes, read_time):
#     for change in changes:
#         if change.type.name == 'ADDED':
#             recruiter_id = change.document.id
#             job_postings_ref = db.collection(f'recruiter/{recruiter_id}/job_postings')
#             job_postings_watch = job_postings_ref.on_snapshot(on_job_postings_snapshot)

# # Reference to the recruiter collection
# recruiter_ref = db.collection('recruiter')

# # Listen for changes in the recruiter collection
# def listen_to_recruiters():
#     recruiter_watch = recruiter_ref.on_snapshot(on_recruiter_snapshot)

# # Start listening for changes in the recruiter collection
# listen_to_recruiters()

recruiter_job_postings = []

# Define the callback function to handle snapshot changes
def on_job_postings_snapshot(doc_snapshot, changes, read_time):
    global recruiter_job_postings  # Declare the list as global to modify it inside the function
    
    for change in changes:
        if change.type.name == 'ADDED' or change.type.name == 'MODIFIED':
            recruiter_id = change.document.reference.parent.parent.id  # Get the parent recruiter ID
            job_posting_data = change.document.to_dict()
            
            # Append data to the list
            recruiter_job_postings.append({
                'Recruiter_ID': recruiter_id,
                'Job_Postings': job_posting_data
            })

            # Process the job posting data here
            print("New job posting:")
            print(job_posting_data)

# Reference to the recruiter collection
recruiter_ref = db.collection('recruiter')

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

# Start listening for changes in the recruiter collection
listen_to_recruiters()

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
                'Job_Postings': job_posting_data
            })

# Convert the list of dictionaries to a DataFrame
recruiter_job_df = pd.DataFrame(recruiter_job_postings)

# Print the DataFrame to see the recruiter IDs and their corresponding job postings
print(recruiter_job_df)

# # Listen for changes in the collection
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
print("mydatframe -niharila")

words = {'c++': ' cpp ', ' ml ': ' machine learning ', ' dl ': ' deep learning ',' nlp ': ' natural language processing ','react js':'reactjs'
,' oop ':' object oriented programming ',' ai ':' artificial intelligence ',' chat gpt ':' chatgpt ','js':' javascript '}



# @app.route('/')
# def home():
#     return render_template('index.html')

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

print(recruiter_job_df["Job_Postings"])
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
    
print("bbbbbbbbbbbbbbbbbbb")

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

                # Calculate advantage
                advantage = reward - np.mean(cosine_similarity(cand_dense[action.numpy()], jd_ndata_dense))
                print("ccccccccccccccccccccc")

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
            print("dddddddddddddddddddddddddd")

            if epoch % 50 == 0 and i == 0:
                print(f"Epoch: {epoch}, Loss: {loss.numpy()}, Reward: {reward}")

# Use the trained policy to select actions
        top2_similar_rows = []
        for i in range(jd_ndata_dense.shape[0]):
            print("eeeeeeeeeeeeeeeeeee")

            state = tf.convert_to_tensor(jd_ndata_dense[i], dtype=tf.float32)
            action_probabilities = policy_model(state).numpy()

    # Use deterministic action (argmax) for display purposes
            top2_indices = np.argsort(action_probabilities[0])[::-1][:2]
            print("dddddddddddddddddd")

            print(f"For row {i}:")
            print(f"Selected Actions: {top2_indices}")
            print(f"Similar Rows: {[df.iloc[j, df.columns.get_loc('name')] for j in top2_indices]}")
            # return top2_indices 


class PolicyModel(tf.keras.Model):
    def __init__(self, input_shape, num_actions):
        super(PolicyModel, self).__init__()
        self.dense1 = tf.keras.layers.Dense(128, activation='relu')
        self.dense2 = tf.keras.layers.Dense(64, activation='relu')
        self.dense3 = tf.keras.layers.Dense(num_actions, activation='softmax')
        print("fffffffffffffffffffffff")

    def call(self, state):
        # Ensure input has at least two dimensions
        state = tf.expand_dims(state, axis=0)
        x = self.dense1(state)
        x = self.dense2(x)
        return self.dense3(x)  
if __name__ == '__main__':
    app.run(debug=True)
