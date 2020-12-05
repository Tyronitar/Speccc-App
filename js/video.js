//
// webpage elements
//

const url_input = document.getElementById("url_input")
const url_input_button = document.getElementById("url_input_button")
const url_input_wrapper = document.getElementById("url_input_wrapper")
const video_footage = document.getElementById("footage-img")
const video_footage_wrapper = document.getElementById("video_footage_wrapper")
const webcam_footage = document.getElementById("footage-vid")
const webcam_toggle_button = document.getElementById("toggle_webcam")
const footage_canvas = document.getElementById("footage")
const spectrum_canvas = document.getElementById("spectrum_canvas")
const spectrum_div = document.getElementById("spectrum")
const m_area = document.getElementById("measurement_area")
const start_y = document.getElementById("start_y")
const size_y = document.getElementById("size_y")
const cam_select = document.getElementById('cam_select');
const spec_line_canvas = document.getElementById("spec_line_canvas")
const lambda1 = document.getElementById("lambda1")
const lambda2 = document.getElementById("lambda2")

//
// canvas contexts
//

const ctx = footage_canvas.getContext("2d");
const spec_ctx = spectrum_canvas.getContext("2d")
const spec_line_ctx = spec_line_canvas.getContext("2d")

var sliders_started = false;

// set resolution of canvases
footage_canvas.width = 1000;
footage_canvas.height = 1000;
spectrum_canvas.width = 1000;
spectrum_canvas.height = 1000;

spec_line_canvas.width = 1000;
spec_line_canvas.height = 1000;

//
// assorted globals
//

let footage_error = false;
let url = url_input.value
let gradientStroke
let webcam_enabled = false
let spectrum_chart
let current_stream

let video_constraints = {
    width: 1280,
    height: 720
}

const constraints = {
    audio: false,
    video: video_constraints
}

//
// event listeners
//

window.addEventListener("resize", update_gradient)
url_input_button.addEventListener("click", () => {
    change_footage(url_input.value);
})

url_input.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        change_footage(url_input.value);
    }
})

spectrum_canvas.addEventListener("wheel", e => {
    e.preventDefault()
    resize_m_area(e.deltaY)
})

spectrum_canvas.addEventListener("mousedown", e => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
    dragMouseDown(e)
})

m_area.addEventListener("mousedown", e => {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0
    dragMouseDown(e)
})

m_area.addEventListener("wheel", e => {
    e.preventDefault()
    resize_m_area(e.deltaY)
})

start_y.oninput = () => {
    start_y.value = Math.max(start_y.value, bounds.min_y)
    start_y.value = Math.min(start_y.value, bounds.max_y - m_area_stats.height)

    move_m_area(Number(start_y.value), m_area_stats.left)
}

size_y.oninput = () => {
    size_y.value = Math.max(size_y.value, bounds.min_y)
    size_y.value = Math.min(size_y.value, bounds.max_y - m_area_stats.top)
    resize_m_area(0, Number(size_y.value) - m_area_stats.height)
}

//
// video canvas things
//
function gotDevices(mediaDevices) {
    cam_select.innerHTML = '';
    for (str of ["Choose Camera", "IP Camera"]) {
        const opt = document.createElement('option');
        opt.value = str
        const lab = str
        const txt = document.createTextNode(lab)
        opt.appendChild(txt)
        cam_select.appendChild(opt)
    }
    let count = 1;
    mediaDevices.forEach(mediaDevice => {
      if (mediaDevice.kind === 'videoinput') {
        const option = document.createElement('option');
        option.value = mediaDevice.deviceId;
        const label = mediaDevice.label || `Camera ${count++}`;
        const textNode = document.createTextNode(label);
        option.appendChild(textNode);
        cam_select.appendChild(option);
      }
    });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices);

function stopMediaTracks(stream) {
    if (stream) {
        stream.getTracks().forEach(track => {
        track.stop();
        });
    }
}

function take_url_input(show) {
    if (!show) {
        url_input_wrapper.style.height = "0%"
        video_footage_wrapper.style.height = "100%"
    }
    else {
        url_input_wrapper.style.height = "10%"
        video_footage_wrapper.style.height = "90%"
    }
}

