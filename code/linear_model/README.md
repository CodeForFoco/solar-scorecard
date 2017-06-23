# Linear Model

### See it in action:
Just open the [sample.html](sample.html) page!

### How to use:

`linearmodel = new LinearModel([ [2010, 50],[2011, 55],[2012, 60],[2012, 65] ])`

`line_of_best_fit = linearmodel.generate_lobf() // the result is a line of best fit for every year in the original list`

To 'project' that line forward, you can use:

`point = linearmodel.project(2015) \\ point will be [2015, projection]`

`line_of_best_fit.push(point)`

If you need access to the slope or intercept:

` var slope = linearmodel.slope`

` var intercept = linearmodel.intercept`

### How to make changes and compile:

Make sure you've installed typescript (npm install -g typescript)

`tsc stats.ts --target es5`

The `target --es5` ensures backwards compatablitity with older browsers and IE

Just copy the stats.js over to the working directory, and you are good!