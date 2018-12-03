import { Component, OnInit, Inject } from '@angular/core';
import { Movie } from '../movie';
import { MovieService } from '../movie.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface movieData{
  movie: string;
}

@Component({
  selector: 'movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
  providers: [MovieService]
})
export class MovieListComponent implements OnInit {

  movies: Movie[];
  watchedMovie: Movie;
  recentlyWatched: Movie[];
  orderdWatched: Movie[];

  constructor(private movieService: MovieService, public dialog: MatDialog){}

  //initialises the movie lists
  ngOnInit(){
    this.getMovies();
    this.getWatched();
  }

  //gets the movies from the API
  getMovies(){
    this.movieService.getMovies().then((movies: Movie[]) =>{
      this.movies = movies.map((movie) => {
        return movie;
      });
    });
  }

  //gets the movies from the database
  getWatched(){
    this.movieService.getWatched().then((recentlyWatched: Movie[]) => {
      this.recentlyWatched = recentlyWatched;
      this.recentlyWatched.sort((a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime());
    });
  }

  //returns the Movie ID
  private getMovieID = (movieID: string) => {
    return this.movies.findIndex((movie) => {
      return movie.id === movieID;
    });
  }

  //opens up a dialog to serve the media player
  playMovie(movie: Movie): void{
    let movieURL = movie.contents[0].url;
    let secureURL = movieURL.slice(0, 4) + "s" + movieURL.slice(4);

    const dialogRef = this.dialog.open(MoviePane, {
      data: {movie: secureURL}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.addWatched(movie);
    })
  }

  //holds the most recently watched film
  movieWatched(movie: Movie){
    this.watchedMovie = movie;
  }

  //adds the most recently watched film to the databse
  addWatched = (movie: Movie) =>{
    let filmCheck = this.recentlyWatched.find(watched => watched.id === movie.id);
    if(!filmCheck){
      this.movieService.createWatched(movie);
    } else {
      console.log('Film already on watched list')
    }
  }

  //updates the list of watched films
  updatedWatched = (movie: Movie) => {
    var index = this.getMovieID(movie.id);
    if(index !== -1){
      this.movies[index] = movie;
      this.movieWatched(movie);
    }
    return this.movies;
  }

}

@Component({
  selector: 'movie-pane',
  templateUrl: 'movie-pane.html',
  styleUrls: ['./movie-pane.component.css']
})
export class MoviePane{
  

  constructor(public dialogRef: MatDialogRef<MoviePane>,
  @Inject(MAT_DIALOG_DATA) public data: movieData,
  protected sanitizer: DomSanitizer){}

  //the video player
  movieURL(){
    debugger
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.data.movie);
  }

}
