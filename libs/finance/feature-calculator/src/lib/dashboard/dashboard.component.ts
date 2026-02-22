import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-card">
        <h2>Welcome to Investment App</h2>
        <p>Track and manage your investment portfolio with our advanced tools.</p>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">🧮</div>
            <h3>Investment Calculator</h3>
            <p>Calculate your investment growth with different scenarios and return rates.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Portfolio Analysis</h3>
            <p>Analyze your portfolio performance and get insights.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>Market Reports</h3>
            <p>Keep up with market trends and investment opportunities.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚙️</div>
            <h3>Customization</h3>
            <p>Customize your experience with personalized settings.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .welcome-card {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    h2 {
      margin: 0 0 16px 0;
      color: #333;
      font-size: 2rem;
    }

    > p {
      color: #666;
      font-size: 1.1rem;
      margin: 0 0 40px 0;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-top: 32px;
    }

    .feature-card {
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
    }

    .feature-icon {
      font-size: 3rem;
      margin-bottom: 12px;
    }

    .feature-card h3 {
      margin: 12px 0;
      font-size: 1.2rem;
    }

    .feature-card p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 20px;
      }

      .welcome-card {
        padding: 20px;
      }

      h2 {
        font-size: 1.5rem;
      }

      > p {
        font-size: 1rem;
      }

      .feature-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {}
