// Angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Locals
import { environment as env } from '../../environments/environment';
import { IWeatherModel } from '../models/wheater.model';
import { IQuestionModel } from '../models/question.model';



@Injectable({
  providedIn: 'root'
})
export class WheatherService {

  private urlApi = env.urlApi;

  constructor( private _http: HttpClient ) { }

  // Trae todos los valores de una location y una metric definida.
  getWeathers ( location: string, metric: string ): Observable<IWeatherModel[]> {
    const URL = `${this.urlApi}${metric}-${location}.json`;
    return this._http.get<IWeatherModel[]>(URL);
  }

  // Carga del local Storage la última consulta realizada.
  loadQuestion() {
    const QUESTION: IQuestionModel = JSON.parse(localStorage.getItem('weatherAPI'));
    QUESTION.dateSta = new Date(QUESTION.dateSta);
    QUESTION.dateSta.setDate(QUESTION.dateSta.getDate());
    QUESTION.dateEnd = new Date(QUESTION.dateEnd);
    QUESTION.dateEnd.setDate(QUESTION.dateEnd.getDate());
    QUESTION.minDate = new Date(QUESTION.minDate);
    QUESTION.minDate.setDate(QUESTION.minDate.getDate());
    QUESTION.maxDate = new Date(QUESTION.maxDate);
    QUESTION.maxDate.setDate(QUESTION.maxDate.getDate());
    return QUESTION;
  }

  // Guarda la consulta en el local Storage.
  saveQuestion(question: IQuestionModel) {
    localStorage.setItem('weatherAPI', JSON.stringify(question));
  }

  // Borrar localStorage
  deleteQuestion() {
    localStorage.removeItem('weatherAPI');
  }

}
