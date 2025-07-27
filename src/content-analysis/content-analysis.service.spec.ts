import { Test, TestingModule } from '@nestjs/testing';
import { ContentAnalysisService } from './content-analysis.service';

describe('ContentAnalysisService', () => {
  let service: ContentAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentAnalysisService],
    }).compile();

    service = module.get<ContentAnalysisService>(ContentAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
