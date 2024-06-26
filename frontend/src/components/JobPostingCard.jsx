import React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, CardActions, Snackbar, Button } from '@mui/material';
import { Dropdown, MenuButton, Menu, MenuItem } from '@mui/base';
import { collection, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { MoreHoriz } from '@mui/icons-material';
import { useSelector } from "react-redux";

export default function JobPostingCard() {
    const [jobPostings, setJobPostings] = useState([]);

    const user = useSelector(state => state.userReducer);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const recruiterId = user.uid;
                console.log(recruiterId)
                const jobPostingsRef = collection(db, 'job_postings');
                const unsubscribeSnapshot = onSnapshot(jobPostingsRef, snapshot => {
                    const newJobPostings = snapshot.docs
                        .map(doc => {
                            console.log(doc.data());
                            if (doc.data()['rec_id'] === user.uid) {
                                return {
                                    id: doc.id,
                                    ...doc.data()
                                };
                            } else {
                                return null;
                            }
                        })
                        .filter(posting => posting !== null); // Filter out null values

                    setJobPostings(newJobPostings);
                });
                return () => unsubscribeSnapshot();
            }
        });

        return () => unsubscribe();
    }, []);

    const deleteDocument = async (docId) => {
        const docRef = doc(collection(db, 'job_postings'), docId);
        try {
            await deleteDoc(docRef);
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };
    
    return (
        <>
            {jobPostings.map((jobPosting, index) => (

                <Card key={index} style={{ margin: '1rem', padding: '1rem', backgroundColor: 'rgba(208, 192, 176, 0.4)' }}>
                    <Grid container>
                        <Grid item xs={10} sx={{ flexWrap: 'wrap', alignContent: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{jobPosting.title}</Typography>
                        </Grid>
                        <Grid item sx={{ justifyContent: 'center' }}>
                            <Dropdown>
                                <MenuButton>
                                    <MoreHoriz />
                                </MenuButton>
                                <Menu style={{ width: '10rem', backgroundColor: '#f5f5f5', padding: '1rem', border: '1px solid #ccc', borderRadius: '1rem', boxShadow: '0px 2px 5px rgba(0,0,0,0.8)' }}>
                                    <MenuItem>
                                        <Button onClick={() => deleteDocument(jobPosting.id)}>
                                            Delete
                                        </Button>

                                    </MenuItem>

                                </Menu>
                            </Dropdown>
                        </Grid>
                    </Grid>
                    <Typography variant="body1" sx={{ color: '#28323B', marginBottom: '0.5rem' }}>{jobPosting.description}</Typography>
                    <Typography variant="body1" sx={{ color: '#28323B', marginBottom: '0.5rem' }}>{jobPosting.requirements}</Typography>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#28323B' }}>Location:</Typography>
                            <Typography variant="body1" sx={{ color: '#28323B' }}>{jobPosting.location}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#28323B' }}>Package:</Typography>
                            <Typography variant="body1" sx={{ color: '#28323B' }}>{jobPosting.package}</Typography>
                        </Grid>
                    </Grid>
                </Card>

            ))}

        </>
    );
};
