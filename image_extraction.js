
function extract_pixels(context) {
  //let context = document.getElementById("footage").getContext("2d")
  return context.getImageData(0,0, footage.width, footage.height).data
}

function get_grayscale(pixels) {
  let newpix = new Uint8ClampedArray(pixels.length)
  for (i = 0; i < pixels.length; i += 4) {
    let avg = Math.round((pixels[i] + pixels[i+1] + pixels[i+2]) / 3)
    newpix[i  ] = avg
    newpix[i+1] = avg
    newpix[i+2] = avg
    newpix[i+3] = 255
  }
  return newpix
}
