import {Router, Request, Response} from "express";
import User, {getUsers} from "../schema/user";
import contact, {getContact} from "../schema/contact";
import bcrypt from "bcryptjs";

const controller = Router();

controller.post('/', saveUser);
controller.get('/', getUser);
controller.get ('/contact', getAllContacts);
controller.post('/contact', postContact);
controller.patch('/contact/:id', updateContact);
controller.delete('/contact/:id', deleteContact);

async function saveUser(req: Request, res: Response) {
    const {email, password} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({email, password: hashedPassword});
        await user.save();

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function getUser(req: Request, res: Response) {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user) return res.sendStatus(404);
        // Check if the password matches
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            // If password is not valid, return 401 Unauthorized
            return res.sendStatus(401);
        }

        // If both email and password are correct, return the user data
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function getAllContacts(req: Request, res: Response) {
    try {
        const contacts = await getContact();
        console.log(contact);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function postContact(req: Request, res: Response) {
    res.sendStatus(201);
}

async function updateContact(req: Request, res: Response) {
    res.sendStatus(201);
}

async function deleteContact(req: Request, res: Response) {}

export {controller as UserHttpController};