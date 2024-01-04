
all: up

up:
	docker-compose -f ./src/docker-compose.yml up --build

down:
	docker-compose -f ./src/docker-compose.yml down

fclean: down
	docker rmi $$(docker images -a -q) &2>/dev/null
	docker network rm $$(docker network ls -q) &2>/dev/null
	docker volume rm $$(docker volume ls -q) &2>/dev/null

clean_cache: fclean
	docker system prune -a
