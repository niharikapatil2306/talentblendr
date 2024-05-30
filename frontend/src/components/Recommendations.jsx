import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, getDoc, addDoc, setDoc, getDocs, updateDoc } from 'firebase/firestore';
import { Card, CardContent, Grid, IconButton, Typography, Button, CardActions, Box, Drawer } from "@mui/material";
import { Check, Close, Person } from "@mui/icons-material";
import { auth, db } from '../firebase';
import { useSelector } from "react-redux";

export default function Recommendations() {

    const [recommendations, setRecommendations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

    const user = useSelector(state => state.userReducer);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const recruiterId = user.uid;
                const recruiterRef = doc(collection(db, 'recommendations'), recruiterId);
                // const doc1 = await getDoc(recruiterRef)
                // await setDocExist(doc1.exists())              

                const unsubscribeSnapshot = onSnapshot(recruiterRef, async (recruiterDoc) => {
                    if (recruiterDoc.id) {
                        const jobPostingIds = (await getDocs(collection(db, 'job_postings'))).docs.map((doc) => {
                            console.log(doc.data())
                            if (doc.data()['rec_id'] == recruiterId) {
                                return {
                                    id: doc.id,
                                    title: doc.data().title
                                }
                            }
                            else {
                                return null;
                            }
                        }).filter(posting => posting !== null);
                        console.log(jobPostingIds)

                        for (const jobPostingId of jobPostingIds) {

                            const jobPostingDocRef = collection(recruiterRef, jobPostingId.id);
                            const recommendationsSnapshot = await getDocs(jobPostingDocRef);

                            const newRecommendations = recommendationsSnapshot.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
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
                });

                return () => unsubscribeSnapshot();
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const handleApprove = async (docId, userId, data) => {
        const selected = collection(db, "selected");
        await setDoc(doc(selected, userId), data);
        await updateDoc(doc(collection(db, "recommendations", user.user.uid, docId, ''), userId), {
            selected: true
        })

        const filteredRecommendations = recommendations.map(rec => {
            if (rec.id === docId) {
                const updatedRecommendations = rec.newRecommendations.map(candidate => {
                    if (candidate.id === userId) {
                        return { ...candidate, selected: true };
                    } else {
                        return candidate;
                    }
                });
                return { ...rec, newRecommendations: updatedRecommendations };
            } else {
                return rec;
            }
        });

        setRecommendations(filteredRecommendations);

    };

    const handleReject = async (docId, userId, data) => {
        const selected = collection(db, 'rejected');
        await setDoc(doc(selected, userId), data);
        await updateDoc(doc(collection(db, "recommendations", user.user.uid, docId, ''), userId), {
            rejected: true
        })

        const filteredRecommendations = recommendations.map(rec => {
            if (rec.id === docId) {
                const updatedRecommendations = rec.newRecommendations.map(candidate => {
                    if (candidate.id === userId) {
                        return { ...candidate, rejected: true };
                    } else {
                        return candidate;
                    }
                });
                return { ...rec, newRecommendations: updatedRecommendations };
            } else {
                return rec;
            }
        });

        setRecommendations(filteredRecommendations);
    };

    const openSidePanel = async (userId) => {
        const selected = doc(collection(db, "seeker"), userId);
        await getDoc(selected).then((snapshot) => {
            setSelectedUser(snapshot.data());
            setIsSidePanelOpen(true);
        });
    };

    const closeSidePanel = () => {
        setSelectedUser(null);
        setIsSidePanelOpen(false);
    };
    
    if (recommendations.length===1 && recommendations[0]['newRecommendations'].length != 5) {
        return (
            <>
            </>
        )
    }

    return (
        <div>
            {recommendations.length === 0 ? (
                <></>
            ) : (
                <>
                    {recommendations.map((rec, i) => (
                        <>
                            <Typography key={i} variant='h4' sx={{ fontWeight: "bold", margin: '1.5rem' }}>
                                {rec.title}
                            </Typography>
                            {rec['newRecommendations'].map((recommendation, index) => (
                                <Card key={index} sx={{ maxWidth: '100%', margin: '1rem' }} >
                                    {!recommendation.rejected &&
                                        <Grid container>
                                            <Grid item xs={9}>
                                                <CardContent onClick={() => openSidePanel(recommendation.id)}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <Person style={{ border: '2px', borderStyle: 'solid', borderColor: 'black', borderRadius: '50%', width: '6rem', height: '6rem', marginRight: '2rem' }} />
                                                        <div>
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{recommendation['Name']}</Typography>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{(recommendation['Similarity_Score'] * 100).toFixed(2)}</Typography>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Grid>
                                            <Grid item xs={3}>
                                                {!recommendation.selected &&
                                                    <CardActions disableSpacing style={{ height: '100%', display: 'flex', flexFlow: 'column', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <IconButton onClick={() => handleApprove(recommendation['Job_Posting_Id'], recommendation.id, recommendation)}>
                                                                <Check />
                                                            </IconButton>
                                                            <IconButton onClick={() => handleReject(recommendation['Job_Posting_Id'], recommendation.id, recommendation)}>
                                                                <Close />
                                                            </IconButton>
                                                        </Box>
                                                    </CardActions>}
                                            </Grid >
                                        </Grid >}
                                </Card >
                            ))}

                        </>
                    ))}
                </>
            )}
            <Drawer anchor="right" open={isSidePanelOpen} onClose={closeSidePanel}>
                {selectedUser && (
                    <div style={{ width: 400, padding: '20px' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>{selectedUser.name}</Typography>
                        {/* <Typography variant="body1">Email: {selectedUser.email}</Typography> */}
                        <Grid container spacing={1} sx={{ width: '100%', marginBottom: '0.5rem' }}>
                            <Grid item xs={6}>
                                <Typography variant="body1"><b><u>Qualification:</u> </b>{selectedUser.qualification}</Typography>
                            </Grid>
                            <Grid xs={6} item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Typography variant="body1"><b><u>GPA:</u> </b>{selectedUser.gpa}</Typography>
                            </Grid>
                        </Grid>
                        <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}><b><u>Certification:</u> </b>{selectedUser.certification}</Typography>
                        <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}><b><u>Experience:</u> </b>{selectedUser.experienceInYears} years</Typography>


                        <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}><b><u>Skills:</u> </b> {selectedUser.skills.join(", ")}</Typography>
                        {/* <Typography variant="body1">Stream: {selectedUser.stream}</Typography>
                    <Typography variant="body1">Project 1: {selectedUser.project1}</Typography>
                    <Typography variant="body1">Project 2: {selectedUser.project2}</Typography> */}
                        <Typography variant="body1" sx={{ marginBottom: '0.5rem' }}><b><u>Publications:</u> </b> {selectedUser.publications}</Typography>
                        {/* <Typography variant="body1">Technologies Used in Project 1: {selectedUser.technologiesUsedInProject1}</Typography>
                    <Typography variant="body1">Technologies Used in Project 2: {selectedUser.technologiesUsedInProject2}</Typography> */}

                    </div>
                )}
            </Drawer>


        </div>
    );

}

