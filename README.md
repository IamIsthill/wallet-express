## DEVELOPMENT

RUN make start-dock
docker exec -it mongo-replica mongosh
use admin
rs.initiate({
\_id: "rs0",
members: [
{ _id: 0, host: "localhost:27017" }
]
})
