// Angular
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
// HightChart
import { StockChart } from 'angular-highcharts';
// Material
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
// Moment para Material Datepicker
import * as moment from 'moment';
import {Moment as _rollupMoment, Moment} from 'moment';
// Locals
import { WheatherService } from '../providers/wheather.service';
import { IQuestionModel } from '../models/question.model';
import { IWeatherModel } from '../models/wheater.model';
import { environment as env } from '../../environments/environment';
// Traductor
import { TranslateService } from '@ngx-translate/core';

// Constante para configurar el Datepicker de Material Angular
export const MY_FORMATS = {
  parse: { dateInput: 'MM/YYYY', },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})


export class WeatherComponent {
  // Constantes para cargar los Select.
  LOCATIONS = env.dataWea.locations;
  METRICS = env.dataWea.metrics;
  // Objeto para guardar los datos del formulario y la fecha mínima y máxima que nos entrega la API.
  question: IQuestionModel = {
    location: null,
    metric: null,
    dateSta: null,
    dateEnd: null,
    minDate: new Date(1910, 0, 1),
    maxDate: new Date(2017, 11, 1),
  };
  // Variables para el formulario.
  selectLocation: string;
  selectMetric: string;
  datepickerSta: FormControl;
  datepickerEnd: FormControl;
  // Guarda todos los datos de una location y una metric especifica.
  weathers: IWeatherModel[];
  // Weathers filtrados entre las fechas seleccionadas en los datepicker. Datos a mostrar en Chart.
  weatherShow: IWeatherModel[];
  // Variable para guardar el gráfico.
  chartWeather: StockChart;
  // Variable para mostrar el spiner mientras se crea el Chart.
  loading = true;
  // Variable para controlar el estado del Expansion Panel de material.
  statusExpansion = true;


  constructor( private wetServ: WheatherService, private translate: TranslateService) {
    // Iniciamos los Datepicker de Material Angular.
    this.datepickerSta = new FormControl(moment(this.question.minDate));
    this.datepickerEnd = new FormControl(moment(this.question.maxDate));

    // Comprobamos si hay datos de busqueda guardados en localStorage, si los hay, cargamos
    // la página con la última busqueda realizada.
    if ( localStorage.getItem('weatherAPI') !== null ) {
      this.question = this.wetServ.loadQuestion();
      this.selectLocation = this.question.location;
      this.selectMetric = this.question.metric;
      this.datepickerSta.setValue(moment(this.question.dateSta));
      this.datepickerEnd.setValue(moment(this.question.dateEnd));
      this.getWeathers( this.question.location, this.question.metric );
    }

  }

  // Trae todos los datos de la location y la metric solicitada. Además actualiza la mínina
  // fecha con datos y la máxima fecha (por si se actulizan los datos que manda la API).
  getWeathers(location: string, metric: string) {
    this.loading = true;
    this.wetServ.getWeathers( location, metric)
      .subscribe( wet => {
        this.weathers = wet;
        this.filterWeathers();
        this.loading = false;
        this.checkMinMaxDate();
      });
  }

  // Filtramos los datos que nos manda la API entre las fechas mostradas en el DatePicker.
  filterWeathers() {
    this.weatherShow = this.weathers.filter(r => (
      new Date(r.year, r.month - 1, 1) >= this.question.dateSta && new Date(r.year, r.month - 1, 1) <= this.question.dateEnd
    ));
    this.updateChart(this.weatherShow);
  }

  // Comprobamos si la MinDate y la MaxDate siguen siendo las mismas, o si actualizaron los
  // datos de la API y ahora tenemos más fechas.
  checkMinMaxDate() {
    this.weathers.map(r => {
      if (new Date(r.year, r.month - 1, 1) < this.question.minDate ) {
        this.question.minDate = new Date(r.year, r.month - 1, 1);
      }
      if (new Date (r.year, r.month - 1, 1) > this.question.maxDate ) {
        this.question.maxDate = new Date (r.year, r.month - 1, 1);
      }
    });
  }

  // Comprobamos que esta contestado todo el formulario y solicitamos a la API los nuevos datos.
  // Además guardamos el formulario en el localStorage para que la proxima vez que cargue la pagina, aparezca la última busqueda realizada.
  updateQuestionForm() {
    if ( this.selectLocation && this.selectMetric && this.question.dateSta && this.question.dateEnd ) {
      this.getWeathers(this.selectLocation, this.selectMetric);
      this.question.location = this.selectLocation;
      this.question.metric = this.selectMetric;
      this.wetServ.saveQuestion(this.question);
    }
  }

  // Comprobamos que esta contestado todo el formulario y filtramos por fechas los datos que ya tenemos.
  // Además guardamos el formulario en el localStorage para que la proxima vez que cargue la pagina, aparezca la última busqueda realizada.
  updateQuestionDate () {
    if ( this.selectLocation && this.selectMetric && this.question.dateSta && this.question.dateEnd ) {
      this.question.dateSta = new Date(this.datepickerSta.value._d.getFullYear(), this.datepickerSta.value._d.getMonth(), 1);
      this.question.dateEnd = new Date(this.datepickerEnd.value._d.getFullYear(), this.datepickerEnd.value._d.getMonth(), 1);
      if (this.question.dateSta <= this.question.dateEnd) {
        this.filterWeathers();
        this.wetServ.saveQuestion(this.question);
      } else {
        this.datepickerEnd = new FormControl(moment(this.question.maxDate));
      }
    }
  }

  // Borra la question del localStorage y reinicia el formulario de busqueda.
  reloadQuestion() {
    this.wetServ.deleteQuestion();
    this.selectLocation = '';
    this.selectMetric = '';
    this.datepickerSta.setValue(moment(this.question.minDate));
    this.datepickerEnd.setValue(moment(this.question.maxDate));
    this.question.dateSta = null;
    this.question.dateEnd = null;
  }

  // Actualizamos los datos mostrados en el Chart.
  updateChart(weathers: IWeatherModel[]) {
    const DATOS = weathers.map( (dato) => {
      return [ (new Date(dato.year, dato.month - 1, 1)).getTime(), dato.value];
    });
    this.chartWeather = new StockChart( <any> {
      rangeSelector: {
        inputEnabled: false,
        selected: 5
      },
      credits: {
        enabled: false
      },
      title: {
        text: ''
      },
      series: [{
        tooltip: {
          valueDecimals: 2
        },
        name: this.selectMetric,
        data: DATOS
      }]
    });
    this.statusExpansion = false;
  }


// --------------------------------------------------------------------------------------------------------
// --------------------------------------- Funciones para los DATEPICKER ----------------------------------
// --------------------------------------------------------------------------------------------------------
  chosenYearHandler( normalizedYear: Moment, dateForm: FormControl) {
    const ctrlValue = dateForm.value;
    ctrlValue.year(normalizedYear.year());
    dateForm.setValue(ctrlValue);
  }
  chosenMonthHandler(normlizedMonth: Moment, datepicker: MatDatepicker<Moment>, dateForm: FormControl) {
    const ctrlValue = dateForm.value;
    ctrlValue.month(normlizedMonth.month());
    dateForm.setValue(ctrlValue);
    datepicker.close();
    this.updateQuestionDate();
  }
}
