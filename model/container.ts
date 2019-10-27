import {Container} from "@hypertype/core";
import {Model, ProxyDomainContainer} from "@hypertype/domain";
import {Root} from "./root";

const root = new Root();
export const ContextDomainContainer = Container.withProviders(
    {provide: Model, useValue: root},
    {provide: Root, useValue: root},
    ProxyDomainContainer
);