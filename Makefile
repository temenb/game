include parameters.mk

NODE_BIN=./node_modules/.bin
SERVICE_DIR := services

PROTO_FILES := $(shell find proto -name '*.proto')


NODE_PROTO_PATH=./src/grpc/generated
FLUTTER_PROTO_PATH=./lib/src/grpc/generated

up:
	@echo "🚀 Запуск docker compose (поднимаем все сервисы)..."
	@docker compose up -d
	@echo "✅ Сервисы запущены!"

install:
	@echo "🔧 Инициализация проекта"
	@echo "🔧 Клонирование подмодулей"
	@git submodule update --init --recursive > /dev/null 2>&1
	@echo "📦 Проверка .env файлов для всех сервисов..."
	@for service in $(NODE_SERVICES) $(FLUTTER_SERVICES); do \
		ENV_PATH="$(SERVICE_DIR)/$$service/.env"; \
		ENV_EXAMPLE_PATH="$(SERVICE_DIR)/$$service/.env.dist"; \
		if [ ! -f "$$ENV_PATH" ] && [ -f "$$ENV_EXAMPLE_PATH" ]; then \
			echo "[env] Копирую .env для $$service"; \
			cp "$$ENV_EXAMPLE_PATH" "$$ENV_PATH"; \
		fi; \
	done
	@if [ ! -f "docker-compose.yml" ] && [ -f "docker-compose.yml.dist" ]; then \
        echo "[env] Создаю docker-compose.yml из docker-compose.yml.dist"; \
        cp docker-compose.yml.dist docker-compose.yml; \
    fi
	@make proto-generate bip=no
	@make reset

bip:
	@paplay /usr/share/sounds/freedesktop/stereo/complete.oga

migrate:
	@echo '🚀 Apply migrations...'
	@if [ -n "$(service)" ]; then \
  		echo "▶️  Running migrations for $(service)..."; \
		docker compose exec -T -w /usr/src/app/$(SERVICE_DIR)/$(service) $(service) npx prisma migrate dev --schema=prisma/schema.prisma; \
	else \
		for s in $(PRISMA_SERVICES); do \
			echo "▶️  Running migrations for $$s..."; \
			docker compose exec -T -w /usr/src/app/$(SERVICE_DIR)/$$s $$s npx prisma migrate dev --schema=prisma/schema.prisma; \
		done \
	fi
	@if [ "$(bip)" != "no" ]; then \
		$(MAKE) bip; \
	fi

prisma-generate:
	@echo '🚀 Generating Prisma clients...'
	@for service in $(PRISMA_SERVICES); do \
		echo '🚀 Generating' $$service 'Prisma client...' && \
		docker cp ./$(SERVICE_DIR)/$$service/prisma game-$$service:/usr/src/app/$(SERVICE_DIR)/$$service; \
		docker compose exec -T -w /usr/src/app/services/$$service $$service npx prisma generate; \
	done
	@if [ "$(bip)" != "no" ]; then \
		$(MAKE) bip; \
	fi

reset:
	docker stop $$(docker ps -aq) || true
	docker rm $$(docker ps -aq) || true
	docker volume rm $$(docker volume ls -q) || true
	docker compose up -d
	@make migrate bip=no
	docker stop $$(docker ps -aq) || true
	docker rm $$(docker ps -aq) || true
	docker compose up -d
	@make bip


seed:
	@echo "🌱 Запуск сидов"
	@for service in $(PRISMA_SERVICES); do \
		docker compose exec -T -w /usr/src/app/services/$$service $$service npx ts-node src/seed/seed.ts; \
	done
	@if [ "$(bip)" != "no" ]; then \
		$(MAKE) bip; \
	fi

git-commit-and-push-all:
	@echo "🚀 Commit all repos..."
	@make git-commit-all bip=no
	@echo "🚀 Push all repos..."
	@make git-push-all bip=no
	@make bip

git-commit-all:
	@for dir in $(GIT_SERVICES); do \
		echo "\033[1;33m[*] Checking $$dir...\033[0m"; \
		SERVICE_PATH="$(SERVICE_DIR)/$$dir"; \
		if [ ! -e "$$SERVICE_PATH/.git" ]; then \
			echo "\033[0;31m[!] Skipping $$dir — not a git repo\033[0m"; \
			continue; \
		fi; \
		cd "$$SERVICE_PATH"; \
		if git diff --quiet; then \
			echo "\033[1;33m[-] No changes in $$dir\033[0m"; \
		else \
			git add . && \
			git commit -am "$(COMMIT_MSG)" && \
			echo "\033[0;32m[✓] Committed changes in $$dir\033[0m"; \
		fi; \
		cd - > /dev/null; \
	done

	@echo "\033[1;33m[*] Checking monorepo...\033[0m"; \
	if git diff --quiet; then \
		echo "\033[1;33m[-] No changes in monorepo\033[0m"; \
	else \
		git add . && \
		git commit -am "$(COMMIT_MSG)" && \
		echo "\033[0;32m[✓] Committed changes in monorepo\033[0m"; \
	fi;
	@if [ "$(bip)" != "no" ]; then \
		$(MAKE) bip; \
	fi


