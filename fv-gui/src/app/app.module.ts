import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// import here every component created
import { Page } from './page';

// main-page
import { HomeRightBarComponent } from './main-page/home-right-bar/home-right-bar';
import { TopBarComponent } from './main-page/top-bar/top-bar.component';
import { HomePageComponent } from './main-page/home-page.component';

// user-regist-page
import { UserRegistFieldsComponent } from './user-regist-page/user-regist-fields/user-regist-fields.component';
import { UserRegistTopBarComponent } from './user-regist-page/user-regist-top-bar/user-regist-top-bar.component';
import { UserRegistPageComponent } from './user-regist-page/user-regist-page.component';

// admin-regist-page
import { AdminRegistPageComponent } from './admin-regist-page/admin-regist-page.component';
import { AdminRegistFieldsComponent } from './admin-regist-page/admin-regist-fields/admin-regist-fields.component';
import { AdminRegistTopBarComponent } from './admin-regist-page/admin-regist-top-bar/admin-regist-top-bar.component';

// login-page
import { LoginPageComponent } from './login-page/login-page.component';
import { LoginFieldsComponent } from './login-page/login-fields/login-fields.component';
import { LoginTopBarComponent } from './login-page/login-topbar/login-top-bar.component';

// create-thread-page
import { CreateThreadComponent } from './create-thread-page/create-thread-page.component';

@NgModule({
    declarations: [
        Page,

        /* main-page */
        HomeRightBarComponent,
        TopBarComponent,
        HomePageComponent,

        /* user-regist-page */
        UserRegistFieldsComponent,
        UserRegistTopBarComponent,
        UserRegistPageComponent,

        /* user-regist-page */
        AdminRegistFieldsComponent,
        AdminRegistTopBarComponent,
        AdminRegistPageComponent,

        /* create-thread-page */
        CreateThreadComponent,
        /* login-page */
        LoginPageComponent,
        LoginFieldsComponent,
        LoginTopBarComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot([
            // add here the path of each root component imported above.
            // The path name is arbitrary, you give it the name you want,
            // but it should be the name of the url of the page. For
            // example, TopBarComponent is the root of the home page,
            // so its path name is 'home'.
            { // root
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                component: HomePageComponent
            },
            {
                path: 'register',
                component: UserRegistPageComponent
            },
            {
                path: 'register-admin',
                component: AdminRegistPageComponent
            },
            {
                path: 'create-thread',
                component: CreateThreadComponent
            },
            {
                path: 'login',
                component: LoginPageComponent
            },
        ])
    ],
    // don't change
    providers: [],
    bootstrap: [Page]
})

export class AppModule { }