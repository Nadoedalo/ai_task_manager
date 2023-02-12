import { TTask } from "@/app/dashboard/types";
import { Card, CardContent, CardHeader, CardActions, IconButton, Box } from "@mui/material";
import styles from "./task.module.scss";
import { DeleteForever, Edit, RemoveRedEye, BugReport, Grade} from '@mui/icons-material';

export default function Task(props:TTask) {
    function CardTitle() {
        // the type icon is redundant
        // TODO add avatar here
        return (
            <Box title={props.name} className={styles.taskHeaderBox}>{props.type === "bug" ? <BugReport fontSize="small"/> : <Grade fontSize="small"/>}<span>{props.name}</span></Box>
        )
    }
    return <Card sx={{ backgroundColor:'#9c27b0' }} className={styles.dashboard_task}>
        <CardHeader title={<CardTitle/>} sx={{alignItems: 'center', padding: "0 0.25em"}} titleTypographyProps={{variant:'body1'}}/>
        <CardContent sx={{ padding: "0.25em"}} className={styles.dashboard_task_content}>
            <div>
                <span>{ props.description }</span>
            </div>
        </CardContent>
        <CardActions sx={{ padding: 0, justifyContent: 'space-between', color: '#FFFFFF'}}>
            <IconButton size='small'>
                <DeleteForever sx={{ color: "#FFFFFF" }}/>
            </IconButton>
            <IconButton size='small'>
                <Edit sx={{ color: "#FFFFFF" }}/>
            </IconButton>
            <IconButton size='small'>
                <RemoveRedEye sx={{ color: "#FFFFFF" }}/>
            </IconButton>
        </CardActions>
    </Card>
}