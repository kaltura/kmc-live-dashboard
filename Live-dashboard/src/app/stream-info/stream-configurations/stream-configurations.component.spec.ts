import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamConfigurationsComponent } from './stream-configurations.component';

describe('StreamConfigurationsComponent', () => {
  let component: StreamConfigurationsComponent;
  let fixture: ComponentFixture<StreamConfigurationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
