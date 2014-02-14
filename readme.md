#mass#
##A quick tool to grab scans from shitty websites##

##Basic usage##
node app.js --url http://www.whatever.com/stuff/{}.html 

The {} represents the page number.  You probably need to go into the comic a page or two to discover where the page number belongs. We'll start at 1 and go up to 99 by default.  You can increase the max.

##Using all our options##
node app.js --url http://www.whatever.com/stuff/{}.html --id #image --max 500 --name nice_name

##Samples##
###Grabbing fairy tail 38 from mangahere###
node app.js --url http://www.mangahere.com/manga/fairy_tail/v38/c370/{}.html --name fairy_tail
###Grabbing freezing 21 from mangafox###
node app.js --url http://mangafox.me/manga/freezing/v21/c147/{}.html --name freezing
###Grabbing katekyo from mangago.com, notice the quotes around the id###
node app.js --url http://www.mangago.com/read-manga/katekyo/mw/c026.8/pg-{}/ --name katekyo --id "#page1"