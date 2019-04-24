import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  language: string;
  bdUK = {
    h: 15,
    w: 30,
  };
  bdSP = {
    h: 15,
    w: 30,
  };

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.language);
    this.selectLanguage('en');
  }

  selectLanguage( lang: string ) {
    this.language = lang;
    if ( lang === 'en') {
      this.bdUK.h = 20;
      this.bdUK.w = 35;
      this.bdSP.h = 10;
      this.bdSP.w = 25;
    } else if ( lang === 'es') {
      this.bdUK.h = 10;
      this.bdUK.w = 25;
      this.bdSP.h = 20;
      this.bdSP.w = 35;
    }
    this.translate.use(lang);
  }
}
