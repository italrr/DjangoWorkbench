# Generated by Django 2.2 on 2019-04-19 20:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('WorkbenchApp', '0007_auto_20190419_1649'),
    ]

    operations = [
        migrations.AlterField(
            model_name='inventory',
            name='Recipe',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='WorkbenchApp.Recipe'),
        ),
    ]
