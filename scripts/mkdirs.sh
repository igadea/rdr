# Backup dir to hold a copy of /etc/hosts
if [ ! -d /usr/local/lib/rdr/backup ]
  then
    sudo mkdir /usr/local/lib/rdr/backup
fi

if [ ! -f /usr/local/lib/rdr/backup/hosts ]
  then
    sudo touch /usr/local/lib/rdr/backup/hosts
fi

# Configuration dir to hold anchors and hosts
if [ ! -d /usr/local/lib/rdr/configuration ]
  then
    sudo mkdir /usr/local/lib/rdr/configuration
fi

if [ ! -f /usr/local/lib/rdr/configuration/anchors.json ]
  then
    sudo touch /usr/local/lib/rdr/configuration/anchors.json
fi

if [ ! -f /usr/local/lib/rdr/configuration/hosts.json ]
  then
    sudo touch /usr/local/lib/rdr/configuration/hosts.json
fi

# Anchor file
if [ ! -f /etc/pf.anchors/rdr ]
  then
    sudo touch /etc/pf.anchors/rdr
fi
