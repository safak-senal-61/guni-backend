import { Test, TestingModule } from '@nestjs/testing';
import { StudentPanelService } from './student-panel.service';

describe('StudentPanelService', () => {
  let service: StudentPanelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentPanelService],
    }).compile();

    service = module.get<StudentPanelService>(StudentPanelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
