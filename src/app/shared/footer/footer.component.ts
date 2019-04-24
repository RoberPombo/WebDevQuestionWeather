import { Component } from '@angular/core';
import { WheatherService } from '../../providers/wheather.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent {

  constructor(private wetServ: WheatherService,
          private router: Router) {}

  goToGithub() {
    window.open('https://github.com/Alukard666/DevWebQuestionWeather', '_blank');
  }

}
