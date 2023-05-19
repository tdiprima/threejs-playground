# pip install openslide-python
import openslide

# Open the slide file
slide = openslide.OpenSlide("input.svs")

# Get the dimensions of the largest level
width, height = slide.level_dimensions[0]

print(f"Slide dimensions: {width} x {height}")

# Close the slide
slide.close()
