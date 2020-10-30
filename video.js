// import "./node_modules/chart.js"

const url_input = document.getElementById("url_input")
const url_input_button = document.getElementById("url_input_button")
const video_footage = document.getElementById("footage-img")
const webcam_footage = document.getElementById("footage-vid")
const webcam_toggle_button = document.getElementById("toggle_webcam")
const footage_canvas = document.getElementById("footage")
const spectrum_canvas = document.getElementById("spectrum_canvas")
const spectrum_div = document.getElementById("spectrum")
footage_canvas.width = 1000;
footage_canvas.height = 1000;
spectrum_canvas.width = 1000;
spectrum_canvas.height = 1000;
let footage_error = false;
let url = url_input.value
let grayscale = false;

const line_choice = document.getElementById("number_input")

let ctx = footage_canvas.getContext("2d");
let spec_ctx = spectrum_canvas.getContext("2d")

let gradientStroke


let webcam = false
let spectrum_chart


function update_gradient() {
    let curr_width = spectrum_div.offsetWidth
    gradientStroke = spec_ctx.createLinearGradient(0, 0, curr_width, 0)
    gradientStroke.addColorStop(0, "#000000")
    gradientStroke.addColorStop(0.25, "#ff0000")
    gradientStroke.addColorStop(0.375, "#ffff00")
    gradientStroke.addColorStop(0.5, "#00ff00")
    gradientStroke.addColorStop(0.626, "#00ffff")
    gradientStroke.addColorStop(0.75, "#0000ff")
    gradientStroke.addColorStop(0.825, "#660066")
    gradientStroke.addColorStop(1, "#000000")
}


window.addEventListener("resize", update_gradient)


video_footage.onerror = () => {
    footage_error = true;
    // alert("Something went wrong looking for your URL")
    video_footage.style.display ='none'
}
url_input_button.addEventListener("click", () => {
    change_footage(url_input.value);
})

url_input.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        change_footage(url_input.value);
    }
})

footage_canvas.addEventListener("click", () => {
    grayscale = !grayscale
})

webcam_toggle_button.addEventListener("click", () => {
    webcam = !webcam
    if (webcam) {
        // change_footage("")
        init_webcam()
    }
    else {
        stream = webcam_footage.srcObject
        stream.getTracks().forEach(function(track) {
            track.stop();
          });
    }
})

function change_footage(url) {
    webcam = false
    footage_error = false
    console.log(url)
    video_footage.src = url
    if (!footage_error) {
        video_footage.style.display = 'block'
    }
}



function update_spectrum() {
    let line = Number(line_choice.value);
    if (spectrum_chart) {
        spectrum_chart.config.data.datasets[0].data = get_spectrum(extract_pixels(ctx), line)
        spectrum_chart.config.data = {
            datasets: [{
                label: 'Scatter Dataset',
                data: get_spectrum(extract_pixels(ctx), line),
                pointRadius: 0,
                borderColor:               gradientStroke,
                pointBorderColor:          gradientStroke,
                pointBackgroundColor:      gradientStroke,
                pointHoverBackgroundColor: gradientStroke,
                pointHoverBorderColor:     gradientStroke,
                fill: true,
                backgroundColor: gradientStroke,
                showLine: true
            }]
          }
        console.log("updated")
        spectrum_chart.update()
    }
    else {
        start_spectrum(extract_pixels(ctx), line)
    }
}


function update_canvas() {
    ctx.clearRect(0, 0, footage_canvas.width, footage_canvas.height)
    if (webcam) {
        ctx.drawImage(webcam_footage, 0, 0, footage_canvas.width, footage_canvas.height)
    }
    else {
        ctx.drawImage(video_footage, 0, 0, footage_canvas.width, footage_canvas.height)
    }
    if (grayscale) {
        ctx.putImageData(new ImageData(get_grayscale(extract_pixels(ctx)),
        footage_canvas.width, footage_canvas.height), 0, 0)
    }
    let line = Number(line_choice.value);
    ctx.putImageData(new ImageData(get_pixels_with_bar(extract_pixels(ctx),line),
    footage_canvas.width, footage_canvas.height), 0, 0)
}

function start_spectrum(pix, line) {
  spec_ctx.clearRect(0, 0, footage_canvas.width, footage_canvas.height)
    spectrum_chart = new Chart(spec_ctx, {
    type: 'scatter',
    data:
    {
        datasets: [{
            label: 'Scatter Dataset',
            data: get_spectrum(pix, line),
            pointRadius: 0,
            borderColor:               gradientStroke,
            pointBorderColor:          gradientStroke,
            pointBackgroundColor:      gradientStroke,
            pointHoverBackgroundColor: gradientStroke,
            pointHoverBorderColor:     gradientStroke,
            fill: true,
            backgroundColor: gradientStroke,
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
    }
});
}

const constraints = {
    audio: false,
    video: {
        width: 1280, height: 720
    }
}

// Access webcam
async function init_webcam() {
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
    window.stream = stream;
    webcam_footage.srcObject = stream
    webcam_footage.play()
}

setInterval(update_canvas, 20)
setInterval(update_spectrum, 100)

update_gradient()
