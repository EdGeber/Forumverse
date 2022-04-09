import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TopBarComponent } from './top-bar.component';

describe('TopBarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        TopBarComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TopBarComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'fv-gui'`, () => {
    const fixture = TestBed.createComponent(TopBarComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('fv-gui');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(TopBarComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('fv-gui app is running!');
  });
});
