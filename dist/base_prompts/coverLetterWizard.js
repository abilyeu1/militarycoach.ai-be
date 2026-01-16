"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basePrompt_CLW = void 0;
const basePrompt_CLW = ({ name, age, branchOfService, languages, careers, educations, professionalCertificates, style, tone, jobDescription, militaryRank, }) => {
    return `As an experienced career coach with 30 years of expertise in assisting military members transition from active duty to the civilian workforce, as well as 20 years as a talented writer,  your task is to write a cover letter for the following military member :

  
  Strict Instruction : The response should be in MDX format!

  Name: ${name}
  Age: ${age}
  Rank at Separation: ${militaryRank}
  Branch of Service: ${branchOfService}
  Languages Spoken: ${languages ? languages.join(' ') + '' : 'N/A'}
  ${careers
        ? careers.map((career, index) => {
            return `Career ${index + 1}: ${career.careerField}; ${career.careerField}; Skills: ${career.skills.join(' ') + ''}`;
        })
        : 'N/A'}
  ${educations
        ? educations.map((education, index) => {
            return `Education ${index + 1}: ${education.levelOfEducation} from ${education.nameOfInstitution} in ${education.degreeAndFieldOfStudy}`;
        })
        : 'N/A'}
  Professional Certificates: ${professionalCertificates ? professionalCertificates.join(' ') + '' : 'N/A'}
  
  A job description for the job they are applying to is as follows:
  
  Job description:
  ${jobDescription}

  Write the cover letter draft in a ${style} style with a ${tone} tone. The body of the letter should be no more than 375 words long. Be sure to use expert-approved cover letter structure, etiquette and tips/tricks. Incorporate information about the job and the military member’s background as necessary. The goal is to sound as authentic and genuine as possible. 
  `;
};
exports.basePrompt_CLW = basePrompt_CLW;
//# sourceMappingURL=coverLetterWizard.js.map