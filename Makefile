
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


DRY_RUN ?= true
COMMIT_MSG ?= stable

SERVICES := auth profile ship gateway asteroid
SERVICE_DIR := services

commit-all:
	@for dir in $(SERVICES); do \
		echo "\033[1;33m[*] Checking $$dir...\033[0m"; \
		if [ ! -d $(SERVICE_DIR)/$$dir/.git ]; then \
			echo "\033[0;31m[!] Skipping $$dir — not a git repo\033[0m"; \
			continue; \
		fi; \
		cd $(SERVICE_DIR)/$$dir && \
		if git diff --quiet; then \
			echo "\033[1;33m[-] No changes in $$dir\033[0m"; \
		else \
			if [ "$(DRY_RUN)" = "true" ]; then \
				echo "\033[0;32m[DRY-RUN] Would commit changes in $$dir\033[0m"; \
			else \
				git add . && \
				git commit -am "$(COMMIT_MSG)" && \
				echo "\033[0;32m[✓] Committed changes in $$dir\033[0m"; \
			fi; \
		fi; \
		cd - > /dev/null; \
    done
