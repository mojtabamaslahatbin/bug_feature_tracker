import React from "react";
import {Link} from "react-router-dom";
import {Icon} from "@iconify/react";
import CircleIcon from "@mui/icons-material/Circle";
import {styled} from "@mui/system";
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Divider,
    Grid,
    Rating,
    Stack,
    Typography,
} from "@mui/material";

type Props = { item: any };

const findActiveStepColor = (status: number | null | undefined) => {
    switch (status) {
        case 1:
            return "#fd0000";
        case 2:
            return "#ff8800";
        case 3:
            return "#f0ed4e";
        case 4:
            return "#66ff00";
        case 5:
            return "#0c9400";
        default:
            break;
    }
};

const StyledRating = styled(Rating)(({value}) => ({
    "& .MuiRating-iconFilled": {
        color: findActiveStepColor(value),
    },
    "& .MuiRating-iconEmpty": {
        color: "#d6d6d6",
    },
}));

const ItemCard: React.FC<Props> = ({item}) => {
    const handleLabelsColor = (priority: string) => {
        switch (priority) {
            case "Minor":
                return {background: "#19c4033e", text: "#14af00"};
            case "Low":
                return {background: "#0077ff32", text: "#0044ff"};
            case "Medium":
                return {background: "#ffee0061", text: "#b4a800"};
            case "High":
                return {background: "#ff910053", text: "#e78300"};
            case "Blocker":
                return {background: "#ff000030", text: "#ff0000"};
            case undefined:
                break;
            default:
                break;
        }
    };

    const findActiveStep = (status: string | undefined) => {
        switch (status) {
            case "New":
                return 1;
            case "Viewed by PM":
                return 2;
            case "Submitted by PM":
                return 3;
            case "In Progress":
                return 4;
            case "Done":
                return 5;
            default:
                break;
        }
    };

    return (
        <>
            <Grid item md={2}>
                <Card
                    sx={{
                        minHeight: "310px",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                        borderRadius: "10px",
                    }}
                >
                    <Grid container sx={{height: "100%", alignContent: "space-between"}}>
                        <Grid
                            item
                            md={12}
                            sx={{
                                display: "flex",
                                flexDirection: "row-reverse",
                                justifyContent: "space-between",
                                pt: 1,
                                pl: 1,
                                pr: 1,
                            }}
                        >
                            <Chip
                                label={item.priority}
                                sx={{
                                    backgroundColor: handleLabelsColor(item.priority)?.background,
                                    color: handleLabelsColor(item.priority)?.text,
                                    width: "4.5rem",
                                }}
                                size="small"
                            />
                            <Chip
                                label={
                                    <Icon
                                        icon={
                                            item.type === "bug"
                                                ? "codicon:bug"
                                                : "ic:baseline-computer"
                                        }
                                        width="20"
                                        inline={true}
                                        fontSize={24}
                                    />
                                }
                                size="small"
                                sx={{backgroundColor: "white"}}
                            />
                        </Grid>
                        <Grid item md={12}>
                            <CardContent sx={{mt: -1.5}}>
                                <Typography variant="body1" component="div" mb={0.5}>
                                    {item?.title.length > 70
                                        ? `${item?.title.substring(0, 40)}...`
                                        : item?.title}
                                </Typography>
                                <Divider/>
                                {/* <Typography
                                        variant="caption"
                                        component="div"
                                        mt={0.5}
                                        mb={2}
                                    >
                                        {item.description.substring(0, 200)}...
                                    </Typography> */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        marginTop: "5px",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <div>
                                        <Typography
                                            color="text.secondary"
                                            variant="caption"
                                            component="div"
                                            mt={0.5}
                                        >
                                            {item.status}
                                        </Typography>
                                    </div>
                                    <div>
                                        <StyledRating
                                            name="simple-controlled"
                                            size="small"
                                            value={findActiveStep(item.status)}
                                            icon={<CircleIcon sx={{fontSize: 12, ml: "2px"}}/>}
                                            emptyIcon={
                                                <CircleIcon sx={{fontSize: 12, ml: "2px"}}/>
                                            }
                                            getLabelText={() => {
                                                return `${3} Star`;
                                            }}
                                            readOnly={true}
                                        />
                                    </div>
                                </div>

                                <Typography
                                    color="text.secondary"
                                    variant="caption"
                                    component="div"
                                    mt={0.5}
                                >
                                    Product : {item.product}
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    variant="caption"
                                    component="div"
                                    mt={0.5}
                                >
                                    Platform : {item.platform}
                                </Typography>
                                {/* <Typography
                                    color="text.secondary"
                                    variant="caption"
                                    component="div"
                                    mt={0.5}
                                >
                                    images : {JSON.parse(item.images).length}
                                </Typography> */}

                                <Typography
                                    color="text.secondary"
                                    variant="caption"
                                    component="div"
                                    mt={0.5}
                                >
                                    Added on : {new Date(item?.dateAdded).toLocaleDateString()}
                                </Typography>
                                {(item?.dateDone) ? (
                                    <Typography
                                        color="text.secondary"
                                        variant="caption"
                                        component="div"
                                        mt={0.5}
                                    >
                                        Done on : {new Date(item?.dateDone).toLocaleDateString()}
                                    </Typography>
                                ) : ''}

                                <Stack direction="row" flexWrap="wrap" mt={2} sx={{mb: -3}}>
                                    {item?.assignedTo?.map((person: any, idx: any) => {
                                        return (
                                            <Chip
                                                avatar={<Avatar alt={person.name}/>}
                                                label={person.name}
                                                variant="outlined"
                                                size="small"
                                                key={idx}
                                                style={{
                                                    textTransform: "capitalize",
                                                    margin: "3px 3px 0 0",
                                                }}
                                            />
                                        );
                                    })}
                                </Stack>
                            </CardContent>
                        </Grid>
                        <Grid item md={12}>
                            <CardActions
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Link to={`/item/${item.id}`}>
                                    <Button size="small">Details</Button>
                                </Link>
                                {JSON.parse(item?.images).length > 0 && (
                                    <Icon
                                        icon="flat-color-icons:image-file"
                                        width={24}
                                        inline={true}
                                    />
                                )}
                            </CardActions>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </>
    );
};

export default ItemCard;
