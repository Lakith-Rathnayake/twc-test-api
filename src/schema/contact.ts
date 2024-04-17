import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    contactId: { type: Number, required: true, unique: true },
    name: {type: String, required: true},
    email: {type: String, required: true},
    contact: {type: Number, required: true},
    gender: {type: String, required: true},
    user: {type: String, required: true}
});

const Contact = mongoose.model('Contact', ContactSchema);

export default Contact;
export const getContact = () => Contact.find();