import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';
// // for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
// // for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
// // for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { SimpleComponent } from './auth/simple/simple.component';
import { CandidatureComponent } from './pages/public/candidature/candidature.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/guard/auth.guard';
import { AgGridModule } from 'ag-grid-angular';
import { TableModule } from 'primeng/table';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { IgxGridModule } from 'igniteui-angular';


registerLocaleData(localeFr, 'fr');
// keycloak
export const initializeKeycloak = (keycloak: KeycloakService) => async () => keycloak.init({
	config: {
		url: environment.keycloak.serverUrl,
		realm: environment.keycloak.realm,
		clientId: environment.keycloak.clientId,
	},

	loadUserProfileAtStartUp: true,
	initOptions: {
		onLoad: 'check-sso', //'login-required', 'check-sso'
		silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
		// flow: 'hybrid',// hybrid , implicit
		enableLogging: true,
		// checkLoginIframe: false,
		// redirectUri: environment.keycloak.redirectUri,
	},
	bearerExcludedUrls: ['/assets', '/clients/public'],
	shouldAddToken: (request) => {
		// console.log('shouldAddToken')
		const { method, url } = request;
		const isGetRequest = 'GET' === method.toUpperCase();
		const acceptablePaths = ['/assets', '/clients/public'];
		const isAcceptablePathMatch = acceptablePaths.some((path) => url.includes(path));
		return !(isGetRequest && isAcceptablePathMatch);
	},
	shouldUpdateToken(request) {
		// console.log('shouldUpdateToken')
		return !request.headers.get('token-update') === false;
	},
});
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		SimpleComponent,
		CandidatureComponent,
		ForgetPasswordComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		OverlayModule,
		SharedModule,
		AppRoutingModule,
		HttpClientModule,
		NgbModule,
		TableModule,
		AgGridModule,
		IgxGridModule,
		// ToastrModule.forRoot(),
		ToastrModule.forRoot({
			timeOut: 10000, positionClass: 'toast-top-center', enableHtml: true, newestOnTop: true, closeButton: true,
			progressBar: true, tapToDismiss: false, preventDuplicates: true,
		}),
		BrowserAnimationsModule,
		NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient],
			},
		}),

		// for HttpClient use:
		LoadingBarHttpClientModule,
		// for Router use:
		LoadingBarRouterModule,
		// for Core use:
		LoadingBarModule,
		KeycloakAngularModule
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	providers: [
		CookieService,
		{ provide: LOCALE_ID, useValue: 'fr' },
		provideAnimationsAsync(),
		AuthService,
		AuthGuard,
		{
			provide: APP_INITIALIZER,
			useFactory: initializeKeycloak,
			multi: true,
			deps: [KeycloakService],
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {
}
