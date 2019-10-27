import {RelationType, RootDbo} from "./context.dbo";
import {Id} from "../base/id";
import {utc} from "@hypertype/core";

const InititalData: () => RootDbo = () => ({
    Contexts: [
        {
            Id: Id(),
            ParentIds: [],
            Time: utc().toISO(),
            Content: [{
                Text: '...',
            }]
        }
    ],
    Users: [],
    Relations: [],
    UserState: {
        ContextsState: {

        }
    }

});

const DefaultDataTest1: () => RootDbo = () => ({
    Contexts: [
        {
            Id: '1',
            ParentIds: [],
            Time: utc().toISO(),
            Content: [{
                Text: 'Контекст',
            }]
        },
        {
            Id: '1.1',
            ParentIds: ['1'],
            Time: utc().toISO(),
            Content: [{
                Text: 'Пример использования',
            }]
        },
        {
            Id: '1.2',
            ParentIds: ['1'],
            Time: utc().toISO(),
            Content: [{
                Text: 'Проектировани',
            }]
        },
        {
            Id: '1.2.1',
            ParentIds: ['1.2'],
            Time: utc().toISO(),
            Content: [{
                Text: 'Сущности',
            }]
        },
        {
            Id: '1.2.2',
            ParentIds: ['1.2'],
            Time: utc().toISO(),
            Content: [{
                Text: 'Поведение',
            }]
        }
    ],
    Users: [{
        Id: 's',
        Name: 'Степа',
        Email: 'styopa@contextify.app'
    }, {
        Id: 'f',
        Name: 'Фра',
        Email: 'fra@contextify.app'
    }, {
        Id: 'a',
        Name: 'Анна',
        Email: 'anna@contextify.app'
    }, {
        Id: 'b',
        Name: 'Боб',
        Email: 'bob@contextify.app'
    }],
    Relations: [{
        UserId: 'b',
        ContextId: '1',
        Type: RelationType.Owner
    }, {
        UserId: 's',
        ContextId: '1.1',
        Type: RelationType.Owner
    }, {
        UserId: 'f',
        ContextId: '1.2',
        Type: RelationType.Owner
    }],
    UserState: {
        ContextsState: {
            '1.2': {
                Collapsed: false
            }
        }
    }
});

export const DefaultData = DefaultDataTest1;