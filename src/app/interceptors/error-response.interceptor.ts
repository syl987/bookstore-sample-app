import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

/**
 * Makes sure that any value returned by the error stream of the http `Observable` is of type `HttpErrorResponse`.
 *
 * Just in case this is not fully covered by the `HttpClient`.
 */
export class ErrorResponseInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse) {
          return throwError(() => err);
        }
        return throwError(() => new HttpErrorResponse({}));
      })
    );
  }
}
