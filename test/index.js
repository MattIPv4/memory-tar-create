import Tar from '../src';

const myTar = new Tar({
    'test.txt': { contents: 'Hello world' },
});
myTar.add({
    'hello.txt': { target: 'test.txt' },
});
myTar.add({
    'world.txt': { contents: 'Bye' },
});
myTar.remove('world.txt');

const b64 = myTar.gz().base64('test');
console.log(b64);
