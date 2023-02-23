import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleBooksListDTO, GoogleBooksVolumeDTO } from 'src/app/models/google-books.models';

@Injectable({
    providedIn: 'root',
})
export class GoogleBooksApiService {
    readonly baseUrl = 'https://www.googleapis.com/books/v1';

    constructor(private readonly http: HttpClient) {}

    list(
        query: string,
        params?: {
            download?: 'epub';
            filter?: 'ebooks' | 'free-ebooks' | 'full' | 'paid-ebooks' | 'partial';
            langRestrict?: string;
            libraryRestrict?: 'my-library' | 'no-restrict';
            maxResults?: number;
            orderBy?: 'newest' | 'relevance';
            partner?: string;
            printType?: 'all' | 'books' | 'magazines';
            projection?: string;
            showPreorders?: boolean;
            source?: string;
            startIndex?: number;
        },
    ): Observable<GoogleBooksListDTO> {
        const url = `${this.baseUrl}/volumes`;

        return this.http.get<GoogleBooksListDTO>(url, { params: { q: query, ...params } });
    }

    get(
        volumeId: string,
        params?: {
            partner: string;
            projection: 'full' | 'lite';
            source: string;
        },
    ): Observable<GoogleBooksVolumeDTO> {
        const url = `${this.baseUrl}/volumes/${volumeId}`;

        return this.http.get<GoogleBooksVolumeDTO>(url, { params });
    }
}
