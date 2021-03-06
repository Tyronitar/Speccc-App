const slider = document.getElementById("myRange");
const output = document.getElementById("demo");
const calibrate_button = document.getElementById("calibrate_button")
const save_cal = document.getElementById("save_calibration")
const slide_container = document.getElementById("slidecontainer")

let calibrating = false;

output.innerHTML = slider.value;

var showing_lines = true;

slider.oninput = function() {
  //output.innerHTML = this.value;
  chart_max = spectrum_chart.scales["x-axis-1"].max
  chart_min = spectrum_chart.scales["x-axis-1"].min
  output.innerHTML = chart_min + ((this.value - 350) / 400) * (chart_max - chart_min)
  draw_lines();
}

const slider2 = document.getElementById("myRange2")
const output2 = document.getElementById("demo2")
output2.innerHTML = slider2.value;

slider2.oninput = function() {

  chart_max = spectrum_chart.scales["x-axis-1"].max
  chart_min = spectrum_chart.scales["x-axis-1"].min
  output2.innerHTML = chart_min + ((this.value - 350) / 400) * (chart_max - chart_min)
  draw_lines();
}
sliders_started = true

function draw_lines() {
  if (showing_lines) {
    chart_max = spectrum_chart.scales["x-axis-1"].max
    chart_min = spectrum_chart.scales["x-axis-1"].min
    var prop = document.getElementById("demo");
    prop = parseFloat(prop.innerHTML);
    prop = (prop-chart_min)/(chart_max - chart_min);
    prop = 0.01 + 0.98 * prop;
    //console.log(prop)
    var prop2 = document.getElementById("demo2");
    prop2 = parseFloat(prop2.innerHTML);
    prop2 = (prop2-chart_min)/(chart_max - chart_min);
    prop2 = 0.01 + 0.98 * prop2;
    //console.log(prop2)
    spec_line_ctx.putImageData(spec_line_ctx.createImageData(spec_line_canvas.width, spec_line_canvas.height), 0, 0)
    spec_line_ctx.putImageData(get_graph_with_vertical_line(extract_pixels(spec_line_ctx),
      Math.floor(prop*spec_line_canvas.width), spec_line_canvas.width, spec_line_canvas.height),
      0, 0)
    spec_line_ctx.putImageData(get_graph_with_vertical_line(extract_pixels(spec_line_ctx),
      Math.floor(prop2*spec_line_canvas.width), spec_line_canvas.width, spec_line_canvas.height),
        0, 0)
  }
}

var calibration = {
  box_minimum: 200,
  box_maximum: 900,
  get_from_width: function(start, width) {
    let wavelength_width = this.box_maximum - this.box_minimum
    wave_start = this.box_minimum + (start / ctx.canvas.width) * wavelength_width
    wave_end = this.box_minimum + ((start + width) / ctx.canvas.width) * wavelength_width
    return [wave_start, wave_end]
  },
  start: function() {
    return this.get_from_width(m_area_stats.left*10, m_area_stats.width*10)[0]
  },
  end: function() {
    return this.get_from_width(m_area_stats.left*10, m_area_stats.width*10)[1]
  },
  update: function() {
    pos1_orig = parseFloat(output.innerHTML )
    pos2_orig = parseFloat(output2.innerHTML)

    pos1_new  = parseFloat(lambda1.value)
    pos2_new  = parseFloat(lambda2.value)

    // Funky algebra
    start = (pos2_new * (pos1_orig - this.box_minimum) - pos1_new * (pos2_orig - this.box_minimum))
    start /= (pos1_orig - pos2_orig)

    end = (pos2_new * (pos1_orig - this.box_maximum) - pos1_new * (pos2_orig - this.box_maximum))
    end /= (pos1_orig - pos2_orig)



    this.box_minimum = start
    this.box_maximum = end
    spec_line_ctx.putImageData(spec_line_ctx.createImageData(spec_line_canvas.width, spec_line_canvas.height), 0, 0)
    showing_lines = false;
  }

}

function toggle_calibration() {
  calibrating = !calibrating;
  if (!calibrating) {
    calibrate_button.innerHTML = "Open Calibration Menu"
    spectrum_canvas.style.height = "100%"
    slide_container.style.display = "none"
    spec_line_canvas.style.display = "none"
    save_cal.style.display = "none"
  }
  else {
    showing_lines = true
    calibrate_button.innerHTML = "Close Calibration Menu"
    spectrum_canvas.style.height = "65%"
    slide_container.style.display = "block"
    spec_line_canvas.style.display = "block"
    save_cal.style.display = "block"
  }
}



calibrate_button.addEventListener("click", () => {
  toggle_calibration();
})

save_cal.addEventListener("click", () => {
  calibration.update()
  toggle_calibration()
})