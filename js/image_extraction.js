
function extract_pixels(context) {
  //let context = document.getElementById("footage").getContext("2d")
  return context.getImageData(0,0, context.canvas.width, context.canvas.height).data
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
  for (let i = (line-2)*4*1000; i < (line-1)*4*1000; i += 4) {
    newpix[i  ] = 255
    newpix[i+1] = 182
    newpix[i+2] = 203
  }
  for (let i = (line+1)*4*1000; i < (line+2)*4*1000; i += 4) {
    newpix[i  ] = 255
    newpix[i+1] = 182
    newpix[i+2] = 203
  }
  return newpix;
}

function get_graph_with_vertical_line(pixels, line, width, height) {
  let newpix = Uint8ClampedArray.from(pixels)
  for (let row = 0; row < height; row++) {
    index = (row * width) * 4
    for (let ind = Math.max(-line*4, line*4-0); ind<=Math.min((width-1)*4, line*4+0); ind+=4) {
      newpix[index+ind  ] = 0
      newpix[index+ind+1] = 0
      newpix[index+ind+2] = 0
      newpix[index+ind+3] = 255
      //console.log(index+ind)
    }
  }
  //console.log(width, height, pixels.length)
  //console.log(newpix)
  //console.log(new ImageData(newpix, width, height))
  return new ImageData(newpix, width, height)
}

function get_intensity_of_box(pixels, ymin, ymax, xmin, xmax) {
  let intensity = new Array(xmax-xmin+1)
  for (let i = xmin; i <= xmax; i++) {
    intensity[i-xmin] = 0
    for (let j = ymin; j <= ymax; j += 1) {
      index = (1000 * 4 * j) + i * 4
      intensity[i-xmin] += (pixels[index]+pixels[index+1]+pixels[index+2])/3
    }
    intensity[i-xmin] /= (ymax - ymin + 1)
  }
  return intensity
}

function get_intensity_of_line(pixels, line) {
  let intensity = new Array(1000)
  for (let i = line*4*1000; i < (line+1)*4*1000; i += 4) {
    //console.log(pixels[i])
    intensity[Math.floor((i-(line)*4*1000)/4)] = (pixels[i]+pixels[i+1]+pixels[i+2])/3
  }
  //console.log(intensity)
  return intensity
}
