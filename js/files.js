const { dialog } = require('electron').remote
const fs = require('fs')

const ss_button = document.getElementById("save_spectrum_button")
const ss_link = document.getElementById("save_spectrum_link")
const sp_button = document.getElementById("save_picture_button")
const sp_link = document.getElementById("save_picture_link")
const sd_button = document.getElementById("save_data")

function save_spectrum() {
    let img
    if (spectrum_chart) {
        img = spectrum_chart.toBase64Image()
    }
    if (img) {
        ss_link.href = img
        ss_link.download = 'spectrum.png'
    }
}

function save_picture() {
    let img
    img = footage_canvas.toDataURL()
    if (img) {
        sp_link.href = img
        sp_link.download = 'photo.png'
    }
}

function save_data() {
    let data
    if (spectrum_chart) {
        data = spectrum_chart.config.data.datasets[0].data
    }
    const location = dialog.showSaveDialogSync({
        defaultPath: 'spectrum_data.txt',
        properties: ['createDirectory', 'showOverwriteConfirmation'],
        filters: [
            { name: 'Text', extensions: ['txt'] }
          ],
    })
    if (location && data) {
        const stream = fs.createWriteStream(location)
        stream.write('wavelength (nm),normalized intensity\n')
        for (point of data) {
            stream.write(`${point.x},${point.y}\n`)
        }
        stream.end()
    }
}

ss_button.addEventListener("click", () => {
    save_spectrum()
})

sp_button.addEventListener("click", () => {
    save_picture()
})

sd_button.addEventListener("click", () => {
    save_data()
})