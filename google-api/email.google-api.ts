import {Injectable} from "@hypertype/core";
import {AuthGoogleApi} from "./auth.google-api";
import Message = gapi.client.gmail.Message;
import Thread = gapi.client.gmail.Thread;

@Injectable()
export class EmailGoogleApi {
    get me() {
        return this.authService.User.email;
    }

    constructor(private authService: AuthGoogleApi) {

    }


    private api = gapi.client['gmail'].users;

    public async Get(from: string): Promise<Thread[]> {
        const {result} = await this.api.threads.list({
            userId: 'me',
            resource: {
                q: `from:${from}`,
            }
        } as any);
        return result.threads;
    }

    public async Send(to: string, content: string) {
        const message =
            `From: ${this.authService.User.email}\r\n` +
            `To: ${to}\r\n` +
            "Subject: As basic as it gets\r\n\r\n" +
            `${content}`;

        await this.api.messages.send({
            userId: 'me',
            resource: {
                raw: btoa(message)
            }
        } as any);
    }
}