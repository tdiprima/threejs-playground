## Exploring Castle for Squares

<span style="color:blue;font-size:larger;">If I'm traversing a scene, how do all the scene objects end up being evaluated?</span>

```js
function findObjectsByName(object, name) {
  let result = [];

  // Define a recursive function to traverse the scene graph
  function traverse(obj) {
    if (obj.name === name) {
      result.push(obj);
    }

    // Recursively search for children
    for (let i = 0; i < obj.children.length; i++) {
      traverse(obj.children[i]);
    }
  }

  // Start the traversal from the root object
  traverse(object);

  return result;
}

findObjectsByName(scene, "Square");
```

Imagine you're playing a video game where you're on a quest to find all the hidden treasures named "Square" in a huge castle. The castle (like our scene) is made up of many rooms (objects), and some rooms have smaller rooms within them (children objects).

Your strategy is to start at the entrance and explore every room, checking if it's named "Square". If it is, you add it to your treasure list. Then, you look to see if this room has any smaller rooms inside it. If there are smaller rooms, you repeat the same process for each: check the name, add it to the list if it matches, and then explore any smaller rooms within those.

The code you have is like your quest plan. It starts at the castle entrance (`scene`) and uses a method (`traverse`) to explore. If it finds a room named "Square", it adds it to the result list. Then, it looks for any smaller rooms (`children`) and explores them too, doing the same checks and adding to the list as needed. This process repeats until every part of the castle is explored, and all treasures named "Square" are found.

<span style="color:blue;font-size:larger;">How does the code know that I have to come out of the smaller rooms and back to the main room to continue the traversal?</span>

Great question! This is where the magic of "recursion" comes in, which is a fancy way of saying the function calls itself to solve smaller parts of the problem.

Imagine you're exploring a maze of rooms within rooms. You start in the main room, and each time you enter a smaller room, you follow the same set of instructions: check the room, then explore any smaller rooms inside it.

Here's the trick: every time you go into a smaller room, you're essentially starting a new, smaller exploration that follows the same rules. You keep doing this until you find a room with no smaller rooms inside it. At that point, you "backtrack" - meaning you return to the room you were in before to continue exploring any other smaller rooms you haven't checked yet.

The code knows to come back ("backtrack") to the main room after exploring all the smaller rooms because of how recursion works in programming. Each call to `traverse` waits for the smaller calls within it (the smaller room explorations) to finish before it continues. So, once there are no more smaller rooms to explore (the base case, when a room has no children), the function finishes for that room, and control goes back to the previous function call, which is like stepping back into the previous room. This process repeats until you've explored all rooms and returned to where you started.

In simpler terms, each time you enter a room and start exploring smaller rooms, you're making a promise to yourself: "I'll come back and check the rest of the rooms here after I'm done with this one." The code automatically keeps track of these "promises" thanks to the call stack, a list of all the function calls waiting to be completed. Once there are no more smaller rooms to check, the function completes, removes itself from the call stack, and the code automatically returns to the previous room, fulfilling the promise to continue exploring from where it left off.

<br>
