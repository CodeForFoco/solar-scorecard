var LinearModel = (function () {
    function LinearModel(original) {
        this.original = original;
        this.linear_regression();
        this.r_squared = this.coefficient_of_determination();
    }
    LinearModel.prototype._sum = function (arr) {
        var num = 0;
        arr.forEach(function (element) {
            num += element;
        });
        return num;
    };
    LinearModel.prototype.generate_lobf = function () {
        var _this = this;
        var out = [];
        this.original.forEach(function (element) {
            var y = _this.slope * element[0] + _this.intercept;
            out.push([element[0], y]);
        });
        return out;
    };
    LinearModel.prototype.squared_error = function (ys_orig, ys_line) {
        var out = [];
        for (var x = 0; x < ys_orig.length; x++) {
            out.push(Math.pow((ys_line[x] - ys_orig[x]), 2));
        }
        return this._sum(out);
    };
    LinearModel.prototype._mean = function (arr) {
        var out = 0;
        arr.forEach(function (element) {
            out += element;
        });
        return out / arr.length;
    };
    LinearModel.prototype.coefficient_of_determination = function () {
        var _this = this;
        var y = [];
        this.original.forEach(function (element) {
            y.push(element[1]);
        });
        var lobf = this.generate_lobf();
        var y_lobf = [];
        lobf.forEach(function (element) {
            y_lobf.push(element[1]);
        });
        var y_mean_line = [];
        y.forEach(function (element) {
            y_mean_line.push(_this._mean(y));
        });
        var squared_error_regr = this.squared_error(y, y_lobf);
        var squared_error_y_mean = this.squared_error(y, y_mean_line);
        return 1 - (squared_error_regr / squared_error_y_mean);
    };
    LinearModel.prototype.project = function (num) {
        return [num, this.slope * num + this.intercept];
    };
    LinearModel.prototype.linear_regression = function () {
        var x = [];
        var y = [];
        this.original.forEach(function (element) {
            x.push(element[0]);
            y.push(element[1]);
        });
        var sum_x = this._sum(x);
        var sum_y = this._sum(y);
        var length = this.original.length;
        var sum_x_squared = 0;
        x.forEach(function (element) {
            sum_x_squared += element * element;
        });
        var sum_y_squared = 0;
        y.forEach(function (element) {
            sum_y_squared += element * element;
        });
        var sum_of_products = 0;
        this.original.forEach(function (element) {
            sum_of_products += element[0] * element[1];
        });
        this.slope = (sum_of_products - (sum_x * sum_y) / length) / (sum_x_squared - ((Math.pow(sum_x, 2)) / length));
        this.intercept = (sum_y - this.slope * sum_x) / length;
    };
    return LinearModel;
}());
