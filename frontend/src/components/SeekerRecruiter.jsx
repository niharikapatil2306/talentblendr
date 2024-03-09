import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import FlippableCard from "./FlippableCard";
import seeker from "../assets/seeker.png";
import recruiter from "../assets/recruiter.png";
export default function SeekerRecruiter() {

    const navigate = useNavigate();

    return (
        <Container className="flex flex-wrap justify-around items-center h-screen">
            <div className="flex justify-center flex-col space-x-4 items-center">
                <FlippableCard bg={seeker} 
                text1={"Job-seeker and employer matchmaker."}
                text2={"Actively scout top talent."} 
                text3={"Guide throughout hiring process."}
                /> 
                <Button className="bg-blue-500 border-0 mt-4" onClick={() => navigate("/seeker-form")}>
                    Seeker
                </Button>
            </div>
            <div className="flex justify-center flex-col space-x-4 items-center mt-4">
                <FlippableCard bg={recruiter}
                text1={"Sleuthing for the perfect career fit."}
                text2={"Prowling for new professional territories."} 
                text3={"Tracking down dream job opportunities."} />
                <Button className="bg-blue-500 border-0 mt-4" onClick={() => navigate("/recruiter-form")}>
                    Recruiter
                </Button>
            </div>

        </Container>
    );
}