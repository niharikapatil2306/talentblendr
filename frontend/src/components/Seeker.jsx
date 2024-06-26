import { Autocomplete, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material/";
import { useEffect, useState } from "react";
import bg from "../assets/seeker1.png";
import { auth, db } from "../firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";

export default function Seeker() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        project1: "",
        technologiesUsedInProject1: "",
        project2: "",
        technologiesUsedInProject2: "",
        skills: [],
        qualification: "",
        stream: "",
        gpa: "",
        experienceInYears: "",
        certification: "",
        publications: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSkillsChange = (event, newValue) => {
        setFormData({
            ...formData,
            skills: newValue, 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

                await setDoc(doc(collection(db, "seeker"), selectedUserId), formData)
                .then((res) => console.log("Successfully updated profile!"))
                setFormData({
                    name: "",
                    email: "",
                    project1: "",
                    technologiesUsedInProject1: "",
                    project2: "",
                    technologiesUsedInProject2: "",
                    skills: [],
                    qualification: "",
                    stream: "",
                    gpa: "",
                    experienceInYears: "",
                    certification: "",
                    publications: "",
                });

        } catch (error) {
            console.error("Error submitting form data:", error);
        }
    }

    const [usersList, setUsersList] = useState([]); // State to hold users list
const [selectedUserId, setSelectedUserId] = useState(""); // State to hold selected user ID

useEffect(() => {
    // Fetch users list
    const fetchUsersList = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const users = querySnapshot.docs.map(doc => ({
                id: doc.id,
                email: doc.data().email
            }));
            setUsersList(users);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    fetchUsersList();
}, []);

const skillOptions = [
    "JavaScript",
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "Python",
    "Java",
    "SQL",
    "Angular",
    "Vue.js",
    "TypeScript",
    "Machine Learning",
    "Deep Learning",
    "Natural Language Processing (NLP)",
    "Computer Vision",
    "Artificial Intelligence (AI)",
    "Data Science",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Ansible",
    "ASP.NET",
    "ASP.NET Core",
    "Assembly",
    "AWS",
    "Bash/Shell",
    "C",
    "C#",
    "C++",
    "Couchbase",
    "Delphi",
    "DigitalOcean",
    "Docker",
    "DynamoDB",
    "Express",
    "Git",
    "Go",
    "Google Cloud Platform",
    "Heroku",
    "jQuery",
    "Kotlin",
    "Kubernetes",
    "Laravel",
    "Matlab",
    "Microsoft Azure",
    "Microsoft SQL Server",
    "MongoDB",
    "MySQL",
    "Oracle",
    "Perl",
    "PHP",
    "PostgreSQL",
    "PowerShell",
    "Redis",
    "Ruby",
    "Ruby on Rails",
    "Rust",
    "Scala",
    "Svelte",
    "Spring",
    "SQL Server",
    "SQLite",
    "Terraform",
    "Unity 3D",
    "VBA",
    "Yarn"
];

    return (
        <Container style={{ height: "100vh" }}>
            <Grid container spacing={3} style={{ height: "100%" }}>
                <Grid item xs={0} md={6} style={{ display: 'flex' }}>
                    <img src={bg} alt="background" style={{ alignSelf: 'center' }} />
                </Grid>
                <Grid item xs={12} md={6} style={{ display: 'flex' }}>
                    <form onSubmit={handleSubmit} style={{ width: '100%', alignSelf: 'center' }}>

                    <FormControl fullWidth margin="normal">
                            <InputLabel id="user-label">Select User</InputLabel>
                            <Select
                                labelId="user-label"
                                id="user-select"
                                value={selectedUserId}
                                onChange={(e) => setSelectedUserId(e.target.value)}
                                label="Select User"
                            >
                                {usersList.map(user => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.email}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField label="Name" type="text" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField label="Project 1" type="text" name="project1" value={formData.project1} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="Technologies Used in Project 1" type="text" name="technologiesUsedInProject1" value={formData.technologiesUsedInProject1} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField label="Project 2" type="text" name="project2" value={formData.project2} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="Technologies Used in Project 2" type="text" name="technologiesUsedInProject2" value={formData.technologiesUsedInProject2} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                        </Grid>

                        <Autocomplete multiple id="skills" options={skillOptions} value={formData.skills} onChange={handleSkillsChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Skills" fullWidth margin="normal" />
                            )}
                        />
                       
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="label-id">
                                        Qualification
                                    </InputLabel>
                                    <Select name="qualification" label="Qualification" labelId="label-id" value={formData.qualification} onChange={handleChange}>
                                        <MenuItem value="BE">BE</MenuItem>
                                        <MenuItem value="BTECH">BTECH</MenuItem>
                                        <MenuItem value="Masters">Masters</MenuItem>
                                        <MenuItem value="PHD">PHD</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="label-id">
                                        Stream
                                    </InputLabel>
                                    <Select name="stream" label="Stream" labelId="label-id" value={formData.stream} onChange={handleChange}>
                                        <MenuItem value="Artificial Intelligence & Machine Learning">Artificial Intelligence & Machine Learning</MenuItem>
                                        <MenuItem value="DataScience">Data Science</MenuItem>
                                        <MenuItem value="CS">CS</MenuItem>
                                        <MenuItem value="IT">IT</MenuItem>
                                        <MenuItem value="ECE">ECE</MenuItem>
                                        <MenuItem value="ENTC">ENTC</MenuItem>
                                        <MenuItem value="Electrical">Electrical</MenuItem>
                                        <MenuItem value="Mechanical">Mechanical</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="label-id1">
                                        GPA
                                    </InputLabel>
                                    <Select label="GPA" labelId="label-id1" name="gpa" value={formData.gpa} onChange={handleChange}>
                                        <MenuItem value="">Select GPA</MenuItem>
                                        <MenuItem value="1">1</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                        <MenuItem value="4">4</MenuItem>
                                        <MenuItem value="5">5</MenuItem>
                                        <MenuItem value="6">6</MenuItem>
                                        <MenuItem value="7">7</MenuItem>
                                        <MenuItem value="8">8</MenuItem>
                                        <MenuItem value="9">9</MenuItem>
                                        <MenuItem value="10">10</MenuItem>

                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="Experience in Years" type="text" name="experienceInYears" value={formData.experienceInYears} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField label="Certification" type="text" name="certification" value={formData.certification} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField label="Publications" type="text" name="publications" value={formData.publications} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                        </Grid>

                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Submit
                        </Button>

                    </form>
                </Grid>
            </Grid>
        </Container>
    );
}
