
NODE_BIN=./node_modules/.bin

prisma-generate:
	@echo 'Generating Prisma clients...'
	docker compose exec auth npx prisma generate
	docker compose exec profile npx prisma generate

#
#
#
#
#
#
#
#
## 🏁 Основные команды
#dev:
#    @echo "🚀 Запуск dev-сервера с hot reload"
#    npm run dev
#
#seed:
#    @echo "🌱 Запуск сидов"
#    $(NODE_BIN)/ts-node src/seed/seed.ts
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
