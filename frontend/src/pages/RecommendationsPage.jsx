import { Grid } from "@mui/material";
import SelectedCandidates from "../components/SelectedCandidates";
import VerticalNavbar from "../components/VerticalNavbar";
import AnalyticsAndReports from "../components/AnalyticsandReport";
import Recommendations from "../components/Recommendations";

export default function RecommendationsPage() {
    return (
        <Grid container spacing={1} sx={{backgroundColor:'rgba(226, 229, 229, 1)'}}>
            <Grid item xs={12} sm={3} md={2}>
                <VerticalNavbar />
            </Grid>
            <Grid item xs={12} sm={9} md={10} >
                <Recommendations />
                {/* <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                    <SelectedCandidates />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <AnalyticsAndReports />
                    </Grid>
                </Grid> */}
            </Grid>
        </Grid>
    );
}