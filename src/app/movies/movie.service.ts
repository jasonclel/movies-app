import { Injectable } from '@angular/core';
import { Movie } from './movie';
import { Http, Response } from '@angular/http';

@Injectable()
export class MovieService {
  private moviesUrl = '/api/movies'
  private watchedUrl = '/api/watched'

  constructor(private http: Http) {}

  //pulls the movies from the provided API
  getMovies(): Promise<void | Movie[]>{
    return this.http.get(this.moviesUrl)
               .toPromise()
               .then(response => response.json() as Movie[])
               .catch(this.handleError);
  }

  //pulls the movies from the database
  getWatched(): Promise<void | Movie[]>{
    return this.http.get(this.watchedUrl)
               .toPromise()
               .then(response => response.json() as Movie[])
               .catch(this.handleError);
  }

  //adds a new movie to the database
  createWatched(newWatched: Movie): Promise<void | Movie>{
    return this.http.post(this.watchedUrl, newWatched)
               .toPromise()
               .then(response => response.json() as Movie)
               .catch(this.handleError);
  }

  //handles any errors generated by the http calls
  private handleError (error: any){
    let err = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(err);
  }

}
