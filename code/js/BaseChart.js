var BaseChart = (function () {
    function BaseChart(draw, update) {
        var self = this;
        this.width = 900;
        this.height = 500;
        this.marginSize = 30;
        this.d3Draw = function (selection) {
            self.updateChart = function () {
                selection.each(function () {
                    // Run the update function in the
                    // d3 context
                    update.bind(this)(self.getContext());
                });
            };
            selection.each(function () {
                // Run the draw function in the
                // d3 context
                draw.bind(this)(self.getContext());
            });
        };
    }
    BaseChart.prototype.update = function () {
        this.updateChart();
    };
    BaseChart.prototype.getContext = function () {
        return {
            width: this.width,
            height: this.height,
            innerWidth: this.innerWidth(),
            innerHeight: this.innerHeight(),
            marginSize: this.marginSize,
            data: this.data
        };
    };
    BaseChart.prototype.innerWidth = function () {
        return this.width - (this.marginSize * 2);
    };
    BaseChart.prototype.innerHeight = function () {
        return this.height - (this.marginSize * 2);
    };
    BaseChart.prototype.setWidth = function (width) {
        this.width = width;
        this.update();
    };
    BaseChart.prototype.setHeight = function (height) {
        this.height = height;
        this.update();
    };
    BaseChart.prototype.setData = function (data) {
        this.data = data;
    };
    return BaseChart;
}());
