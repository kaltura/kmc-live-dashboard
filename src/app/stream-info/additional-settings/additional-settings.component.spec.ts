import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalSettingsComponent } from './additional-settings.component';

describe('AdditionalSettingsComponent', () => {
  let component: AdditionalSettingsComponent;
  let fixture: ComponentFixture<AdditionalSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
