const { createCanvas, createImageData, loadImage } = require('canvas');
const fs = require('fs');

sortPixels('11.jpg');

async function sortPixels(fileName, mode = 'Brightness', type = 'Row') {
    const img = await loadImage(`${__dirname}/images/${fileName}`);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    let imageData;
    let newImageData;

    if (mode === 'Hue') {

        if (type === 'All') {
            imageData = chunkInFour(ctx.getImageData(0, 0, img.width, img.height).data);
            imageData = imageData.sort((a, b) => getHue(a[0], a[1], a[2]) - getHue(b[0], b[1], b[2]));
            newImageData = createImageData(Uint8ClampedArray.from(imageData.flat()), img.width, img.height);
        } else {
            imageData = chunk(chunkInFour(ctx.getImageData(0, 0, img.width, img.height).data), img.width);
            for (let i = 0; i < imageData.length; i++) {
                imageData[i] = imageData[i].sort((a, b) => getHue(a[0], a[1], a[2]) - getHue(b[0], b[1], b[2]));
            }
            newImageData = createImageData(Uint8ClampedArray.from(imageData.flat().flat()), img.width, img.height);
        }

        
    } else {
        if (type === 'All') {
            imageData = chunkInFour(ctx.getImageData(0, 0, img.width, img.height).data);
            imageData = imageData.sort((a, b) => (0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]) - (0.2126 * b[0] + 0.7152 * b[1] + 0.0722 * b[2]));
            newImageData = createImageData(Uint8ClampedArray.from(imageData.flat()), img.width, img.height);
        } else {
            imageData = chunk(chunkInFour(ctx.getImageData(0, 0, img.width, img.height).data), img.width);
            for (let i = 0; i < imageData.length; i++) {
                imageData[i] = imageData[i].sort((a, b) => (0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]) - (0.2126 * b[0] + 0.7152 * b[1] + 0.0722 * b[2]));
            }
            newImageData = createImageData(Uint8ClampedArray.from(imageData.flat().flat()), img.width, img.height);
        }
    }
    
    ctx.putImageData(newImageData, 0, 0);

    const out = fs.createWriteStream(`${__dirname}/images/${fileName.split('.')[0]}_sorted.png`);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => console.log('Done!'));

    function getHue(red, green, blue) {

        let min = Math.min(red, green, blue);
        let max = Math.max(red, green, blue);
    
        if (min === max) {
            return 0;
        }
    
        let hue = 0;
        if (max === red) {
            hue = (green - blue) / (max - min);
        } else if (max === green) {
            hue = 2 + (blue - red) / (max - min);
        } else {
            hue = 4 + (red - green) / (max - min);
        }
    
        hue = hue * 60;
        if (hue < 0) hue = hue + 360;
    
        return Math.round(hue);
    }

    function chunkInFour(array) {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += 4) {
            chunkedArr.push([ array[i], array[i + 1], array[i + 2], array[i + 3] ]);
        }
        return chunkedArr;
    }
    
    function chunk(array, size) {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i++) {
          const last = chunkedArr[chunkedArr.length - 1];
          if (!last || last.length === size) {
            chunkedArr.push([array[i]]);
          } else {
            last.push(array[i]);
          }
        }
        return chunkedArr;
    }
}

