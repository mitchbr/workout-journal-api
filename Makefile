fulldeploy:
	git pull
	docker-compose up -d --force-recreate --build
	bash scripts/backup_db.sh --backup
	(cd scripts && npx tsx runmigrations.ts)
