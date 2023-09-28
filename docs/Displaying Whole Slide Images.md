## Delaying rendering after the user stops scrolling

<span style="color:#0000dd;">OpenSeadragon will hesitate rendering a whole slide image until the user has stopped scrolling.  Is there a way to mimic such hesitation in three.js?</span>

Yes, it is possible to mimic the hesitation behavior of OpenSeadragon in three.js.

OpenSeadragon is a popular JavaScript library used for displaying high-resolution images, such as whole slide images, and it includes a feature called <mark>**"spring-natural scrolling"**</mark> that causes the image to continue moving after the user stops scrolling.

This can help prevent the image from rendering too quickly, which can be especially important when working with large, high-resolution images.

### Hesitating rendering like OpenSeadragon

You can mimic this hesitation behavior by using a similar technique, such as adding a delay before rendering the image after the user stops scrolling.

One way to achieve this is by using the `setTimeout` function to wait for a specified period of time before rendering the image. 

For example, you could add an event listener to the scroll event of the window, and then use `setTimeout` to wait for a certain amount of time before rendering the image.

```javascript
// Yeah, but it's not a scroll, is it?
let timeout = null;

function onScroll() {
  clearTimeout(timeout);
  // Wait 500ms before rendering
  timeout = setTimeout(renderImage, 500);
}

function renderImage() {
  // Render the image here
}

window.addEventListener('scroll', onScroll);
```

If the user continues scrolling during this time, the `timeout` variable is cleared and the delay is reset. Once the delay has passed without any further scrolling, the `renderImage` function is called to render the image.


## Display a whole slide image

<span style="color:#0000dd;">A digital slide image file created by an Aperio ScanScope slide scanner.</span>

Three.js does not have built-in support for SVS files, and therefore cannot directly load and display them.

Convert SVS files to more common image formats, such as JPEG or PNG, that can be loaded by Three.js.

OpenSlide provides a C library and command-line tools for reading and converting various whole-slide image formats.

```sh
brew install openslide
openslide-write-png input.svs x y level width height output.png
```

This will create a PNG file named `output.png` that contains the contents of the SVS file.

Use a texture and apply it to a plane geometry.

Create a plane geometry with the same aspect ratio as the image. Adjust the `PlaneGeometry` accordingly.

Load the PNG file using the `TextureLoader`:

```javascript
let loader = new THREE.TextureLoader();

loader.load('output.png', function(texture) {
  let geometry = new THREE.PlaneGeometry(1, 1);
  let material = new THREE.MeshBasicMaterial({ map: texture });
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});
```

## Pre-processing <span style="font-size:30px;">🔥🧯🧑🏻‍🚒</span>

<span style="color:#0000dd;">Obviously pre-processing such a large file is gonna suck, if not impossible.  Also, the resulting PNG file will be quite large and consume a lot of memory, which will impact the performance of the application.
</span>

### Get dimensions of whole slide image

```python
# pip install openslide-python
import openslide

# Open the slide file
slide = openslide.OpenSlide('path/to/slide.svs')

# Get the dimensions of the largest level
width, height = slide.level_dimensions[0]

print(f"Slide dimensions: {width} x {height}")

# Close the slide
slide.close()
```

This will open the slide file using OpenSlide, and then retrieve the dimensions of the largest level of the slide using the `level_dimensions` property. The dimensions are returned as a tuple containing the width and height of the level, respectively.

To convert the slide to PNG format, you can use the `openslide-write-png` command-line tool.

### Convert the largest level of the slide to PNG format

<span style="color:#0000dd;">Buddy suggested doing this on the entire slide.  Hecc no!</span>

```sh
openslide-write-png path/to/slide.svs 0 0 0 <width> <height> output.png
# took too long!
openslide-write-png input.svs 0 0 0 112319 87197 output.png
```

Replace `<width>` and `<height>` with the values retrieved from the openslide get `level_dimensions` function. This will create a PNG file named `output.png` in the current directory that contains the contents of the slide.

Once you have the PNG file, you can load it into Three.js using the `TextureLoader` and display it using a `PlaneGeometry` and `MeshBasicMaterial`, as explained previously.

```sh
# I divided the height by the width, and multiplied it by 1024 (the width that I wanted) to get the height
# I divided the size by 2 so I can get good x,y coordinates
openslide-write-png input.svs 56159 43598 0 1024 794 output.png
```

## Re. Size. Aspect ratio...

How to resize an image to a width of 1024 pixels and calculate the corresponding height:

```python
from PIL import Image

# Open the PNG file
image = Image.open('output.png')

# Get the original width and height
width, height = image.size

# Calculate the new height based on the desired width and aspect ratio
new_width = 1024
new_height = int(height * (new_width / width))

# Resize the image
resized_image = image.resize((new_width, new_height))

# Save the resized image as a PNG file
resized_image.save('resized_output.png')

# Close the original and resized images
image.close()
resized_image.close()
```


Note that when resizing the image, the aspect ratio of the original image is maintained, so the height of the resized image is calculated proportionally to the desired width.


