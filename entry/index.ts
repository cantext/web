import {GoogleApi} from "../google-api/google-api";
import {ApplicationBuilder, RootStore as AppRootStore} from "@hypertype/app"
import {Container} from "@hypertype/core";
import {GoogleLoginComponent} from "../components/google-login.component";
import {RootComponent} from "./root/root.component";
import {ContextComponent} from "../components/context/context.component";
import {RootStore} from "../store/RootStore";
import {InfrContainer} from "@hypertype/infr";
import {BrowserContainer} from "@hypertype/infr-browser";
import {ContextDomainContainer} from "../model/container";
import {AuthGoogleApi} from "../google-api/auth.google-api";
import {DriveGoogleApi} from "../google-api/drive.google-api";
import {ModelAdapter} from "../services/model.adapter";
import {SheetGoogleApi} from "../google-api/sheet.google-api";
import {DriveAdapter} from "../services/drive.adapter";
import {FileTree} from "../services/file.tree";
import {WhiteboardComponent} from "../components/whiteboard/whiteboard.component";
import {TreeComponent} from "../components/tree/tree.component";

const app = ApplicationBuilder
    .withInfrustructure(ContextDomainContainer)
    .withInfrustructure(InfrContainer)
    .withInfrustructure(BrowserContainer)
    .withUI(Container.withProviders(
        GoogleLoginComponent,
        RootComponent,
        ContextComponent,
        WhiteboardComponent,
        TreeComponent,
        RootStore,
    ))
    .withRouter({
        routes: [
            {path: '/', name: 'root', forwardTo: 'tree'},
            {path: '/tree', name: 'tree'},
            {path: '/whiteboard', name: 'whiteboard'}
        ],
    } as any)
    .build();
GoogleApi.Load().catch(e => null)
    .then(async () => {
        app.Provide(
            AuthGoogleApi,
            DriveGoogleApi,
            SheetGoogleApi,
            ModelAdapter,
            DriveAdapter,
            FileTree
        );
        app.Init();
        app.get<AppRootStore>(AppRootStore).createStore();
        const adapter = window['adapter']
            = await app.get<ModelAdapter>(ModelAdapter);
        adapter.init();

    });

// 1. Load the JavaScript client library.