cam_select.addEventListener("change", () => {
    if (cam_select.value === "Choose Camera" || cam_select.value === "") {
        webcam_enabled = false;
        stopMediaTracks(current_stream);
        video_footage.src = ""
        take_url_input(false);
    }
    else if (cam_select.value === "IP Camera") {
        webcam_enabled = false;
        take_url_input(true);
        stopMediaTracks(current_stream);
        change_footage(url_input.value);
    }
    else {
        take_url_input(false);
        webcam_enabled = true;
        video_footage.src = ""
        init_webcam();
    }
})

video_footage.onerror = () => {
    footage_error = true;
    // alert("Something went wrong looking for your URL")
    video_footage.style.display ='none'
}

function update_video_canavs() {
    ctx.clearRect(0, 0, footage_canvas.width, footage_canvas.height)
    if (webcam_enabled) {
        ctx.drawImage(webcam_footage, 0, 0, footage_canvas.width, footage_canvas.height)
    }
    else {
        ctx.drawImage(video_footage, 0, 0, footage_canvas.width, footage_canvas.height)
    }
}

function change_footage(url) {
    webcam_enabled = false
    stopMediaTracks(current_stream)
    cam_select.value = "IP Camera"
    footage_error = false
    console.log(url)
    video_footage.src = url
    if (!footage_error) {
        video_footage.style.display = 'block'
    }
}

// Access webcam
async function init_webcam() {
    video_constraints.deviceId = {exact: cam_select.value}
    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        handleSuccess(stream)
    })
    .catch(err => {
        console.log(`navigator.getUserMedia error:${err.toString()}`)
    })
}

// Success
function handleSuccess(stream) {
    // window.stream = stream;
    current_stream = stream
    webcam_footage.srcObject = current_stream
    webcam_footage.play()
}

//
// Spectrum stuff
//
Chart.defaults.global.legend.display = false;

function start_spectrum(pix) {
    spec_ctx.clearRect(0, 0, footage_canvas.width, footage_canvas.height)
    spectrum_chart = new Chart(spec_ctx, {
        type: 'scatter',
        data:
        {
            datasets: [{
                // label: 'Scatter Dataset',
                data: get_box_spectrum(pix),
                pointRadius: 0,
                borderColor:               "#000000",
                borderWidth:               1,
                fill: true,
                showLine: true
            }],
            showLine: true
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            animation: {
                duration: 0
            },
            scales: {
                yAxes: [{
                    ticks:{
                        display: false,
                        beginAtZero: true,
                    }
                }]
            }
        }
    });
    update_gradient();
}

function update_spectrum() {
    if (spectrum_chart) {
        spectrum_chart.config.data.datasets[0].data = get_box_spectrum(extract_pixels(ctx));
        spectrum_chart.update();
        if (sliders_started) {
          slider.oninput()
          slider2.oninput()
        }
        update_gradient()
    }
    else {
        start_spectrum(extract_pixels(ctx))
    }
}

function update_gradient() {
    let curr_width = spectrum_div.offsetWidth
    gradientStroke = spec_ctx.createLinearGradient(0, 0, curr_width, 0)
    
    gradientStroke.addColorStop(1, "#000000") // black
    gradientStroke.addColorStop(0.825, "#ff0000") // red
    gradientStroke.addColorStop(0.75, "#ffff00") // yellow
    gradientStroke.addColorStop(0.625, "#00ff00") // green
    gradientStroke.addColorStop(0.5, "#00ffff") // cyan
    gradientStroke.addColorStop(0.375, "#0000ff") // blue
    gradientStroke.addColorStop(0.23, "#660066") // violet
    gradientStroke.addColorStop(0, "#000000") // black

    if (spectrum_chart) {
        const ds = spectrum_chart.config.data.datasets[0]
        ds.pointBorderColor = gradientStroke
        ds.pointBackgroundColor = gradientStroke
        ds.pointHoverBackgroundColor = gradientStroke
        ds.pointHoverBorderColor = gradientStroke
        ds.backgroundColor = gradientStroke
    }
}

//
// Measurement Area Stuff
//
let m_area_stats = {width: 50, height: 40, left: 25, right: 75, top: 30, bottom: 70}

let bounds = {min_w: 5,
    max_w: 100,
    min_h: 5,
    max_h: 100,
    min_x: 0,
    max_x: 100,
    min_y: 0,
    max_y: 100
}


