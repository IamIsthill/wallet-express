.PHONY: db
db:
	mongod --dbpath ~/data/db --logpath ~/data/log/mongodb/mongo.log --replSet rs0 --fork

.PHONY: p
p:
	ps aux | grep -v grep | grep mongod

.PHONY: stopdb
stopdb:
	@PID=$$(ps aux | grep -v grep | grep mongod | awk '{print $$2}'); \
	kill $$PID; \
	echo 'MongoDB stopped'

.PHONY: start-dock
start-dock:
	sh ./local/dev.sh
.PHONY: end-dock
end-dock:
	sh ./local/dev.end.sh
