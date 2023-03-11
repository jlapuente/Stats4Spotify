import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumtifyComponent } from './albumtify.component';

describe('AlbumtifyComponent', () => {
  let component: AlbumtifyComponent;
  let fixture: ComponentFixture<AlbumtifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumtifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumtifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
