import { IsIn } from 'class-validator';

export class UpdateRankingSettingsDto {
  @IsIn(['alphabetical', 'most_wins', 'most_podiums'])
  tieBreakRule!: 'alphabetical' | 'most_wins' | 'most_podiums';
}
