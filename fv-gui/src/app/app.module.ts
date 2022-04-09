import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// import here every component created
import { TopBarComponent } from './main-page/top-bar/top-bar.component';
import { RightBarComponent } from './main-page/right-bar/right-bar';


@NgModule({
    declarations: [
        TopBarComponent,
        RightBarComponent
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
                path: 'main',
                component: TopBarComponent
            },
        ])
    ],
    // don't change
    providers: [],
    bootstrap: [TopBarComponent]
})
export class AppModule { }
