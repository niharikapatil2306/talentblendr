import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { addDoc, collection, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function JobPostingForm(){
    const [formData, setFormData] = useState({
        title: '',
        description: '', 
        requirements: '',
        location: '',
        package: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                const recruiterRef = doc(collection(db, "recruiter"), user.uid);
                
                const jobPostingsRef = collection(recruiterRef, "job_postings");
                await addDoc(jobPostingsRef, formData);
                
                console.log("Successfully added job posting!");
                window.location.reload()
            }
        } catch (error) {
            console.error("Error submitting job posting:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                name="title"
                label="Job Title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
            />
            <TextField
                name="requirements"
                label="Requirements"
                value={formData.requirements}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
            />

            <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
            />

            <TextField
                name="package"
                label="Package"
                value={formData.package}
                onChange={handleChange}
                fullWidth
                margin="normal"
                multiline
            />
            <Button type="submit" variant="contained" color="primary">Submit</Button>
        </form>
    );
}