import {Alert, Snackbar} from "@mui/material";
import {useDispatch} from 'react-redux'
import * as actionTypes from '../../store/actions/actionTypes'

type Props = {
    message: string;
    snackBarOpen: boolean;
    messageType: "success" | "error";
};

const FlashMessage = ({message, snackBarOpen, messageType}: Props) => {

    const dispatch = useDispatch()
    const dispatchHideFlashMessage = () => dispatch(actionTypes.hideFlashMessage())

    return (
        <div>
            <Snackbar
                open={snackBarOpen}
                autoHideDuration={3000}
                onClose={() => dispatchHideFlashMessage()}
                anchorOrigin={{vertical: "top", horizontal: "center"}}
            >
                <Alert
                    onClose={() => dispatchHideFlashMessage()}
                    severity={messageType}
                    sx={{width: "100%"}}
                >
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default FlashMessage;
