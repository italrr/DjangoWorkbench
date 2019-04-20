# DJANGO WORKBENCH

Django Workbench is a powerful tool used to spawn objects using ingredients & recipes. 
You can create your own ingredients and recipes!

Default URL: http://0.0.0.0:9090/workbench/

## Requirements 
	* Python 3.7
	* Django >=2.2
	* pip for python3

## How to build?
	Package can be installed with `pip3 install django-workbench.tar.gz`.
	There's no building nor deployment procedures as of now. No WSGI either.

## How to run?
	Package has to be decompressed first in order to run it.

	* To run it manually:
		python3 ./manage.py runserver 0.0.0.0:9090

	* With Honcho:
		honcho start server
		or 
		honcho start

	* Open in the browser at http://0.0.0.0:9090/workbench/

## How to use?
	There are 4 sections in this app. Each section with a specific purpose.

	HOME:
		Entry point of the application. It contains a welcome message and a preview of the current inventory.
	INGREDINTS:
		Here you can create new ingredients by providing a name. You also can see the list of ingredients currently in the system
	RECIPES:
		Here you can create recipes using ingredients, see the lists of recipes currently in the system. You also can remove any recipe.
	CRAFT:
		Craft is where the magic is done. Place your ingredients in the matrix/grid and press craft. You will have a success or failure message depending if the 			recipe is correct. The new object will be added to the invetory if it doesn't exist. Otherwise it'll increment the already existing item amount by one.




