import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EncoderSettingsComponent } from './encoder-settings.component';

describe('EncoderSettingsComponent', () => {
  let component: EncoderSettingsComponent;
  let fixture: ComponentFixture<EncoderSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncoderSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EncoderSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
