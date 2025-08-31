import { PromptDetails } from 'src/modules/openai/interface/careerWizard.interface';
import { ICareer, IEducation } from 'src/types/openai.interface';

export const basePrompt_CW = ({
  name,
  age,
  branchOfService,
  languages,
  careers,
  educations,
  professionalCertificates,
  industryOfInterest,
  jobLocation,
  militaryRank,
}: PromptDetails): string => {
  return `
    As an experienced career coach with 30 years of expertise in assisting military members transition from active duty to the civilian workforce, your task is to recommend potential civilian career paths for the following military member:

    Name: ${name}
    Age: ${age}
    Rank at Separation: ${militaryRank}
    Job Location: ${jobLocation}
    Branch of Service: ${branchOfService}
    Languages Spoken: ${languages ? languages.join(' ') + '' : 'N/A'}
    ${
      careers
        ? careers.map((career: ICareer, index: number) => {
            return `Career ${index + 1}: ${career.careerField}; ${
              career.careerField
            }  Skills: ${career.skills.join(' ') + ''}`;
          })
        : 'N/A'
    }
    ${
      educations
        ? educations.map((education: IEducation, index: number) => {
            return `Education ${index + 1}: ${
              education.levelOfEducation
            } from ${education.nameOfInstitution} in ${
              education.degreeAndFieldOfStudy
            }`;
          })
        : 'N/A'
    }
    Professional Certificates: ${
      professionalCertificates ? professionalCertificates.join(' ') + '' : 'N/A'
    }

    Based on this profile, and their desired job location, ${jobLocation}, recommend a list of 5 potential yet realistic civilian career paths in the ${industryOfInterest} industry that could be well-suited for them. If the industry is not "Undecided/Any", you must recommend careers in the desired industry. List the careers in order of most suitable to least suitable. Please include a line break after each career recommendation. Include a brief justification for why the career path makes sense. As applicable, recommend 2-3 potential well-known employers hiring in their desired location for the suggested career and include hyperlinks for those employers.  Be sure to mention that the order of the recommended careers is in order of most suitable to least suitable.
        
    Also help me generate 7 total short questions the military member might ask to help them narrow down their career choices. The first 5 questions should be aimed at learning more about each of the 5 recommended career fields listed.
    
    Strict Instruction: The helper questions must start with ## in the start, For example:

    ## What is the day in the life of an investment banker?
    ## What is it like to be a High School Teacher?
    ## Which career would help me best utilize my language skills?
`;
};
