import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { CityMasterService } from "./services/citymaster.service";
import { CityMaster } from "./models/citymaster.model";
import { map } from "rxjs/operators";
import * as XLSX from "xlsx";
@Component({
  selector: "app-citymaster-form",
  templateUrl: "./citymaster-form.component.html",
})
export class CitymasterFormComponent implements OnInit {
  // Define properties
  citymasterForm: FormGroup;
  uploadcitymasterForm!: FormGroup;
  isEditMode: boolean = false;
  citymasterId: number | null = null;
  steps: any[] = []; // Add this line to define 'steps' property
  messages: any[] = [];
  currentStep: number = 0;
  operationSuccessful: boolean = false;
  createdOrEditedCitymaster: CityMaster | null = null;
  errorMessage: string = "";
  stateOptions: any[] = [];
  districtOptions: any[] = [];
  talukaOptions: any[] = [];
  postnameOptions: any[] = [];
  pincodeOptions: any[] = [];
  selectedState: string = "";
  showDropdown: boolean = false;
  selectedDistrict: string = "";
  selectedTaluka: string = "";
  selectedPostName: string = "";
  selectedPincode: string = ""; //

  // Define constructor
  constructor(
    private fb: FormBuilder,
    private citymasterService: CityMasterService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    // Initialize form
    this.citymasterForm = this.fb.group({
      CityNameEng: ["", Validators.required],
      CityNameMar: ["", Validators.required],
      CityNameGmap: ["", Validators.required],
      Country: ["", Validators.required],
      District: ["", Validators.required],
      Taluka: ["", Validators.required],
      Pincode: ["", Validators.required],
      State: ["", Validators.required],

      Latitude: ["", Validators.required],
      Longitude: ["", Validators.required],
      Zone: ["", Validators.required],
      RouteNo: ["", Validators.required],
      RouteSequens: ["", Validators.required],

      DelDepot: ["", Validators.required],
      Tat: ["", Validators.required],
      ODA: ["", Validators.required],

      NearStateHighway: ["", Validators.required],
      NearestNationalHighway: ["", Validators.required],

      AddUser: ["", Validators.required],
    });
    this.steps = [
      { label: "City Mater Form" },
      { label: "City Master Details" },
    ];
  }

