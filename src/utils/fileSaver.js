import fs from 'fs';
import request from 'request';

const download = function (uri, filename, callback) {
    request.head(uri, function (err, res) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

export default download;
