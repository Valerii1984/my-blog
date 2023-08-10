import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { FpAuthResponse, User } from "src/app/shared/interfaces";
import { environment } from "src/environments/environment";
import { Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators"


@Injectable({providedIn: 'root'})
export class AuthService {

    public error$: Subject<string> = new Subject<string>;
    

    constructor(private http: HttpClient) { }

    get token(): string | null {
        const expDate = this.parseDate(localStorage.getItem('fb-token-exp'));
        if (expDate && new Date() > expDate) {
            this.logout();
            return null;
        }
        return localStorage.getItem('fb-token');
    }

    login(user: User): Observable<FpAuthResponse> {
        user.returnSecureToken = true;
        return this.http.post<FpAuthResponse>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
            .pipe(
                tap(response => {
                    this.setToken(response)
                        
                }),
                catchError(error => {
                    this.handleError(error);
                    return throwError(error);
                })
            );
    }

    logout() {
        this.setToken(null);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    private handleError(error: HttpErrorResponse) {
        const { message } = error.error.error

        switch (message) {
            case 'INVALID_EMAIL':
                this.error$.next('Неверный email')
                break
            case 'INVALID_PASSWORD':
                this.error$.next('Неверный пароль')
                break
            case 'EMAIL_NOT_FOUND':
                this.error$.next('email не найден')
                break
        }
        return throwError(error)
    }

    private formatDate(date: Date): string {
        return date.toISOString();
    }

    private parseDate(dateString: string | null): Date | null {
        if (dateString) {
            return new Date(dateString);
        }
        return null;
    }

    private setToken(response: FpAuthResponse | null) {
        if (response) {
            const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
            localStorage.setItem('fb-token', response.idToken);
            localStorage.setItem('fb-token-exp', this.formatDate(expDate));
        } else {
            localStorage.removeItem('fb-token');
            localStorage.removeItem('fb-token-exp');
        }
    }
}
