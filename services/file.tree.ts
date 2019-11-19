import {Injectable} from "@hypertype/core";
import {Tree} from "../model/base/tree";
import {ContextDbo, RootDbo} from "../model/dbo/context.dbo";
import {Id} from "../model/base/id";
import {ContextTree} from "../model/contextTree";
import {DriveGoogleApi} from "../google-api/drive.google-api";
import {Context} from "../model/context";
import {ContextFile} from "./context.file";
import File = gapi.client.drive.File

@Injectable()
export class FileTree extends Tree<ContextFile, ContextDbo, Id> {

    Items: Map<Id, ContextFile> = new Map<Id, ContextFile>();
    Root: ContextFile;

    constructor(private tree: ContextTree,
                public driveApi: DriveGoogleApi) {
        super();
    }

    public async LoadFiles(files: File[], rootId: string) {
        const rootContext = files.find(c => c.parents[0] == rootId);
        const contextDbos: ContextDbo[] = files.map(c => ({
            Id: c.id,
            Content: [{Text: c.name}],
            Children: files.filter(f => f.parents.includes(c.id)).map(f => f.id),
            Time: c.createdTime
        }));
        this.tree.Load({
            Root: rootContext.id,
            Contexts: contextDbos,
            Users: [],
            Relations: [],
            UserState: {
                ContextsState: {}
            }
        });
        this.Items = new Map([...this.tree.Items.values()].map(context => {
            const file = files.find(f => f.id == context.Id);
            return [file.id, new ContextFile(context, file)];
        }));
        this.Root = this.Items.get(this.tree.Root.Id);
    }

    public async Load(dto: RootDbo, createFile = true) {
        this.tree.Load(dto);
        const getChildren = (item: Context) => {
            if (!item.Children) return [];
            const children = item.Children;
            return [
                ...children,
                ...children.map(getChildren).flat()
            ];
        };
        this.Root = await this.CreateContextFile(this.tree.Root, 'appDataFolder');
        const childs = getChildren(this.tree.Root).reverse().distinct().reverse();
        for (const child of childs) {
            const file = await this.From(child);
        }
    }

    private async CreateContextFile(context: Context, ...parents) {
        const file = await this.driveApi.CreateFolder(context.toString(), ...parents);
        context.Id = file.id;
        const contextFile = new ContextFile(context, file);
        this.Items.set(context.Id, contextFile);
        return contextFile;
    }

    public async From(context: Context): Promise<ContextFile> {
        const parents = Array.from(context.Parents.keys());
        const contextFile = await this.CreateContextFile(context, ...parents);
        contextFile.Parents = new Map(parents.map(id => [id, this.Items.get(id)]));
        return contextFile;
    }

    Add(file: ContextFile) {

    }
}