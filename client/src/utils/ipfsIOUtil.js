import ipfsClient from 'ipfs-http-client';

const ipfs = ipfsClient('localhost', '5001', { protocol: 'http' });

function saveTextBlobOnIpfs(blob) {
    return new Promise(function (resolve, reject) {
        const descBuffer = Buffer.from(blob, 'utf-8');
        ipfs.add(descBuffer).then((response) => {
            // console.log(response)
            // console.log(response[0].hash);
            resolve(response[0].hash);
        }).catch((error) => {
            console.log(error)
            reject(error);
        })
    })
}

function getTextFromIpfs(dataHash) {
    return new Promise(function (resolve, reject) {
        ipfs.cat(dataHash).then((stream) => {
            // console.log(stream);
            let strContent = utf8ArrayToStr(stream);
            // console.log(strContent);
            resolve(strContent);
        }).catch((err) => {
            reject(err);
        })
    })
}

function saveFileOnIpfs(reader) {
    return new Promise(function (resolve, reject) {
        let buffer = Buffer.from(reader.result);
        ipfs.add(buffer).then((response) => {
            console.log(response)
            resolve(response[0].hash);
        }).catch((err) => {
            console.error(err);
            reject(err);
        })
    })
}

function getFileFromIpfs(fileHash) {
    return new Promise(function (resolve, reject) {
        try {
            let stream = ipfs.getReadableStream(fileHash);
            // let resultArr = new Uint8Array(0);
            stream.on('data', (file) => {
                if (file.type !== 'dir') {
                    file.content.on('data', (data) => {
                        resolve(data);
                        // console.log(data)
                        // let tmpArr = new Uint8Array(resultArr.length + data.length)
                        // tmpArr.set(data, resultArr.length)
                        // resultArr = tmpArr;
                        // console.log(resultArr)
                    })
                    file.content.resume()
                }
            })
            // stream.on('end', () => {
            //     console.log(resultArr)
            //     resolve(resultArr)
            // })
        } catch (err) {
            reject(err)
        }
    })

}


function utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;
    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                break;
            default:
                break;
        }
    }
    return out;
}

export { saveTextBlobOnIpfs, getTextFromIpfs, saveFileOnIpfs, getFileFromIpfs }
