include .env
export

node_modules: package.json
	npm i

up: node_modules
	npm run dev

up-build:
	node .output/server/index.mjs
