# Data Visualization Project

## Data

The data in this report is the food nutrient dataset from the FDC

- Here is a link to the data
  - https://fdc.nal.usda.gov/download-datasets

- This dataset is a huge list of foods and the nutrients contained in them
  - What else comes with that information is names of many different types of nutrients, food groops, and statistics on how much quantity of certain nutrients are in each food.
- The full data file is nearly 7MB which is very difficult to use. So I cleaned the JSON file by removing all the unnecessary information and only keeping certain attributes and properties which ill talk about below. 

## Attributes
- For each food the only information I decided to keep was
  - The Name of the food
  - The Food Group 
    - Here is a list of all the food groups
      - Baked Products
      - Beef Products
      - Beverages
      - Cereal Grains and Pasta
      - Dairy and Egg Products
      - Finfish and Shellfish Products
      - Fruits and Fruit Juices
      - Lamb, Veal, and Game Products
      - Legumes and Legume Products
      - Nut and Seed Products
      - Pork Products
      - Poultry Products
      - Restaurant Foods
      - Sausages and Luncheon Meats
      - Soups, Sauces, and Gravies
      - Spices and Herbs
      - Vegetables and Vegetable Pr..
  - And I also Only decided to keep a list of the 12 most common nutrients in the data set.
    - Here is a list of those nutrients
      - Potassium, K
      - Zinc, Zn
      - Magnesium, Mg
      - Protein
      - Phosphorus, P
      - Calcium, Ca
      - Total lipid (fat)
      - Water
      - Iron, Fe
      - Carbohydrate, by difference
      - Sodium, Na
      - Vitamin B-6

## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

 * Finding the primary nutrients within key foods
 * Compare foods based on similarities in their nutrient quantities
 * Find food alternatives across nutrient categories
 * Take foods we know are healthy and discover what nutrients they contain

## Preliminary Desing work / Sketches

- This first sketch shows a potential idea where foods are connected to other similar foods in a graph like structure, and you can select which attribute represents the similarity/conenctions between teh foods in a key.

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image.png)

- This other visual shows another way of plotting more attributes(nutrients) of each food. This takes both axis of a plot and puts a point (or a food icon in this case) in the location relating to how much of that nutrient that food has. 

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image2.png)

- These graphs work to show the foods and the similarities they have based on certain nutrients

## Prototypes/First Visual Itterations

- My first proof of concept visualization looked like this. It's a scatterplot and it successfully draws out the location of a select group of the foods on the two axis. 
- Here is a picture from the first prototype

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image3.png)

- This has two nutirents on the axises and points for each of the foods based on their quantitiy of that nutrient
- Here is a link to the viz
  - https://vizhub.com/rkohub/b8fb2cbd2b034c1380c461c4c763d36b

## Next Itteration (Sizing) 

- In this itteration I added more control to the users choices by providing a selector along the top where you can choose between the different food attributes to be represented on both of the axis.
- I also added a 3rd attribute which can be plotted and represented by the size of the circles on the plot
- This is also where I added hovering over each of the circles to get more information about which food and its values. 

- Here is an image of that 

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image4.png)

- And a link to the viz
  - https://vizhub.com/rkohub/d955b4ef7727428baa77873f94f0170d


## Mid Project Progress
- By the Middle or so of the project, I focused on some data cleaning/other polishing and turned some of my datapoints into images

- First I took the massive 6414KB Json file of all the data, and used a python script to trim out only the most important food nutrients and all the unnecessary data from the file, and turn it into a 601KB file that can fit in vizhub
- This allowed me to include all of the food data, and keep the file more organized, focused and lightweight
- Then I made some small adjustments to the food nutrient options, based on the most common nutrients, added a default circle size option, and added values to the circles when I hover them
- Lastly I used Wikipedia and creative commons to make a fetch request for images based on my foods
  - It would query wikipedia for an image, and if it returns one, then display it instead of the circle
- You are able to see it works because clusters of related images are together on the scatterplot.

- From here I want to polish and make the images more clear And normalize some of the data based on the food sizes

- Here are some of the images of that progress

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image5.png)

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image6.png)

- And a link to the viz
  - https://vizhub.com/rkohub/30a230ae3bfb4e06b801262857ecfce9

## Next Progress, Categories, and Controls. 

- This week I added on some categorical variables with some color coding for different food groups. 
- I did a different round of cleaning on the data to make sure that it only have the required data as well as adding the categorical food group attribute
- I also added more toggles to toggle a key/legend and to toggle between showing all the dots, and showing the images

- Here are some of the images of that progress

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image7.png)

- And a link to the viz
  - https://vizhub.com/rkohub/0e0b74ce0aee40cba552e35fcff1fedc

## Approaching a Final Product, Interaction

- This week I added Things relating to interaction. 
- I already had some hoverable information about each food, so I expanded upon that and added a little growing indicator
- I also added hovering of the categories similar to the demo videos. 
- Next I made the transitions betweens states animated for some added flare
- And lastly I did some small quality of life changes with scaling and the images. 

- Here are some of the images of that progress

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image8.png)

![image](https://github.com/rkohub/offstein-dataviz-project-template-proposal/blob/master/image9.png)

- And a link to the viz
  - https://vizhub.com/rkohub/406a889450184d93a2352415227b8c47