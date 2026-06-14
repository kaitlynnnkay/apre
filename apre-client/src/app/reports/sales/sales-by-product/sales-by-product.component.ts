import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartComponent } from '../../../shared/chart/chart.component';

@Component({
  selector: 'app-sales-by-product',
  standalone: true,
  imports: [ReactiveFormsModule, ChartComponent],
  template: `
    <h1>Sales by Product</h1>
    <div class="product-container">
      <form class="form" [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label class="label" for="product">Product</label>

          <!-- Dropdown list of products, populated from backend -->
          <select class="select" formControlName="product" id="product" name="product">
            @for(product of products; track product) {
              <option value="{{ product }}">{{ product }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      <!-- Check for totalSales values & labels values -->
      @if (totalSales.length && labels.length) {
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Sales by Product'"
            [data]="totalSales"
            [labels]="labels"> <!-- binds the product names to the chart's x-axis -->
          </app-chart>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
    }
  `]
})
export class SalesByProductComponent implements AfterViewInit {
  products: string[] = []; // list of all products for the dropdown
  totalSales: number[] = []; // numeric sales values returned from backend
  labels: string[] = []; // labels for chart's x-axis

  // reactive form to select a product to display sales data for
  productForm = this.fb.group({
    product: [null, Validators.compose([Validators.required])]
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    // fetch list of all products for the dropdown
    this.http.get(`${environment.apiBaseUrl}/reports/sales/product`).subscribe({
      next: (data: any) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    // No need to create chart here, it will be handled by ChartComponent
  }

  onSubmit() {
    const product = this.productForm.controls['product'].value;
    // fetch sales data for the selected product
    this.http.get(`${environment.apiBaseUrl}/reports/sales/product/${product}`).subscribe({
      next: (data: any) => {
        // extract numeric sales values for the chart
        this.totalSales = data.map((s: any) => s.totalSales);
        // extract product names for the chart labels
        this.labels = data.map((s: any) => s.product);

        console.log('totalSales', this.totalSales);
        console.log('product', this.products);

        // Trigger change detection
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching sales data:', err);
      }
    });
  }
}