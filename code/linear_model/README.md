# Linear Model

### See it in action:
Just open the [sample.html](sample.html) page!

### How to use:

    linearmodel = new LinearModel([ [2010, 50],[2011, 55],[2012, 60],[2012, 65] ])

    line_of_best_fit = linearmodel.generate_lobf() // the result is a line of best fit for every year in the original list

To 'project' that line forward, you can use:

    point = linearmodel.project(2015) \\ point will be [2015, projection]

    line_of_best_fit.push(point)

Based on request from @dgendill:

    projection = linearmodel.project_func() // Returns based on lobf

    for (var x = 0; x < 20; x++) {
        console.log( projection(x) )
    }


If you need access to the slope or intercept or r squared:

` var slope = linearmodel.slope`

` var intercept = linearmodel.intercept`

` var r_squared = linearmodel.r_squared`

### How to use for projections:

linearmodel.project_r_squared(year, number_of_years_from_last_known_year)

`y1 = linearmodel.project_r_squared(2013, 1)`

Above will return `[2013, highest_value, lowest_value]`

This is different than just `.project(year)` because, unlike project, it gives you a range the 
data should fall in.

### How to make changes and compile:

Make sure you've installed typescript (`npm install -g typescript`)

`tsc stats.ts --target es5`

The `target --es5` ensures backwards compatablitity with older browsers and IE

Just copy the stats.js over to the working directory, and you are good!