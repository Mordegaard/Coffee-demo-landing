/*
USE <animated-span> AND <animated-div> TAGS TO ADD ANIMATIONS
Use animation-type to select animation type;
Use animation-speed to change animation speed;
Use animation-property to change animation's additional property (second speed, number of repeats, etc);
Use animation-trigger to change animation's trigger: onload, onscroll, oncommand;
Use animation-delay to change delay between fired trigger and animation start;
Use Node.addAnimationCallback(callback) to add callback which will be fired after animation end;
Available text animations:
random-letters, emergent-letters, falling-letters, rotating-letters;
Available block animations:
emergent-block, falling-block, rising-block;
*/

function randomInt(m1,m2=undefined) {
  if (m2 === undefined) return Math.floor(Math.random()*m1);
  else return Math.floor(Math.random() * (m2 - m1)) + m1;
}
function id(node) {
  return document.getElementById(node);
}
function cl(node) {
  return document.getElementsByClassName(node);
}
function tag(node) {
  return document.getElementsByTagName(node);
}
function name(node) {
  return document.getElementsByName(node);
}
Node.prototype.cl = function(node) {
  return this.getElementsByClassName(node);
}
Node.prototype.tag = function(node) {
  return this.getElementsByTagName(node);
}
Node.prototype.changeVisible = function(sel=undefined) {
  if (sel === undefined) this.classList.toggle("visible");
  else {
    sel ? this.classList.add("visible") : this.classList.remove("visible");
  }
};
Node.prototype.isInViewPort = function() {
  const rect = this.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
Node.prototype.changeCSS = function(obj) {
  for (var i=0; i<Object.keys(obj).length; i++) {
    var n = Object.keys(obj)[i];
    this.style.setProperty(n, obj[n]);
  }
};
Node.prototype.addAnimationCallback = function(callback) {
  this.MRDGRDanimCallback = callback;
};

let addTrigger = function(el, trigger, startAnimation) {
  switch (trigger) {
    case "onload":
    window.addEventListener("load", startAnimation, false);
    break;
    case "onscroll":
    function evt() {
      if (el.isInViewPort()) {
        startAnimation();
        document.removeEventListener("scroll", evt);
      }
    }
    document.addEventListener("scroll", evt, {passive: true});
    break;
    case "oncommand":
    el.startAnimation = function() {
      startAnimation();
      animations.span.functions.animatedLetters(el, prop, speed, 1);
    }
    break;
  }
}

const animations = {
  span: {
    blocks: [...tag("animated-span")],
    animationList: ["random-letters", "emergent-letters", "falling-letters", "rotating-letters"],
    functions: {
      randomLetters: function(block, max, speed, text) {
        [].forEach.call(block.tag("span"), (element,index)=>{
          var t = text[index];
          element.changeCSS({opacity: ""});
          element.innerText = "";
          setTimeout(()=>{
            loop(element, 0, max, speed, t);
          }, index*speed+1);
        });
        if (block.MRDGRDanimCallback) setTimeout(()=>{block.MRDGRDanimCallback()}, speed*(text.length+max));
        function loop(bl, iteration, max, speed, letter) {
          var string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
          bl.innerText = string.charAt(randomInt(string.length));
          iteration++;
          if (iteration < max) {setTimeout(()=>{loop(bl, iteration, max, speed, letter)}, speed);}
          else bl.innerText = letter;
        }
      },
      animatedLetters: function(el, speed1, speed2, animation) {
        var a = [...el.tag("span")];
        [].forEach.call(a, letter => {letter.classList.add("MRDGRD-letter");});
        var animationName, getLetter;
        switch (animation) {
          case 0:
          animationName = "MRDGRD-emergent-letters";
          getLetter = function() {return 0;}
          break;
          case 1:
          animationName = "MRDGRD-falling-letters";
          getLetter = function() {return randomInt(a.length);}
          break;
          case 2:
          animationName = "MRDGRD-rotating-letters";
          getLetter = function() {return 0;}
          break;
        }
        function loop(a, speed1, speed2) {
          if (a.length > 0) {
            let i = getLetter();
            let letter = a.splice(i, 1)[0];
            letter.changeCSS({animation: speed1/1000 + `s ${animationName} forwards`, opacity: ""});
            setTimeout(()=>{letter.changeCSS({animation: ""})}, speed1);
            setTimeout(()=>{loop(a, speed1, speed2);}, speed2);
          } else if (el.MRDGRDanimCallback) setTimeout(()=>el.MRDGRDanimCallback(), speed1);
        }
        loop(a, speed1, speed2);
      },
    }
  },
  div: {
    blocks: [...tag("animated-div")],
    animationList: ["emergent-block", "falling-block", "rising-block", "increasing-block", "decreasing-block"],
    functions: {
      animatedBlock: function(el, speed, animation) {
        var animationName;
        switch (animation) {
          case 0: animationName = "MRDGRD-emergent-block"; break;
          case 1: animationName = "MRDGRD-falling-block"; break;
          case 2: animationName = "MRDGRD-rising-block"; break;
          case 3: animationName = "MRDGRD-increasing-block"; break;
          case 4: animationName = "MRDGRD-decreasing-block"; break;
        }
        el.changeCSS({animation: speed/1000 + `s ${animationName}`, opacity: ""});
        setTimeout(()=>{
          el.changeCSS({animation: ""});
          if (el.MRDGRDanimCallback) el.MRDGRDanimCallback();
        }, speed);
      }
    }
  }
};

[].forEach.call(animations.span.blocks, (el)=>{
  const attr = el.getAttribute("animation-type") || undefined;
  const speed = parseInt(el.getAttribute("animation-speed")) || 100;
  const trigger = el.getAttribute("animation-trigger") || "onload";
  const delay = parseInt(el.getAttribute("animation-delay")) || 0;
  var prop = parseInt(el.getAttribute("animation-property")) || undefined;

  if (animations.span.animationList.includes(attr)) {
    var text = el.innerText;
    el.innerText = "";
    for (var i=0; i<text.length; i++) {
      var sp = document.createElement("span");
      sp.changeCSS({opacity: 0});
      sp.innerText = text[i] == " " ? String.fromCharCode(160) : text[i];
      el.append(sp);
    };
    function startAnimation() {
      setTimeout(()=>{
        switch (attr) {
          case "random-letters":
            if (!prop) prop = 10;
            animations.span.functions.randomLetters(el, prop, speed, text);
            break;
            case "emergent-letters":
            if (!prop) prop = 500;
            animations.span.functions.animatedLetters(el, prop, speed, 0);
            break;
            case "falling-letters":
            if (!prop) prop = 500;
            animations.span.functions.animatedLetters(el, prop, speed, 1);
            break;
            case "rotating-letters":
            if (!prop) prop = 500;
            animations.span.functions.animatedLetters(el, prop, speed, 2);
            break;
          }
      }, delay);
    }
    addTrigger(el, trigger, startAnimation);
  }
});

[].forEach.call(animations.div.blocks, (el)=>{
  const attr = el.getAttribute("animation-type") || undefined;
  const speed = parseInt(el.getAttribute("animation-speed")) || 1000;
  const trigger = el.getAttribute("animation-trigger") || "onload";
  const delay = parseInt(el.getAttribute("animation-delay")) || 0;
  var prop = parseInt(el.getAttribute("animation-property")) || undefined;

  if (animations.div.animationList.includes(attr)) {
    el.changeCSS({opacity: 0});
    el.classList.add("MRDGRD-block");
    function startAnimation() {
      setTimeout(()=>{
        switch (attr) {
          case "emergent-block":
          animations.div.functions.animatedBlock(el, speed, 0);
          break;
          case "falling-block":
          animations.div.functions.animatedBlock(el, speed, 1);
          break;
          case "rising-block":
          animations.div.functions.animatedBlock(el, speed, 2);
          break;
          case "increasing-block":
          animations.div.functions.animatedBlock(el, speed, 3);
          break;
          case "decreasing-block":
          animations.div.functions.animatedBlock(el, speed, 4);
          break;
        }
      }, delay);
    }
    addTrigger(el, trigger, startAnimation);
  }
});

const css = `
  @keyframes MRDGRD-emergent-letters {
    0% {opacity: 0;}
    100% {opacity: 1;}
  }
  @keyframes MRDGRD-falling-letters {
    0% {opacity: 0; transform: translateY(-100px);}
    100% {opacity: 1; transform: initial;}
  }
  @keyframes MRDGRD-rotating-letters {
    0% {opacity: 0; transform: rotate(90deg) translateY(2ch);}
    100% {opacity: 1; transform: initial;}
  }
  @keyframes MRDGRD-emergent-block {
    0% {opacity: 0;}
    100% {opacity: 1;}
  }
  @keyframes MRDGRD-falling-block {
    0% {opacity: 0; transform: translateY(-100px);}
    100% {opacity: 1; transform: initial;}
  }
  @keyframes MRDGRD-rising-block {
    0% {opacity: 0; transform: translateY(100px);}
    100% {opacity: 1; transform: initial;}
  }
  @keyframes MRDGRD-increasing-block {
    0% {opacity: 0; transform: scale(0.5);}
    100% {opacity: 1; transform: initial;}
  }
  @keyframes MRDGRD-decreasing-block {
    0% {opacity: 0; transform: scale(1.5);}
    100% {opacity: 1; transform: initial;}
  }

  .MRDGRD-letter {
    display: inline-block;
  }
  .MRDGRD-block {
    display: block;
  }

  .flexed {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const head = document.head || tag('head')[0],
      style = document.createElement('style');
head.appendChild(style);
style.appendChild(document.createTextNode(css));
