const helper = {
	getItem(key: string) {
		return window.localStorage.getItem(key);
	},
	setItem(key: string, value: any) {
		window.localStorage.setItem(key, value);
	},
}

export default helper;