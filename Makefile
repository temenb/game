
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


test:
	@echo "🧪 Запуск тестов"
	$(NODE_BIN)/jest

# 🛠️ Установка зависимостей
test:
	@echo "🧪 Запуск тестов"
	npx turbo run test


git-commit:
	cd services/auth
	git add .
	git commit -am "stable"
	cd ../profile
	git add .
	git commit -am "stable"
	cd ../ship
	git add .
	git commit -am "stable"
	cd ../gateway
	git add .
	git commit -am "stable"
	cd ../asteroid
	git add .
	git commit -am "stable"
