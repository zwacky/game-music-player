import Vue, { DirectiveOptions } from 'vue';

function toggle(el, classKeys: {[key: string]: boolean}) {
	const toAdd = Object.keys(classKeys)
		.filter(key => classKeys[key]);
	const toRemove = Object.keys(classKeys)
		.filter(key => !classKeys[key]);

	el.className = el.className.split(' ')
		.filter(name => toAdd.indexOf(name) === -1)
		.concat(toAdd)
		.filter(name => toRemove.indexOf(name) === -1)
		.join(' ');
}

const toggleClass: DirectiveOptions = {
	bind: (el, node) => toggle(el, node.value),
	update: (el, node) => toggle(el, node.value),
};

export default toggleClass;