# Web Dev Question

SPA creada para practicar como es una prueba de nivel. Y desplegada en Azure.

[Ver DEMO en Azure](https://weatheruk.azurewebsites.net)

## Enunciado de la prueba:

Your mission is to create a simple Angular.io app using Angular Material that displays monthly weather data as a chart.

The source data comes from the UK metoffice here: https://www.metoffice.gov.uk/climate/uk/summaries/datasets#Yearorder.

For convenience we’ve scraped this into JSON files on AWS S3 There are three metrics: Tmax (max temperature), Tmin (min temperature) and Rainfall (mm), and 4 locations: UK, England, Scotland, Wales. The url on S3 is:

https://s3.eu-west-2.amazonaws.com/interview-question-data/metoffice/{metric}-{location}.json

E.g: 
https://s3.eu-west-2.amazonaws.com/interview-question-data/metoffice/Rainfall-England.json

(Note that Jan=1, Dec=12)

The bare minimum app will fetch the data on-demand from S3 to show a single metric for a single geographic region between two user-supplied dates e.g Max Temp for the UK between two dates.

The graph should update automatically when the dates are changed.

The app must be responsive i.e it should still work on small screens. 

The app should be runnable out of the box, but deployment is optional.
