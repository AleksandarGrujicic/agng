import { Component, OnInit, OnDestroy, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subscription, startWith, switchMap, skip } from 'rxjs';
import {
  InvestmentService,
  InvestmentResult,
  YearlyBreakdown,
} from '../services/investment.service';
import { I18nService } from '@shared/ui/services/i18n.service';
import { ThemeService } from '@shared/ui/services/theme.service';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'lib-calculator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatExpansionModule,
    BaseChartDirective,
    TranslocoDirective,
  ],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export class CalculatorComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private investmentService = inject(InvestmentService);
  private i18n = inject(I18nService);
  private transloco = inject(TranslocoService);
  private theme = inject(ThemeService);
  private injector = inject(Injector);
  private langSub!: Subscription;
  private themeSub!: Subscription;

  form!: FormGroup;
  result: InvestmentResult | null = null;
  displayedColumns: string[] = ['year', 'contributions', 'totalValue', 'gain'];

  // Main calculator chart
  chartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'line'>['options'] = {};

  // Historical explainer chart
  historyChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  historyChartOptions: ChartConfiguration<'line'>['options'] = {};

  // MSCI World Index year-end closing values 1995–2026 (USD, price index; 2026 = YTD)
  private readonly SP500_PRICES = [
    1001, 1199, 1573, 1938, 2422,  // 1995–1999
    2077, 1749, 1328, 1663, 1886,  // 2000–2004
    2053, 2498, 2652, 1475, 1997,  // 2005–2009
    2316, 2054, 2427, 3082, 3232,  // 2010–2014
    3100, 3352, 4126, 3576, 4629,  // 2015–2019
    5147, 6897, 5193, 6691, 7954,  // 2020–2024
    8590, 8720,                     // 2025, 2026 (YTD)
  ];
  private readonly HISTORY_YEARS = Array.from({ length: 32 }, (_, i) => 1995 + i);

  ngOnInit(): void {
    this.initializeForm();
    this.calculate();
    // Rebuild chart after translation file is fully loaded for the new language
    this.langSub = this.transloco.langChanges$
      .pipe(
        startWith(this.transloco.getActiveLang()),
        switchMap((lang) => this.transloco.load(lang)),
      )
      .subscribe(() => {
        this.updateChart();
        this.buildHistoryChart();
      });

    // Rebuild chart when dark/light theme toggles (canvas can't use CSS vars directly)
    this.themeSub = toObservable(this.theme.isDark, { injector: this.injector })
      .pipe(skip(1))
      .subscribe(() => {
        this.updateChart();
        this.buildHistoryChart();
      });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
    this.themeSub?.unsubscribe();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      initialInvestment: [1000, [Validators.required, Validators.min(0)]],
      monthlyInvestment: [1000, [Validators.required, Validators.min(0)]],
      returnRate: [
        8.5,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      years: [25, [Validators.required, Validators.min(0)]],
    });

    // Subscribe to form changes to auto-calculate
    this.form.valueChanges.subscribe(() => this.calculate());
  }

  get yearlyData(): YearlyBreakdown[] {
    return this.result?.yearlyBreakdown || [];
  }

  get growthMultiplier(): string {
    if (!this.result || this.result.totalContributions <= 0) return '—';
    return (this.result.totalValue / this.result.totalContributions).toFixed(1);
  }
  buildHistoryChart(): void {
    const t = (key: string) => this.transloco.translate(key);
    const primary = this.getCssVar('--color-primary');

    this.historyChartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: t('calculator.howItWorks.chartTitle') },
        tooltip: {
          callbacks: {
            label: (ctx) => ` $${(ctx.raw as number).toLocaleString()}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: { callback: (v) => `$${(v as number).toLocaleString()}` },
        },
      },
    };

    this.historyChartData = {
      labels: this.HISTORY_YEARS.map(String),
      datasets: [
        {
          label: 'S&P 500',
          data: this.SP500_PRICES,
          borderColor: primary,
          backgroundColor: this.toAlpha(primary, 0.10),
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2,
          pointBackgroundColor: primary,
        },
      ],
    };
  }
  calculate(): void {
    if (this.form.invalid) return;

    const { initialInvestment, monthlyInvestment, returnRate, years } =
      this.form.value;
    const totalMonths = years * 12;

    if (totalMonths === 0) return;

    this.result = this.investmentService.calculateInvestment(
      initialInvestment,
      monthlyInvestment,
      returnRate / 100, // Convert percentage to decimal
      totalMonths,
    );

    this.updateChart();
  }

  updateChart(): void {
    if (!this.result) return;

    const t = (key: string, params?: Record<string, unknown>) =>
      this.transloco.translate(key, params);

    const labels = this.result.yearlyBreakdown.map((d) =>
      t('calculator.chart.yearLabel', { year: d.year }),
    );
    const contributionsData = this.result.yearlyBreakdown.map(
      (d) => Math.round(d.contributions * 100) / 100,
    );
    const totalValueData = this.result.yearlyBreakdown.map(
      (d) => Math.round(d.totalValue * 100) / 100,
    );

    // Capture reference for y-axis callback (closures can't use `this`)
    const fmt = (v: number) => this.formatCurrency(v);

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'top' },
        title: { display: true, text: t('calculator.chart.title') },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => fmt(value as number) },
        },
      },
    };

    this.chartData = {
      labels,
      datasets: [
        {
          label: t('calculator.results.totalValue'),
          data: totalValueData,
          borderColor: this.getCssVar('--color-primary'),
          backgroundColor: this.toAlpha(
            this.getCssVar('--color-primary'),
            0.12,
          ),
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: this.getCssVar('--color-primary'),
        },
        {
          label: t('calculator.results.totalContributions'),
          data: contributionsData,
          borderColor: this.getCssVar('--color-accent'),
          backgroundColor: this.toAlpha(this.getCssVar('--color-accent'), 0.12),
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: this.getCssVar('--color-accent'),
        },
      ],
    };
  }

  /** Read a CSS custom property value from the document root. */
  private getCssVar(name: string): string {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  }

  /**
   * Convert hsl(h, s%, l%) → hsla(h, s%, l%, alpha).
   * Falls back to the original string if the format is unrecognised.
   */
  private toAlpha(color: string, alpha: number): string {
    if (color.startsWith('hsl(')) {
      return color.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);
    }
    // If the browser normalised to rgb() form, wrap it
    if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
    }
    return color;
  }

  formatCurrency(value: number): string {
    const locale = this.i18n.currentLang() === 'sr' ? 'sr-Latn-RS' : 'en-GB';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
