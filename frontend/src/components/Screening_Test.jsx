import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import SwipeableViews from 'react-swipeable-views';
import { Card, CardContent, Typography, Radio, RadioGroup, FormControlLabel, Button, Box } from '@mui/material';
import { db } from '../firebase';
import { useSelector } from "react-redux";

const Screening_Test = () => {
  const [questions, setQuestions] = useState([]);
  const [userResponses, setUserResponses] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const user = useSelector(state => state.userReducer);
  const recruiterId = user.user.uid;  // Replace with dynamic recruiter ID if necessary

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'screening_test', recruiterId, 'questions'));
        const questionsData = [];
        querySnapshot.forEach((doc) => {
          questionsData.push({ id: doc.id, ...doc.data() });
        });
        setQuestions(questionsData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [recruiterId]);

  const handleResponseChange = (questionId, response) => {
    setUserResponses({
      ...userResponses,
      [questionId]: response,
    });
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Save responses to Firestore
      try {
        for (const questionId in userResponses) {
          const questionRef = doc(db, 'screening_test', recruiterId, 'questions', questionId);
          await updateDoc(questionRef, {
            user_response: userResponses[questionId],
          });
        }
        alert('Responses saved successfully!');
      } catch (error) {
        console.error('Error saving responses:', error);
      }
    }
  };

  return (
    <div>
      <SwipeableViews index={currentIndex}>
        {questions.map((question) => (
          <Card key={question.id} style={{ padding: '20px', margin: '20px'}}>
            <CardContent>
              <Typography variant="h5">{question.question}</Typography>
              <RadioGroup
                value={userResponses[question.id] || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
              >
                {Object.entries(question.options).map(([optionKey, optionValue]) => (
                  <FormControlLabel
                    key={optionKey}
                    value={optionValue}
                    control={<Radio />}
                    label={optionValue}
                  />
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </SwipeableViews>
      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="contained" onClick={handleNext}>
          {currentIndex < questions.length - 1 ? 'Next' : 'Submit'}
        </Button>
      </Box>
    </div>
  );
};

export default Screening_Test;
