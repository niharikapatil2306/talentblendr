import React, { useState } from 'react';
import { Button, Card, Container, Grid, TextField, Typography } from '@mui/material';

import { AddCircleOutline, PostAdd } from '@mui/icons-material';

import Screening_Test from '../components/Screening_Test';
import VerticalNavbarSeeker from '../components/VerticalNavbarSeeker';

const Screening_Tests = () => {
    const [showForm, setShowForm] = useState(false);

    // sx={{backgroundColor:'rgba(226, 229, 229, 1)'}}
    
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={3} md={2}>
                <VerticalNavbarSeeker />
            </Grid>
            <Grid item xs={12} sm={9} md={10}>
            <Screening_Test />
            </Grid>
        </Grid>
    );
};

export default Screening_Tests;
