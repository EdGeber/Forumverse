import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// import here every component created
import { Page } from './page';
import { TopBarComponent } from './main-page/top-bar/top-bar.component';
import { RightBarComponent } from './main-page/right-bar/right-bar';
import { UserRegistComponent } from './user-regist-page/user-regist.component';
import { MainPageComponent } from './main-page/main-page.component';


@NgModule({
    declarations: [
        Page,
        TopBarComponent,
        RightBarComponent,
        UserRegistComponent,
        MainPageComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        RouterModule.forRoot([
            // add here the path of each root component imported above.
            // The path name is arbitrary, you give it the name you want,
            // but it should be the name of the url of the page. For
            // example, TopBarComponent is the root of the main page,
            // so its path name is 'main'.
            {
                path: '',
                redirectTo: 'main',
                pathMatch: 'full'
            },
            {
                path: 'main',
                component: MainPageComponent
            },
            {
                path: 'register',
                component: UserRegistComponent
            },
        ])
    ],
    // don't change
    providers: [],
    bootstrap: [Page]
})

export class AppModule { }
