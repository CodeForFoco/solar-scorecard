class LinearModel {
    original: number[][];
    slope: number;
    intercept: number;
    r_squared: number;
    constructor(original: number[][]) {
        this.original = original;
        this.linear_regression();
        this.r_squared = this.coefficient_of_determination();
    }
    _sum(arr: number[]): number {
        // Sums an array
        var num = 0
        arr.forEach(element => {
            num += element
        });
        return num
    }

    generate_lobf() {
        // generates line of best fit
        let out = []
        this.original.forEach(element => {
            let y = this.slope * element[0] + this.intercept
            out.push([element[0], y])
        });
        return out        
    }

    squared_error(ys_orig: number[], ys_line: number[]): number {
        // determines the difference or 'error' from our line of best fit, compaired to the original data
        var out = []
        for(let x = 0; x < ys_orig.length; x++) {
            out.push( (ys_line[x] - ys_orig[x]) ** 2 )
        }
        return this._sum(out) 
    }

    _mean(arr: number[]): number {
        // Returns the mean of an array
        let out = 0
        arr.forEach(element => {
            out += element
        });
        return out / arr.length
    }

    coefficient_of_determination() {
        // This determins our confidence (r^2) as a percent (0.8 means we are 80% 
        // confident in our line of best fit and the accuracity of our projections)
        var y = []
        this.original.forEach(element => {
            y.push(element[1])
        });
        var lobf = this.generate_lobf()
        var y_lobf = []
        lobf.forEach(element => {
            y_lobf.push(element[1])
        });


        var y_mean_line = []
        y.forEach(element => {
            y_mean_line.push(this._mean(y))
        });

        var squared_error_regr = this.squared_error(y, y_lobf)
        var squared_error_y_mean = this.squared_error(y, y_mean_line)
        return 1 - (squared_error_regr/squared_error_y_mean)
    }

    project_r_squared(year: number, diff: number):number[] {
        // This projects forward the line of best fit +- the confidence
        let mod = 1-this.r_squared
        let yp = this.project(year)[1] * (1 + mod * diff)
        let ym = this.project(year)[1] - (this.project(year)[1] * mod * diff)
        return [year, yp, ym]
    }

    project(num: number): number[] {
        // This projects forward the line of best fit
        return [num, this.slope * num + this.intercept]
    }

    linear_regression() {
        // This generates our slope + intercept, used in line of best fit, and r^2
        var x = []
        var y = []
        this.original.forEach(element => {
            x.push(element[0])
            y.push(element[1])
        });

        let sum_x = this._sum(x)
        let sum_y = this._sum(y)
        let length = this.original.length

        let sum_x_squared = 0
        x.forEach(element => {
            sum_x_squared += element * element
        });
        let sum_y_squared = 0
        y.forEach(element => {
            sum_y_squared += element * element
        });
        let sum_of_products = 0
        this.original.forEach(element => {
            sum_of_products += element[0] * element[1]
        });
        this.slope = (sum_of_products - (sum_x * sum_y) / length) / (sum_x_squared - ((sum_x ** 2) / length))
        this.intercept = (sum_y - this.slope * sum_x) / length
    }
}
