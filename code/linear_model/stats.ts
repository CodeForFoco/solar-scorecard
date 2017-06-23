class LinearModel {
    original: number[][];
    slope: number;
    intercept: number;
    constructor(original: number[][]) {
        this.original = original;
        this.linear_regression();
    }
    _sum(arr: number[]): number {
        var num = 0
        arr.forEach(element => {
            num += element
        });
        return num
    }

    generate_lobf() {
        let out = []
        this.original.forEach(element => {
            let y = this.slope * element[0] + this.intercept
            out.push([element[0], y])
        });
        return out        
    }

    project(num: number): number[] {
        return [num, this.slope * num + this.intercept]
    }

    linear_regression() {
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
