fulldeploy:
	git pull
	docker-compose up -d --force-recreate --build
	yarn # TODO: Would be nice to not need to install locally
	bash scripts/backup_db.sh --backup
	(cd scripts && npx tsx runmigrations.ts)
