import { OpenaiService } from './openai.service';
import { UserDocument } from 'src/schemas/users/user.schema';
import { CareerWizardDTO } from './DTO/careerWizard.dto';
import { CoverLetterWizardDTO } from './DTO/coverLetterWizard.dto';
import { MockInterviewDTO } from './DTO/mockInterview.dto';
import { SkillsGapAnalysisDTO } from './DTO/skillsGapAnalysis.dto';
export declare class OpenaiController {
    private openaiService;
    constructor(openaiService: OpenaiService);
    bulletTranslator({ bullet }: {
        bullet: string;
    }, req: {
        user: UserDocument;
    }): Promise<{
        message: string;
    }>;
    careerWizardTool({ chatID }: {
        chatID: string;
    }, career: CareerWizardDTO, req: {
        user: UserDocument;
    }): Promise<{
        content: string;
    }>;
    coverLetterWizardTool(career: CoverLetterWizardDTO, req: {
        user: UserDocument;
    }): Promise<{
        content: string;
    }>;
    mockInterview({ chatID }: {
        chatID: string;
    }, career: MockInterviewDTO, req: {
        user: UserDocument;
    }): Promise<{
        content: string;
        basePrompt: string;
    }>;
    skillsGapAnalysis({ chatID }: {
        chatID: string;
    }, career: SkillsGapAnalysisDTO, req: {
        user: UserDocument;
    }): Promise<{
        content: string;
        basePrompt: string;
    }>;
    upload(file: any): Promise<string>;
    recommendIndustry(req: {
        user: UserDocument;
    }): Promise<{
        recommendations: string;
    }>;
}
