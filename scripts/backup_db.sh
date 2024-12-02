#!/bin/bash

# For more info, view here:
# https://medium.com/@burakkocakeu/get-pg-dump-from-a-docker-container-and-pg-restore-into-another-in-5-steps-74ca5bf0589c

# Run this from the main directory, not from /scripts

# To backup: bash scripts/backup_db.sh --backup
# To restore: bash scripts/backup_db.sh --restore <filename>.tar

source .env

CONTAINER_NAME=$(basename "$(pwd)")-db-1

while (( "$#" )); do
  case "$1" in
    -b|--backup)
      DATE=$(date +"%Y_%m_%d")
      mkdir -p db_backups
      # docker exec <container-name> pg_dump -U <mydbUser> -F t <mydbName> > mydb.tar
      docker exec $CONTAINER_NAME pg_dump -U $POSTGRESDB_USER -F t $POSTGRESDB_DATABASE > db_backups/boilerplate_db_$DATE.tar
      shift
      ;;
    -r|--restore)
      if [ -n "$2" ] && [ ${2:0:1} != "-" ]; then
        docker cp db_backups/$2 $CONTAINER_NAME:/
        docker exec $CONTAINER_NAME pg_restore -U $POSTGRESDB_USER -C -d $POSTGRESDB_DATABASE $2
        shift 2
      else
        echo "Error: Argument for $1 is missing" >&2
        exit 1
      fi
      ;;
    -*|--*=) # unsupported flags
      echo "Error: Unsupported flag $1" >&2
      exit 1
      ;;
    *) # preserve positional arguments
      PARAMS="$PARAMS $1"
      shift
      ;;
  esac
done


# TODO: Backup to Gdrive
