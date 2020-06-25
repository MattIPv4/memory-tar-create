import tarts from 'tarts';
import gzip from 'gzip-js';
import TarGzData from './tar_gz_data';

/**
 * A path-like string for a file in the tar.
 * @typedef TarPath
 * @type {String}
 */

/**
 * An item within the tar.
 * @typedef TarItem
 * @type {Object}
 * @property {Date} [modified] The timestamp for when the file was last modified.
 */

/**
 * A file within the tar.
 * @typedef TarFile
 * @type {TarItem}
 * @property {String} contents The content to be included in the file, in the tar.
 */

/**
 * A symlink within the tar.
 * @typedef TarLink
 * @type {TarItem}
 * @property {TarPath} target The target file for the symlink.
 */

/**
 * An object containing a set of files to be included in the tar.
 * @typedef TarFiles
 * @type {Object.<TarPath, (TarFile|TarLink)>}
 */

/**
 * Options for compressing the tar archive with gzip.
 * @typedef TarGzOptions
 * @type {Object}
 * @property {Number} [level] gzip compression level to use.
 * @property {Date|Number} [timestamp] timestamp to use for archive creation.
 */

/**
 * An uncompressed tar archive controller.
 */
class Tar {
    /**
     * Create a new tar archive.
     *
     * @param {TarFiles} [files] Initial files to create the tar with
     */
    constructor(files) {
        this.files = files || {};
    }

    /**
     * Add files to the tar archive.
     * This can also be used to replace existing files with the same name.
     *
     * @param {TarFiles} files One or more files to add to the tar
     */
    add(files) {
        this.files = { ...this.files, ...files };
    }

    /**
     * Remove files from the tar archive.
     *
     * @param {TarPath} files Path-like names of files to remove from the tar.
     */
    remove(...files) {
        this.files = Object.entries(this.files).reduce((prev, [name, data]) => {
            if (!files.includes(name)) prev[name] = data;
            return prev;
        }, {});
    }

    /**
     * Compress the tar archive with gzip.
     *
     * @param {TarGzOptions} [opts] Options for compressing the tar with gzip.
     * @return {TarGzData} The resulting gzipped tar archive data.
     */
    gz(opts) {
        opts = opts || {};
        if (opts.level === undefined) opts.level = 9;
        if (opts.timestamp === undefined) opts.timestamp = new Date();
        opts.timestamp = Math.floor(opts.timestamp.getTime() / 1000);

        // Convert TarFiles to data for tars, drop any invalid entries silently
        const data = Object.entries(this.files).map(([name, data]) => {
            const obj = { name };

            // Timestamp
            if ('modified' in data) {
                obj.mtime = Math.floor(data.modified.getTime() / 1000);
            }

            // Normal file
            if ('contents' in data) {
                obj.content = data.contents;
                return obj;
            }

            // Symlink
            if ('target' in data) {
                obj.typeflag = '2';
                obj.linkname = data.target;
                obj.content = '';
                return obj;
            }
        }).filter(x => !!x);

        // Create the gzipped tar
        const tarData = tarts(data);
        const gzipped = gzip.zip(tarData, opts);
        return new TarGzData(Uint8Array.from(gzipped));
    }
}

export default Tar;
