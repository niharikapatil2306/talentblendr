import { Button, Grid } from "@mui/material";
import VerticalNavbarSeeker from "../components/VerticalNavbarSeeker";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Seeker() {

    return(
        <Grid container spacing={1}>
            <Grid item xs={12} sm={3} md={2}>
                <VerticalNavbarSeeker />
            </Grid>
            <Grid item xs={12} sm={9} md={10} >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        
                    </Grid>
                    <Grid item xs={12} md={6}>
                        
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
    
}