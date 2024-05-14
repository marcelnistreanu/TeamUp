import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTeamsDialogComponent } from './generate-teams-dialog.component';

describe('GenerateTeamsDialogComponent', () => {
  let component: GenerateTeamsDialogComponent;
  let fixture: ComponentFixture<GenerateTeamsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateTeamsDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenerateTeamsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
