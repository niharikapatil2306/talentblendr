import Navigation from "../components/Navigation";
import bg from "../assets/bg.jpg";
import bg1 from "../assets/aboutus.gif";
import bg2 from "../assets/ourapproach.gif"
import bg3 from "../assets/bg16.jpg";
import bg4 from "../assets/bg17.jpg";

import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {

    const navigate = useNavigate();


    return (
        <>
            <Container fluid className="flex g-0 h-screen overflow-hidden">
                <Navigation />
                <Row className="grow mt-28">
                    <Col className="flex self-center flex-wrap justify-center mx-4">
                        <div className="font-extrabold text-8xl text-blue-950 mb-8">
                            TalentBlendr
                        </div>
                        <div className="text-gray-500 text-xl">
                            Transforming Recruitment, Empowering HR: Talent Blend, Where AI Redefines Talent Acquisition
                        </div>
                        <Button onClick={() => navigate("/signup")} className="bg-blue-500 border-0 mt-8">
                            Get Started
                        </Button>
                    </Col>
                    <Col className="flex self-center">
                        <img src={bg} alt="" />
                    </Col>
                </Row>
            </Container>
            <Container fluid className="g-0">
                <div className="h-24" id="aboutus" />

                <div className=" mx-28">
                    <Row>
                        <Col className="mr-4">
                            <Row className="text-7xl font-serif text-blue-950 font-bold mb-2">
                                About Us
                            </Row>
                            <Row className="font-serif text-gray-700 text-justify">
                                At Talent Blendr, we are on a mission to reshape the landscape of talent acquisition by introducing innovative and efficient solutions. In a world where the demand for skilled professionals is ever-growing, we recognize the need for a streamlined recruitment process. Our vision is to empower Human Resources (HR) professionals with cutting-edge AI technology to enhance talent acquisition practices.Talent Blend is not just a platform; it's a commitment to efficiency, precision, and empowering HR teams to make informed decisions.
                            </Row>
                        </Col>
                        <Col md={5}>
                            <img src={bg1} alt="" />
                        </Col>
                    </Row>
                </div>
                <div className="h-24" id="ourapproach" />
                <div className="mx-28 g-0" >
                    <Row>
                        <Col md={4} className="mr-4 py-8 border-1 border-gray-400">
                            <img src={bg2} alt="" />
                        </Col>
                        <Col className="ml-4">
                            <Row className="text-7xl font-serif text-end text-blue-950 font-bold mb-4">
                                Our Approach
                            </Row>
                            <Row className="font-serif text-gray-700 text-justify">
                                Our approach is simple yet transformative. We have developed a HR-centric AI Talent Acquisition System driven by reinforcement learning. By leveraging the power of artificial intelligence, we aim to significantly shorten the recruitment lifecycle, allowing HR professionals to focus on what matters most – finding the best talent for their organizations.
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Container>
            <div className="h-24 m-1 g-0" id="whyus" />
            <Container fluid className="bg-cover h-screen g-0" style={{ backgroundImage: `url(${bg3})` }}>
                <div className="">
                    <Row className="text-8xl font-serif text-center text-blue-950 font-bold mb-20 g-0">
                        <Col>
                            What Sets Us Apart
                        </Col>
                    </Row>
                    <Row className="mx-20 g-0">
                        <Col className="px-4 border-r-2 border-gray-950">
                            <Row className="text-center font-serif text-5xl font-bold text-gray-500">
                                <Col>
                                    Smart Suggestions
                                </Col>
                            </Row>
                            <Row className="mt-16 font-serif text-xl font-mediun text-gray-700  text-justify px-2">
                                Our system utilizes state-of-the-art reinforcement learning algorithms to understand the unique preferences of HR professionals. This enables us to provide highly personalized and relevant job profiles, streamlining the decision-making process.
                            </Row>
                        </Col>
                        <Col className="px-4 border-r-2 border-gray-950">
                            <Row className="text-center font-serif text-5xl font-bold text-gray-500">
                                <Col>
                                    Efficiency Redefined
                                </Col>
                            </Row>
                            <Row className="mt-16 font-serif text-xl font-mediun text-gray-700 text-justify px-2">
                                TalentBlendr is designed to enhance the efficiency of HR teams. We believe in minimizing manual efforts and maximizing results. Our platform automates repetitive tasks, allowing HR professionals to concentrate on strategic aspects of talent acquisition.
                            </Row>
                        </Col>
                        <Col className="px-4">
                            <Row className="text-center font-serif text-5xl font-bold text-gray-500">
                                <Col>
                                    Personalized Solutions
                                </Col>
                            </Row>
                            <Row className="mt-16 font-serif text-xl font-mediun text-gray-700  text-justify px-2">
                                We recognize that every organization is unique. Our platform adapts to the specific needs of your industry, company culture, and recruitment requirements. Talent Blend is not a one-size-fits-all solution; it's tailored to meet your distinctive hiring needs.
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Container>
            {/*  style={{backgroundImage:`url(${bg4})`}} */}
            <div className="h-24 m-1 g-0" id="ourmethod" />
            <Container fluid className="mb-20 g-0 font-serif bg-cover h-screen">
                <div className="mb-20 mx-20">
                    <Row className="text-8xl font-serif text-center text-blue-950 font-bold mb-12">
                        <Col>
                            Process We Follow
                        </Col>
                    </Row>
                    <Row className="mb-12 pb-6 border-b-4 border-black">
                        <Col xs={6} className="px-4 border-r-4 border-black pb-2">
                            <Row className="mb-8">
                                <Col className="text-center text-5xl font-semibold text-gray-600">
                                    Registration
                                </Col>
                            </Row>
                            <Row>
                                <Col className="pb-2 px-4 border-r-2 border-black">
                                    <Row>
                                        <Col className="mb-4 text-center text-2xl text-indigo-950 font-bold">
                                            HR
                                        </Col>
                                    </Row>
                                    <Row className="text-gray-700">
                                        <Col className="text-justify text-md font-semibold">
                                            <Row>
                                                Create Job Description Instances
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col className="mx-4">
                                    <Row>
                                        <Col className="mb-4 text-center text-2xl text-indigo-950 font-bold">
                                            User
                                        </Col>
                                    </Row>
                                    <Row className="text-gray-700 ">
                                        <Col className="text-justify text-md font-semibold">
                                            <Row>
                                                Create Personal Profile Stating Your Skills
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>

                            </Row>
                        </Col>
                        <Col className="text-center mx-4">
                            <Row className="mb-20">
                                <Col className="text-center text-5xl font-semibold text-gray-600">
                                    Matching Profiles
                                </Col>
                            </Row>
                            <Row className="text-gray-700">
                                <Col className="text-center text-md font-semibold">
                                    <Row>
                                        AI-driven Recommendation system that matches user profiles with job descriptions.
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center px-8 pb-4 border-r-4 border-black">
                            <Row className="mb-8">
                                <Col className="text-center text-4xl font-semibold text-gray-600">
                                    Screening
                                </Col>
                            </Row>
                            <Row className="text-gray-700">
                                <Col className="text-center text-md font-semibold">
                                    Top-matching candidates receive a screening test link.
                                </Col>
                            </Row>
                        </Col>
                        <Col className="text-center px-8 pb-4 border-r-4 border-black">
                            <Row className="mb-8">
                                <Col className="text-center text-4xl font-semibold text-gray-600">
                                    Recommendations
                                </Col>
                            </Row>
                            <Row className="text-gray-700">
                                <Col className="text-center text-md font-semibold">
                                    Candidates with top scores are recommended to HR.
                                </Col>
                            </Row>
                        </Col>
                        <Col className="text-center px-8">
                            <Row className="mb-8">
                                <Col className="text-center text-4xl font-semibold text-gray-600">
                                    Interaction
                                </Col>
                            </Row>
                            <Row className="text-gray-700">
                                <Col className="text-center text-md font-semibold">
                                    HR contacts recommended candidates for an Interview.
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Container>
            <div className="bg-white py-6 px-4 text-center">
            <div className="mb-4">
                <p className="text-gray-500">&copy; 2024 TalentBlendr</p>
            </div>
            <div className="flex justify-center space-x-4">
                <a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-gray-700">Contact Us</a>
            </div>
        </div>
        </>
    );
}