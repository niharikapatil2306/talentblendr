import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material/";
import { useState } from "react";
import { auth, db } from "../firebase";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import bg from "../assets/hiring.png"
import { useNavigate } from "react-router-dom";

export default function RecruiterForm() {
    const [formData, setFormData] = useState({
        name: "",
        company_name: "",
        company_mail: "",
        company_phoneno: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (user) {
                const ref = doc(db, "users", user.uid);
                await updateDoc(ref, { role: 'recruiter' });
                await setDoc(doc(collection(db, "recruiter"), user.uid), formData)
                .then((res) => console.log("Successfully updated profile!"))
                navigate('/')

            }
        } catch (error) {
            console.error("Error submitting form data:", error);
        }
    }

    return (
        <Container style={{ height: "100vh" }}>
            <Grid container spacing={3} style={{ height: "100%" }}>
                <Grid item xs={0} md={6} style={{ display: 'flex' }}>
                    <img src={bg} alt="background" style={{ alignSelf: 'center' }} />
                </Grid>
                <Grid item xs={12} md={6} style={{ display: 'flex' }}>
                    <form onSubmit={handleSubmit} style={{ width: '100%', alignSelf: 'center' }}>
                        <TextField label="Name" type="text" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />

                        <TextField label="Company Name" type="text" name="company_name" value={formData.company_name} onChange={handleChange} fullWidth margin="normal" />

                        <TextField label="Company Email" type="email" name="company_mail" value={formData.company_mail} onChange={handleChange} fullWidth margin="normal" />

                        <TextField label="Company Phone Number" type="tel" name="company_phoneno" value={formData.company_phoneno} onChange={handleChange} fullWidth margin="normal" />

                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Submit
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </Container>
    );
}