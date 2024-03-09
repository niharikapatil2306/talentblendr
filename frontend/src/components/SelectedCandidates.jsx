import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Box, Card, CardActions, CardContent, Grid, IconButton, Typography } from "@mui/material";
import { Check, Close, Person } from "@mui/icons-material";
import { auth, db } from '../firebase';

export default function SelectedCandidates() {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const recruiterId = user.uid;
                const jobPostingsRef = collection(db, 'recruiter', recruiterId, 'recommendations');
                const unsubscribeSnapshot = onSnapshot(jobPostingsRef, snapshot => {
                    const newRecommendations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setRecommendations(newRecommendations);
                });

                return () => unsubscribeSnapshot();
            }
        });

        return () => unsubscribe();
    }, []);

    const handleApprove = (id) => {
        // Handle approval logic for the recommendation with ID 'id'
    };

    const handleReject = (id) => {
        // Handle rejection logic for the recommendation with ID 'id'
    };

    return (
        <div style={{ maxHeight: '20rem', overflowY: 'auto', marginTop: '2rem' }}>
            {recommendations.map((recommendation, index) => (
                <Card key={index} sx={{ maxWidth: '100%', margin: '1rem' }}>
                    <Grid container>
                        <Grid item xs={9}>
                            <CardContent>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Person style={{ border: '2px', borderStyle: 'solid', borderColor: 'black', borderRadius: '50%', width: '6rem', height: '6rem', marginRight: '2rem' }} />
                                    <div>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{recommendation.name}</Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{recommendation.education}</Typography>
                                    </div>
                                </div>
                            </CardContent>
                        </Grid>
                        <Grid item xs={3}>
                            <CardActions disableSpacing style={{ height: '100%', display: 'flex', flexFlow: 'column', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={() => handleApprove(recommendation.id)}>
                                        <Check />
                                    </IconButton>
                                    <IconButton onClick={() => handleReject(recommendation.id)}>
                                        <Close />
                                    </IconButton>
                                </Box>
                            </CardActions>
                        </Grid>
                    </Grid>
                </Card>
            ))}
        </div>
    );
}
