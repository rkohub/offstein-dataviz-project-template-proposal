# Data Visualization Project

## Data

The Data I propose to visualize is the food nutrient dataset from the FDC

- Here is a link to the data
  - https://fdc.nal.usda.gov/download-datasets

- I had to purge many of the foods to fit the size
  requirements of vizhub, I might try and refactor the data, to only contain key nutrients to add all the food samples back in

- This contains a food and then a list of its nutrients, The
  name, and how much, in statistics, like median, max, min

## Attributes

- For each food there is a big list of nutrients and their quantities. The main ones Ill be looking at are
 "Carbohydrate, by difference", "Protein", "Total lipid (fat)", "Water", "Calcium, Ca", "Potassium, K", "Energy", "Starch", "Lactose"

## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

 * Finding the primary nutrients within key foods
 * Compare foods based on similarities in their nutrient quantities
 * Find food alternatives across nutrient categories
 * Take foods we know are healthy and discover what nutrients they contain

## Sketches


![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image.png)
This one shows a potential way to represent connections between fruits. By showing connections as similarities and then having a key where you can select which attribute or nutrient is represented by the size of the data.

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image2.png)
This visual shows other ways to potentially plot the data. To have two different attributes acros the X and Y axis and then Have friut images at the location of the fruits and these nutrients

These graphs work to show the foods and the similarities they have based onc ertain nutrients



## Prototypes

I’ve created a proof of concept visualization of this data. It's a scatterplot and it shows connections and similarities between foods in certain nutrient groups. Here is a picture from the first prototype

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image3.png)

This has two nutirents on the axises and points for each of the foods based on their quantitiy of that nutrient

Here is a link to the viz

- https://vizhub.com/rkohub/b8fb2cbd2b034c1380c461c4c763d36b

In this itteration

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image4.png)

- https://vizhub.com/rkohub/d955b4ef7727428baa77873f94f0170d

I have used AI tools to add selectors for the axis and a third attribute controlling the size of the circles. As well as axis scale options and hover to see the name of the food. 

## Week 6 Progress
- In week 6 I did some data cleaning/other polishing and turned some of my datapoints into images

- First I took the massive 6414KB Json file of all the data, and used a python script to trim out only the most important food nutrients and all the unnecessary data from the file, and turn it into a 601KB file that can fit in vizhub
- This allowed me to include all of the food data, and keep the file more organized, focused and lightweight
- Then I made some small adjustments to the food nutrient options, based on the most common nutrients, added a default circle size option, and added values to the circles when I hover them
- Lastly I used Wikipedia and creative commons to make a fetch request for images based on my foods
- It would query wikipedia for an image, and if it returns one, then display it instead of the circle
- You are able to see it works because clusters of related images are together on the scatterplot.

- From here I want to polish and make the images more clear And normalize some of the data based on the food sizes

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image5.png)

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image6.png)

## Open Questions

I'm not sure if I selected the best nutirient groups to filter on. Lastly other visualization methods, like a force-directed layout for the nodes would be interesting but would convey less data.

## Milestones

- [x] From here I hope to create better visuals for the food icons
- [x] Clean up the data, to show more foods

- [ ] And also create different ways to display the food similarities
- [ ] I also could incorproate color to cover another attribute

- [ ] From here I want to polish and make the images more clear
- [ ] And normalize some of the data based on the food sizes