  // Define ngOnInit method
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.isEditMode = true;
        this.citymasterId = params["id"];
        if (this.citymasterId !== null) {
          this.loadCitymasterData(this.citymasterId);
        }
      }
    });
    this.citymasterForm
      .get("CityNameEng")
      ?.valueChanges.subscribe((value: string) => {
        // Translate the value from English to Marathi
        this.translateCityName(value);
      });
  }

  // Function to translate city name from English to Marathi using Google Translate API
  translateCityName(cityNameEng: string): void {
    // Construct the URL for Google Translate API
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=mr&dt=t&q=${encodeURIComponent(
      cityNameEng
    )}`;

    // Make a GET request to the Google Translate API
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Extract the translated city name from the response
        const translatedCityName = data[0][0][0];
        // Update the CityNameMar field with the translated value
        this.citymasterForm.get("CityNameMar")?.setValue(translatedCityName);
      });
  }

  validateLatitude(event: any) {
    const latitudeInput = event.target.value;
    const latitudeValidationMessage = document.getElementById(
      "latitudeValidationMessage"
    );

    if (latitudeValidationMessage) {
      // Check if element exists
      if (
        isNaN(latitudeInput) ||
        parseFloat(latitudeInput) < -90 ||
        parseFloat(latitudeInput) > 90
      ) {
        latitudeValidationMessage.classList.remove("hidden");
      } else {
        latitudeValidationMessage.classList.add("hidden");
      }
    }
  }

  validateLongitude(event: any) {
    const longitudeInput = event.target.value;
    const longitudeValidationMessage = document.getElementById(
      "longitudeValidationMessage"
    );

    if (longitudeValidationMessage) {
      // Check if element exists
      if (
        isNaN(longitudeInput) ||
        parseFloat(longitudeInput) < -180 ||
        parseFloat(longitudeInput) > 180
      ) {
        longitudeValidationMessage.classList.remove("hidden");
      } else {
        longitudeValidationMessage.classList.add("hidden");
      }
    }
  }

  onCountryChange(event: any) {
    this.citymasterService.getStates().subscribe(
      (response: any) => {
        console.log("Received states:", response); // Log the received data

        // Check if response is an object with a 'states' property
        if (
          typeof response === "object" &&
          response !== null &&
          Array.isArray(response.states)
        ) {
          // Use the 'states' property for stateOptions
          this.stateOptions = response.states.map((state: string) => ({
            label: state,
            value: state,
          }));
        } else {
          console.error(
            'Invalid response format. Expected an array with a "states" property.'
          );
          this.handleError("Invalid response format");
          this.stateOptions = []; // Reset to an empty array or handle it as per your requirements
        }
      },
      (error) => {
        console.error("Error fetching states:", error); // Log the error
        this.handleError(error);
        this.stateOptions = []; // Make sure to reset it in case of an error
      }
    );
  }

  onStateChange(event: any) {
    // Get the selected state
    const selectedState = event.value;

    // Make a request to fetch districts based on the selected state
    this.citymasterService.getDistricts(selectedState).subscribe(
      (response: any) => {
        console.log("Received districts:", response);

        // Check if response.districts is an array
        if (Array.isArray(response.districts)) {
          this.districtOptions = response.districts.map((district: string) => ({
            label: district,
            value: district,
          }));
        } else {
          console.error(
            "Invalid response format for districts. Expected an array."
          );
          this.handleError("Invalid response format for districts");
          this.districtOptions = [];
        }
      },
      (error) => {
        console.error("Error fetching districts:", error);
        this.handleError(error);
        this.districtOptions = [];
      }
    );
  }

  onDistrictChange(event: any) {
    const selectedDistrict = event.value;

    // Fetch Talukas based on the selected District
    this.citymasterService.getTalukas(selectedDistrict).subscribe(
      (response: any) => {
        console.log("Received talukas:", response);

        // Check if response.talukas is an array
        if (Array.isArray(response.talukas)) {
          this.talukaOptions = response.talukas.map((taluka: string) => ({
            label: taluka,
            value: taluka,
          }));
        } else {
          console.error(
            "Invalid response format for talukas. Expected an array."
          );
          this.handleError("Invalid response format for talukas");
          this.talukaOptions = [];
        }
      },
      (error) => {
        console.error("Error fetching talukas:", error);
        this.handleError(error);
        this.talukaOptions = [];
      }
    );
  }

  onTalukaChange(event: any) {
    const selectedTaluka = event.value;

    // Fetch postnames based on the selected Taluka
    this.citymasterService.getPostnames(selectedTaluka).subscribe(
      (response: any) => {
        console.log("Received postnames:", response);

        // Check if response.postnames is an array
        if (Array.isArray(response.postnames)) {
          this.postnameOptions = response.postnames.map((postname: string) => ({
            label: postname,
            value: postname,
          }));
        } else {
          console.error(
            "Invalid response format for postnames. Expected an array."
          );
          this.handleError("Invalid response format for postnames");
          this.postnameOptions = [];
        }
      },
      (error) => {
        console.error("Error fetching postnames:", error);
        this.handleError(error);
        this.postnameOptions = [];
      }
    );
  }

  onPostnameChange(event: any): void {
    const selectedPostname = event.value;

    // Fetch pincodes based on the selected Postname
    this.citymasterService.getPincodes(selectedPostname).subscribe(
      (response: any) => {
        if (Array.isArray(response.pincodes)) {
          this.pincodeOptions = response.pincodes.map((pincode: string) => ({
            label: pincode,
            value: pincode,
          }));
        } else {
          console.error(
            "Invalid response format for pincodes. Expected an array."
          );
          this.handleError("Invalid response format for pincodes");
          this.pincodeOptions = [];
        }
      },
      (error) => {
        console.error("Error fetching pincodes:", error);
        this.handleError(error);
        this.pincodeOptions = [];
      }
    );
  }

  // Define statusOptions and stateOptions
  countryOptions = [
    // { label: "NONE", value: null },
    { label: "India", value: "India" },
    // { label: "Nepal", value: "Nepal" },
  ];

  statusOptions = [
    // { label: "NONE", value: null },
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "ACTIVE", value: "ACTIVE" },
    { label: "DEACTIVATED", value: "DEACTIVATED" },
  ];

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const uppercaseValue = inputValue.toUpperCase();
    this.citymasterForm.get("CityNameEng")?.setValue(uppercaseValue);
  }

  ODAOptions = [
    // { label: "NONE", value: null },
    // { label: "REGISTERED", value: "REGISTERED" },
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];

  showStateDropdown() {
    // Toggle the visibility of the dropdown
    this.showDropdown = !this.showDropdown;
  }

  selectState(option: any) {
    // Set the selected state and hide the dropdown
    this.selectedState = option.value;
    this.showDropdown = false;
  }

  fetchStates() {
    this.citymasterService.getStates().subscribe(
      (response: any) => {
        console.log("Received State:", response);
        // Update stateOptions with the new values
        this.stateOptions = response.states.map((state: string) => ({
          label: state,
          value: state,
        }));
      },
      (error) => {
        // Handle error if needed
        console.error("Error fetching states:", error);
      }
    );
  }                                                                      

  // private fetchDistricts(selectedState: string): void {
  //   // Implement the logic to fetch districts based on the selected state
  //   // Update the 'districtOptions' array with the fetched district data
  //   // For example:
  //   this.citymasterService.getDistricts(selectedState).subscribe(
  //     (response: any) => {
  //       console.log("Received District:", response);
  //       this.districtOptions = response.districts.map((district: string) => ({
  //         label: district,
  //         value: district,
  //       }));

  //       // Update the form control value with the first district (you can modify this based on your logic)
  //       const districtControl = this.citymasterForm.get("District");
  //       if (districtControl && this.districtOptions.length > 0) {
  //         districtControl.setValue(this.districtOptions[0].value);
  //       }
  //     },
  //     (error) => this.handleError(error)
  //   );
  // }

  private fetchDistricts(selectedState: string): void {
    this.citymasterService.getDistricts(selectedState).subscribe(
      (response: any) => {
        console.log("Received District:", response);
        this.districtOptions = response.districts.map((district: string) => ({
          label: district,
          value: district,
        }));

        // Update the form control value with the selected district if it's available
        const districtControl = this.citymasterForm.get("District");
        if (districtControl) {
          districtControl.setValue(this.selectedDistrict);
        }
      },
      (error) => this.handleError(error)
    );
  }

  private fetchTalukas(selectedDistrict: string): void {
    this.citymasterService.getTalukas(selectedDistrict).subscribe(
      (response: any) => {
        console.log("Received talukas:", response);

        if (Array.isArray(response.talukas)) {
          this.talukaOptions = response.talukas.map((taluka: string) => ({
            label: taluka,
            value: taluka,
          }));
          const talukaControl = this.citymasterForm.get("Taluka");
          if (talukaControl) {
            talukaControl.setValue(this.selectedTaluka);
          }
        } else {
          console.error(
            "Invalid response format for talukas. Expected an array."
          );
          this.handleError("Invalid response format for talukas");
          this.talukaOptions = [];
        }
      },
      (error) => {
        console.error("Error fetching talukas:", error);
        this.handleError(error);
        this.talukaOptions = [];
      }
    );
  }

  // private fetchPostname(selectedTaluka: string): void {
  //   this.citymasterService.getPostnames(selectedTaluka).subscribe(
  //     (response: any) => {
  //       console.log("Received Postname:", response);

  //       if (Array.isArray(response.postnames)) {
  //         this.postnameOptions = response.postnames.map((postname: string) => ({
  //           label: postname,
  //           value: postname,
  //         }));
  //         const PostnameControl = this.citymasterForm.get("Postname");
  //         if (PostnameControl) {
  //           PostnameControl.setValue(this.selectedPostName);
  //         }
  //       } else {
  //         console.error(
  //           "Invalid response format for postnames. Expected an array."
  //         );
  //         this.handleError("Invalid response format for postnames");
  //         this.postnameOptions = [];
  //       }
  //     },
  //     (error) => {
  //       console.error("Error fetching postnames:", error);
  //       this.handleError(error);
  //       this.postnameOptions = [];
  //     }
  //   );
  // }

  // private fetchPincodes(selectedPostname: string): void {
  //   this.citymasterService.getPincodes(selectedPostname).subscribe(
  //     (response: any) => {
  //       console.log("Received pincodes:", response);

  //       if (Array.isArray(response.pincodes)) {
  //         this.pincodeOptions = response.pincodes.map((pincode: string) => ({
  //           label: pincode,
  //           value: pincode,
  //         }));
  //         const pincodeControl = this.citymasterForm.get("Pincode");
  //         if (pincodeControl) {
  //           pincodeControl.setValue(this.selectedPincode);
  //         }
  //       } else {
  //         console.error(
  //           "Invalid response format for pincodes. Expected an array."
  //         );
  //         this.handleError("Invalid response format for pincodes");
  //         this.pincodeOptions = [];
  //       }
  //     },
  //     (error) => {
  //       console.error("Error fetching pincodes:", error);
  //       this.handleError(error);
  //       this.pincodeOptions = [];
  //     }
  //   );
  // }

  // Define loadCitymasterData method
  private loadCitymasterData(id: number): void {
    this.citymasterService.getCityMasterById(id).subscribe(
      (citymaster) => {
        this.citymasterForm.patchValue(citymaster);

        console.log(this.citymasterForm);
        if (this.citymasterForm) {
          const stateControl = this.citymasterForm.get("State");
          const districtControl = this.citymasterForm.get("District");
          const talukaControl = this.citymasterForm.get("Taluka");
          const PincodeControl = this.citymasterForm.get("Pincode");

          if (
            stateControl &&
            districtControl &&
            talukaControl &&
            PincodeControl
          ) {
            stateControl.setValue(citymaster.State);
            this.selectedState = citymaster.State;

            // Fetch the states after loading citymaster data
            this.fetchStates();

            // Fetch the districts based on the selected state
            this.fetchDistricts(citymaster.State);

            // Fetch the talukas based on the selected district
            this.fetchTalukas(citymaster.District);
          }
        }
        console.log(citymaster);
      },
      (error) => this.handleError(error)
    );
  }

  mapRowToContractData(row: any): CityMaster {
    return {
      id: row.id,
      CityNameEng: row.CityNameEng,
      CityNameGmap: row.CityNameGmap,
      Taluka: row.Taluka,
      District: row.District,
      DistrictMar: row.DistrictMar,
      Pincode: row.Pincode,
      Country: row.Country,
      State: row.State,
      CityNameMar: row.CityNameMar,
      Latitude: row.Latitude,
      Longitude: row.Longitude,
      Zone: row.Zone,
      RouteNo: row.RouteNo,
      RouteSequens: row.RouteSequens,
      DelDepot: row.DelDepot,
      Tat: row.Tat,
      ODA: row.ODA,
      NearStateHighway: row.NearStateHighway,
      NearestNationalHighway: row.NearestNationalHighway,
      status: row.status,
      AddUser: row.AddUser,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  uploadFile(fileInput: HTMLInputElement) {
    const fileList: FileList | null = fileInput.files;

    if (!fileList || fileList.length === 0) {
      console.error("Files not found.");
      return;
    }

    const file: File = fileList[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      if (!jsonData || jsonData.length === 0) {
        console.error("No data found in the Excel file.");
        return;
      }

      console.log("Data from Excel:", jsonData);

      const citymasters: CityMaster[] = [];

      if (Array.isArray(jsonData)) {
        jsonData.forEach((row: any) => {
          const contractData: CityMaster = this.mapRowToContractData(row);
          citymasters.push(contractData);
        });
      }

      console.log("Data to send to server:", citymasters);
      this.citymasterService.createCityMaster(citymasters).subscribe(
        (response) => {
          console.log("Data successfully sent to the server:", response);
          // Show success alert using handleSuccess method
          this.handleSuccess("City Insert successfully", response);
          this.router.navigate([`/md/citymasters/`]);
        },
        (error) => {
          this.handleError(error);
          console.error("Error while sending data to the server:", error);
          // Check if the error response contains the duplicate city name
          if (error.error && error.error.message) {
            const errorMessage = error.error.message;
            const match = errorMessage.match(/duplicate entry '(.+)' for key/);
            if (match && match.length > 1) {
              const duplicateCityName = match[1];
              alert(`City with name ${duplicateCityName} already exists.`);
            } else {
              // Handle other errors if needed
              console.error("Error:", error);
            }
          } else {
            // Handle other errors if needed
            console.error("Error:", error);
          }
        }
      );
    };

    reader.readAsArrayBuffer(file);
  }

  onSubmit(): void {
    if (this.citymasterForm.valid) {
      const citymasterData = this.citymasterForm.value;

      // Restructure the citymasterData object to match the expected structure
      const structuredData = {
        data: [citymasterData], // Assuming you're sending an array with a single object
      };

      // Assuming you have defined this.isEditMode and this.citymasterId elsewhere
      if (this.isEditMode && this.citymasterId) {
        this.citymasterService
          .updateCityMaster(this.citymasterId, structuredData.data[0]) // Assuming updateCityMaster expects a single CityMaster object
          .subscribe(
            (citymaster) => {
              console.log("Citymaster updated successfully:", citymaster);

              this.handleSuccess("Citymaster updated successfully", citymaster);
            },
            (error) => {
              console.error("Error updating citymaster:", error);
              this.handleError(error);
            }
          );
      } else {
        this.citymasterService.createCityMaster(structuredData.data).subscribe(
          (citymasters) => {
            // Assuming createCityMaster returns an array of CityMaster objects
            console.log("Citymasters created successfully:", citymasters);
            //this.router.navigate([`/md/citymasters/`]);
            this.handleSuccess("Citymasters created successfully", citymasters);
          },
          (error) => {
            console.error("Error creating citymasters:", error);
            this.handleError(error);
          }
        );
      }
    }
  }

  headers = [
    "CityNameEng",
    "Taluka",
    "District",
    "Pincode",
    "Country",
    "State",
    "CityNameMar",
    "CityNameGmap",
    "Latitude",
    "Longitude",
    "Zone",
    "RouteNo",
    "RouteSequens",

    "DelDepot",
    "Tat",
    "ODA",
    "NearStateHighway",
    "NearestNationalHighway",
    "status",
    "AddUser",
  ];

  downloadExcelFormat() {
    // Define the column headers
    const headers = [
      "CityNameEng",
      "Taluka",
      "District",
      "Pincode",
      "Country",
      "State",
      "CityNameMar",
      "CityNameGmap",
      "Latitude",
      "Longitude",
      "Zone",
      "RouteNo",
      "RouteSequens",
      "DelDepot",
      "Tat",
      "ODA",
      "NearStateHighway",
      "NearestNationalHighway",
      "status",
      "AddUser",
    ];

    // Create a dummy data array representing Excel content
    const data: any[] = [
      headers, // Add headers as the first row
      [],
      // Replace "Value 1", "Value 2", etc., with your actual data
    ];

    // Convert data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    // Create workbook and add the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save the workbook as Excel file
    XLSX.writeFile(wb, "citymaster_template.xlsx");
  }

  // Define handleSuccess method
  private handleSuccess(message: string, citymaster: CityMaster | null): void {
    this.messages = [
      { severity: "success", summary: "Success", detail: message },
    ];
    this.createdOrEditedCitymaster = citymaster;
    this.operationSuccessful = true;
    this.currentStep = 1;
  }

  // Define handleError method
  private handleError(error: any): void {
    this.errorMessage = "An error occurred";
    this.messages = [
      { severity: "error", summary: "Error", detail: this.errorMessage },
    ];
    this.operationSuccessful = false;
    this.currentStep = 1;
    console.error("An error occurred:", error);
  }

  resetFormAndNavigateBack(): void {
    this.citymasterForm.reset();
    this.router.navigate(["/md/citymasters"]);
  }

  // Define cancel method
  cancel(): void {
    this.citymasterForm.reset();
    this.router.navigate(["/md/citymasters"]);
  }
}
