import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, getDocs } from 'firebase/firestore';
import { Card, CardContent, Grid, IconButton, Typography, Button, CardActions, Box } from "@mui/material";
import { Check, Close, Person } from "@mui/icons-material";
import { auth, db } from '../firebase';
import { useSelector } from "react-redux";

export default function Recommendations() {

    const [recommendations, setRecommendations] = useState([]);

    const user = useSelector(state => state.userReducer);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const recruiterId = user.uid;
                const jobPostingsRef = collection(db, 'recruiter', recruiterId, 'job_postings');
                const unsubscribeSnapshot = onSnapshot(jobPostingsRef, async (snapshot) => {
                    for (const jobPostingDoc of snapshot.docs) {
                        const recommendationsRef = collection(jobPostingsRef, jobPostingDoc.id, 'recommendations');


                        const result = await getDocs(recommendationsRef)
                        const newRecommendations = result.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        }))
                        const hasRecommendation = recommendations.some((rec) => rec.id === jobPostingDoc.id);
                        if (!hasRecommendation) {
                            setRecommendations((prev) => [
                                ...prev,
                                {
                                    id: jobPostingDoc.id, title: jobPostingDoc.data().title,
                                    newRecommendations
                                },

                            ])
                        }
                    }
                });

                return () => unsubscribeSnapshot();
            }
        });

        return () => unsubscribe();
    }, []);

    const handleApprove = (id) => {
        const selected = collection(db, "recruiter", user.user.uid, 'job_postings')

    };

    const handleReject = (id) => {
        // Handle rejection logic for the recommendation with ID 'id'
    };

    return (
        <div>
            {recommendations.length === 0 ? (
                <></>
            ) : (
                <>
                    {recommendations.map((rec, i) => (
                        <>
                            <Typography key={i} variant='h4' sx={{ fontWeight: "bold", margin:'1.5rem' }}>
                                {rec.title}
                            </Typography>
                            {rec['newRecommendations'].map((recommendation, index) => (
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
                                        </Grid >
                                    </Grid >
                                </Card >
                            ))}

                        </>
                    ))}
                </>
            )}

        </div>
    );

}

