"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeParserBasePrompt = void 0;
exports.ResumeParserBasePrompt = `
  You will be provided a Resume JSON, and you will need to normalize it.
  
  You have to return only normalized resume JSON, nothing more!
  Convert provided Resume to the following schema:
  
  interface User {
    fullName: string; // First Name Only of the user
    email: string; // Email address of the user
    languages: string[] | []; // Spoken languages (e.g., English, Spanish)
    branchOfService?: string | null; // Branch of military service
    militaryRank?: string | null; // Military rank
    industryOfInterest?: string; // Industry of interest
    jobPositionOfInterest?: string; // Job position of interest
    jobPositionLevel?: string; // Job position level
    workExperience?: {
      careerField: string; // Career field
      yearsInCareerField: number // Years of experience in the career field
      jobTitle: string; // Job title
      skillsLeveragedInCareerField: string[]; // Skills leveraged in the career field
    }[]; // Array of work experiences
  
    education?: {
      levelOfEducation: string; // Level of education
      nameOfInstitution: string; // Name of the educational institution
      degreeAndFieldOfStudy: string; // Degree and field of study
    }[]; // Array of educational experiences
  
    certificates?: string[]; // Array of certificates
  }
  
  If some filed is not provided in the Resume JSON, you should set it to null or empty array, don't add comments in the response.
  
  Strict Instructions: Do not return the response in template string, parsed CV should be in Javascript JSON object format, no additional text should be returned, only JSON Object.
  `;
//# sourceMappingURL=ResumeJSONNormalizer.js.map