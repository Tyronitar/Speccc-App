const url_input = document.getElementById("url_input")
const url_input_button = document.getElementById("url_input_button")
const video_footage = document.getElementById("footage")
let footage_error = false;
let url = url_input.value
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