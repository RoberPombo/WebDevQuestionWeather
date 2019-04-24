// Angular
import { NgModule } from '@angular/core';
// Material Angular
import {
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatExpansionModule
} from '@angular/material';

const modules = [
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatExpansionModule
];

@NgModule({
    imports: modules,
    exports: modules
   })

export class MaterialModule {}
