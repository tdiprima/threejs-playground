## I'm looking at this GLSL shader code...

```glsl
vec2 uv = fragCoord.xy / iResolution.xy;
```

### What does "UV" stand for?  ("XY")

In GLSL shader code, "uv" typically stands for "texture **coordinates**" or "normalized coordinates" representing a **point** on a texture or a rendering surface. It is usually used to sample textures or perform texture mapping operations.

### Why are we dividing fragCoord by iResolution?

Aspect ratio.  Duh.

The division of `fragCoord.xy` by `iResolution.xy` is used to **normalize** the screen coordinates `fragCoord` to a range between 0 and 1.

`fragCoord.xy` represents the pixel coordinates of the **current** fragment being processed, and `iResolution.xy` represents the resolution of the rendering surface (such as the width and height of the **screen** or the texture being rendered to).

By dividing `fragCoord.xy` by `iResolution.xy`, you obtain a normalized coordinate that ranges from 0 to 1 in both the X and Y directions. This normalization is often useful when performing calculations involving textures or applying effects uniformly across different screen sizes or resolutions.

### How do I know that "XY" is a property of these variables?

In GLSL, `xy` is a shorthand notation that allows you to access the X and Y components of a vector. So, `fragCoord.xy` represents the X and Y components of the `fragCoord` vector, and `iResolution.xy` represents the X and Y components of the `iResolution` vector.

It is what it is.

### Documentation is your friend

Finally, `iResolution` is neither passed in to this function, nor is it defined there; so how do I know it even exists?

As for `iResolution` not being explicitly defined or passed into the shader function, it is likely that `iResolution` is a **predefined uniform variable** provided by the shader environment or the rendering framework you are using.

**Uniforms** are values that can be set externally and are accessible to all shader invocations. They are typically used to pass information from the **application code to the shaders.**

In this case, `iResolution` might represent the resolution of the rendering surface and is provided to the shader context automatically.

To know if `iResolution` exists and what it represents, you need to consult the **[documentation](https://www.shadertoy.com/howto)** or shader code from the specific rendering framework or shader environment you are using. It should specify the available predefined variables or uniforms and their meanings.

<br>
