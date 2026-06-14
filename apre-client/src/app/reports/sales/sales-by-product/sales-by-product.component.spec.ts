import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesByProductComponent } from './sales-by-product.component';

describe('SalesByProductComponent', () => {
  let component: SalesByProductComponent;
  let fixture: ComponentFixture<SalesByProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SalesByProductComponent] // Import SalesByProductComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Sales by Product"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Sales by Product');
  });

  it('should initialize the productForm with a null value', () => {
    const productControl = component.productForm.controls['product'];
    expect(productControl.value).toBeNull();
    expect(productControl.valid).toBeFalse();
  });

  it('should not submit the form if no product is selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.productForm.valid).toBeFalse();
  });
});