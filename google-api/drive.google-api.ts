import File = gapi.client.drive.File

export class DriveGoogleApi {
    private filesApi = gapi.client.drive.files;


    public async ListAppData() {
        const {result} = await this.filesApi.list({
            spaces: 'appDataFolder',
            fields: "files(id,name,parents),nextPageToken",
        });
        return result.files;
    }

    public async GetAppFolder(): Promise<File> {
        const {result} = await this.filesApi.get({
            fileId: 'appDataFolder',
            fields: "id,name",
        });
        return result;
    }

    public async ByParent(parent = 'appDataFolder') {
        const {result: parentFile} = await this.filesApi.list({
            q: `name = '${parent}'`
        });
        const {result} = await this.filesApi.list({
            q: `'${parent}' in parents`,
            // q: "mimeType='application/vnd.google-apps.folder'",
            fields: "files(id,name,parents),nextPageToken",
        });
        return result.files;
    }

    public async CreateFolder(name, ...parents) {
        const file: File = {
            mimeType: 'application/vnd.google-apps.folder',
            name: name,
            parents,
        };
        const {result} = await this.filesApi.create({
            resource: file,
            // @ts-ignore
            fields: 'id, parents',
        });
        return result as File;
    }

    async Delete(id: string) {
        await this.filesApi.delete({
            fileId: id
        })
    }

    async addParent(file: File, parentId: any) {
        await this.filesApi.update({
            fileId: file.id,
            addParents: parentId
        });
    }
}