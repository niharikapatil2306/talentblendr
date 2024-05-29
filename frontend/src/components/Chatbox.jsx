import { Box, Card, CardContent, Grid, Typography, } from "@mui/material";
import { useEffect, useState } from 'react';
import { collection, onSnapshot, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useSelector } from "react-redux";
import { AccountCircle } from "@mui/icons-material";

export default function Chatbox() {

    const [chatUsers, setChatUsers] = useState([])

    const user = useSelector(state => state.userReducer);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const recruiterId = user.uid;
                const jobPostingsRef = collection(db, 'recruiter', recruiterId, 'job_postings');
                const unsubscribeSnapshot = onSnapshot(jobPostingsRef, async (snapshot) => {
                    // Initialize a new array to hold the merged data
                    const updatedChatUsers = [];

                    // Iterate through the snapshot to fetch new data
                    for (const doc of snapshot.docs) {
                        const recRef = collection(jobPostingsRef, doc.id, 'selected');
                        const result = await getDocs(recRef);
                        const selected = result.docs.map((doc) => (doc.data().name));

                        if (selected.length > 0) {
                            const existingUserIndex = updatedChatUsers.findIndex(user => user.id === doc.id);
                            if (existingUserIndex !== -1) {
                                updatedChatUsers[existingUserIndex] = {
                                    ...updatedChatUsers[existingUserIndex],
                                    jobPostTitle: doc.data().title,
                                    selected: selected,
                                };
                            } else {
                                updatedChatUsers.push({
                                    id: doc.id,
                                    jobPostTitle: doc.data().title,
                                    selected: selected,
                                });
                            }
                        }
                    }
                    setChatUsers(updatedChatUsers);
                });

                return () => unsubscribeSnapshot();
            }
        });

        return () => unsubscribe();
    }, [auth]);

    console.log(chatUsers)
    return (
        <>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Messages
        </Typography>
        <Card sx={{ padding: '1rem', overflowY: 'auto', maxHeight: '5rem' }}>
          {chatUsers.map(user => (
            <Box key={user.id} sx={{ marginBottom: '1rem', borderBottom: '1px solid grey', paddingBottom: '1rem' }}>
              <Grid container direction="column">
                {user.selected.map((candidate, index) => (
                  <Grid item key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <AccountCircle sx={{ marginRight: '0.5rem' }} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {candidate}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ marginLeft: '1rem' }}>
                      {user.jobPostTitle}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Card>
      </>

    );
}