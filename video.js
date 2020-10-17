const url_input = document.getElementById("url_input")
const url_input_button = document.getElementById("url_input_button")
const video_footage = document.getElementById("footage-img")
const footage_canvas = document.getElementById("footage");
footage_canvas.width = 1000;
footage_canvas.height = 1000;
let footage_error = false;
let url = url_input.value

    
let ctx = footage_canvas.getContext("2d");


video_footage.onerror = () => {
    footage_error = true;
    alert("Something went wrong looking for your URL")
    video_footage.style.display ='none'
}
url_input_button.addEventListener("click", () => {
    change_footage();
})

url_input.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        change_footage();
    }
})

function change_footage() {
    footage_error = false;
    url = url_input.value
    console.log(url)
    video_footage.src = url
    if (!footage_error) {
        video_footage.style.display = 'block'
    }
}

function update_canvas() {
    ctx.clearRect(0, 0, footage_canvas.width, footage_canvas.height)
    ctx.drawImage(video_footage, 0, 0, footage_canvas.width, footage_canvas.height)
    setTimeout(update_canvas, 20)
}

update_canvas();