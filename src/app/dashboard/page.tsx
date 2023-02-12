'use client';
import * as React from "react";
import {useEffect, useReducer, useState} from "react";
import Task from "./Components/Task";
import { Box } from "@mui/material";
import TaskCreation from "./Components/TaskCreation";
import { TTask, TTaskReducer, TTaskState} from "./types";
import styles from "./dashboard.module.scss";

export default function Dashboard() {
    /*
    * FIXME: this, as well as everything else with regards to client-server data flow should be done with Redux
    *  PS also could have been done with the help of a reducer
    * */
    const [dashboardTasks, setTasks] = useState([] as Array<TTask>);
    const [bugArray, setBugArray] = useState({} as TTaskReducer);
    const [storyArray, setStoryArray] = useState({} as TTaskReducer);

    useEffect(() => {
        handleGet().then(() => {
            const task:TTask = {
                name: 'TestTestTestTestTestTestTestTestTestTest',
                description: 'first task',
                type: 'bug',
                status: 'todo',
                timeSpent: 0,
                dateStart: 0,
                dateEnd: 0,
                labels: ['test'],
            }
            handlePost(task);
            const task2:TTask = {
                name: 'Test',
                description: 'second tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond tasksecond task',
                type: 'story',
                status: 'todo',
                timeSpent: 0,
                dateStart: 0,
                dateEnd: 0,
                labels: ['test'],
            }
            handlePost(task2);
        })
    }, []);
    useEffect(() => {
        const reducedTasks:any = dashboardTasks.reduce((memo:any, item): any => {
            memo[item.type][item.status].push(<Task {...item} key={item.id}></Task>);
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
    async function handleGet(): Promise<Array<TTask>> {
        const res = await fetch('/api/taskManager', {
            method: 'GET'
        });
        const data = await res.json();
        setTasks(data.data);
        return data;
    }
    async function handlePost(task: TTask): Promise<Array<TTask>> {
        const res = await fetch('/api/taskManager', {
            method: 'POST',
            body: JSON.stringify(task)
        });
        const data = await res.json();
        setTasks(data.data);
        console.log('here wtf??', data);
        return data;
    }
    async function handleEdit(task: TTask): Promise<Array<TTask>> {
        const res = await fetch('/api/taskManager', {
            method: 'PUT',
            body: JSON.stringify(task)
        });
        const data = await res.json();
        setTasks(data.data);
        return data;
    }
    async function handleDelete(task: TTask): Promise<Array<TTask>> {
        const res = await fetch('/api/taskManager', {
            method: 'DELETE',
            body: JSON.stringify(task)
        });
        const data = await res.json();
        setTasks(data);
        return data;
    }
    return (
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
    )
}
