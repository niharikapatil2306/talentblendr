import React, { useState } from 'react';
import { Button, Card, Container, Grid, TextField, Typography } from '@mui/material';
import VerticalNavbar from '../components/VerticalNavbar';
import { AddCircleOutline, PostAdd } from '@mui/icons-material';
import JobPostingForm from '../components/JobPostingForm';
import JobPostingCard from '../components/JobPostingCard';

const JobBoardPage = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={3} md={2}>
                <VerticalNavbar />
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
            <Button onClick={() => setShowForm(!showForm)} style={{ float: 'inline-end' }}>
                        <AddCircleOutline sx={{ fontSize: 52 }} />
                    </Button>
                <Container style={{ width: '90%', marginTop: '1rem' }}>
                    
                    {showForm && <JobPostingForm />}
                    <JobPostingCard />
                </Container>
            </Grid>
        </Grid>
    );
};

export default JobBoardPage;
