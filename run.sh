#!/bin/bash

# --- Color Codes ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function show_help() {
    echo "Usage: ./run.sh [command]"
    echo ""
    echo "Commands:"
    echo "  up        Start all containers in detached mode"
    echo "  down      Stop and remove containers"
    echo "  build     Rebuild images and start"
    echo "  logs      Tail logs for all services"
    echo "  db        Open MySQL terminal"
    echo "  clean     Stop and REMOVE all volumes (Wipe DB)"
    echo "  restart   Quick restart of containers"
    echo "  status    Show running containers"
}

case "$1" in
    up)
        echo -e "${GREEN}Starting services...${NC}"
        docker-compose up -d
        ;;
    down)
        echo -e "${YELLOW}Stopping services...${NC}"
        docker-compose down
        ;;
    build)
        echo -e "${GREEN}Rebuilding and starting...${NC}"
        docker-compose up -d --build
        ;;
    logs)
        docker-compose logs -f
        ;;
    db)
        echo -e "${GREEN}Connecting to MySQL...${NC}"
        docker exec -it mysql_db mysql -u root -p
        ;;
    clean)
        echo -e "${RED}WARNING: This will delete all database data!${NC}"
        read -p "Are you sure? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v
            echo -e "${GREEN}Volumes cleaned.${NC}"
        fi
        ;;
    restart)
        docker-compose restart
        ;;
    status)
        docker-compose ps
        ;;
    *)
        show_help
        ;;
esac