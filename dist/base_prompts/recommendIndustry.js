"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basePrompt_RI = void 0;
const basePrompt_RI = ({ name, age, branchOfService, languages, careers, educations, professionalCertificates, }) => {
    return `As an experienced interview prep coach with 30 years of expertise in assisting military members transition from active duty to the civilian workforce, your task is to recommend potential industries to a transitioning military member:

  Name: ${name}
  Age: ${age}
  Rank at Separation: $Rank
  Branch of Service: ${branchOfService}
  Languages Spoken: ${languages ? languages.join(' ') + '' : 'N/A'}
  ${careers
        ? careers.map((career, index) => {
            return `Career ${index + 1}: ${career.careerField}; ${career.careerField}; Skills: ${career.skillsLeveragedInCareerField.join(' ') + ''}`;
        })
        : 'N/A'}
  ${educations
        ? educations.map((education, index) => {
            return `Education ${index + 1}: ${education.levelOfEducation} from ${education.nameOfInstitution} in ${education.degreeAndFieldOfStudy}`;
        })
        : 'N/A'}
  Professional Certificates: ${professionalCertificates.length > 0
        ? professionalCertificates
            .map((certificate) => certificate.name)
            .join(' ') + ''
        : 'N/A'}
  
  The listing of possible industries is a follows: Aerospace, Artificial Intelligence, Automotive, Biotechnology/Bioengineering, Computers/Electronics/Telecom, Consulting (General/Defense), Consulting (Management), Defense, Diversified Financial Services, Education, Energy, Energy (Renewable/Green), Finance, FinTech, Food & Beverage, Government, Healthcare, Healthcare Technology, Investment Banking/Brokerage, Investment Management, Legal Services, Manufacturing, Media/Entertainment/Sports, Nonprofit (General), Pharmaceuticals, Private Equity, Real Estate, Retails/CPG, Restaurant/Hotel/Hospitality, Sales (General), Supply Chain/Logistics, Technology/Software/Internet, Venture Capital
   
  Based on the members profile, recommend 5 potential career paths from the list above that would be well-suited for them. No need to provide any explanation or justification, just the list of 5 total career paths. 

  Response should be an array of string
  `;
};
exports.basePrompt_RI = basePrompt_RI;
//# sourceMappingURL=recommendIndustry.js.map