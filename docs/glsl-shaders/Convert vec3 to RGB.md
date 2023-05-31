## Colors: GLSL to RGB

To convert a `vec3` color value in **GLSL (OpenGL Shading Language)** to regular RGB values, you typically need to multiply each component by 255 and clamp the result between 0 and 255.

```js
let color = [0.2, 0.2, 0.2];
let rgb = [];

for (let i = 0; i < color.length; i++) {
	rgb.push(color[i] * 255.0);
}
console.log("rgb:", rgb)
```

### Multiply Array

Yeah, JavaScript isn't like Python where you can just multiply the array by 255, but you can do it in C; and therefore, GLSL.

```glsl
vec3 color = vec3(0.2, 0.2, 0.2);
vec3 rgb = color * 255.0;
```

In the above code, we multiply each component of the `color` vector by 255 to **convert the range from [0, 1] to [0, 255].** 

```glsl
rgb = clamp(rgb, 0.0, 255.0); // expression not allowed here
```

Then we **clamp the result** to ensure that all values fall within the valid RGB range of [0, 255].

```glsl
vec3 finalColor = rgb / 255.0;
```

Finally, we divide the clamped result by 255 to **normalize it back** to the range [0, 1] if desired.

The `finalColor` variable represents the RGB values that you can use in your **rendering pipeline** or output.

Note that the final values are typically **in the range [0, 1]**, which is a common convention in computer graphics.

If you need the values in the range [0, 255] for some specific use case, you can adjust accordingly.

<br>
