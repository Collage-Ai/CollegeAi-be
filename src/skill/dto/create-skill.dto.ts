export class CreateSkillDto {
  userId: number;
  title: string;
  description: string;
  type?: string;
  category?: number;
}
