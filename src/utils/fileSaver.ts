import fs from 'fs';
import request from 'request';

const download = function (uri: string, filename: string, callback: () => void) {
    request.head(uri, function (err: any, res: any) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

export default download;