git-push-all:
	@for dir in $(GIT_SERVICES); do \
		echo "\033[1;34m[*] Pushing $$dir...\033[0m"; \
		SERVICE_PATH="$(SERVICE_DIR)/$$dir"; \
		cd "$$SERVICE_PATH"; \
		if git push; then \
			echo "\033[0;32m[✓] Pushed $$dir\033[0m"; \
		else \
			echo "\033[0;31m[✗] Failed to push $$dir\033[0m"; \
		fi; \
		cd - > /dev/null; \
	done

	@echo "\033[1;34m[*] Pushing monorepo...\033[0m"
	if git push; then \
		echo "\033[0;32m[✓] Pushed monorepo\033[0m"; \
	else \
		echo "\033[0;31m[✗] Failed to push monorepo\033[0m"; \
	fi
	@if [ "$(bip)" != "no" ]; then \
		$(MAKE) bip; \
	fi

proto-generate:
	@echo '🚀 Proto generate...'

	@for dir in $(NODE_SERVICES); do \
		echo "\033[1;33m[*] Checking $$dir...\033[0m"; \
		rm -rf $(SERVICE_DIR)/$$dir/${NODE_PROTO_PATH}; \
		mkdir -p $(SERVICE_DIR)/$$dir/${NODE_PROTO_PATH}; \
	done

	@for dir in $(FLUTTER_SERVICES); do \
		echo "\033[1;33m[*] Checking $$dir...\033[0m"; \
		rm -rf $(SERVICE_DIR)/$$dir/${FLUTTER_PROTO_PATH}; \
		mkdir -p $(SERVICE_DIR)/$$dir/${FLUTTER_PROTO_PATH}; \
	done

	@for dir in $(NODE_SERVICES); do \
		echo "\033[1;34m[>] Generating proto for $$dir...\033[0m"; \
		npx protoc \
			--plugin=./node_modules/.bin/protoc-gen-ts_proto \
			--ts_proto_out=$(SERVICE_DIR)/$$dir/${NODE_PROTO_PATH} \
			--ts_proto_opt=outputServices=grpc-js,useExactTypes=false,esModuleInterop=true \
			--proto_path=./proto \
			$(PROTO_FILES); \
		echo "\033[1;32m[✓] $$dir done\033[0m"; \
	done

	@for dir in $(FLUTTER_SERVICES); do \
		echo "\033[1;34m[>] Generating proto for $$dir...\033[0m"; \
		protoc \
			--dart_out=grpc:$(SERVICE_DIR)/$$dir/${FLUTTER_PROTO_PATH} \
			--proto_path=./proto \
			$(PROTO_FILES); \
		echo "\033[1;32m[✓] $$dir done\033[0m"; \
	done
	@if [ "$(bip)" != "no" ]; then \
		$(MAKE) bip; \
	fi





kafka-list-topics:
	docker compose exec kafka /opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list

kafka-user-created-list:
	docker compose exec kafka /opt/kafka/bin/kafka-console-consumer.sh \
	  --bootstrap-server localhost:9092 \
	  --topic user.created \
	  --from-beginning






test:
	@echo "🧪 Запуск тестов"

	@for service in $(NODE_SERVICES); do \
		echo '🚀 Test' $$service service && \
		docker compose exec -T -w /usr/src/app/services/$$service $$service pnpm test; \
	done
	@make bip

tmux:
	tmux new-session -d -s logs
	tmux send-keys -t logs:0 'docker compose logs -f streaming | lnav -t ' C-m
	tmux split-window -h -t logs:0
	tmux send-keys -t logs:0.1 'docker compose logs -f battle | lnav -t ' C-m
	tmux split-window -v -t logs:0.1
	tmux send-keys -t logs:0.2 'docker compose logs -f engine | lnav -t ' C-m
	tmux split-window -v -t logs:0.0
	tmux select-pane -t logs:0.1
	tmux attach -t logs
