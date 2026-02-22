import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoDirective } from '@jsverse/transloco';
import { ThemeService } from '../../services/theme.service';
import { I18nService } from '../../services/i18n.service';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, TranslocoDirective, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() sidebarOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  readonly theme = inject(ThemeService);
  readonly i18n  = inject(I18nService);

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}
