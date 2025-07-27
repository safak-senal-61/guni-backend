import { Test, TestingModule } from '@nestjs/testing';
import { ParentPanelService } from './parent-panel.service';

describe('ParentPanelService', () => {
  let service: ParentPanelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParentPanelService],
    }).compile();

    service = module.get<ParentPanelService>(ParentPanelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
