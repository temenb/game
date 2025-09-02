
NODE_BIN=./node_modules/.bin

PRISMA_SERVICES := auth profile engine asteroid ship
SERVICE_DIR := services

prisma-migrate:
	@echo '🚀 Apply migrations...'
	@for service in $(PRISMA_SERVICES); do \
		echo "▶️  Running migrations for $$service..."; \
		cd ./services/$$service \
		pwd; \
		npx prisma migrate dev --schema=prisma/schema.prisma; \
		cd - > /dev/null; \
	done

prisma-generate:
	@echo '🚀 Generating Prisma clients...'
	@for service in $(PRISMA_SERVICES); do \
		echo '🚀 Generating' $$service 'Prisma client...' && \
		docker cp ./$(SERVICE_DIR)/$$service/prisma game-$$service:/usr/src/app/$(SERVICE_DIR)/$$service/prisma; \
		docker compose exec -T -w /usr/src/app/services/$$service $$service npx prisma generate; \
    done

seed:
	@echo "🌱 Запуск сидов"
	@for service in $(PRISMA_SERVICES); do \
		docker compose exec -T -w /usr/src/app/services/$$service $$service npx ts-node src/seed/seed.ts; \
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
DRY_RUN ?= true
COMMIT_MSG ?= anonymous-sign-in done

NODE_SERVICES := gateway auth profile engine ship asteroid mail
FLUTTER_SERVICES := front

commit-all:
	@for dir in $(NODE_SERVICES) $(FLUTTER_SERVICES); do \
		echo "\033[1;33m[*] Checking $$dir...\033[0m"; \
		SERVICE_PATH="$(SERVICE_DIR)/$$dir"; \
		if [ ! -d "$$SERVICE_PATH/.git" ]; then \
			echo "\033[0;31m[!] Skipping $$dir — not a git repo\033[0m"; \
			continue; \
		fi; \
		cd "$$SERVICE_PATH"; \
		if git diff --quiet; then \
			echo "\033[1;33m[-] No changes in $$dir\033[0m"; \
		else \
			if [ "$(DRY_RUN)" = "true" ]; then \
				echo "\033[0;32m[DRY-RUN] Would commit changes in $$dir\033[0m"; \
			else \
				git add . && \
				git commit -am "$(COMMIT_MSG)" && \
				echo "git commit -am \"$(COMMIT_MSG)\"" && \
				if git push; then \
					echo "\033[0;32m[✓] Committed changes in $$dir\033[0m"; \
				else \
					echo "\033[0;31m[✗] Failed to push $$dir\033[0m"; \
				fi; \
			fi; \
		fi; \
		cd - > /dev/null; \
    done

	@echo "\033[1;33m[*] Checking monorepo...\033[0m"
	if git diff --quiet; then \
		echo "\033[1;33m[-] No changes in monorepo\033[0m"; \
	else \
		if [ "$(DRY_RUN)" = "true" ]; then \
			echo "\033[0;32m[DRY-RUN] Would commit changes in monorepo\033[0m"; \
		else \
			git add . && \
			git commit -am "$(COMMIT_MSG)" && \
			echo "git commit -am \"$(COMMIT_MSG)\"" && \
			if git push; then \
				echo "\033[0;32m[✓] Committed changes in monorepo\033[0m"; \
			else \
				echo "\033[0;31m[✗] Failed to push monorepo\033[0m"; \
			fi; \
		fi; \
	fi;


PROTO_FILES := $(shell find proto -name '*.proto')

proto-generate:
	@echo '🚀 Proto generate...'

	@for dir in $(NODE_SERVICES) $(FLUTTER_SERVICES); do \
		echo "\033[1;33m[*] Checking $$dir...\033[0m"; \
		rm -rf $(SERVICE_DIR)/$$dir/src/generated; \
		mkdir -p $(SERVICE_DIR)/$$dir/src/generated; \
	done

	@for dir in $(NODE_SERVICES); do \
		echo "\033[1;34m[>] Generating proto for $$dir...\033[0m"; \
		npx protoc \
			--plugin=./node_modules/.bin/protoc-gen-ts_proto \
			--ts_proto_out=$(SERVICE_DIR)/$$dir/src/generated \
			--ts_proto_opt=outputServices=grpc-js,useExactTypes=false,esModuleInterop=true \
			--proto_path=./proto \
			$(PROTO_FILES); \
		echo "\033[1;32m[✓] $$dir done\033[0m"; \
	done

	@for dir in $(FLUTTER_SERVICES); do \
		echo "\033[1;34m[>] Generating proto for $$dir...\033[0m"; \
		rm -rf $(SERVICE_DIR)/$$dir/lib/generated; \
		mkdir -p $(SERVICE_DIR)/$$dir/lib/generated; \
		protoc \
			--dart_out=grpc:$(SERVICE_DIR)/$$dir/lib/grpc/generated \
			--proto_path=./proto \
			$(PROTO_FILES); \
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

