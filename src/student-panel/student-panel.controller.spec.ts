import { Test, TestingModule } from '@nestjs/testing';
import { StudentPanelController } from './student-panel.controller';

describe('StudentPanelController', () => {
  let controller: StudentPanelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentPanelController],
    }).compile();

    controller = module.get<StudentPanelController>(StudentPanelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
