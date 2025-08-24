
NODE_BIN=./node_modules/.bin

PRISMA_SERVICES := auth profile ship asteroid

prisma-migrate:
	@echo '🚀 Apply migrations...'
	@for service in $(PRISMA_SERVICES); do \
		docker compose exec $$service npx --yes prisma migrate dev; \
    done

prisma-generate:
	@echo '🚀 Generating Prisma clients...'
	@for service in $(PRISMA_SERVICES); do \
		docker compose exec $$service npx prisma generate; \
    done

seed:
	@echo "🌱 Запуск сидов"
	@for service in $(SERVICES); do \
		docker compose exec $$service npx ts-node src/seed/seed.ts; \
    done



#test:
#	@echo "🧪 Запуск тестов"
#	$(NODE_BIN)/jest
#
## 🛠️ Установка зависимостей
#test:
#	@echo "🧪 Запуск тестов"
#	npx turbo run test


DRY_RUN ?= false
#DRY_RUN ?= true
COMMIT_MSG ?= refactoring in progress. monorepo is installed. kafka is not working proppely. shared folders are in progress

SERVICES := auth profile ship gateway asteroid engine mail
SERVICE_DIR := services

commit-all:
	@for dir in $(SERVICES); do \
		echo "\033[1;33m[*] Checking $$dir...\033[0m"; \
		if [ ! -d $(SERVICE_DIR)/$$dir/.git ]; then \
			echo "\033[0;31m[!] Skipping $$dir — not a git repo\033[0m"; \
			continue; \
		fi; \
		cd $(SERVICE_DIR)/$$dir && \
		git add . && \
		if git diff HEAD --quiet; then \
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

proto-generate:
	@echo '🚀 Proto generate...'
	@for dir in $(SERVICES); do \
		echo "\033[1;33m[*] Checking $$dir...\033[0m"; \
		if [ ! -d "$(SERVICE_DIR)/$$dir/src/generated" ]; then \
			echo "\033[0;31m[!] Skipping $$dir — missing src/generated folder\033[0m"; \
			exit 1; \
		  fi; \
	done

	@for dir in $(SERVICES); do \
		echo "\033[1;34m[>] Generating proto for $$dir...\033[0m"; \
		npx protoc \
			--plugin=./node_modules/.bin/protoc-gen-ts_proto \
			--ts_proto_out=$(SERVICE_DIR)/$$dir/src/generated \
			--ts_proto_opt=outputServices=grpc-js,useExactTypes=false,esModuleInterop=true \
			--proto_path=./proto \
			./proto/*.proto; \
		echo "\033[1;32m[✓] $$dir done\033[0m"; \
	done

kafka-list-topics:
	docker compose exec kafka kafka-topics.sh --bootstrap-server localhost:9092 --list

kafka-user-created-list:
	docker compose exec kafka \
	kafka-console-consumer.sh \
	--bootstrap-server localhost:9092 \
	--topic user.created \
	--from-beginning

