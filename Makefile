
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

proto-generate:
	@echo '🚀 Proto generate...'
	npm run proto:generate






## 🏁 Основные команды
#dev:
#    @echo "🚀 Запуск dev-сервера с hot reload"
#    npm run dev
#
#reset:
#    @echo "🧹 Очистка и пересборка"
#    rm -rf dist
#    npm run build
#
#lint:
#    @echo "🔍 Линтинг проекта"
#    $(NODE_BIN)/eslint src --ext .ts
#
#test:
#    @echo "🧪 Запуск тестов"
#    $(NODE_BIN)/jest
#
## 🛠️ Установка зависимостей
#install:
#    @echo "📦 Установка зависимостей"
#    npm install
#
## 🧼 Очистка кешей
#clean:
#    @echo "🧼 Очистка кешей и артефактов"
#    rm -rf node_modules dist .turbo .next .cache
#
## 🆘 Справка
#help:
#    @echo "🛠 Доступные команды:"
#    @echo "  make dev     — запуск dev-сервера"
#    @echo "  make seed    — сидирование базы"
#    @echo "  make reset   — очистка и пересборка"
#    @echo "  make lint    — линтинг"
#    @echo "  make test    — тесты"
#    @echo "  make install — установка зависимостей"
#    @echo "  make clean   — очистка кешей"
