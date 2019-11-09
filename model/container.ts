import {Container} from "@hypertype/core";
import {Model, ProxyDomainContainer} from "@hypertype/domain";
import {ContextTree} from "./contextTree";
import {EmailGoogleApi} from "../google-api/email.google-api";
import {AuthGoogleApi} from "../google-api/auth.google-api";

export const ContextDomainContainer = Container.withProviders(
    ContextTree,
    AuthGoogleApi,
    EmailGoogleApi,
    ProxyDomainContainer
);
// const root = ContextDomainContainer.get<ContextTree>(ContextTree);
//
// ContextDomainContainer.provide([
//     {provide: ContextTree, useValue: root,},
//     {provide: Model, useValue: root}
// ]);