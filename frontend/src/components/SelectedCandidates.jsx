import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, getDocs, getDoc } from 'firebase/firestore';
import { Box, Card, CardActions, CardContent, Grid, IconButton, Typography, Button } from "@mui/material";
import { Check, Close, Person } from "@mui/icons-material";
import { auth, db } from '../firebase';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SelectedCandidates() {
    const [recommendations, setRecommendations] = useState([]);

    const user = useSelector(state => state.userReducer);
    // const [docexist, setDocExist] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const recruiterId = user.uid;
                const recruiterRef = doc(collection(db, 'recommendations'),recruiterId);
                // const doc1 = await getDoc(recruiterRef)
                // await setDocExist(doc1.exists())
                
                const unsubscribeSnapshot = onSnapshot(recruiterRef, async (recruiterDoc) => {
                    if (recruiterDoc.id) {
                        const jobPostingIds = (await getDocs(collection(db, 'job_postings'))).docs.map((doc) => ({
                            id: doc.id,
                            title: doc.data().title
                        }))
                        
                        for (const jobPostingId of jobPostingIds) {
                            // Get the documents within each job posting subcollection
                            const jobPostingDocRef = collection(recruiterRef, jobPostingId.id);
                            const recommendationsSnapshot = await getDocs(jobPostingDocRef);
                            if (!recommendationsSnapshot.empty) {
                                const newRecommendations = recommendationsSnapshot.docs.map((doc) => ({
                                    // if(doc['Recruiter_ID' == recruiterId]){
                                    //     return{
                                            id: doc.id,
                                            ...doc.data()
                                    //     }
                                    // }
                                }));
                                const hasRecommendation = recommendations.some((rec) => rec.id === jobPostingId.id);
                                if (!hasRecommendation) {
                                    setRecommendations((prev) => [
                                        ...prev,
                                        {
                                            id: jobPostingId.id,
                                            title: jobPostingId.title,
                                            newRecommendations,
                                        },
                                    ]);
                                }
                            }
                            

                        }   
                    }
                });

                return () => unsubscribeSnapshot();
            }
        });

        return () => unsubscribe();
    }, [auth]);
    
    const nav = () => {
        navigate('/recommendations')
    }

    // const handleApprove = (id) => {
    //     const selected = collection(db, "recruiter", user.user.uid, 'job_postings')

    // };

    // const handleReject = (id) => {
    //     // Handle rejection logic for the recommendation with ID 'id'
    // };

    // if(!docexist){
    //     return(
    //         <Typography variant='h4' sx={{ marginTop: '2rem', fontWeight: "bold", color:'#4C6071' }}>
    //             Recommendations would be displayed here!!
    //         </Typography>
    //     )
    // }

    return (
        <>
            <div style={{ maxHeight: '20rem', overflowY: 'auto', marginTop: '2rem' }}>
                {recommendations.length === 0 ? (
                    <></>
                ) : (
                    <Typography variant='h4' sx={{ fontWeight: "bold", color:'#4C6071' }}>
                        {recommendations[recommendations.length - 1]['title']}
                    </Typography>
                )}
                {recommendations.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-400"></div>
                    </div>
                ) :
                    (recommendations[recommendations.length - 1]['newRecommendations'].map((recommendation, index) => (
                        <Card key={index} sx={{ maxWidth: '100%', margin: '1rem' }}>
                            <Grid container>
                                <Grid item xs={9}>
                                    <CardContent>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Person style={{ color:"#28323B", border: '2px', borderStyle: 'solid', borderColor: '#28323B', borderRadius: '50%', width: '6rem', height: '6rem', marginRight: '2rem' }} />
                                            <div>
                                                <Typography variant="body1" sx={{ fontWeight: 'bold', color:'#28323B' }}>{recommendation['Name']}</Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{recommendation.education}</Typography>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Grid>
                                <Grid item xs={3}>
                                    {/* <CardActions disableSpacing style={{ height: '100%', display: 'flex', flexFlow: 'column', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton onClick={() => handleApprove(recommendation.id)}>
                                                <Check />
                                            </IconButton>
                                            <IconButton onClick={() => handleReject(recommendation.id)}>
                                                <Close />
                                            </IconButton>
                                        </Box>
                                    </CardActions> */}
                                </Grid>
                            </Grid>
                        </Card>
                    )))}

            </div>
            <Button sx={{float:'inline-end', marginRight:'2rem', marginTop:'1rem'}} onClick={nav}>
                Check More
            </Button>
        </>
    );
}
