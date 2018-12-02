import { Injectable } from '@angular/core';
import { Movie } from './movie';
import { Http, Response } from '@angular/http';

@Injectable()
export class MovieService {
  private moviesUrl = '/api/movies'
  private watchedUrl = '/api/watched'

  constructor(private http: Http) {}

  getMovies(): Promise<void | Movie[]>{
    return this.http.get(this.moviesUrl)
               .toPromise()
               .then(response => response.json() as Movie[])
               .catch(this.handleError);
  }

  getWatched(): Promise<void | Movie[]>{
    return this.http.get(this.moviesUrl)
               .toPromise()
               .then(response => response.json() as Movie[])
               .catch(this.handleError);
  }

  createWatched(newWatched: Movie): Promise<void | Movie>{
    return this.http.post(this.moviesUrl, newWatched)
               .toPromise()
               .then(response => response.json() as Movie)
               .catch(this.handleError);
  }

  private handleError (error: any){
    let err = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(err);
  }

}
