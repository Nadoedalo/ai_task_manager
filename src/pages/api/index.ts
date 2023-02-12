/*
* just a simple global storage object
* */
import validKeys from "./validKeys.config";
interface DataBase {
    [key: string] : object | Array<any> | number | string | boolean;
}
export class DB {
    data: DataBase;
    constructor() {
        this.data = {};
    }
    add(key:string, value:any) {
        this.data[key] = value; //could be better and should be SET. Merge strategies etc but just keeping it simple for now.
    }
    get(key:string) {
        return this.data[key];
    }
    reset() {
        this.data = {};
    }
}
const keysDB = new DB();
for(let key in validKeys) {
    keysDB.add(key, validKeys[key]);
}

const db = new DB();
const emailsDB = new DB(); /* stores emails that people have subscribed to*/

export { db, emailsDB, keysDB };