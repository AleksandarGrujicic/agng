import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly titleService = inject(Title);
  private readonly transloco = inject(TranslocoService);

  ngOnInit(): void {
    this.transloco.selectTranslate('header.title').subscribe(title => {
      this.titleService.setTitle(title);
    });
  }
}

