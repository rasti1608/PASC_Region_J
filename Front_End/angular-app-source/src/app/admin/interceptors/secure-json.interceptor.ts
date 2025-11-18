import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SecureJsonInterceptor implements HttpInterceptor {

  /**
   * Recursively convert object keys from UPPERCASE to lowercase
   * to match Angular interfaces that expect lowercase keys
   */
  private normalizeKeys(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.normalizeKeys(item));
    }

    if (typeof obj === 'object') {
      const normalized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const lowerKey = key.toLowerCase();
          normalized[lowerKey] = this.normalizeKeys(obj[key]);
        }
      }
      return normalized;
    }

    return obj;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // For CFC API requests, force responseType to 'text' to prevent auto-parsing
    let modifiedRequest = request;
    if (request.url.includes('/api/')) {
      modifiedRequest = request.clone({
        responseType: 'text' as any
      });
    }

    return next.handle(modifiedRequest).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          let body = event.body;

          // If we got a text response from a ColdFusion API
          if (typeof body === 'string' && body.length > 0) {
            // Remove ColdFusion's secure JSON prefix "//"
            if (body.startsWith('//')) {
              body = body.substring(2);
            }

            // Try to parse the cleaned JSON
            try {
              const parsedBody = JSON.parse(body);

              // Convert ColdFusion uppercase keys to lowercase
              const normalizedBody = this.normalizeKeys(parsedBody);

              return event.clone({ body: normalizedBody });
            } catch (e) {
              console.error('SecureJsonInterceptor: Failed to parse JSON', e);
              // If parsing fails, return original
              return event;
            }
          }
        }
        return event;
      })
    );
  }
}
