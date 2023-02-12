'use client';
import { TextField, Select, Box, Stack, MenuItem } from "@mui/material";
import { TTaskFormProps, TTask } from '../types';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState, useMemo, useEffect } from "react";
import { BugReport, Grade } from '@mui/icons-material';
import moment from "moment";

export default function TaskForm(props:TTaskFormProps) {
    const [taskForm, setTaskForm] = useState({
        name: '',
        description: '',
        type: 'story',
        status: 'todo',
        timeSpent: '', /* hours */
        dateStart: moment().toISOString(), /*timestamp*/
        dateEnd: moment().toISOString(), /*timestamp*/
        labels: [],
    } as any); //FIXME quick and dirty since I can't use null or undefined
    const isReadOnly = useMemo((): boolean => {return props.mode === 'open'}, [props.mode]);
    function handleChange(e: any, key:string) {
        const taskCopy = JSON.parse(JSON.stringify(taskForm));
        const target = e.target;
        const value = target ? e.target.value : e;
        taskCopy[key] = value;
        setTaskForm(taskCopy);
        props.onChange(taskCopy);
    }
    useEffect(() => {
        const dateNow = moment().toISOString();
        const merged = Object.assign({
                dateStart: dateNow,
                dateEnd: dateNow,
            }, taskForm, props.task);
        setTaskForm(merged);
    });
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: "0.5em 0", padding: "0.25em 0 0 0"}}>
            <TextField
                placeholder='Name'
                value={taskForm.name}
                onChange={(e) => handleChange(e, 'name')}
                InputProps={{
                    readOnly: isReadOnly,
                }}
                variant='outlined'
            ></TextField>
            <TextField
                placeholder="Description"
                value={taskForm.description}
                multiline
                rows={4}
                onChange={(e) => handleChange(e, 'description')}
                InputProps={{
                    readOnly: isReadOnly,
                }}
                variant='outlined'
            ></TextField>
            <Stack spacing={2} direction='row' sx={{ height: '3em'}}>
                <Select sx={{flexGrow: 1, width: "50%"}} value={taskForm.type} defaultValue='story' placeholder='Select task type' disabled={isReadOnly} onChange={(e) => handleChange(e, 'type')}>
                    <MenuItem value={'bug'}><BugReport/>Bug</MenuItem>
                    <MenuItem value={'story'}><Grade/>Story</MenuItem>
                </Select>
                <Select sx={{flexGrow: 1, width: "50%"}} placeholder='Select task status' defaultValue='todo' disabled={isReadOnly} onChange={(e) => handleChange(e, 'status')}>
                    <MenuItem value={'todo'}>
                            <span>Todo</span>
                    </MenuItem>
                    <MenuItem value={'inProgress'}>
                            <span>In Progress</span>
                    </MenuItem>
                    <MenuItem value={'done'}>
                        <span>Done</span>
                    </MenuItem>
                </Select>
                <TextField
                    placeholder='Time, h'
                    value={taskForm.timeSpent}
                    sx={{maxWidth: '5em'}}
                    InputProps={{
                        readOnly: isReadOnly,
                    }}
                    onChange={(e) => handleChange(e, 'timeSpent')}
                ></TextField>
            </Stack>
            <Stack spacing={2} direction='row'>
                <DatePicker
                    label="Date start"
                    readOnly={isReadOnly}
                    value={taskForm.dateStart}
                    renderInput={(params) => <TextField sx={{ flexGrow: 1}} {...params}/>}
                    onChange={(e) => handleChange(e, 'dateStart')}
                ></DatePicker>
                <DatePicker
                    label="Date end"
                    readOnly={isReadOnly}
                    value={taskForm.dateEnd}
                    renderInput={(params) => <TextField sx={{ flexGrow: 1}} {...params}/>}
                    onChange={(e) => handleChange(e, 'dateEnd')}
                ></DatePicker>
            </Stack>
        </Box>
    )
}