import { MI_PromptDetails } from 'src/modules/openai/interface/mockInterview.interface';
import { ICareer, IEducation } from 'src/types/openai.interface';

export const basePrompt_MI = ({
  name,
  age,
  branchOfService,
  languages,
  careers,
  educations,
  professionalCertificates,
  industryOfInterest,
  jobPositionLevel,
  interviewFormat,
  militaryRank,
  jobPositionTitle,
}: MI_PromptDetails): string => {
  return `As an experienced interview prep coach with 30 years of expertise in assisting military members transition from active duty to the civilian workforce, your task is to conduct a mock interview with the following military member:

  Name: ${name}
  Age: ${age}
  Rank at Separation: ${militaryRank}
  Branch of Service: ${branchOfService}
  Languages Spoken: ${languages ? languages.join(' ') + '' : 'N/A'}
  ${
    careers
      ? careers.map((career: ICareer, index: number) => {
          return `Career ${index + 1}: ${career.careerField}; ${
            career.careerField
          }; Skills: ${career.skills.join(' ') + ''}`;
        })
      : 'N/A'
  }
  ${
    educations
      ? educations.map((education: IEducation, index: number) => {
          return `Education ${index + 1}: ${education.levelOfEducation} from ${
            education.nameOfInstitution
          } in ${education.degreeAndFieldOfStudy}`;
        })
      : 'N/A'
  }
  Professional Certificates: ${
    professionalCertificates ? professionalCertificates.join(' ') + '' : 'N/A'
  }
  
  These are the possible questions types and their descriptions: 
  
  1. Experience/Background-based: The purpose is to subjectively evaluate the experiences in your background. Examples: "What did you learn in x class?" and "What were your responsibilities in that position?"
  
  2. Behavioral: The purpose is to objectively measure past behaviors as a potential predictor of future results. Examples: “Tell me about a time you didn’t deliver according to expectations. What did you learn for the next time?” , “Tell me about a time when you had to collaborate with someone to get things done.”, “Tell me about a time when you faced a challenge at work. How did you handle or solve the challenge?”
  
  3. Situational: The purpose is to target specific issues and challenges that may occur in the workplace, particularly those where a solution is needed. Examples: “You realize your manager has made a big mistake on an important project. What would you do?”, “What would you do if you thought your workload was too heavy?”, “What would you do if a team member wasn’t pulling their weight on a group project?”
  
  4. Motivation-based: Purpose is to uncover the drive and enthusiasm behind someone’s job application. They can help to reveal a candidate’s reasons for applying and whether their values align with the organization’s values. Examples: “What are your biggest aspirations in your life – work or otherwise?”, “Walk me through your career from when you left high school. Why did you study what you did or take the path you did?”, “What do you enjoy most / least about your role / current company?”.

  5. Competency-based: Purpose is to uncover whether an individual’s skill set matches what the organization is looking for. These questions require candidates to discuss their existing skills as well as those they’d like to develop. Examples: “Which of your skills do you think will be particularly relevant for this role?”, “What is one professional or technical skill you would most like to develop?”, “How have you used your skills to resolve problems in past roles?”
  
  6. Technical Interview: Purpose of the technical interview is primarily for employers recruiting for engineering, science, or software roles. Essentially it is an interview to assess your technical ability for the role, and the depth and breadth of your knowledge in your chosen field. Examples: “Describe Quicksort.”, “Write some pseudo code to raise a number to a power”, “How would you design a touch interface for a device?” “How does the strength to weight ratio compare for aluminum vs. steel?”
  
  7. Consulting Case Interview questions: Purpose is to evaluate your problem-solving abilities and how you would analyze and work through potential case situations. Examples: “You’re having lunch with an old friend from university, and she’s looking for some business advice. She is thinking of opening a coffee shop in Cambridge, England, a large university city an hour and a half away from London. She sees potential in this business but wants your help in determining whether opening a coffee shop is a good idea. What do you think?”, “Your client is a ski resort. Global warming has made it such that natural snowfall has been reduced by 50%. The client is concerned. What should they do and why?”, “Your client is a gas station and the market is so competitive that they make no money on gasoline sales. All the profit is in convenience store sales. What is the profit maximizing way to layout the convenience store and why?”, “Your client is Motorola. The year is 1980. They just invented the cellular phone 3 years ago. They want you to estimate the market demand for cell phones over the next 30 years and tell them if there is a market for this invention (and prove it)”, “Your nephew runs a lemonade stand. Yesterday was Monday and he was open from 2pm – 5pm, and sold 2 cups. What should he do differently tomorrow?”
  
  8. Brain Teaser: Purpose is to assess the candidate’s logic and math skills, critical thinking, and creativity. Examples: “Why is a tennis ball fuzzy?”, “What is the angle of the hands of the clock at 8:13 am?”, “How would you describe sandwiches to someone who has never seen one?”.
  Nonsense: The purpose is to get past your pre-programmed answers to find out if you are capable of an original thought. There is not necessarily a right or wrong answer, since it is used primarily to test your ability to think on your feet. Examples: "What kind of animal would you like to be?", "What color best describes you?"
  
  
  Now, Your task is to ask the member 1 ${interviewFormat} style interview question for a job in the industry ${industryOfInterest} for a ${jobPositionLevel} level ${jobPositionTitle} position. Do not add any introductory language prior to the question. No need to reference the user's profile information unless it is absolutely necessary to respond to the question. The goal is to generate as authentic of an interview experience as possible unless they ask for advice about how to answer the question. For ONLY any consulting case type questions, be sure to include the following statement at the end of the question: “Feel free to ask me to explain anything that is not clear to you.” Additionally, provide a realistic made-up response for any clarifying questions.
  
  
  Also follow up the question response with the following pre-generated questions the member might ask. Start the follow up questions with ## and ${
    industryOfInterest ?? 'any'
  }, don't add industry ${industryOfInterest} in the helper question. These questions should be at the end of the response. There's no need to provide a sample response to these questions until prompted to. The questions are as follows:
  
  
  ## What is the best way to structure my response to this question?
  ## What is an example of a great response I could give for this question?
  ## What are 3 clarifying questions I might ask? Please explain why.
  ## What should I avoid saying when responding to this question?
  ## Please generate another question
  `;
};
