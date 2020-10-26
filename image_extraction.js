
function extract_pixels(context) {
  //let context = document.getElementById("footage").getContext("2d")
  return context.getImageData(0,0, footage.width, footage.height).data
}

function get_grayscale(pixels) {
  let newpix = new Uint8ClampedArray(pixels.length)
  for (let i = 0; i < pixels.length; i += 4) {
    let avg = Math.round((pixels[i] + pixels[i+1] + pixels[i+2]) / 3)
    newpix[i  ] = avg
    newpix[i+1] = avg
    newpix[i+2] = avg
    newpix[i+3] = 255
  }
  return newpix
}

function get_pixels_with_bar(pixels, line) {
  let newpix = Uint8ClampedArray.from(pixels)
  for (let i = (line-1)*4*1000; i < (line+2)*4*1000; i += 4) {
    newpix[i  ] = 255
    newpix[i+1] = 182
    newpix[i+2] = 203
  }
  return newpix;
}

function get_intensity_of_line(pixels, line) {
  let intensity = new Array(1000)
  for (let i = line*4*1000; i < (line+1)*4*1000; i += 4) {
    intensity[Math.floor((i-(line)*4*1000)/4)] = (pixels[i]+pixels[i+1]+pixels[i+2])/3
  }
  console.log(intensity)
  return intensity
}
