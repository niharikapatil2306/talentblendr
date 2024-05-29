import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsAndReports = () => {

    const jobPostingsData = [
        { month: 'Jan', count: 100 },
        { month: 'Feb', count: 120 },
        { month: 'Mar', count: 90 },
        { month: 'Apr', count: 110 },
        { month: 'May', count: 130 },
        { month: 'Jun', count: 95 },
        { month: 'Jul', count: 115 },
        { month: 'Aug', count: 105 },
        { month: 'Sep', count: 125 },

    ];

    return (
        <Card sx={{ mt: 6, mr:2 }} style={{boxShadow: 'black'}}>
            <CardContent>
                <Typography variant="h5" gutterBottom style={{textAlign:'center'}}>
                    Job Postings Statistics
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={jobPostingsData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#D0C0B0" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default AnalyticsAndReports;
