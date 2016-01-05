# rdr
Simulate multi-server production environments on your Mac, with multiple projects handling traffic on the same ports simultaneously (e.g., 80, 443).

## Install it.
You'll want to install rdr globally, so you can use the executable from the command line (it would be of little use as a local project dependency).

`sudo npm install rdr -g`

*N.b.:* rdr is not tested on versions of OSX prior to 10.11 (El Capitan). In 10.10.5 (Yosemite), it works in Chrome/FF, but is unreliable in Safari.

## Use it.
### Configure  `.rdr`
While you do not need to have a configuration file to use rdr, doing so makes it easier to manage many redirect rules, especially if you need special environments for multiple projects.

For each project needing domain+port forwarding, provide an `.rdr` configuration file in project root. The syntax is self-explanatory (comments are bash-style):

```
project.com:80 to 127.0.0.1:3000
internal.project.com:80 to 127.0.0.1:3000
api.project.com:80 to 127.0.0.1:3001
```

### Commands
* `rdr .` to consume `$cwd/.rdr` (clobbers previous configuration)
* `rdr on` to enable
* `rdr off` to disable
* `rdr list` to inspect the configuration
* `rdr reset` to empty the current configuration
* `rdr restore` to overwrite `/etc/hosts` with `~/.etchosts.bak`
* `rdr <host>:<port-x> to <ip>:<port-y>` (clobbers previous configuration)
* `rdr --version`
* `rdr --help`

### About your browser:
Browsers store DNS information and keep sockets open across page loads, so you'll need to clear that stuff occasionally, after using `rdr on` or `rdr off`.

**Chrome users** may need to use `chrome://internals/#dns` and `/#sockets` to flush DNS and the socket pool. The console prints a reminder.

**Safari users** may have to wait a moment and/or refresh the page a few times.
