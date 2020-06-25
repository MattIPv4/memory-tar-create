import base64 from 'Base64';

/**
 * A gzip compressed tar archive.
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
        /* eslint-env browser */
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

export default TarGzData;
