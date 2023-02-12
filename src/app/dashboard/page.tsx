'use client';
import * as React from "react";
import { useEffect, useReducer, useState } from "react";
import Task from "./Components/Task";
import { Box, AppBar, Toolbar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Stack, Button } from "@mui/material";
import TaskForm from "./Components/TaskForm";
import { TTask, TTaskReducer, TTaskState} from "./types";
import styles from "./dashboard.module.scss";
import { Add } from '@mui/icons-material';
import moment from "moment/moment";

export default function Dashboard() {
    /*
    * FIXME: this, as well as everything else with regards to client-server data flow should be done with Redux. Also this could be better overall even without Redux.
    * */
    const [dashboardTasks, setTasks] = useState([] as Array<TTask>);
    const [bugArray, setBugArray] = useState({} as TTaskReducer);
    const [storyArray, setStoryArray] = useState({} as TTaskReducer);
    const [confirmationDialogStatus, setConfirmationDialogStatus] = useState(false);
    const [confirmationDialogValue, setConfirmationDialogValue] = useState({} as TTask);
    const [confirmationDialogChoice, setConfirmationDialogChoice] = useState(false);

    const [addEditDialog, setAddEditDialog] = useState(false);
    const [addEditDialogMode, setAddEditDialogMode] = useState('add' as string);
    const [addEditDialogValue, setAddEditDialogValue] = useState({} as TTask);
    useEffect(() => {
        const reducedTasks:any = dashboardTasks.reduce((memo:any, item): any => {
            memo[item.type] = memo[item.type] || {};
            memo[item.type][item.status] =memo[item.type][item.status] || [];
            memo[item.type][item.status].push(<Task onTaskDelete={handleDeleteEvent} onTaskEdit={handleEditEvent} onTaskOpen={handleOpenEvent} task={item} key={item.id}></Task>);
            return memo;
        }, {
            bug: {
                todo: [] as React.ReactElement[],
                inProgress: [] as React.ReactElement[],
                done: [] as React.ReactElement[],
            },
            story: {
                todo: [] as React.ReactElement[],
                inProgress: [] as React.ReactElement[],
                done: [] as React.ReactElement[],
            }
        });
        setBugArray(reducedTasks.bug);
        setStoryArray(reducedTasks.story);
    }, [dashboardTasks]);
    useEffect(() => {
        if(confirmationDialogChoice) {
            handleDelete(confirmationDialogValue);
            setConfirmationDialogChoice(false);
        }
    }, [confirmationDialogStatus, confirmationDialogValue, confirmationDialogChoice]);
    async function handleGet(): Promise<Array<TTask>> {
        const res = await fetch('/api/taskManager', {
            method: 'GET'
        });
        const { data } = await res.json();
        setTasks(data);
        return data;
    }
    async function handlePost(task: TTask): Promise<Array<TTask>> {
        const res = await fetch('/api/taskManager', {
            method: 'POST',
            body: JSON.stringify(task)
        });
        const { data } = await res.json();
        setTasks(data);
        return data;
    }
    async function handleEdit(task: TTask): Promise<Array<TTask>> {
        const res = await fetch('/api/taskManager', {
            method: 'PUT',
            body: JSON.stringify(task)
        });
        const { data } = await res.json();
        setTasks(data);
        return data;
    }
    async function handleDelete(task: TTask): Promise<Array<TTask>> {
        const res = await fetch('/api/taskManager', {
            method: 'DELETE',
            body: JSON.stringify(task)
        });
        const { data } = await res.json();
        setTasks(data);
        return data;
    }

    function handleDeleteEvent(task:TTask) {
        setConfirmationDialogValue(task);
        setConfirmationDialogStatus(true);
    }
    function handleEditEvent(task:TTask) {
        setAddEditDialog(true);
        setAddEditDialogMode('edit');
        setAddEditDialogValue(task);
    }
    function handleOpenEvent(task:TTask) {
        setAddEditDialog(true);
        setAddEditDialogMode('open');
        setAddEditDialogValue(task);
    }
    function handleAddEvent() {
        setAddEditDialog(true);
        setAddEditDialogMode('add');
        setAddEditDialogValue({} as TTask);
    }
    function handleDialogClick() {
        setAddEditDialog(false); addEditDialogMode === 'add' ? handlePost(addEditDialogValue) : handleEdit(addEditDialogValue);
    }
    function modeText() {
        let res = '';
        if(addEditDialogMode === 'add') {
            res = 'Add new task';
        } else {
            let modeLabel = addEditDialogMode === 'open' ? '' : 'Edit';
            res = `${modeLabel} Task #${addEditDialogValue.id}`;
        }
        return res;
    }
    return (
        <>
            <Dialog open={confirmationDialogStatus}>
                <DialogTitle></DialogTitle>
                <DialogContent>
                    <h3>You are going to delete { confirmationDialogValue.name }, are you sure?</h3>
                </DialogContent>
                <DialogActions>
                    <Stack spacing={10} sx={{justifyContent: "space-between", width: "100%"}} direction={'row'}>
                        <Button onClick={() => { setConfirmationDialogStatus(false); setConfirmationDialogChoice(true)}} color="error">
                            Delete
                        </Button>
                        <Button onClick={() => { setConfirmationDialogStatus(false);}} variant="outlined">
                            Cancel
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
            <Dialog open={addEditDialog} fullWidth={true} maxWidth='md'>
                <DialogTitle>
                    {modeText()}
                </DialogTitle>
                <DialogContent>
                    <TaskForm onChange={(task) => setAddEditDialogValue(task)} mode={addEditDialogMode} task={addEditDialogValue}/>
                </DialogContent>
                <DialogActions>
                    <Stack spacing={10} sx={{justifyContent: "space-between", width: "100%", padding: "0 0.75em"}} direction={'row'}>
                        <Button onClick={() => { setAddEditDialog(false);}} variant="outlined">
                            Cancel
                        </Button>
                        {   addEditDialogMode !== 'open' &&
                            <Button onClick={() => handleDialogClick()} color="error">
                                { addEditDialogMode === 'add' ? 'add' : 'edit' }
                            </Button>
                        }
                    </Stack>
                </DialogActions>
            </Dialog>
            <AppBar sx={{ width: "3em", height: "100%", padding: "0.25em", alignItems: "center", justifyContent: "center"}}>
                <Toolbar>
                    <IconButton onClick={() => handleAddEvent()} sx={{border: "1px solid #FFFFFF", color: "#FFFFFF", margin: "0.61em 0 0 0"}} title='Add new task'>
                        <Add/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <main className={styles.dashboard}>
                <div className={styles.dashboard_content}>
                    <div className={styles.dashboard_content_todo}>
                        <Box className={styles.dashboard_box}>{bugArray.todo}</Box>
                        <Box className={styles.dashboard_box}>{storyArray.todo}</Box>
                    </div>
                    <div className={styles.dashboard_content_inProgress}>
                        <Box className={styles.dashboard_box}>{bugArray.inProgress}</Box>
                        <Box className={styles.dashboard_box}>{storyArray.inProgress}</Box>
                    </div>
                    <div className={styles.dashboard_content_done}>
                        <Box className={styles.dashboard_box}>{bugArray.done}</Box>
                        <Box className={styles.dashboard_box}>{storyArray.done}</Box>
                    </div>
                </div>
            </main>
        </>
    )
}
