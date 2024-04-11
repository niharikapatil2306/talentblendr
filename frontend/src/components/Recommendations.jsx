import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, getDoc, addDoc, setDoc, getDocs } from 'firebase/firestore';
import { Card, CardContent, Grid, IconButton, Typography, Button, CardActions, Box, Drawer } from "@mui/material";
import { Check, Close, Person } from "@mui/icons-material";
import { auth, db } from '../firebase';
import { useSelector } from "react-redux";

export default function Recommendations() {

    const [recommendations, setRecommendations] = useState([]);
    const [display, setDisplay] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

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
                            ...doc.data(),
                            displayActions: true
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
    }, [auth]);

    const handleApprove = async (docId, userId, username) => {
        const selected = collection(db, "recruiter", user.user.uid, 'job_postings', docId, 'selected');
        await setDoc(doc(selected, userId), {
            name: username,
        });

        // Update the recommendations state to remove the action buttons
        setRecommendations((prevRecommendations) =>
            prevRecommendations.map((recommendation) =>
                recommendation.id === docId
                    ? {
                        ...recommendation,
                        newRecommendations: recommendation.newRecommendations.map((candidate) =>
                            candidate.id === userId ? { ...candidate, displayActions: false } : candidate
                        ),
                    }
                    : recommendation
            )
        );
    };

    const handleReject = async (docId, userId, username) => {
        const selected = collection(db, "recruiter", user.user.uid, 'job_postings', docId, 'rejected');
        await setDoc(doc(selected, userId), {
            name: username,
        });

        setRecommendations((prevRecommendations) =>
            prevRecommendations.map((recommendation) =>
                recommendation.id === docId
                    ? {
                        ...recommendation,
                        newRecommendations: recommendation.newRecommendations.filter((candidate) => candidate.id !== userId),
                    }
                    : recommendation
            )
        );
    };

    const openSidePanel = async (userId) => {
        const selected = doc(collection(db, "seeker"), userId);
        await getDoc(selected).then((snapshot) => {
            setSelectedUser(snapshot.data() );
            setIsSidePanelOpen(true);
        });
    };

    const closeSidePanel = () => {
        setSelectedUser(null);
        setIsSidePanelOpen(false);
    };


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
                                                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{recommendation.name}</Typography>
                                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{recommendation.education}</Typography>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Grid>
                                            <Grid item xs={3}>
                                                {recommendation.displayActions &&
                                                    <CardActions disableSpacing style={{ height: '100%', display: 'flex', flexFlow: 'column', justifyContent: 'space-between' }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <IconButton onClick={() => handleApprove(rec.id, recommendation.id, recommendation.name)}>
                                                                <Check />
                                                            </IconButton>
                                                            <IconButton onClick={() => handleReject(rec.id, recommendation.id, recommendation.name)}>
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
            <Typography variant="h5">{selectedUser.name}</Typography>
            <Typography variant="body1">Email: {selectedUser.email}</Typography>
            <Typography variant="body1">Certification: {selectedUser.certification}</Typography>
            <Typography variant="body1">Experience: {selectedUser.experienceInYears} years</Typography>
            <Typography variant="body1">GPA: {selectedUser.gpa}</Typography>
            <Typography variant="body1">Qualification: {selectedUser.qualification}</Typography>
            <Typography variant="body1">Skills: {selectedUser.skills}</Typography>
            <Typography variant="body1">Stream: {selectedUser.stream}</Typography>
            <Typography variant="body1">Project 1: {selectedUser.project1}</Typography>
            <Typography variant="body1">Project 2: {selectedUser.project2}</Typography>
            <Typography variant="body1">Publications: {selectedUser.publications}</Typography>
            <Typography variant="body1">Technologies Used in Project 1: {selectedUser.technologiesUsedInProject1}</Typography>
            <Typography variant="body1">Technologies Used in Project 2: {selectedUser.technologiesUsedInProject2}</Typography>
            {/* Add more details as needed */}
        </div>
    )}
</Drawer>


        </div>
    );

}

