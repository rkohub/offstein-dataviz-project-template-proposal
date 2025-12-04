import {
  useRef,
  useEffect,
  createElement,
  useState,
} from 'react';
import { select, json } from 'd3';
import { viz } from './viz.js';

const nutrientOptions = [
  'Potassium, K',
  'Zinc, Zn',
  'Magnesium, Mg',
  'Protein',
  'Phosphorus, P',
  'Calcium, Ca',
  'Total lipid (fat)',
  'Water',
  'Iron, Fe',
  'Carbohydrate, by difference',
  'Sodium, Na',
  'Vitamin B-6',
];

const scaleOptions = ['log', 'linear'];

const App = () => {
  const svgRef = useRef();
  const [data, setData] = useState([]);
  const [xNutrient, setXNutrient] = useState(
    'Total lipid (fat)',
  );
  const [yNutrient, setYNutrient] = useState('Protein');
  const [radiusNutrient, setRadiusNutrient] =
    useState('Constant Size');
  const [scaleType, setScaleType] = useState('log');
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 120,
  });
  const [foodImages, setFoodImages] = useState({});
  const [imagesLoading, setImagesLoading] = useState(true);
  const [useImages, setUseImages] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 120,
      });
    };

    window.addEventListener('resize', handleResize);
    return () =>
      window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    json('data.json').then((loadedData) => {
      const formattedData = loadedData.FoundationFoods.map(
        (food, index) => {
          const nutrients = {};
          food.foodNutrients.forEach((nutrientObj) => {
            nutrients[nutrientObj.nutrient.name] =
              parseFloat(nutrientObj.amount) || 0;
          });
          return {
            id: index,
            description: food.description,
            nutrients: nutrients,
            foodCategory: food.foodCategory,
          };
        },
      );

      setData(formattedData);

      // Fetch images for all foods
      const fetchImages = async () => {
        setImagesLoading(true);
        const images = {};
        for (const food of loadedData.FoundationFoods) {
          const foodName = food.description
            .split(',')[0]
            .trim();
          try {
            const response = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&titles=${foodName}&prop=pageimages&format=json&pithumbsize=200&origin=*`,
            );
            const data = await response.json();
            const pages = data.query.pages;
            const page = Object.values(pages)[0];
            if (page.thumbnail) {
              images[food.description] =
                page.thumbnail.source;
            }
          } catch (error) {
            console.error(
              `Error fetching image for ${foodName}:`,
              error,
            );
          }
        }
        setFoodImages(images);
        setImagesLoading(false);
      };

      fetchImages();
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const svg = select(svgRef.current);
      viz(svg, {
        data,
        width: dimensions.width,
        height: dimensions.height,
        margin: {
          top: 20,
          right: 40,
          bottom: 70,
          left: 80,
        },
        xValue: (d) => d.nutrients[xNutrient] || 0,
        yValue: (d) => d.nutrients[yNutrient] || 0,
        rValue: (d) => d.nutrients[radiusNutrient] || 0,
        scaleType,
        fill: '#00ccff',
        xAxisLabel: xNutrient + ' (g)',
        yAxisLabel: yNutrient + ' (g)',
        radiusLabel: radiusNutrient,
        xAxisLabelOffsetY: 10,
        yAxisLabelOffsetX: -20,
        yAxisLabelOffsetY: 15,
        axisLabelFontSize: '16px',
        axisTickFontSize: '12px',
        constantRadius: radiusNutrient === 'Constant Size',
        xNutrient,
        yNutrient,
        radiusNutrient,
        foodImages,
        useImages,
        showLegend,
      });
    }
  }, [
    data,
    xNutrient,
    yNutrient,
    radiusNutrient,
    scaleType,
    dimensions,
    foodImages,
    useImages,
    showLegend,
  ]);

  const handleXChange = (event) => {
    setXNutrient(event.target.value);
  };

  const handleYChange = (event) => {
    setYNutrient(event.target.value);
  };

  const handleRadiusChange = (event) => {
    setRadiusNutrient(event.target.value);
  };

  const handleScaleChange = (event) => {
    setScaleType(event.target.value);
  };

  const handleToggleChange = (event) => {
    const newUseImages = event.target.checked;
    setUseImages(newUseImages);
    // Disable legend when showing images
    if (newUseImages) {
      setShowLegend(false);
    } else {
      setShowLegend(true);
    }
  };

  const handleLegendToggle = (event) => {
    setShowLegend(event.target.checked);
  };

  return createElement(
    'div',
    {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        padding: '0',
        margin: '0',
        overflow: 'hidden',
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      },
    },
    [
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '10px',
            marginTop: '10px',
            width: '100%',
            flexWrap: 'wrap',
          },
        },
        [
          createElement(
            'h1',
            {
              style: {
                fontSize: '24px',
                fontWeight: '600',
                margin: '0',
                whiteSpace: 'nowrap',
                color: '#333',
              },
            },
            'Food Comparison by Nutrients',
          ),
          imagesLoading &&
            createElement(
              'div',
              {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 10px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '5px',
                },
              },
              [
                createElement('div', {
                  style: {
                    width: '16px',
                    height: '16px',
                    border: '2px solid #ccc',
                    borderTop: '2px solid #333',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  },
                }),
                createElement(
                  'span',
                  {
                    style: {
                      fontSize: '12px',
                      color: '#333',
                    },
                  },
                  'Loading images...',
                ),
              ],
            ),
        ],
      ),
      createElement(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '15px',
            width: '100%',
            padding: '10px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          },
        },
        [
          createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '5px',
              },
            },
            [
              createElement(
                'label',
                {
                  style: {
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#555',
                  },
                },
                'X Axis:',
              ),
              createElement(
                'select',
                {
                  value: xNutrient,
                  onChange: handleXChange,
                  style: {
                    padding: '8px 12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    minWidth: '180px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  },
                },
                nutrientOptions.map((nutrient) =>
                  createElement(
                    'option',
                    {
                      key: `x-${nutrient}`,
                      value: nutrient,
                    },
                    nutrient,
                  ),
                ),
              ),
            ],
          ),
          createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '5px',
              },
            },
            [
              createElement(
                'label',
                {
                  style: {
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#555',
                  },
                },
                'Y Axis:',
              ),
              createElement(
                'select',
                {
                  value: yNutrient,
                  onChange: handleYChange,
                  style: {
                    padding: '8px 12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    minWidth: '180px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  },
                },
                nutrientOptions.map((nutrient) =>
                  createElement(
                    'option',
                    {
                      key: `y-${nutrient}`,
                      value: nutrient,
                    },
                    nutrient,
                  ),
                ),
              ),
            ],
          ),
          createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '5px',
              },
            },
            [
              createElement(
                'label',
                {
                  style: {
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#555',
                  },
                },
                'Point Size:',
              ),
              createElement(
                'select',
                {
                  value: radiusNutrient,
                  onChange: handleRadiusChange,
                  style: {
                    padding: '8px 12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    minWidth: '180px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  },
                },
                [
                  createElement(
                    'option',
                    {
                      key: 'constant',
                      value: 'Constant Size',
                    },
                    'Constant Size',
                  ),
                  ...nutrientOptions.map((nutrient) =>
                    createElement(
                      'option',
                      {
                        key: `r-${nutrient}`,
                        value: nutrient,
                      },
                      nutrient,
                    ),
                  ),
                ],
              ),
            ],
          ),
          createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '5px',
              },
            },
            [
              createElement(
                'label',
                {
                  style: {
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#555',
                  },
                },
                'Scale Type:',
              ),
              createElement(
                'select',
                {
                  value: scaleType,
                  onChange: handleScaleChange,
                  style: {
                    padding: '8px 12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    minWidth: '120px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  },
                },
                scaleOptions.map((scale) =>
                  createElement(
                    'option',
                    {
                      key: scale,
                      value: scale,
                    },
                    scale.charAt(0).toUpperCase() +
                      scale.slice(1),
                  ),
                ),
              ),
            ],
          ),
          createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '5px',
              },
            },
            [
              createElement(
                'label',
                {
                  style: {
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#555',
                  },
                },
                'Display:',
              ),
              createElement(
                'label',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    minWidth: '120px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: imagesLoading
                      ? 'not-allowed'
                      : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: imagesLoading ? 0.5 : 1,
                  },
                },
                [
                  createElement('input', {
                    type: 'checkbox',
                    checked: useImages,
                    onChange: handleToggleChange,
                    disabled: imagesLoading,
                    style: {
                      cursor: imagesLoading
                        ? 'not-allowed'
                        : 'pointer',
                    },
                  }),
                  createElement(
                    'span',
                    null,
                    'Use Food Images',
                  ),
                ],
              ),
            ],
          ),
          createElement(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '5px',
              },
            },
            [
              createElement(
                'label',
                {
                  style: {
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#555',
                  },
                },
                'Legend:',
              ),
              createElement(
                'label',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    fontSize: '14px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    backgroundColor: '#fff',
                    minWidth: '120px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    cursor: useImages
                      ? 'not-allowed'
                      : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: useImages ? 0.5 : 1,
                  },
                },
                [
                  createElement('input', {
                    type: 'checkbox',
                    checked: showLegend,
                    onChange: handleLegendToggle,
                    disabled: useImages,
                    style: {
                      cursor: useImages
                        ? 'not-allowed'
                        : 'pointer',
                    },
                  }),
                  createElement(
                    'span',
                    null,
                    'Show Legend',
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      createElement('svg', {
        ref: svgRef,
        style: {
          width: dimensions.width,
          height: dimensions.height,
          border: '1px solid #ddd',
          backgroundColor: 'white',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      }),
    ],
  );
};

export { App };