const size_diff = 2

function resize_m_area(dx, dy) {
    if (sliders_started) {
      slider.oninput()
      slider2.oninput()
    }
    const neg = dx < 0 ? -1 : 1
    let dw = neg * size_diff
    if (in_bounds(m_area_stats.width + dw, "width") && dx !== 0) {
        let dl = 0, dr = 0

        if (in_bounds(m_area_stats.left - (dw / 2), "left")) {
            dl = (dw / 2)
        }

        if (in_bounds(m_area_stats.right + (dw / 2), "right")) {
            dr = (dw / 2)
        }

        if (dl === 0) {
            if (in_bounds(m_area_stats.right + dw, "right")) {
                dr = dw
            }
            else {
                dw /= 2
            }
        }
        if (dr === 0) {
            if (in_bounds(m_area_stats.left - dw, "left")) {
                dl = dw
            }
            else {
                dw /= 2
            }
        }

        m_area_stats.width += dw
        m_area_stats.left -= dl
        m_area_stats.right += dr
    }

    if (in_bounds(m_area_stats.height + dy, "height")) {
        let  db = 0

        if (in_bounds(m_area_stats.bottom + dy, "bottom")) {
            db = dy
        }
        else {
            dy = 0
        }
        m_area_stats.height += dy
        m_area_stats.bottom += db
        size_y.max = bounds.max_h - m_area_stats.top - 1;
        size_y.min = bounds.min_h;
        start_y.min = bounds.min_y;
        start_y.max = bounds.max_y - m_area_stats.height - 1;
    }

    m_area.style.height = "" + m_area_stats.height + "%"
    m_area.style.width = "" + m_area_stats.width + "%"
    m_area.style.left = "" + m_area_stats.left + "%"
    m_area.style.right = "" + m_area_stats.right + "%"
    m_area.style.top = "" + m_area_stats.top + "%"
    m_area.style.bottom = "" + m_area_stats.bottom + "%"
}

function move_m_area(new_top, new_left) {
    if (sliders_started) {
      slider.oninput()
      slider2.oninput()
    }
    if (in_bounds(new_top, "top")) {
        m_area_stats.top = new_top
        m_area_stats.bottom = m_area_stats.top + m_area_stats.height
    }
    if (in_bounds(new_left, "x")) {
        m_area_stats.left = new_left
        m_area_stats.right = new_left + m_area_stats.width
    }

    m_area.style.left = "" + m_area_stats.left + "%"
    m_area.style.right = "" + m_area_stats.right + "%"
    m_area.style.top = "" + m_area_stats.top + "%"
    m_area.style.bottom = "" + m_area_stats.bottom + "%"

}

function in_bounds(arg, to_test) {
    if (to_test === "width") {
        return arg >= bounds.min_w && arg <= bounds.max_w
    }
    else if (to_test === "height") {
        return arg >= bounds.min_h && arg <= bounds.max_h
    }
    else if (to_test === "x") {
        return arg >= bounds.min_x && arg + m_area_stats.width <= bounds.max_x
    }
    else if (to_test === "top") {
        return arg >= bounds.min_y && arg + m_area_stats.height <= bounds.max_y
    }
    else if (to_test === "bottom") {
        return arg <= bounds.max_y && arg >= bounds.min_y
    }
    else if (to_test === "left") {
        return arg >= bounds.min_x
    }
    else if (to_test === "right") {
        return arg <= bounds.max_x
    }
    else {
        return false
    }
}

function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    let new_top = px_to_percent(m_area.offsetTop - pos2, "y")
    let new_left = px_to_percent(m_area.offsetLeft - pos1, "x")
    new_top = m_area_stats.top // This line limits movement to x axis only
    move_m_area(new_top, new_left)
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }

function px_to_percent(num, axis) {
    const w = video_footage_wrapper.offsetWidth
    const h = video_footage_wrapper.clientHeight

    if (axis === "x") {
        return num / w * 100
    }
    else {
        return num / h * 100
    }
}

//
// Run when starting
//
take_url_input(false)

move_m_area(Number(start_y.value), m_area_stats.left)
resize_m_area(0, Number(size_y.value) - m_area_stats.height)

setInterval(update_video_canavs, 50)
setInterval(update_spectrum, 100)
