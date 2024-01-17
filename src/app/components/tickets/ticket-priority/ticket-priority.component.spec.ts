import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPriorityComponent } from './ticket-priority.component';

describe('TicketPriorityComponent', () => {
  let component: TicketPriorityComponent;
  let fixture: ComponentFixture<TicketPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketPriorityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
