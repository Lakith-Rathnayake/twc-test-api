import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<UserDocument>({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

UserSchema.methods.comparePassword = async function (userPassword: string) {
    try {
        return await bcrypt.compare(userPassword, this.password);
    } catch (error) {
        throw new Error("Error comparing passwords");
    }
};

const User = mongoose.model<UserDocument>('User', UserSchema);
export default User;
export const getUsers = () => User.find();
