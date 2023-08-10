import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "../admin/shared/components/admin-loyout/services/auth.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private auth: AuthService,
        private route: Router
        ) {
        
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.auth.isAuthenticated()) {
            const token = this.auth.token || '';
            req = req.clone({
                setParams: {
                auth: token
                }
            })
        }
        return next.handle(req)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                console.log('[Interpretator Error]: ', error)
                if(error.status === 401) {
                    this.auth.logout()
                    this.route.navigate(['/admin','login'], {
                        queryParams: {
                            authFailed: true
                        }
                    })
                }
                return throwError(error)
            })
            )
    }
    }

