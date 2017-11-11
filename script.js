// Renders the game board for snake
function render() {
  let divs = "";
  for (let t = 1; t <= 40; t++) {
    for (let i = 1; i <= 40; i++) {
      divs += `<div id='${t}-${i}' class='tile'></div>`;
    }
    divs += "<br>"
  }
  $(".board").prepend(divs);
  $(".tile").css({"width"  : "15px",
                  "height" : "15px",
                  "border" : "1px solid gray",
                  "box-sizing" : "border-box",
                  "display" : "inline-block"});
}

// Changes an array of coordinates into an id tag usable by JQuery
Array.prototype.find_id = function() {
  return `#${this[0]}-${this[1]}`;
}

Array.prototype.equals = function(array) {
  if (!array) return false;

  if (this.length != array.length) return false;

  for (let i = 0, l=this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}

// Sets the snake position, length, and creates the food
function start_snake() {
  //$("#20-20").text("O");
  snake.body = [];
  snake.head = [20,20];
  snake.length = 3;
  //snake.tail = snake.body[snake.length - 1];
  food.create();
  snake.update();
}

function food_eaten() {
  if (snake.head.equals(food.position)) {
    return true;
  } return false;
}

// Snake object
let snake = {
  delete_end: function(array) {
    $(array.find_id()).empty();
  },
  // Updates the function....
  update: function() {
    //debugger;
    let head = snake.head.slice();
    // Finds the new head of snake and adds a "O"
    $(head.find_id()).text("O");
    // Adds the new head to snake.position
    snake.body.unshift(head);
    //console.log(snake.position[0]);
    if (snake.body.length > snake.length) {
      let array = snake.body.pop();
      snake.delete_end(array);
    }
    if (food_eaten()) {
      console.log("Nom");
      // Add to the end of snake.position array
      //food.delete();
      food.create();
      snake.length++;
      //timer.quicken();
      //decelerate(some,600);
    }
  },

  // Changes the position of the snake and updates it on screen
  move_right: function() {
    //debugger;
    snake.head[1] += 1;
    snake.update();
  },

  move_left: function() {
    snake.head[1] -= 1;
    snake.update();
  },

  move_up: function() {
    snake.head[0] -= 1;
    snake.update();
  },

  move_down: function() {
    snake.head[0] += 1;
    snake.update();
  },

  // Stops the movement of the snake
  stop: function() {
    clearTimeout(moving);
    console.log("Done");
  },

  // Moves the snake based on the direction and stops when game_over
  move: function() {
    //debugger;
    if((current === 'right' || current === 'left') && (direction === "down" || direction === "up")) {
      if (direction === "down") {
        snake.move_down();
      } else {
        snake.move_up()
      } return current = direction;
    } else if ((current === 'up' || current === 'down') && (direction === "left" || direction === "right")) {
      if (direction === "right") {
        snake.move_right();
      } else {
        snake.move_left();
      } return current = direction;
    } else {
      snake.continue();
    }
  },

  continue: function() {
    switch (current) {
      case "left":
          snake.move_left();
          break;
      case "right":
          snake.move_right();
          break;
      case "up":
          snake.move_up();
          break;
      case "down":
          snake.move_down();
          break;
      default:
          console.log("Invalid Key pressed");
          break;
    }
  },

  hit_wall: function() {
    let current_position = snake.head.filter(x => x > 40 || x < 0);
    // Returns false if head is in bounds and true otherwise
    if (current_position.length === 0) {
      return false;
    } else {
      return true;
    }
  },

  hit_body: function() {
    if(snake.body.length > 1) {
      for(let i = 1; i < snake.body.length; i++) {
        if(snake.head.equals(snake.body[i])) {
          return true;
        }
      }
    } return false;
  },

  // Describes the game over condition. Returns true or false
  game_over: function() {
    if(snake.hit_wall() || snake.hit_body()) {
      return true;
    } return false;
  }
}

// Food object
let food = {
  // Uses an array of the position to set the food location
  update: function() {
    //while(!food_eaten()) {
        $(food.position.find_id()).text("X").toggle(!food_eaten());
    //}
  },

  snake_position: function(food) {
    //debugger;
    snake.body.forEach(function(body) {
      if (food.equals(body) || food.equals(snake.head)) {
        return true;
      } return false;
    })
  },

  // Finds a random position that does not match the snake position
  create: function() {
    let x = Math.floor(Math.random() * 40);
    let y = Math.floor(Math.random() * 40);
    while (food.snake_position([x,y])) {
      x = Math.floor(Math.random() * 40);
      y = Math.floor(Math.random() * 40);
    }
    let position = [x,y];
    food.set_position(position);
    food.update();
  },

  // Sets the food position based on a given array
  set_position: function(array) {
    food.position = array;
  },

  // Takes the position and deletes the "X"
  delete: function() {
    //let position = food.position;
    $(food.position.find_id()).empty();
  },

}

// Changes the direction variable for snake.move function
function change_state(code){
  switch (code) {
    case "ArrowLeft":
        direction = 'left';
        console.log(direction);
        break;
    case "ArrowRight":
        direction = 'right';
        console.log(direction);
        break;
    case "ArrowUp":
        direction = 'up';
        console.log(direction);
        break;
    case "ArrowDown":
        direction = 'down';
        console.log(direction);
        break;
    default:
        console.log("Invalid Key pressed");
        break;
  }
}

function decelerate(callback, time) {

  if((time - 50) >= 150) {
    //debugger;
    time -= 150;
    setTimeout(callback, time);
  }
  setTimeout(callback, time);
}

function movement(callback, time) {
  //debugger;
  let internal = function() {
    if(!snake.game_over()) {
      callback();
      moving = setTimeout(internal, time);
    } else {
      snake.stop();
    }

  }
  moving = setTimeout(internal, time);

}

function some() {
  console.log("ay");
}

$(function() {

  $("body").prepend("<div class='board'></div>");
  render();
  start_snake();

  direction = 'right';
  current = 'right';
  //moving = setInterval(snake.move, 100);
  movement(snake.move, 400);
  $("body").keydown(function(event) {
    change_state(event.key);
  });


  // If you need a keyup event
  $("body").keyup(function(e) {

  });


});
