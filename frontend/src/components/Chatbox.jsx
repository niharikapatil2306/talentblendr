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
        const jobPostingsRef = collection(db, 'selected');
        const unsubscribeSnapshot = onSnapshot(jobPostingsRef, async (snapshot) => {
          // Initialize a new array to hold the merged data
          const updatedChatUsers = [];
          const userIds = new Set()

          // Iterate through the snapshot to fetch new data
          for (const doc of snapshot.docs) {
            // console.log(doc.data())
            const result = await getDocs(jobPostingsRef);
            if (result) {
              const selected = result.docs.map((doc) => {
                if (doc.data()['Recruiter_ID'] == recruiterId) {
                  if (!userIds.has(doc.id)) {
                    userIds.add(doc.id)
                    updatedChatUsers.push({
                      id: doc.id,
                      name: doc.data()['Name']
                    });
                  }
                }
                console.log(updatedChatUsers)
              })
            }

            // if (selected.length > 0) {
            //     const existingUserIndex = updatedChatUsers.findIndex(user => user.id === doc.data()['Recruiter_ID']);
            //     if (existingUserIndex !== -1) {
            //         updatedChatUsers[existingUserIndex] = {
            //             ...updatedChatUsers[existingUserIndex],
            //             selected: selected,
            //         };
            //     } else {
            //         updatedChatUsers.push({
            //             id: doc.id,
            //             // jobPostTitle: doc.data().title,
            //             selected: selected,
            //         });
            //     }
            //     console.log(updatedChatUsers)
            // }
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
      <Card sx={{ padding: '1rem', overflowY: 'auto', maxHeight: '8rem' }}>
        {chatUsers.map(user => (
          <Box key={user.id} sx={{ marginBottom: '1rem', borderBottom: '1px solid grey', paddingBottom: '1rem' }}>
            <Grid container direction="column">
              <Grid item sx={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                <AccountCircle sx={{ marginRight: '0.5rem' }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {user.name}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Card>
    </>

  );
}