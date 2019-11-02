import {GoogleApi, GoogleApiAuth} from "./google-api";
import {ApplicationBuilder, RootStore as AppRootStore} from "@hypertype/app"
import {Container} from "@hypertype/core";
import {GoogleLoginComponent} from "../components/google-login.component";
import {RootComponent} from "../components/root/root.component";
import {ContextComponent} from "../components/context/context.component";
import {RootStore} from "../store/RootStore";
import {InfrContainer} from "@hypertype/infr";
import {BrowserContainer} from "@hypertype/infr-browser";
import {ContextDomainContainer} from "../model/container";

const app = ApplicationBuilder
    .withInfrustructure(ContextDomainContainer)
    .withInfrustructure(InfrContainer)
    .withInfrustructure(BrowserContainer)
    .withUI(Container.withProviders(
        GoogleLoginComponent,
        RootComponent,
        ContextComponent,
        RootStore,
    ))
    .build();
GoogleApi.Load().then((auth) => {
    app.Provide({
        provide: GoogleApiAuth,
        useValue: auth
    });
    app.Init();
    app.get<AppRootStore>(AppRootStore).createStore();
});

// 1. Load the JavaScript client library.
