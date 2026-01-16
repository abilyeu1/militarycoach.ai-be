import { Document } from 'mongoose';
interface IAddWorkExperience extends Document {
    _id: string;
    careerField: string;
    jobTitle: string;
    yearsInCareerField: number;
    skillsLeveragedInCareerField: string[];
}
export default IAddWorkExperience;
