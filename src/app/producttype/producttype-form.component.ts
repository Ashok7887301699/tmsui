import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductTypeService } from "./services/producttype.service";
import { MessageService } from "primeng/api";
import { ProductType } from "./models/producttype.model";

@Component({
  selector: "app-producttype-form",
  templateUrl: "./producttype-form.component.html",
})
export class ProducttypeFormComponent implements OnInit {
  cancel() {
    this.router.navigate(["/md/producttype"]);
  }
  producttypeForm: FormGroup;
  isEditMode: boolean = false;
  producttypeId: number | null = null;
  steps: any[]; // Define the steps for the stepper
  messages: any[] = []; // Define messages array
  currentStep: number = 0; // Track the current step
  operationSuccessful: boolean = false; // Flag to track operation success
  createdOrEditedProductType: ProductType | null = null; // Store the Product type data after successful operation
  errorMessage: string = ""; // Store error message

  constructor(
    private fb: FormBuilder,
    private producttypeService: ProductTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    this.producttypeForm = this.fb.group({
      product_type: ["", Validators.required],
      status: ["", Validators.required],
    });
    // Initialize the steps
    this.steps = [
      { label: "Product Type Form" },
      { label: "Product Type Details" },
    ];
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.producttypeId = params["id"];
        if (this.producttypeId !== null) {
          this.loadProductTypeData(this.producttypeId);
        }
      }
    });
  }
  // Dropdown options
  statusOptions = [
    // { label: "NONE", value: null }, // Allows deselection by setting the value to null
    { label: "ACTIVE", value: "ACTIVE" },
    // { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  private loadProductTypeData(id: number): void {
    this.producttypeService.getProductTypeById(id).subscribe(
      (producttype: ProductType) =>
        this.producttypeForm.patchValue(producttype),
      (error) => this.handleError(error)
    );
  }

  onSubmit(): void {
    if (this.producttypeForm.valid) {
      const packagetypeData = this.producttypeForm.value;

      if (this.isEditMode && this.producttypeId) {
        this.producttypeService.updateProductType(this.producttypeId, packagetypeData).subscribe(
          (producttype) => this.handleSuccess("ProductType updated successfully", producttype),
          (error) =>{
            if (error.status === 422 && error.error.errors) {
              const errorMessage = this.extractErrorMessage(error.error.errors);
              this.showError(errorMessage);
            } else {
              this.handleError(error);
            }
          }
        );
      } else {
        this.producttypeService.createProductType(packagetypeData).subscribe(
          (producttype) => this.handleSuccess("ProductType created successfully", producttype),
          (error) => {
            if (error.status === 422 && error.error.errors) {
              const errorMessage = this.extractErrorMessage(error.error.errors);
              this.showError(errorMessage);
            } else {
              this.handleError(error);
            }
          }
        );
      }
    }
  }


  
  extractErrorMessage(errors: any): string {
    let errorMessage = '';
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        errorMessage += `${errors[key][0]}\n`;
      }
    }
    return errorMessage;
  }

  
  showSuccess(message: string) {
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: message,
    });
  }

  showError(message: string) {
    this.messageService.add({
      severity: "warn",
      summary: "Warning",
      detail: message,
    });
  }

  private handleSuccess(message: string, producttype: ProductType): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedProductType = producttype;
    this.operationSuccessful = true;
    this.currentStep = 1; // Move to step 2 to show producttype details
  }

  private handleError(error: any): void {
    this.errorMessage = "An error occurred";
    this.messages = [
      { severity: "error", summary: "Error", detail: this.errorMessage },
    ];
    this.operationSuccessful = false;
    this.currentStep = 1; // Move to step 2 to show error message
    console.error("An error occurred:", error);
  }
  // Navigate back to the producttype list
  resetFormAndNavigateBack(): void {
    this.producttypeForm.reset();
    this.router.navigate(["/md/producttype"]);
  }
}
