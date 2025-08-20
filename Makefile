
NODE_BIN=./node_modules/.bin

prisma-generate:
	@echo '🚀 Generating Prisma clients...'
	docker compose exec auth npx prisma generate
	docker compose exec profile npx prisma generate
	docker compose exec ship npx prisma generate
	docker compose exec asteroid npx prisma generate

prisma-migrate:
	@echo '🚀 Apply migrations...'
	docker compose exec auth npm run prisma:migrate
	docker compose exec profile npm run prisma:migrate
	docker compose exec ship npm run prisma:migrate
	docker compose exec asteroid npm run prisma:migrate


seed:
	@echo "🌱 Запуск сидов"
	docker compose exec auth npx ts-node src/seed/seed.ts
	docker compose exec profile npx ts-node src/seed/seed.ts
	docker compose exec ship npx ts-node src/seed/seed.ts
	docker compose exec asteroid npx ts-node src/seed/seed.ts

proto-generate:
	@echo '🚀 Proto generate...'
	npm run proto:generate


#test:
#	@echo "🧪 Запуск тестов"
#	$(NODE_BIN)/jest
#
## 🛠️ Установка зависимостей
#test:
#	@echo "🧪 Запуск тестов"
#	npx turbo run test


COMMENT="'asdf sdfg'"

git-commit:
	cd services/auth && \
    git diff --quiet && echo "No changes in auth" || ( \
        git add . && \
        git commit -am "$(COMMENT)" \
    ) && \
	cd ../profile && \
    git diff --quiet && echo "No changes in profile" || ( \
        git add . && \
        git commit -am "$(COMMENT)" \
    ) && \
	cd ../asteroid && \
    git diff --quiet && echo "No changes in asteroid" || ( \
        git add . && \
        git commit -am "$(COMMENT)" \
    ) && \
	cd ../ship && \
    git diff --quiet && echo "No changes in ship" || ( \
        git add . && \
        git commit -am "$(COMMENT)" \
    ) && \
	cd ../gateway && \
	git diff --quiet && echo "No changes in gateway" || ( \
		git add . && \
		git commit -am "$(COMMENT)" \
	) && \
	cd ../.. && \
	git diff --quiet && echo "No changes root" || ( \
		  git add . && \
		  git commit -am "$(COMMENT)" \
	)
#	cd services/auth && \
#	git add . && \
#	git commit -am "stable"
#	cd services/profile && \
#	git add . && \
#	git commit -am "stable"
#	cd services/ship && \
#	git add . && \
#	git commit -am "stable"
#	cd services/gateway && \
#	git add . && \
#	git commit -am "stable"
#	cd services/asteroid && \
#	git add . && \
#	git commit -am "stable"
