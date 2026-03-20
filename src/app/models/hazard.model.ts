export interface HazardRecord {
  dateRaised: string;
  recordId: number;
  concern: string;
  riskScore: number;
  responsibleDept: string;
  dateOfSat: string;
  actions: string;
  escalatedToSrb: string;
  status: string;
  daysOpen: number;
  hazardCompletion: string;
}