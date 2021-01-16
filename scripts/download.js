const http = require("https");
const fs = require("fs");
const input = require("./input.json");

const BASE = "https://www.vipvgm.net/mu";

const tracks = input.tracks.map((track) => {
	return {
		url: `${BASE}/${track.file}.m4a`,
		file: track.file,
	};
});

tracks.reduce((root, track, index) => {
	return root.then(() => {
		console.log(`[${index + 1}/${tracks.length}] ${track.file}`);
		return download(track.url, `./${track.file}.m4a`);
	});
}, new Promise((resolve, reject) => resolve()));

function download(url, dest, cb) {
	return new Promise((resolve, reject) => {
		var file = fs.createWriteStream(dest);
		var request = http
			.get(url, function (response) {
				response.pipe(file);
				file.on("finish", function () {
					file.close(resolve); // close() is async, call cb after close completes.
				});
			})
			.on("error", function (err) {
				// Handle errors
				fs.unlink(dest); // Delete the file async. (But we don't check the result)
				reject(err.message);
			});
	});
}
