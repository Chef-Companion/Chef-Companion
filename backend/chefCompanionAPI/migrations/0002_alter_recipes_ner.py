# Generated by Django 4.2.6 on 2023-10-27 03:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chefCompanionAPI', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipes',
            name='ner',
            field=models.CharField(db_column='NER', max_length=1024),
        ),
    ]