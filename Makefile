.PHONY: db
db:
	sh ./local/dev.sh

.PHONY: p
p:
	ps aux | grep -v grep | grep mongod

.PHONY: stopdb
stopdb:
	sh ./local/dev.end.sh

.PHONY: start-dock
start-dock:
	sh ./local/dev.sh
.PHONY: end-dock
end-dock:
	sh ./local/dev.end.sh
