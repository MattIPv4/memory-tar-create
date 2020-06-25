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
        'H4sIAADhC14CAytJLS7RK6koYaAhMAACc3NzMA0E6LSBgaExg6GxmYGRuZmBCUTc3MTMWMGAgQ6gtLgksUhBgWGEAo/UnJx8hfL8opwUhlEw8gAAhaFlbgAEAAA='
    );

    myTar.add({
        'hello.txt': { contents: 'Testing', modified: safeDate },
    });

    arrayEqual(Object.keys(myTar.files), ['test.txt', 'hello.txt']);
    assert.equal(
        myTar.gz({ timestamp: safeDate }).base64(),
        'H4sIAADhC14CAytJLS7RK6koYaAhMAACc3NzMA0E6LSBgaExg6GxmYGRuZmBCUTc3MTMWMGAgQ6gtLgksUhBgWGEAo/UnJx8hfL8opwUhlEw8kAGKP5pXAAQzP8G5hj538zQaDT/0wGEAMv/zLz00YwwQgEAshOsVwAIAAA='
    );

    myTar.remove('hello.txt');

    arrayEqual(Object.keys(myTar.files), ['test.txt']);
    assert.equal(
        myTar.gz({ timestamp: safeDate }).base64(),
        'H4sIAADhC14CAytJLS7RK6koYaAhMAACc3NzMA0E6LSBgaExg6GxmYGRuZmBCUTc3MTMWMGAgQ6gtLgksUhBgWGEAo/UnJx8hfL8opwUhlEw8gAAhaFlbgAEAAA='
    );

    myTar.add({
        'hello.txt': { contents: 'Replaced', modified: safeDate },
    });

    arrayEqual(Object.keys(myTar.files), ['test.txt', 'hello.txt']);
    assert.equal(myTar.files['hello.txt'].contents, 'Replaced');
    assert.equal(
        myTar.gz({ timestamp: safeDate }).base64(),
        'H4sIAADhC14CAytJLS7RK6koYaAhMAACc3NzMA0E6LSBgaExg6GxmYGRuZmBCUTc3MTMWMGAgQ6gtLgksUhBgWGEAo/UnJx8hfL8opwUhlEw8kAGKP5pXAAQzv8GGPkfyBrN/3QAQakFOYnJqaOZf4QCAAbHGB8ACAAA'
    );
};
