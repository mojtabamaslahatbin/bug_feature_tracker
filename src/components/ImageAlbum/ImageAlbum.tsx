import React, {useState} from "react";
import {Masonry} from "@mui/lab";
import {Backdrop, styled, Typography} from "@mui/material";

type ImageAlbumProps = {
    images: string;
};

const StyledImage = styled("img")({
    display: "block",
    width: "100%",
    cursor: "pointer",
    margin: "5px 0",
    border: "1px solid #ccc",
    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
});
const ImageBox = styled("div")({
    cursor: "pointer",
    position: "relative",
    transition: "transform 0.2s",
    "&:hover": {
        transform: "scale(1.02)",
    },
});

const ImageAlbum: React.FC<ImageAlbumProps> = ({images}) => {
    const [backdropIsOpen, setBackdropIsOpen] = useState(false);
    const [bigImage, setBigImage] = useState("");

    const openBackdrop = (img: string) => {
        setBigImage(img);
        setBackdropIsOpen(!backdropIsOpen);
    };

    return (
        <>
            <Masonry columns={2} spacing={1}>
                {images.length > 2 ? (
                    JSON.parse(images)?.map((img: string, index: number) => (
                        <div key={index}>
                            <ImageBox>
                                <StyledImage
                                    src={img}
                                    alt={`${index}`}
                                    onClick={() => openBackdrop(img)}
                                />
                            </ImageBox>
                        </div>
                    ))
                ) : (
                    <Typography align="center" minWidth="100%">
                        No Image
                    </Typography>
                )}
            </Masonry>
            <div>
                <Backdrop
                    sx={{
                        color: "#fff",
                        backgroundColor: "#8686866d",
                        backdropFilter: "blur(5px)",
                        zIndex: theme => theme.zIndex.drawer + 1,
                    }}
                    open={backdropIsOpen}
                    onClick={() => setBackdropIsOpen(false)}
                >
                    <img src={bigImage} alt={bigImage} style={{maxHeight: "95vh"}}/>
                </Backdrop>
            </div>
        </>
    );
};

export default ImageAlbum;
