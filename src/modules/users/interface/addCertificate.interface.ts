import { Document } from 'mongoose';

interface IAddCertificate extends Document {
    _id: string;
    name: string;
}

export default IAddCertificate;
