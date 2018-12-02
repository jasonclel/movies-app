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

  constructor(private movieService: MovieService, public dialog: MatDialog){}

  ngOnInit(){
    this.getMovies();
  }

  getMovies(){
    this.movieService.getMovies().then((movies: Movie[]) =>{
      this.movies = movies.map((movie) => {
        return movie;
      });
    });
  }

  getWatched(){
    this.movieService.getWatched().then((recentlyWatched: Movie[]) =>{
      this.recentlyWatched = recentlyWatched.map((watched) =>{
        return watched;
      });
    });
  }

  private getMovieID = (movieID: string) => {
    return this.movies.findIndex((movie) => {
      return movie.id === movieID;
    });
  }

  playMovie(movie: Movie): void{
    let movieURL = movie.contents[0].url;
    const dialogRef = this.dialog.open(MoviePane, {
      data: {movie: movieURL}
    });

    dialogRef.afterClosed().subscribe(() => {
      this.addWatched(movie);
    })
  }

  movieWatched(movie: Movie){
    this.watchedMovie = movie;
  }

  addWatched = (movie: Movie) =>{
    this.movieService.createWatched(movie);
  }

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
  templateUrl: 'movie-pane.html'
})
export class MoviePane{
  

  constructor(public dialogRef: MatDialogRef<MoviePane>,
  @Inject(MAT_DIALOG_DATA) public data: movieData,
  protected sanitizer: DomSanitizer){}

  movieURL(){
    debugger
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.data.movie);
  }

}
