import { Document } from 'mongoose';

interface IAddEducation extends Document {
    _id: string;
    levelOfEducation: string;
    nameOfInstitution: string;
    degreeAndFieldOfStudy: string;
}

export default IAddEducation;
