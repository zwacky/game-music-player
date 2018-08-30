import { Injectable } from '@angular/core';

declare var ga:Function;

interface TrackingProperties {
	action?: string;
	label?: string | number | boolean;
	value?: number;
	nonInteraction?: boolean;
}

@Injectable()
export class GoogleAnalyticsTracker {
	trackEvent(category: string, properties: TrackingProperties) {
		const nonInteraction = ('nonInteraction' in properties) ?
			properties.nonInteraction :
			false;
		ga('send', 'event', category, properties.action, properties.label, properties.value, {nonInteraction})
	}
}
