import {Leaf} from "../model/base/leaf";
import {ContextDbo} from "../model/dbo/context.dbo";
import {Context} from "../model/context";
import File = gapi.client.drive.File;

export class ContextFile extends Leaf<ContextDbo, string> {

    constructor(private context: Context, private file: File) {
        super();
    }


    get Id(): string {
        return this.file.Id;
    }

}