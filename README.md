
# rdr
Simulate multi-server production environments on your Mac, with multiple projects handling traffic on the same ports simultaneously (e.g., 80, 443).

## Install it.
`npm install -g rdr`

N.b.: rdr is not tested on versions of OSX prior to 10.10 Yosemite.

## Use it.
### Configure  `.rdr`
While you do not need to have a configuration file to use rdr, doing so makes it easier to manage many redirect rules, especially if you need special environments for multiple projects.

For each project needing domain+port forwarding, provide an `.rdr` configuration file in project root. The syntax is self-explanatory (comments are bash-style):

```
project.com:80 to 127.0.0.1:3000
api.project.com:80 to 127.0.0.1:3001
```

### Commands
* `rdr .` to use `$cwd/.rdr` and enable forwarding
* `rdr on` to enable forwarding
* `rdr off` to disable forwarding
* `rdr list` to inspect the current configuration
* `rdr <host>:<port-x> to <ip>:<port-y>` to create a new forwarding rule
* `rdr --version`
* `rdr --help`
