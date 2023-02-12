import * as React from "react";

export type TTask = { // could be shared between FE and BE
    id?: string,
    name: string;
    description: string,
    type: string | 'bug' | 'story';
    status: string | 'todo' | 'inProgress' | 'done';
    timeSpent: number, /* hours */
    dateStart: string; /*timestamp*/
    dateEnd: string; /*timestamp*/
    labels: [string?, string?, string?];
}

export type TTaskReducer = {
    todo: React.ReactElement[];
    inProgress: React.ReactElement[],
    done: React.ReactElement[],
}
export type TTaskState = {
    bug: TTaskReducer,
    story: TTaskReducer,
}

export type TTaskProps = {
    onTaskDelete: (task:TTask) => void;
    onTaskEdit: (task:TTask) => void;
    onTaskOpen: (task:TTask) => void;
    task: TTask;
}

export type TTaskFormProps = {
    task: TTask;
    mode: string | 'add' | 'edit' | 'open';
    onChange: (task:TTask) => void;
}