import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HazardRecord } from '../models/hazard.model';

@Injectable({
  providedIn: 'root',
})
export class SmartsheetService {
  private sheetId = 'vMCgm37QGv8293MqMggmRhHxRjgQmw9WFWjCF9q1';
  private apiUrl = `https://api.smartsheet.com/2.0/sheets/${this.sheetId}`;
  private accessToken = process.env['SMARTSHEET_API_TOKEN'] || '';
  
  private hazardRecords$ = new BehaviorSubject<HazardRecord[]>([]);
  private lastUpdated$ = new BehaviorSubject<Date>(new Date());

  constructor(private http: HttpClient) {}

  getHazardRecords(): Observable<HazardRecord[]> {
    return this.hazardRecords$.asObservable();
  }

  getLastUpdated(): Observable<Date> {
    return this.lastUpdated$.asObservable();
  }

  fetchData(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
    });
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      tap((data) => {
        const records = this.parseSmartsheetData(data);
        this.hazardRecords$.next(records);
        this.lastUpdated$.next(new Date());
      })
    );
  }

  startAutoRefresh(): Observable<any> {
    // Fetch immediately
    this.fetchData().subscribe();
    
    // Then refresh every 1 hour (3,600,000 milliseconds)
    return interval(3600000).pipe(
      switchMap(() => this.fetchData())
    );
  }

  private parseSmartsheetData(data: any): HazardRecord[] {
    const records: HazardRecord[] = [];
    if (data.rows) {
      data.rows.forEach((row: any) => {
        const record: HazardRecord = {
          dateRaised: this.getCellValue(row, 'Date raised'),
          recordId: parseInt(this.getCellValue(row, 'Record ID')),
          concern: this.getCellValue(row, 'Concern / Hazard'),
          riskScore: parseInt(this.getCellValue(row, 'Risk score')),
          responsibleDept: this.getCellValue(row, 'Responsible DEPT'),
          dateOfSat: this.getCellValue(row, 'Date of SAT'),
          actions: this.getCellValue(row, 'Actions'),
          escalatedToSrb: this.getCellValue(row, 'Escalated to SRB'),
          status: this.getCellValue(row, 'Status'),
          daysOpen: parseInt(this.getCellValue(row, 'Days open')) || 0,
          hazardCompletion: this.getCellValue(row, 'Hazard completion'),
        };
        records.push(record);
      });
    }
    return records;
  }

  private getCellValue(row: any, columnName: string): string {
    const cell = row.cells?.find((c: any) => c.columnId);
    return cell?.displayValue || '';
  }
}
