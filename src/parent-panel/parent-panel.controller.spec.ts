import { Test, TestingModule } from '@nestjs/testing';
import { ParentPanelController } from './parent-panel.controller';

describe('ParentPanelController', () => {
  let controller: ParentPanelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentPanelController],
    }).compile();

    controller = module.get<ParentPanelController>(ParentPanelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
