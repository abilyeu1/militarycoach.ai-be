import { Document } from 'mongoose';
interface IUpdateCareerAspiration extends Document {
    industryOfInterest: string;
    jobPositionOfInterest: string;
    jobPositionLevel: string;
}
export default IUpdateCareerAspiration;
