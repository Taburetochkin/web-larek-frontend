import { IEvents } from "./events";

export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	emitChanges(event: string, payload?: object) {
    payload ??= {};
		this.events.emit(event, payload);
	}
}

export const isModel = (object: unknown): object is Model<any> => {
	return object instanceof Model;
};