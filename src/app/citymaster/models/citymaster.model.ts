export interface CityMaster {
  id: number;
  CityNameEng: string;
  CityNameGmap: string;

  Taluka: string;
  District: string;
  DistrictMar: string;
  Pincode: string;
  Country: string;
  State: string;
  CityNameMar: string;
  Latitude: string;
  Longitude: string;
  Zone: string;
  RouteNo: string;
  RouteSequens: string;
  DelDepot: string;
  Tat: string;
  ODA: string;

  NearStateHighway: string;
  NearestNationalHighway: string;
  status: string;
  AddUser: string;
  created_at: Date | null;
  updated_at: Date | null;
}
