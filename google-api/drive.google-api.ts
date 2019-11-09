export class DriveGoogleApi {
    private filesApi = gapi.client.drive.files;


    public async List(name) {
        const {result} = await this.filesApi.list({
            q: `name = '${name}'`
        });
        return result.files;
    }

    async Delete(id: string) {
        await this.filesApi.delete({
            fileId: id
        })
    }
}