const url_input = document.getElementById("url_input")
const url_input_button = document.getElementById("url_input_button")
const video_footage = document.getElementById("footage-img")
const webcam_footage = document.getElementById("footage-vid")
const webcam_toggle_button = document.getElementById("toggle_webcam")
const footage_canvas = document.getElementById("footage")
const chartjs = require("chart.js")
footage_canvas.width = 1000;
footage_canvas.height = 1000;
let footage_error = false;
let url = url_input.value
let grayscale = false;



let ctx = footage_canvas.getContext("2d");
let webcam = false


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
    let line = Number(document.getElementById("number_input").value);
    ctx.putImageData(new ImageData(get_pixels_with_bar(extract_pixels(ctx),line),
    footage_canvas.width, footage_canvas.height), 0, 0)
    setTimeout(update_canvas, 20)
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

update_canvas();
