<!-- Source: https://github.com/MattIPv4/template/blob/master/README.md -->

<!-- Title -->
<h1 align="center" id="memory-tar-create">
    memory-tar-create
</h1>

<!-- Tag line -->
<h3 align="center">Create gzipped tar archives in memory and download them as files or base64 strings.</h3>

<!-- Badges -->
<p align="center">
    <a href="https://npm.com/package/memory-tar-create" target="_blank">
        <img src="https://img.shields.io/npm/v/memory-tar-create?style=flat-square" alt="NPM Package"/>
    </a>
    <a href="https://github.com/users/MattIPv4/sponsorship" target="_blank">
        <img src="https://img.shields.io/badge/GitHub%20Sponsors-MattIPv4-blue.svg?style=flat-square" alt="GitHub Sponsors"/>
    </a>
    <a href="http://patreon.mattcowley.co.uk/" target="_blank">
        <img src="https://img.shields.io/badge/Patreon-IPv4-blue.svg?style=flat-square" alt="Patreon"/>
    </a>
    <a href="http://slack.mattcowley.co.uk/" target="_blank">
        <img src="https://img.shields.io/badge/Slack-MattIPv4-blue.svg?style=flat-square" alt="Slack"/>
    </a>
</p>

----

<!-- Content -->
## Creating a Tar file in memory

```js
import Tar from 'memory-tar-create';

// Create your initial tar archive with a file
const myTar = new Tar({
    'test.txt': { contents: 'Hello world' },
});

// Add some more files to the archive
myTar.add({
    'a.txt': { contents: 'apple' },
    'b.txt': { contents: 'banana' },
});

// Add a symlink to the archive
myTar.add({
    'hello.txt': { target: 'test.txt' },
});

// Remove a file from the archive
myTar.remove('a.txt');

// gzip the archive
const gzipTar = myTar.gz();

// Get the base64 of the gzipped archive
const b64GzippedTar = gzipTar.base64();

// Or, get the base64 string as a shell command for the archive
const b64CommandGzippedTar = gzipTar.base64('myTar.tar.gz');

// Or, in a browser, download the archive directly
gzipTar.download('myTar.tar.gz');
```

<!-- Contributing -->
## Contributing

Contributions are always welcome to this project!\
Take a look at any existing issues on this repository for starting places to help contribute towards, or simply create your own new contribution to the project.

Please make sure to follow the existing standards within the project such as code styles, naming conventions and commenting/documentation.

When you are ready, simply create a pull request for your contribution and I will review it whenever I can!

### Donating

You can also help me and the project out by sponsoring me through [GitHub Sponsors](https://github.com/users/MattIPv4/sponsorship) (preferred), contributing through a [donation on PayPal](http://paypal.mattcowley.co.uk/) or by supporting me monthly on my [Patreon page](http://patreon.mattcowley.co.uk/).
<p>
    <a href="https://github.com/users/MattIPv4/sponsorship" target="_blank">
        <img src="https://img.shields.io/badge/GitHub%20Sponsors-MattIPv4-blue.svg?logo=github&logoColor=FFF&style=flat-square" alt="GitHub Sponsors"/>
    </a>
    <a href="http://patreon.mattcowley.co.uk/" target="_blank">
        <img src="https://img.shields.io/badge/Patreon-IPv4-blue.svg?logo=patreon&logoColor=F96854&style=flat-square" alt="Patreon"/>
    </a>
    <a href="http://paypal.mattcowley.co.uk/" target="_blank">
        <img src="https://img.shields.io/badge/PayPal-Matt%20(IPv4)%20Cowley-blue.svg?logo=paypal&logoColor=00457C&style=flat-square" alt="PayPal"/>
    </a>
</p>

<!-- Discussion & Support -->
## Discussion, Support and Issues

Need support with this project, have found an issue or want to chat with others about contributing to the project?
> Please check the project's issues page first for support & bugs!

Not found what you need here?

* If you have an issue, please create a GitHub issue here to report the situation, include as much detail as you can!
* _or,_ You can join our Slack workspace to discuss any issue, to get support for the project or to chat with contributors and myself:

<a href="http://slack.mattcowley.co.uk/" target="_blank">
    <img src="https://img.shields.io/badge/Slack-MattIPv4-blue.svg?logo=slack&logoColor=blue&style=flat-square" alt="Slack" height="30">
</a>
