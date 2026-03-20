import { Component, OnInit, OnDestroy } from '@angular/core';
import { SmartsheetService } from '../../services/smartsheet.service';
import { HazardRecord } from '../../models/hazard.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  hazardRecords: HazardRecord[] = [];
  filteredRecords: HazardRecord[] = [];
  lastUpdated: Date = new Date();
  private destroy$ = new Subject<void>();

  // Filter properties
  riskScoreFilter: number | null = null;
  departmentFilter: string = '';
  daysOpenFilter: number | null = null;

  // Available filter options
  uniqueDepartments: string[] = [];
  uniqueRiskScores: number[] = [];

  constructor(private smartsheetService: SmartsheetService) {}

  ngOnInit(): void {
    // Subscribe to hazard records
    this.smartsheetService
      .getHazardRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe((records) => {
        this.hazardRecords = records;
        this.applyFilters();
        this.populateFilterOptions();
      });

    // Subscribe to last updated time
    this.smartsheetService
      .getLastUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((date) => {
        this.lastUpdated = date;
      });

    // Start auto-refresh (every 1 hour)
    this.smartsheetService.startAutoRefresh().pipe(takeUntil(this.destroy$)).subscribe();
  }

  applyFilters(): void {
    this.filteredRecords = this.hazardRecords.filter((record) => {
      const matchRiskScore =
        this.riskScoreFilter === null || record.riskScore === this.riskScoreFilter;
      const matchDepartment =
        this.departmentFilter === '' || record.responsibleDept === this.departmentFilter;
      const matchDaysOpen =
        this.daysOpenFilter === null || record.daysOpen === this.daysOpenFilter;

      return matchRiskScore && matchDepartment && matchDaysOpen;
    });
  }

  private populateFilterOptions(): void {
    this.uniqueDepartments = [...new Set(this.hazardRecords.map((r) => r.responsibleDept))]
      .filter((dept) => dept)
      .sort();
    this.uniqueRiskScores = [...new Set(this.hazardRecords.map((r) => r.riskScore))]
      .filter((score) => score)
      .sort((a, b) => a - b);
  }

  getRiskScoreColor(riskScore: number): string {
    if (riskScore >= 21) return '#FF5252'; // Red
    if (riskScore >= 14) return '#FFB300'; // Orange
    if (riskScore >= 7) return '#FFEB3B'; // Yellow
    return '#4CAF50'; // Green
  }

  clearFilters(): void {
    this.riskScoreFilter = null;
    this.departmentFilter = '';
    this.daysOpenFilter = null;
    this.applyFilters();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}