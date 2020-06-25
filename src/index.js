import tarts from 'tarts';
import gzip from 'gzip-js';
import base64 from 'Base64';

/**
 * A path-like string for a file in the tar.
 * @typedef TarPath
 * @type {String}
 */

/**
 * A file within the tar.
 * @typedef TarFile
 * @type {Object}
 * @property {String} contents The content to be included in the file, in the tar.
 */

/**
 * A symlink within the tar.
 * @typedef TarLink
 * @type {Object}
 * @property {TarPath} target The target file for the symlink.
 */

/**
 * An object containing a set of files to be included in the tar.
 * @typedef TarFiles
 * @type {Object.<TarPath, (TarFile|TarLink)>}
 */

class TarGzData {
    /**
     * Create a new compressed tar archive data entry.
     *
     * @param {Uint8Array} data The tar archive data.
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Download the archive file in the browser.
     * This requires `document` and `window` to be available.
     *
     * @param {String} [name] Optional, the file name for the archive download.
     */
    download(name) {
        const blob = new Blob([ this.data ], { type: 'application/tar+gzip' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.safeName(name || 'archive.tar.gz');
        link.click();
    }

    /**
     * Convert the tar data to a base64 string.
     * Optionally, return a shell command to echo the base64 data to a valid tar archive file.
     *
     * @param {String} [path] Optional, the target file path for the tar archive.
     * @return {String} The base64 data for the tar archive, or the full shell command.
     */
    base64(path) {
        const b64 = base64.btoa(String.fromCharCode(...this.data));
        if (!path) return b64;
        return `echo '${b64}' | base64 --decode | tee ${this.safeName(path)} > /dev/null`;
    }

    /**
     * Ensuring a file name has the correct extension for a gzipped tar archive.
     *
     * @private
     * @param {String} name The initial file name to make safe.
     * @return {String} The safe file name.
     */
    safeName(name) {
        if (name.endsWith('.tar.gz')) return name;
        return `${name}.tar.gz`;
    }
}

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
        this.files = Object.entries(this.files).reduce((prev, current) => {
            if (!files.includes(current[0])) prev[current[0]] = current[1];
            return prev;
        }, {});
    }

    /**
     * Compress the tar archive with gzip.
     *
     * @param {Number} [level=9] gzip compression level to use.
     * @return {TarGzData} The resulting gzipped tar archive data.
     */
    gz(level = 9) {
        // Convert TarFiles to data for tars, drop any invalid entries silently
        const data = Object.entries(this.files).map(([name, data]) => {
            // Normal file
            if ('contents' in data) {
                return {
                    name,
                    content: data.contents
                };
            }

            // Symlink
            if ('target' in data) {
                return {
                    name,
                    typeflag: '2',
                    linkname: data.target,
                    content: '',
                };
            }
        }).filter(x => !!x);

        // Create the gzipped tar
        const tarData = tarts(data);
        const gzipped = gzip.zip(tarData, { level });
        return new TarGzData(Uint8Array.from(gzipped));
    }
}

export default Tar;
