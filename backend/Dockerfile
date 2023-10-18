FROM python:3.12 as base

WORKDIR /backend

COPY ./requirements.txt /backend/requirements.txt

RUN pip install --upgrade pip

RUN pip install --no-cache -r /backend/requirements.txt

COPY . /backend

FROM base as development

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]