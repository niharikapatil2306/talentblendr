import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function JobPostingCard() {
    const [jobPostings, setJobPostings] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const recruiterId = user.uid;
                const jobPostingsRef = collection(db, 'recruiter', recruiterId, 'job_postings');
                const unsubscribeSnapshot = onSnapshot(jobPostingsRef, snapshot => {
                    const newJobPostings = snapshot.docs.map(doc => doc.data());
                    setJobPostings(newJobPostings);
                });

                return () => unsubscribeSnapshot();
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            {jobPostings.map((jobPosting, index) => (
                <Card key={index} style={{ margin: '1rem', padding: '1rem', backgroundColor: '#f5f5f5' }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{jobPosting.title}</Typography>
    <Typography variant="body1" sx={{ color: '#333', marginBottom: '0.5rem' }}>{jobPosting.description}</Typography>
    <Typography variant="body1" sx={{ color: '#333', marginBottom: '0.5rem' }}>{jobPosting.requirements}</Typography>
    <Grid container spacing={1}>
        <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>Location:</Typography>
            <Typography variant="body1" sx={{ color: '#555' }}>{jobPosting.location}</Typography>
        </Grid>
        <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#555' }}>Package:</Typography>
            <Typography variant="body1" sx={{ color: '#555' }}>{jobPosting.package}</Typography>
        </Grid>
    </Grid>
</Card>

            ))}
        </>
    );
};
