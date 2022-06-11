import {Grid} from "@mui/material";
import {useSelector} from 'react-redux'
import Table from "../Table/Table";
import {InitialStateType} from "../../store/reducers/items";

const Home = () => {
    const state = useSelector((state: InitialStateType) => state)
    return (
        <>
            <Grid container spacing={5} direction="row">
                <Grid item xs={12}>
                    {state.items && <Table items={state.items}/>}
                </Grid>
            </Grid>
        </>
    );
};

export default Home;
