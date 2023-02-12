import * as React from "react";

export type TTask = { // could be shared between FE and BE
    id?: string,
    name: string;
    description: string,
    type: string | 'bug' | 'story';
    status: string | 'todo' | 'inProgress' | 'done';
    timeSpent: number, /* hours */
    dateStart: number; /*timestamp*/
    dateEnd: number; /*timestamp*/
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