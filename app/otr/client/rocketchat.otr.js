import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

import { Subscriptions } from '../../models';
import { OTRRoom } from './OTRRoom';

class OTRClass {
	constructor() {
		this.enabled = new ReactiveVar(false);
		this.instancesByRoomId = {};
		this.crypto = null;
	}

	isEnabled() {
		return this.enabled.get();
	}

	getInstanceByRoomId(roomId) {
		if (!this.enabled.get()) {
			return;
		}

		if (this.instancesByRoomId[roomId]) {
			return this.instancesByRoomId[roomId];
		}

		const subscription = Subscriptions.findOne({
			rid: roomId,
		});

		if (!subscription || subscription.t !== 'd') {
			return;
		}

		this.instancesByRoomId[roomId] = new OTRRoom(Meteor.userId(), roomId); // eslint-disable-line no-use-before-define
		return this.instancesByRoomId[roomId];
	}
}

export const OTR = new OTRClass();
