import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type AlertDialogProps = {
    openDialog: boolean;
    closeDialog: boolean;
};

const AlertDialog: React.FC<AlertDialogProps> = ({ openDialog, closeDialog }) => {
    const [open, setOpen] = React.useState(true);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Are You Sure To delete This Item?"}</DialogTitle>
            {/* <DialogContent>
                <DialogContentText id="alert-dialog-description">confirm message</DialogContentText>
            </DialogContent> */}
            <DialogActions>
                <Button onClick={handleClose}>CANCEL</Button>
                <Button onClick={handleClose} autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AlertDialog;
