import { RouterModule, Routes } from '@angular/router';
import { WeatherComponent } from './weather/weather.component';


const APP_ROUTES: Routes = [
  { path: '', component: WeatherComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash: true } );
