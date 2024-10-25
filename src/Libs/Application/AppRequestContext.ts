import { RequestContext } from 'nestjs-request-context';
import { ulid } from 'ulid';

export class AppRequestContext extends RequestContext {
	public requestId: string;
}

export class RequestContextService {
	public static getContext(): AppRequestContext {
		let context: AppRequestContext;
		try {
			context = RequestContext.currentContext.req as unknown as AppRequestContext;
		} catch (e) {
			context = { requestId: ulid(), req: undefined, res: undefined };
		}
		return context;
	}

	public static setRequestId(id: string): void {
		const ctx = this.getContext();
		ctx.requestId = id;
	}

	public static getRequestId(): string {
		return this.getContext().requestId;
	}
}
