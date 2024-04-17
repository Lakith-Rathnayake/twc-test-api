import {Router, Request, Response} from "express";
import User from "../schema/user";
import contact, {getContact} from "../schema/contact";
import bcrypt from "bcryptjs";
import Contact from "../schema/contact";
import Counter from "../schema/counter";

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
        res.sendStatus(500); // Internal server error
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
        res.sendStatus(500); // Internal server error
    }
}

async function getAllContacts(req: Request, res: Response) {
    try {
        const contact = await getContact();
        console.log(contact);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500); // Internal server error
    }
}

async function postContact(req: Request, res: Response) {
    const { name, email, contact, gender, user } = req.body;

    try {
        // Find and update the counter to get the next available sequence number
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'contactId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const newContact = new Contact({
            contactId: counter.seq, // Use the incremented sequence number as the contactId
            name,
            email,
            contact,
            gender,
            user
        });

        await newContact.save();

        res.status(201).json(newContact); // Send the newly created contact as JSON response
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Internal server error
    }
}

async function updateContact(req: Request, res: Response) {
    const {id} = req.params;
    const { name, email, contact, gender } = req.body;
    try {
        // Find the contact by ID
        let updatedContact = await Contact.findOne({contactId: id});

        if (!updatedContact) {
            return res.sendStatus(404);
        }

        // Update the contact fields
        updatedContact.name = name;
        updatedContact.email = email;
        updatedContact.contact = contact;
        updatedContact.gender = gender;

        // Save the updated contact
        await updatedContact.save();

        res.status(200).json(updatedContact); // Send the updated contact as JSON response
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Internal server error
    }
}

async function deleteContact(req: Request, res: Response) {
    const { id } = req.params; // Get the contact ID from the request parameters

    try {
        // Find the contact by its contactId and delete it
        const deletedContact = await Contact.findOneAndDelete({ contactId: id });

        if (!deletedContact) {
            return res.sendStatus(404); // Contact not found
        }

        res.status(200).json(deletedContact); // Send the deleted contact as JSON response
    } catch (error) {
        console.error(error);
        res.sendStatus(500); // Internal server error
    }
}

export {controller as UserHttpController};