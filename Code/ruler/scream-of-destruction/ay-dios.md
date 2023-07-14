### I'd like to solve the puzzle

I think this could be *because* of the "correct" addition of the text.

That it might be interfering with the raycasting.

Also &ndash; do we have a *thing* to raycast *against?*

<mark>**That's all it was.  All I had to do was add a PlaneGeometry.**</mark>

<span style="color:#0000dd;">I need help.  I have a program that is supposed to allow the user to draw a line, and as the line is drawn, it measures how long it is in pixels, and displays the text as we draw the line.  The text was a blob (like the problem in the previous example).  So <span style="color:#0000dd;font-weight:bold;">I added a FontLoader</span>, like you said.  But now, the line isn't drawing, the text isn't moving with the line, and the line measurement is zero.  What am I doing wrong?</span>

<span style="color:red;font-weight:bold">01.js</span>

The issue in your code is related to the scope of the variables `startPoint`, `endPoint`, `startVector`, and `endVector`. Currently, you are declaring these variables outside of the `onMouseDown` and `onMouseMove` functions, which means they are **shared** across different mouse events. As a result, the line geometry and text position are not updated correctly. <span style="color:deeppink;">Sounds like BS, already...</span>

To fix this issue, you should declare these variables **inside the `onMouseDown`** function and update them accordingly. This ensures that each time you start drawing a new line, the variables are initialized properly.

<span style="color:red;font-weight:bold">02.js</span>

With these changes, the line should be drawn correctly, and the text should move along with it while displaying the line length.

<span style="color:#0000dd;">ok, I implemented the updated code.  now I've got <span style="color:#0000dd;font-weight:bold;">line length NaN</span>, and the line still doesn't draw</span>

I apologize for the oversight. It seems that there are a couple of issues in the code that are causing the problems you mentioned.

First, the **line length is NaN** because the calculation in the `lineLength` function is using incorrect values.

Instead of directly accessing the `lineGeometry.attributes.position.array`, you should use the **`startPoint` and `endPoint`** values when calculating the line length. <span style="color:#ff00cc;">Ya mean like I had originally.</span>

Update the `onMouseMove` function.

Second, the **line is not drawing** because the `lineGeometry.attributes.position.array` is not being updated correctly.

You need to **update the `startPoint` and `startVector`** values each time you start a new line in the `onMouseDown` function.

Modify the `onMouseDown` function.

<span style="color:red;font-weight:bold">03.js</span>

With these changes, the line should now be drawn correctly, and the line length should be displayed accurately as you draw the line.

<span style="color:#0000dd;">ok.  and where are <span style="color:#0000dd;font-weight:bold;">startPoint and endPoint declared?</span></span>

Apologies for the confusion caused. The `startPoint` and `endPoint` variables should be declared outside of the `onMouseDown` and `onMouseMove` functions to maintain their scope and persist their values between function calls. Here's the updated code.

<span style="color:red;font-weight:bold">04.js</span>

With this update, the `startPoint` and `endPoint` variables are declared outside the event functions, allowing them to be accessed and updated correctly within those functions.

<span style="color:#0000dd;">ok.  it still does not work.  no line is drawn.  and line calculation is 0.0.  <span style="color:#0000dd;font-weight:bold;">could you write this from scratch?</span>  if you wanted to allow the user to draw a straight line, and calculate the line length as its being drawn, and load a font that will write the line length to the screen as the line is being drawn, how would you do it?</span>

Certainly! Here's a complete code example that allows the user to draw a straight line, calculates the line length in real-time, and displays the length using a loaded font:

<span style="color:red;font-weight:bold">05.js</span>

In this code, the `onMouseDown`, `onMouseMove`, and `onMouseUp` functions handle the mouse events for drawing the line and updating the length text. The `getMouseCoordinates` function converts the mouse coordinates to the scene's normalized device coordinates. The `Calculate` object contains the line length calculation function.

The line is represented by a `THREE.Line` object, and the length is displayed using a `THREE.TextGeometry` with a loaded font. The text position is updated dynamically based on the end point of the line.

I hope this code helps you achieve the desired functionality!

<span style="color:#0000dd;">Well, it doesn't.</span> 😡💢

<span style="color:#0000dd;">Go make me a coffee jelly!</span>

<br>
