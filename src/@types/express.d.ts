type User = {
    id:string;
    name:string;
    username:string;
    technologies: Technology[];
}

type Technology = {
    id:string;
    title:string;
    studied:boolean;
    deadline:Date;
    created_at:Date;
}
declare namespace Express {
    export interface Request {
        user:User;
    }
}