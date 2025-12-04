import {
  select,
  scaleLog,
  scaleLinear,
  extent,
  axisBottom,
  axisLeft,
} from 'd3';

// Define a color scale for food categories
const categoryColors = {
  'Legumes and Legume Products': '#ff7f0e',
  'Vegetables and Vegetable Products': '#2ca02c',
  'Fruits and Fruit Juices': '#d62728',
  'Dairy and Egg Products': '#9467bd',
  'Spices and Herbs': '#8c564b',
  Sweets: '#e377c2',
  'Cereal Grains and Pasta': '#7f7f7f',
  'Fast Foods': '#bcbd22',
  'Meals, Entrees, and Side Dishes': '#17becf',
  Snacks: '#aec7e8',
  'Nut and Seed Products': '#ffbb78',
  'Beef Products': '#98df8a',
  'Pork Products': '#ff9896',
  'Poultry Products': '#c5b0d5',
  'Finfish and Shellfish Products': '#c49c94',
  'Restaurant Foods': '#f7b6d2',
  'American Indian/Alaska Native Foods': '#c7c7c7',
  'Baked Products': '#dbdb8d',
  'Soups, Sauces, and Gravies': '#9edae5',
  Beverages: '#ff9f9b',
  'Baby Foods': '#b6e3d4',
  'Breakfast Cereals': '#d1c1e1',
  'Fats and Oils': '#f4cae4',
};

