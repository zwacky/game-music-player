export default function toSeconds(value: number) {
	const minutes = Math.floor(value / 60);
	const seconds = Math.floor(value - minutes * 60);
	return [('00' + minutes).substr(-2), ('00' + seconds).substr(-2)].join(':');
}