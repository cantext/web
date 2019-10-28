import {Container} from "@hypertype/core";
import {Model, ProxyDomainContainer} from "@hypertype/domain";
import {ContextTree} from "./contextTree";

const root = new ContextTree();
export const ContextDomainContainer = Container.withProviders(
    {provide: Model, useValue: root},
    {provide: ContextTree, useValue: root},
    ProxyDomainContainer
);