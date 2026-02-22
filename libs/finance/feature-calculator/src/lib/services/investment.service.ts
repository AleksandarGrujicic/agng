import { Injectable } from '@angular/core';

export interface YearlyBreakdown {
  year: number;
  contributions: number;
  totalValue: number;
  gain: number;
}

export interface InvestmentResult {
  totalValue: number;
  totalContributions: number;
  totalGain: number;
  yearlyBreakdown: YearlyBreakdown[];
}

@Injectable({
  providedIn: 'root',
})
export class InvestmentService {
  /**
   * Calculate investment growth with monthly compounding
   * @param initialInvestment Initial lump sum
   * @param monthlyInvestment Monthly contribution
   * @param annualReturnRate Annual return rate (e.g., 0.085 for 8.5%)
   * @param months Total number of months
   */
  calculateInvestment(
    initialInvestment: number,
    monthlyInvestment: number,
    annualReturnRate: number,
    months: number
  ): InvestmentResult {
    const monthlyRate = annualReturnRate / 12;
    const yearlyBreakdown: YearlyBreakdown[] = [];

    let totalValue = initialInvestment;
    let totalContributions = initialInvestment;
    let monthCount = 0;

    // Calculate year by year
    const yearsCount = Math.ceil(months / 12);
    for (let year = 1; year <= yearsCount; year++) {
      const monthsInYear = Math.min(12, months - (year - 1) * 12);

      // Calculate for each month in this year
      for (let month = 0; month < monthsInYear; month++) {
        // Apply monthly return to current value
        totalValue = totalValue * (1 + monthlyRate);

        // Add monthly investment (if applicable)
        if (monthCount < months - 1 || month < monthsInYear - 1) {
          totalValue += monthlyInvestment;
          totalContributions += monthlyInvestment;
        }
      }

      monthCount += monthsInYear;

      // Store yearly breakdown
      const totalGain = totalValue - totalContributions;
      yearlyBreakdown.push({
        year,
        contributions: totalContributions,
        totalValue: Math.round(totalValue * 100) / 100,
        gain: Math.round(totalGain * 100) / 100,
      });
    }

    return {
      totalValue: Math.round(totalValue * 100) / 100,
      totalContributions: Math.round(totalContributions * 100) / 100,
      totalGain: Math.round((totalValue - totalContributions) * 100) / 100,
      yearlyBreakdown,
    };
  }
}