export const viz = (
  selection,
  {
    data,
    xValue,
    yValue,
    rValue,
    scaleType,
    fill,
    width,
    height,
    margin = { top: 20, right: 20, bottom: 60, left: 70 },
    xAxisLabel = 'Carbohydrate, by difference (g)',
    yAxisLabel = 'Protein (g)',
    radiusLabel = 'Water',
    xAxisLabelOffsetY = 10,
    yAxisLabelOffsetX = -15,
    yAxisLabelOffsetY = 15,
    axisLabelFontSize = '16px',
    axisTickFontSize = '12px',
    constantRadius = false,
    xNutrient,
    yNutrient,
    radiusNutrient,
    foodImages,
    useImages = false,
    showLegend = true,
  },
) => {
  // Calculate inner dimensions
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Filter out data points where xValue or yValue is NaN
  let filteredData = data.filter(
    (d) => !isNaN(xValue(d)) && !isNaN(yValue(d)),
  );

  // For log scale, filter out values <= 0
  if (scaleType === 'log') {
    filteredData = filteredData.filter(
      (d) => xValue(d) > 0 && yValue(d) > 0,
    );
  }

  // Get extent of data
  const xExtent = extent(filteredData, xValue);
  const yExtent = extent(filteredData, yValue);

  // Add padding to avoid points at the edges
  const xPadding = (xExtent[1] - xExtent[0]) * 0.05;
  const yPadding = (yExtent[1] - yExtent[0]) * 0.05;

  // Create scales based on selected type
  const xScale = (
    scaleType === 'log' ? scaleLog : scaleLinear
  )()
    .domain([xExtent[0], xExtent[1] + xPadding])
    .range([margin.left, margin.left + innerWidth]);

  const yScale = (
    scaleType === 'log' ? scaleLog : scaleLinear
  )()
    .domain([yExtent[0], yExtent[1] + yPadding])
    .range([height - margin.bottom, margin.top]);

  // Create radius scale or constant radius
  let rScale;
  let actualRadiusLabel = constantRadius
    ? 'Constant Size'
    : radiusLabel;

  if (!constantRadius) {
    const rExtent = extent(filteredData, rValue);
    rScale = scaleLinear().domain(rExtent).range([5, 25]);
  }

  // Add x-axis
  const xAxis = axisBottom(xScale);
  selection
    .selectAll('.x-axis')
    .data([null])
    .join('g')
    .attr('class', 'x-axis')
    .attr(
      'transform',
      `translate(0, ${height - margin.bottom})`,
    )
    .call(xAxis)
    .selectAll('text')
    .attr('font-size', axisTickFontSize)
    .attr('font-family', 'sans-serif');

  // Add y-axis
  const yAxis = axisLeft(yScale);
  selection
    .selectAll('.y-axis')
    .data([null])
    .join('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(yAxis)
    .selectAll('text')
    .attr('font-size', axisTickFontSize)
    .attr('font-family', 'sans-serif');

  // Add x-axis label
  selection
    .selectAll('.x-axis-label')
    .data([null])
    .join('text')
    .attr('class', 'x-axis-label')
    .attr('x', margin.left + innerWidth / 2)
    .attr('y', height - xAxisLabelOffsetY)
    .attr('text-anchor', 'middle')
    .attr('font-size', axisLabelFontSize)
    .attr('font-family', 'sans-serif')
    .text(xAxisLabel);

  // Add y-axis label
  selection
    .selectAll('.y-axis-label')
    .data([null])
    .join('text')
    .attr('class', 'y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2 - margin.top / 2)
    .attr('y', yAxisLabelOffsetY)
    .attr('text-anchor', 'middle')
    .attr('font-size', axisLabelFontSize)
    .attr('font-family', 'sans-serif')
    .text(yAxisLabel);

  // Create tooltip div
  const tooltip = select('body')
    .selectAll('.tooltip')
    .data([null])
    .join('div')
    .attr('class', 'tooltip');

  // Create pattern definitions for images
  const defs = selection
    .selectAll('defs')
    .data([null])
    .join('defs');

  const patterns = defs
    .selectAll('pattern')
    .data(filteredData, (d) => d.description)
    .join('pattern')
    .attr('id', (d) => `pattern-${d.id}`)
    .attr('width', 1)
    .attr('height', 1)
    .attr('patternUnits', 'objectBoundingBox')
    .attr('patternContentUnits', 'objectBoundingBox');

  patterns
    .selectAll('image')
    .data((d) => [d])
    .join('image')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 1)
    .attr('height', 1)
    .attr('href', (d) => foodImages[d.description] || '')
    .attr('preserveAspectRatio', 'xMidYMid slice');

  // Add circles with radius based on selected nutrient or constant size
  const circles = selection
    .selectAll('circle')
    .data(filteredData, (d) => d.id)
    .join('circle')
    .attr('fill', (d) => {
      if (useImages && foodImages[d.description]) {
        return `url(#pattern-${d.id})`;
      }
      // Color by food category
      return categoryColors[d.foodCategory] || '#00ccff';
    })
    .attr('stroke', '#333')
    .attr('stroke-width', 2)
    .attr(
      'class',
      (d) =>
        `food-circle category-${d.foodCategory.replace(/\s+/g, '-').replace(/[\/,]/g, '')}`,
    )
    .on('mouseover', (event, d) => {
      // Build tooltip content
      let content = `<strong>${d.description}</strong><br/>`;
      content += `Category: ${d.foodCategory}<br/>`;

      // Add X and Y nutrient information
      content += `${xNutrient}: ${xValue(d).toFixed(2)} g<br/>`;
      content += `${yNutrient}: ${yValue(d).toFixed(2)} g`;

      // Only add radius nutrient info if not constant size
      if (!constantRadius && radiusNutrient) {
        const rUnit =
          radiusNutrient === 'Water'
            ? 'g'
            : [
                  'Iron, Fe',
                  'Magnesium, Mg',
                  'Phosphorus, P',
                  'Sodium, Na',
                  'Vitamin B-6',
                ].includes(radiusNutrient)
              ? 'mg'
              : 'g';
        content += `<br/>${radiusNutrient}: ${rValue(d).toFixed(2)} ${rUnit}`;
      }

      // Get tooltip dimensions
      tooltip
        .html(content)
        .style('opacity', 0)
        .style('display', 'block');

      const tooltipNode = tooltip.node();
      const tooltipWidth = tooltipNode.offsetWidth;
      const tooltipHeight = tooltipNode.offsetHeight;

      // Calculate position, ensuring tooltip stays within viewport
      let left = event.pageX + 10;
      let top = event.pageY - 10;

      // Check right boundary
      if (left + tooltipWidth > window.innerWidth) {
        left = event.pageX - tooltipWidth - 10;
      }

      // Check bottom boundary
      if (top + tooltipHeight > window.innerHeight) {
        top = event.pageY - tooltipHeight - 10;
      }

      // Check left boundary
      if (left < 0) {
        left = 10;
      }

      // Check top boundary
      if (top < 0) {
        top = 10;
      }

      tooltip
        .style('opacity', 1)
        .style('left', left + 'px')
        .style('top', top + 'px');

      // Grow circle on hover if constant radius is used
      if (constantRadius) {
        select(event.target)
          .attr('r', 15)
          .attr('stroke-width', 3);
      }
    })
    .on('mouseout', (event) => {
      tooltip.style('opacity', 0).style('display', 'none');

      // Reset circle size on mouseout if constant radius is used
      if (constantRadius) {
        select(event.target)
          .attr('r', 12)
          .attr('stroke-width', 2);
      }
    });

  // Animate transitions for position and radius
  circles
    .transition()
    .duration(800)
    .attr('cx', (d) => xScale(xValue(d)))
    .attr('cy', (d) => yScale(yValue(d)))
    .attr(
      'r',
      constantRadius ? 12 : (d) => rScale(rValue(d)),
    );

  // Add legend
  if (showLegend && !useImages) {
    // Get unique categories present in the data
    const categoriesInData = [
      ...new Set(filteredData.map((d) => d.foodCategory)),
    ].sort();

    const legendWidth = 250;
    const legendItemHeight = 24;
    const legendPadding = 10;
    const legendX = width - legendWidth - 10;
    const legendY = margin.top + 10;

    const legend = selection
      .selectAll('.legend')
      .data([null])
      .join('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        `translate(${legendX}, ${legendY})`,
      );

    // Legend background
    legend
      .selectAll('.legend-background')
      .data([null])
      .join('rect')
      .attr('class', 'legend-background')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', legendWidth)
      .attr(
        'height',
        categoriesInData.length * legendItemHeight +
          2 * legendPadding +
          20,
      )
      .attr('fill', 'white')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1)
      .attr('rx', 4);

    // Legend title
    legend
      .selectAll('.legend-title')
      .data([null])
      .join('text')
      .attr('class', 'legend-title')
      .attr('x', legendPadding)
      .attr('y', legendPadding + 12)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'sans-serif')
      .text('Food Categories');

    // Legend items
    const legendItems = legend
      .selectAll('.legend-item')
      .data(categoriesInData)
      .join('g')
      .attr('class', 'legend-item')
      .attr(
        'transform',
        (d, i) =>
          `translate(${legendPadding}, ${legendPadding + 20 + i * legendItemHeight})`,
      );

    legendItems
      .selectAll('rect')
      .data((d) => [d])
      .join('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 15)
      .attr('height', 15)
      .attr('fill', (d) => categoryColors[d] || '#00ccff')
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr(
        'class',
        (d) =>
          `legend-rect category-${d.replace(/\s+/g, '-').replace(/[\/,]/g, '')}`,
      )
      .on('mouseover', function (event, d) {
        // Highlight hovered category and fade others
        circles
          .attr('opacity', 0.2)
          .filter(
            `.category-${d.replace(/\s+/g, '-').replace(/[\/,]/g, '')}`,
          )
          .attr('opacity', 1);

        // Highlight legend item
        select(this)
          .attr('stroke-width', 3)
          .attr('stroke', '#000');
      })
      .on('mouseout', function (event, d) {
        // Reset all circles to full opacity
        circles.attr('opacity', 1);

        // Reset legend item styling
        select(this)
          .attr('stroke-width', 2)
          .attr('stroke', '#333');
      });

    legendItems
      .selectAll('text')
      .data((d) => [d])
      .join('text')
      .attr('x', 20)
      .attr('y', 12)
      .attr('font-size', '11px')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'normal')
      .attr('text-anchor', 'start')
      .style('white-space', 'pre-wrap')
      .style('word-break', 'break-word')
      .style('max-width', legendWidth - 40 + 'px')
      .text((d) => d)
      .on('mouseover', function (event, d) {
        // Highlight hovered category and fade others
        circles
          .attr('opacity', 0.2)
          .filter(
            `.category-${d.replace(/\s+/g, '-').replace(/[\/,]/g, '')}`,
          )
          .attr('opacity', 1);

        // Highlight legend item
        select(this.parentNode)
          .select('.legend-rect')
          .attr('stroke-width', 3)
          .attr('stroke', '#000');
      })
      .on('mouseout', function (event, d) {
        // Reset all circles to full opacity
        circles.attr('opacity', 1);

        // Reset legend item styling
        select(this.parentNode)
          .select('.legend-rect')
          .attr('stroke-width', 2)
          .attr('stroke', '#333');
      });
  } else {
    // Remove legend if not showing
    selection.selectAll('.legend').remove();
  }
};
