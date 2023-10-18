import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

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

const users = [] as User[];

const checkExistsUserAccount = (req:Request, res:Response, next:NextFunction):void => {
    const { username } = req.headers;
    const userExists = users.find((user) => user.username === username);
    if (!userExists) {
        return res.status(404).json({error:'Usuário não existe.'});
    }
    req.user = userExists;
    return next();
}

app.post('/users', (req, res) => {
    const { name, username } = req.body;

    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(400).json({error:'Username já cadastrado.'});
    }
    const newUser = {
        id:uuidv4(),
        name,
        username,
        technologies: []
    }
    users.push(newUser);
    return res.status(201).json(newUser);
});

app.post('/technologies', checkExistsUserAccount, (req, res) => {
    const { title, deadline } = req.body
    const { user } = req;

    const technology: Technology = {
        id:uuidv4(),
        title,
        studied: false,
        deadline: new Date(deadline),
        created_at: new Date()
    }
    user.technologies.push(technology);
    return res.status(201).json(technology);
});

app.get('/technologies', checkExistsUserAccount, (req, res) => {
    const { user } = req;

    return res.status(200).json(user.technologies);
});

app.put('/technologies/:id', checkExistsUserAccount, (req, res) => {
    const { title, deadline } = req.body;
    const { id } = req.params;
    const { user } = req;

    const technology = user.technologies.find((technology) => technology.id === id);
    
    if (!technology) {
        return res.status(404).json({error:'Tecnologia não encontrada.'});
    }

    const technologyId = user.technologies.findIndex((technology) => technology.id === id);

    technology.title = title;
    technology.deadline = deadline;

    user.technologies.splice(technologyId, 1, technology);

    return res.status(200).json(technology);
});

app.patch('/technologies/:id/studied', checkExistsUserAccount, (req, res) => {
    const { id } = req.params;
    const { user } = req;

    const technology = user.technologies.find((technology) => technology.id === id);
    
    if (!technology) {
        return res.status(404).json({error:'Tecnologia não encontrada.'});
    }

    const technologyId = user.technologies.findIndex((technology) => technology.id === id);

    technology.studied = true;

    user.technologies.splice(technologyId, 1, technology);

    return res.status(200).json(technology);
});

app.delete('/technologies/:id', checkExistsUserAccount, (req, res) => {
    const { id } = req.params;
    const { user } = req;

    const technologyId = user.technologies.findIndex((technology) => technology.id === id);
    
    if (technologyId < 0) {
        return res.status(404).json({error:'Tecnologia não encontrada.'});
    }
    
    user.technologies.splice(technologyId, 1);

    return res.status(200).json({message:'Tecnologia deletada.'});
});


app.listen(3000, () => {console.log('Server online on port 3000.')});