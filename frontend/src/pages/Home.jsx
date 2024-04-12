import { Grid } from "@mui/material";
import SelectedCandidates from "../components/SelectedCandidates";
import VerticalNavbar from "../components/VerticalNavbar";
import AnalyticsAndReports from "../components/AnalyticsandReport";
import Chatbox from "../components/Chatbox";

export default function Home() {
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={3} md={2}>
                <VerticalNavbar />
            </Grid>
            <Grid item xs={12} sm={9} md={10} >
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                    <SelectedCandidates />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AnalyticsAndReports />
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                    <Chatbox />
                    </Grid>
                    <Grid item xs={12} md={6}>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}