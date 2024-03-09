import { Box, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";


export default function FlippableCard(props) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    useEffect(() => {
       
        setIsFlipped(true);

        const timer = setTimeout(() => {
            setIsFlipped(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);


    return (
        <Box
            sx={{
                perspective: "1000px",
                cursor: "pointer",
                width: 300,
                height: 400,
            }}
            onClick={handleFlip}
        >
            <Card
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transition: "transform 0.5s",
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(-180deg)" : "none",
                }}
            >
                {/* Front side of the card */}
                {!isFlipped && <div
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                    }}
                >
                    <img
                        src={props.bg}
                        alt="Front"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                </div>
                }
                {/* Back side of the card */}
                {isFlipped &&
                    <div
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            transform: "rotateY(180deg)",
                        }}
                    >
                         <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',  // Change flex direction to column
                                alignItems: 'center',     // Align items to center horizontally
                                justifyContent: 'center', // Align content to center vertically
                            }}
                        >
                            <Typography variant="body1" style={{ marginBottom: '1rem' }}>{props.text1}</Typography>
                            <Typography variant="body1" style={{ marginBottom: '1rem' }}>{props.text2}</Typography>
                            <Typography variant="body1">{props.text3}</Typography>
                        </div>

                    </div>
                }
            </Card>
        </Box>
    );
}
