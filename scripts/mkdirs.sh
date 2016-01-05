# Backup dir to hold a copy of /etc/hosts
if [ ! -d /usr/local/lib/node_modules/rdr/backup ]
  then
    sudo mkdir /usr/local/lib/node_modules/rdr/backup
fi

if [ ! -f /usr/local/lib/node_modules/rdr/backup/hosts ]
  then
    sudo touch /usr/local/lib/node_modules/rdr/backup/hosts
fi

# Configuration dir to hold anchors and hosts
if [ ! -d /usr/local/lib/node_modules/rdr/configuration ]
  then
    sudo mkdir /usr/local/lib/node_modules/rdr/configuration
fi

if [ ! -f /usr/local/lib/node_modules/rdr/configuration/anchors.json ]
  then
    sudo touch /usr/local/lib/node_modules/rdr/configuration/anchors.json
fi

if [ ! -f /usr/local/lib/node_modules/rdr/configuration/hosts.json ]
  then
    sudo touch /usr/local/lib/node_modules/rdr/configuration/hosts.json
fi

# Anchor file
if [ ! -f /etc/pf.anchors/rdr ]
  then
    sudo touch /etc/pf.anchors/rdr
fi
