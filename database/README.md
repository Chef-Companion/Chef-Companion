# Initial Setup

Run:

`docker exec -it backend python manage.py makemigrations`

`docker exec -it backend python manage.py migrate`

Then run:

`docker exec -it database psql -d chefCompanionDB -U chef`

And paste in the contents of `mini.sql`.
