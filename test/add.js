import { strict as assert } from 'assert';
import Tar from '../src';
import arrayEqual from './util/array_equal';

const safeDate = new Date('Wed Jan 01 2020 00:00:00 GMT+0000');

export default () => {
    const myTar = new Tar({
        'test.txt': { contents: 'Hello world', modified: safeDate },
    });

    arrayEqual(Object.keys(myTar.files), ['test.txt']);
    assert.equal(
        myTar.gz({ timestamp: safeDate }).base64(),
        'H4sIAADhC14CAytJLS7RK6koYaAhMAACc3NzMA0E6LSBgaExg6GxmYGRuZmBCUTc3MTMWMGAgQ6gtLgksUhBgWGEAo/UnJx8hfL8opwUhlEw8gAAhaFlbgAEAAA=',
    );

    myTar.add({
        'hello.txt': { contents: 'Testing', modified: safeDate },
    });

    arrayEqual(Object.keys(myTar.files), ['test.txt', 'hello.txt']);
    assert.equal(
        myTar.gz({ timestamp: safeDate }).base64(),
        'H4sIAADhC14CAytJLS7RK6koYaAhMAACc3NzMA0E6LSBgaExg6GxmYGRuZmBCUTc3MTMWMGAgQ6gtLgksUhBgWGEAo/UnJx8hfL8opwUhlEw8kAGKP5pXAAQzP8G5hj538zQaDT/0wGEAMv/zLz00YwwQgEAshOsVwAIAAA=',
    );

    myTar.add({
        'a.txt': { contents: 'apple', modified: safeDate },
        'b.txt': { contents: 'banana', modified: safeDate },
    });

    arrayEqual(Object.keys(myTar.files), ['test.txt', 'hello.txt', 'a.txt', 'b.txt']);
    assert.equal(
        myTar.gz({ timestamp: safeDate }).base64(),
        'H4sIAADhC14CA+3VUQrCMAyA4RylJ5C03ZIreAAvULGoULaxVfT4Vn2bgr60CMnfh0Bfw9fmuORNvmWoGJaY+TlL64loPVhP6Jiwe91zR94gNOiy5DAbA0LbxpRGcx3ndABNXqfH/is/AF/9I7/5J+vUf4N25f0/D0eFILRQ+/P/yX+/9k/sevXfYv/TlKIyENv+L/zTB/+s/lvsPwzlqAOp3QFs8/+vABAAAA==',
    );

    myTar.add({
        'hello.txt': { contents: 'Replaced', modified: safeDate },
    });

    arrayEqual(Object.keys(myTar.files), ['test.txt', 'hello.txt', 'a.txt', 'b.txt']);
    assert.equal(myTar.files['hello.txt'].contents, 'Replaced');
    assert.equal(
        myTar.gz({ timestamp: safeDate }).base64(),
        'H4sIAADhC14CA+3VwQ7CIAyA4T4KT2C6sbWv4Nk3QCXxQBzZavTxRb1NE71ATNqfA4Rr84HERTZyE6gYlpj5uZfWO2LnofOEPRMOr3seyDuEBl0WCbNzoLRtTGly12lOR7D0dXrMv/ID8N0/vvkvJ/PfoF3MKRyi4VdaqP35/+Ifx7V/4n40/y3mn3OKxkBt+7/wTx/8s/lvMf9wLsscaO0OzkzlcgAQAAA=',
    );
};
