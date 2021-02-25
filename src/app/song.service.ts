import { Injectable } from '@angular/core';
import { Song } from '../json-schema/song';
import { StatusResponse } from '../json-schema/statusResponse';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, tap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

interface SongList {
  songs: Song[];
}

@Injectable({
  providedIn: 'root',
})
export class SongService {
  private URL_GET_SONG_LIST: string = `http://${this.config.serverHost}:${this.config.serverPort}/song/list`;
  private URL_UPDATE_CURRENT_SONG: string = `http://${this.config.serverHost}:${this.config.serverPort}/song/current`;
  private URL_GET_SONG_DATA: string = `http://${this.config.serverHost}:${this.config.serverPort}/song/data`;
  private URL_GET_SONG_LYRICS: string = `http://${this.config.serverHost}:${this.config.serverPort}/song/lyrics`;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private config: ConfigurationService
  ) { }

  getList(): Observable<SongList> {
    const songList: Observable<SongList> = this.http
      .get<SongList>(this.URL_GET_SONG_LIST)
      .pipe(
        tap((_) => this.log('Fetched song list')),
        catchError(this.handleError<SongList>('getSongList'))
      );
    return songList;
  }

  getData(artist: string, title: string): Observable<string> {
    let options: { params?: HttpParams; responseType: 'text' } = {
      params: new HttpParams().append('artist', artist).append('title', title),
      responseType: 'text',
    };

    let songData: Observable<string> = this.http
      .get(this.URL_GET_SONG_DATA, options)
      .pipe(
        tap((_) => this.log('Fetched data')),
        catchError(this.handleError<string>('getData'))
      );

    return songData;
  }

  getLyrics(artist: string, title: string): Observable<string> {
    let options: { params?: HttpParams; responseType: 'text' } = {
      params: new HttpParams().append('artist', artist).append('title', title),
      responseType: 'text',
    };

    let lyrics: Observable<string> = this.http
      .get(this.URL_GET_SONG_LYRICS, options)
      .pipe(
        tap((_) => this.log('Fetched lyrics')),
        catchError(this.handleError<string>('getLyrics'))
      );

    return lyrics;
  }

  setCurrentSong(currentSong: Song): Observable<StatusResponse> {
    const currentSongString: string = JSON.stringify(currentSong);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const updateStatusResponse: Observable<StatusResponse> = this.http
      .post<StatusResponse>(
        this.URL_UPDATE_CURRENT_SONG,
        currentSongString,
        httpOptions
      )
      .pipe(
        tap((_) => this.log('Updated current song')),
        catchError(this.handleError<StatusResponse>('setCurrentSong'))
      );

    return updateStatusResponse;
  }

  /** Log a SongService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`SongService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
