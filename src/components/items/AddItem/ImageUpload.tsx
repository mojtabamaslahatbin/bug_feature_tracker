import React, {useEffect, useState} from "react";
import {useDispatch} from 'react-redux'
import {Backdrop, Box, Card, CardContent, Divider, IconButton, Typography} from "@mui/material";
import {Masonry} from "@mui/lab";
import {Icon} from "@iconify/react";
import {styled} from "@mui/system";
import * as actionTypes from "../../../store/actions/actionTypes";

type ImageUploadProps = {
    images: string;
    setImages: (array: string) => void;
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

const ImageUpload: React.FC<ImageUploadProps> = ({images, setImages}) => {
    const [backdropIsOpen, setBackdropIsOpen] = useState(false);
    const [bigImage, setBigImage] = useState("");

    const dispatch = useDispatch()
    const dispatchFlashMessage = (message: string, type: "success" | "error") => dispatch(actionTypes.showFlashMessage(message, type))

    const openBackdrop = (img: string) => {
        setBigImage(img);
        setBackdropIsOpen(!backdropIsOpen);
    };

    useEffect(() => {
        const list = localStorage.getItem("bug-tracker-image");
        if (list !== null) {
            setImages(list);
        }
    }, [setImages]);

    const convertBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            if (file) {
                fileReader.readAsDataURL(file);
            }
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = error => {
                reject(error);
            };
        });
    };

    const imageUploadHandler = async (e: any) => {
        const file = e.target.files[0];
        if (file.size > 1000000) {
            dispatchFlashMessage(`image size should be less than 1Mb. selected image size: ${((file.size) / 1000000).toFixed(1)}Mb`, "error")
            return
        }
        await convertBase64(file).then(response => {
            if (typeof response === "string" && images !== null) {
                const parsedImages = JSON.parse(images);
                const newUploadedImages = [...parsedImages, response];
                setImages(JSON.stringify(newUploadedImages));
                localStorage.setItem("bug-tracker-image", JSON.stringify(newUploadedImages));
            }
        });
    };

    //TODO: add "compressorjs" package to reduce size of images

    // const imageUploadHandler = async (e: any) => {
    //     const file = e.target.files[0];
    //     const {data, error} = await supabase
    //         .storage
    //         .from('avatars')
    //         .upload('public/img2.png', file, {
    //             cacheControl: '3600',
    //             upsert: false
    //         })
    //     if (error) console.log(error)
    //     else {
    //         console.log(data)
    //         const {publicURL, error} = supabase
    //             .storage
    //             .from('avatar')
    //             .getPublicUrl('public/img1.png')
    //         if (error) console.log(error)
    //         else console.log(publicURL)
    //     }
    // }

    //TODO: [bug] after deleting an image, can't upload it again immediately

    const imageDeleteHandler = (img: string) => {
        const confirm = window.confirm("Are you sure to delete this image ? ");
        if (confirm) {
            const parsedImages = JSON.parse(images);
            const selectedImageIndex = parsedImages.indexOf(img);
            parsedImages.splice(selectedImageIndex, 1);
            setImages(JSON.stringify(parsedImages));
            if (parsedImages.length === 0) {
                localStorage.removeItem("bug-tracker-image");
            } else {
                localStorage.setItem("bug-tracker-image", JSON.stringify(parsedImages));
            }
        }
    };

    //TODO: add image upload progress bar

    return (
        <>
            <Box
                sx={{
                    border: "1px solid #c4c4c4",
                    borderRadius: "5px",
                }}
            >
                <Card sx={{minHeight: "316px", boxShadow: 0}}>
                    <CardContent sx={{mt: -1.5}}>
                        <Typography align="center" variant="body1" component="div">
                            Add Image
                            <label htmlFor="icon-button-file">
                                <input
                                    accept="image/*"
                                    id="icon-button-file"
                                    type="file"
                                    style={{display: "none"}}
                                    onChange={imageUploadHandler}
                                />
                                <IconButton
                                    color="primary"
                                    aria-label="upload images"
                                    component="span"
                                    style={{marginLeft: "16px"}}
                                >
                                    <Icon
                                        icon="flat-color-icons:add-image"
                                        width={24}
                                        inline={true}
                                    />
                                </IconButton>
                            </label>
                        </Typography>
                        <Divider/>
                        <Masonry columns={2} spacing={1}>
                            {images &&
                            JSON.parse(images).map((img: string, index: number) => (
                                <div key={index}>
                                    <ImageBox>
                                        <StyledImage
                                            src={img}
                                            alt={`${index}`}
                                            onClick={() => openBackdrop(img)}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                right: 0,
                                                width: "100%",
                                                backgroundColor: "#69696973",
                                                backdropFilter: "blur(1px)",
                                                cursor: "default",
                                            }}
                                        >
                                            <Icon
                                                icon="fluent:delete-24-filled"
                                                inline={true}
                                                onClick={() => imageDeleteHandler(img)}
                                                style={{
                                                    width: "15%",
                                                    color: "#ffffff",
                                                    cursor: "pointer",
                                                }}
                                            />
                                        </div>
                                    </ImageBox>
                                </div>
                            ))}
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
                    </CardContent>
                </Card>
            </Box>
        </>
    );
};

export default ImageUpload;
