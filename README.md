# Chef-Companion

## Installation

Install Docker on your machine: [Install Docker Engine](https://docs.docker.com/engine/install/)

Clone the repo: ` git clone https://github.com/Chef-Companion/Chef-Companion.git` or `git clone git@github.com:Chef-Companion/Chef-Companion.git`

Navigate into repo folder: `cd Chef-Companion`

## Building

Run: `docker compose build`

## First Time Setup

If this is your first time setting up the project, some additional steps are needed.

To make the database tables run:

`docker exec -it backend python manage.py makemigrations`

Then

`docker exec -it backend python manage.py migrate`

To import the database run:

`docker exec -it database psql -d chefCompanionDB -U chef`

Paste in the contents of [/database/mini.sql](https://github.com/Chef-Companion/Chef-Companion/blob/main/database/mini.csv)

Press Enter

## Running

Run: `docker compose up`

Navigate to http://localhost:3000

## Development

Both the frontend and the backend will live update when code changes are made.

If new NPM or PIP packages are installed in the frontend or backend respectively, the container will have to be rebuilt. To do this rerun the [Build](#building) step.