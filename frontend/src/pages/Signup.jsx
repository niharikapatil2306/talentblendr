import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import bg1 from "../assets/5541.jpg";
import google from "../assets/icons/google.svg";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth } from "../firebase.js";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Done } from '@mui/icons-material';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [load, setLoad] = useState(false);

    const navigate = useNavigate();

    const signup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Add user ID and email to users document
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                userId: user.uid,
                // Add more user data if needed
            });
        
            navigate("/question");

        } catch (error) {
            console.error("Error signing up:", error.message);
            setPasswordError(error.message);
        }
    }

    const gsignup = async (e) => {
        e.preventDefault();
        try {
            const provider = new GoogleAuthProvider();
            setLoad(true)
            await signInWithPopup(auth, provider)
                .then(() => {
                    navigate("/question")
                })
        } catch (error) {
            console.error("Error signing up:", error.message);
            setPasswordError(error.message);
        }
    }


    if (load) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className='flex h-screen items-center justify-center bg-cover' style={{ backgroundImage: `url(${bg1})` }}>
            <Container className='md:w-2/4 lg:w-2/5 border-1 rounded-xl bg-gradient-to-l from-blue-100 to-gray-200 border-gray-500 w-screen mx-1 md:px-12'>
                <Row className='justify-center md:text-5xl font-bold my-4 lg:my-8'>
                    Signup
                </Row>

                <Row className="justify-center">
                    <Col>
                        <Form onSubmit={signup}>
                            <Form.Group controlId="formBasicEmail" className='my-4'>
                                <Form.Control
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Email"
                                    className='border-1 border-gray-600 md:text-xl'
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword" className='mt-4 mb-2'>
                                <Form.Control
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Create Password"
                                    className='border-1 border-gray-600 md:text-xl'
                                />
                            </Form.Group>
                            <Form.Group controlId="formBasicConfirmPassword" className='mt-4 mb-2'>
                                <Form.Control
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    type="password"
                                    placeholder="Confirm Password"
                                    className='border-1 border-gray-600 md:text-xl'
                                />
                            </Form.Group>
                            {passwordError && <p className="text-red-500">{passwordError}</p>}

                            <Row className='mx-1'>
                                <Button className="bg-blue-900 text-white font-semibold md:text-lg border-0 hover:bg-indigo-500 my-2" type="submit">
                                    Signup
                                </Button>
                            </Row>
                            <Row>
                                <p className='text-center align-middle'> Already have an account?
                                    <Link to='/login'>
                                        <button className='mx-1 bg-transparent border-0  text-rose-600'>
                                            Login
                                        </button>
                                    </Link>
                                </p>
                            </Row>
                            <Row className='mt-4'>
                                <div className='flex items-center'>
                                    <hr className='flex-grow border-t-2 border-gray-900' />
                                    <span className='mx-2 text-gray-800 font-semibold'>
                                        Or
                                    </span>
                                    <hr className='flex-grow border-t-2 border-gray-800' />
                                </div>
                            </Row>
                        </Form>
                    </Col>
                </Row>
                <Button onClick={gsignup} className="bg-white w-full flex text-gray-600 font-medium justify-center my-4 border-1 rounded-lg border-gray-500 shadow-md">
                    <img src={google} alt="" className='h-8' />
                    <p className="mx-2 my-auto">
                        Signup with Google
                    </p>
                </Button>
            </Container>
        </div>
    );
}
