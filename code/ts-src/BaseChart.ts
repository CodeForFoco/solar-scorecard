type ChartContext = {
  width : number,
  height: number,
  innerWidth: number,
  innerHeight: number,
  marginSize: number,
  data: any
}

class BaseChart {
  public d3Draw;

  private width: number;
  private height: number;
  private marginSize: number;
  private data;
  private updateChart;

  constructor(
    draw:(s: ChartContext) => null,
    update: (s: ChartContext) => null
  ) {

    var self = this;
    this.width = 900;
    this.height = 500;
    this.marginSize = 30;

    this.d3Draw = function(selection) {

      self.updateChart = function() {
        selection.each(function() {
          // Run the update function in the
          // d3 context
          update.bind(this)(self.getContext());
        });
      }

      selection.each(function() {
        // Run the draw function in the
        // d3 context
        draw.bind(this)(self.getContext())

      });
    }

  }

  update() {
      this.updateChart();
  }

  getContext() : ChartContext {
    return {
      width: this.width,
      height: this.height,
      innerWidth: this.innerWidth(),
      innerHeight: this.innerHeight(),
      marginSize: this.marginSize,
      data: this.data
    }
  }

  private innerWidth() {
    return this.width - (this.marginSize * 2)
  }

  private innerHeight() {
    return this.height - (this.marginSize * 2)
  }

  setWidth(width: number) {
    this.width = width;
    this.update();
  }

  setHeight(height: number) {
    this.height = height;
    this.update();
  }

  setData(data) {
    this.data = data;
  }

}
