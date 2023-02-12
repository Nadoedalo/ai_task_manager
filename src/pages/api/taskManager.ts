import type { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { db } from "@/pages/api/index";
type Task = {
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
type TaskManagerRes = {
    data: Array<Task>;
}

function getTasksHandler(res: NextApiResponse<TaskManagerRes>) {
    /*TODO use request params for sorting / filtering etc */
    const tasks= db.get('tasks') as Array<Task> || [] as Array<Task>;
    res.status(200).json({
        data: tasks,
    });
}
function postTaskHandler(res: NextApiResponse<TaskManagerRes>, body:Task) {
    const tasks = JSON.parse(JSON.stringify(db.get('tasks') || []));
    /* TODO validation so required fields are present, etc */
    const task = body;
    task.id = uuidv4();
    tasks.push(task);
    db.add('tasks', tasks);
    res.status(200).json({
        data: tasks,
    });
}
function deleteTaskHandler(res: NextApiResponse<TaskManagerRes>, body:Task) {
    const tasks = JSON.parse(JSON.stringify(db.get('tasks') || []));
    /* TODO permission checks etc etc */
    const index = tasks.findIndex((item:Task) => { return item.id === body.id});
    if(index > -1) {
        tasks.splice(index, 1);
        db.add('tasks', tasks);
        res.status(200).json({
            data: tasks,
        });
    } else {
        console.log('Trying to delete non-existent task');
        res.status(400).end();
    }
}
function editTaskHandler(res: NextApiResponse<TaskManagerRes>, body:Task) {
    const tasks = JSON.parse(JSON.stringify(db.get('tasks') || []));
    /* TODO permission checks etc etc */
    /* FIXME could definitely reduce DRY */
    const index = tasks.findIndex((item:Task) => { return item.id === body.id});
    if(index > -1) {
        tasks[index] = body;
        db.add('tasks', tasks);
        res.status(200).json({
            data: tasks,
        });
    } else {
        console.log('Trying to edit non-existent task');
        res.status(400).end();
    }
}

export default function taskManager(
    req: NextApiRequest,
    res: NextApiResponse<TaskManagerRes>
) {
    const { method } = req;
    const body = req.body ? JSON.parse(req.body) : null;
    if(method === 'GET') {
        getTasksHandler(res);
    } else if(method === 'POST') {
        postTaskHandler(res, body);
    } else if(method === 'DELETE') {
        deleteTaskHandler(res, body);
    } else if(method === 'PUT') {
        editTaskHandler(res, body);
    }
}
