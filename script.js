window.addEventListener("load", function() {
  document.body.classList.add("loaded");
  setTimeout(()=>id("loading").style.display = "none", 1000);
});

var w = window.innerWidth, h = window.innerHeight;
const scroll = {
  current: Math.floor(window.scrollY/h),
  possible: true,
  delay: 666,
  max: 4,
}

var nonScrollableElements = [id("newsContainer"), id("map"), id("newsFull")];

function checkScrolling(target) {
  for (let i in nonScrollableElements) {
    if (nonScrollableElements[i].contains(target)) {
      return false;
    }
  }
  return true;
}

class News {
  constructor(title, description, image, date) {
    this.title = title; this.description = description; this.image = image; this.date = date;
  }
}

var newsArray = [
  new News("День без цукру",
           "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
           "materials/images/news1.jpg",
           "14.07.2021"),
  new News("Новина 2",
           "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
           `https://loremflickr.com/320/320/coffee?r=${1}`,
           "09.07.2021"),
  new News("Новина 3",
           "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...",
           `https://loremflickr.com/320/320/coffee?r=${2}`,
           "02.06.2021"),
  new News("Новина 4",
           "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
           `https://loremflickr.com/320/320/coffee?r=${3}`,
           "01.06.2021"),
  new News("Новина 5",
           "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
           `https://loremflickr.com/320/320/coffee?r=${4}`,
           "25.05.2021"),
  new News("Новина 6",
           "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...",
           `https://loremflickr.com/320/320/coffee?r=${5}`,
           "21.05.2021"),
  new News("Новина 7",
           "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
           `https://loremflickr.com/320/320/coffee?r=${6}`,
           "14.05.2021"),
  new News("Новина 8",
           "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
           `https://loremflickr.com/320/320/coffee?r=${7}`,
           "02.05.2021"),
];

scrollWindow(scroll.current);

for (let i=0; i<scroll.max; i++) {
  let label = document.createElement("label");
  label.innerHTML='<input type="radio" name="navigation"><div></div>';
  label.addEventListener("click", function(){
    scroll.current = i;
    scrollWindow(scroll.current);
  });
  id("navigation").append(label);
}
id("navigation").tag("input")[0].checked = true;

function scrollWindow(i) {
  window.scrollTo({top: i*h, behavior: "smooth"});
  if (i) {
    [].forEach.call(id("backgrounds").children, block=>block.changeVisible(false));
    id("backgrounds").children[i-1].changeVisible(true);
  }
}

if (scroll.current) {
  name("navigation")[scroll.current].checked = true;
}

var touchstartY = 0;
var touchendY = 0;

function handleGesture(target) {
  if (checkScrolling(target)) {
    if (touchendY > touchstartY) {
      console.log('swiped down!');
      if (scroll.current > 0) {
        --scroll.current;
        scrollWindow(scroll.current);
        name("navigation")[scroll.current].checked = true;
      }
    } else if (touchendY < touchstartY) {
      console.log('swiped up!');
      if (scroll.current*h < document.body.scrollHeight && scroll.current < scroll.max-1) {
        scroll.current++;
        scrollWindow(scroll.current);
        name("navigation")[scroll.current].checked = true;
      }
    }
  }
}

document.body.addEventListener('touchstart', e => {
  touchstartY = e.changedTouches[0].screenY;
})

document.body.addEventListener('touchend', e => {
  console.log(e);
  touchendY = e.changedTouches[0].screenY;
  handleGesture(e.path[0]);
})

document.addEventListener("wheel", function(e) {
  if (checkScrolling(e.target)) {
    if (scroll.possible) {
      if (e.deltaY > 0) {
          if (scroll.current*h < document.body.scrollHeight && scroll.current < scroll.max-1) {
            scroll.current++;
            scroll.possible = false;
          }
      } else if (scroll.current > 0) {
        --scroll.current;
        scroll.possible = false;
      }
      scrollWindow(scroll.current);
      name("navigation")[scroll.current].checked = true;
      setTimeout(()=>scroll.possible=true, scroll.delay);
    }
  }
});

newsArray.forEach((item, i) => {
  let block = document.createElement("div");
  block.classList.add("news");
  block.innerHTML = `
  <img class="pointer" src="materials/icons/ornament3-1.svg">
  <div class="news-in flexed">
    <div class="news-image-container">
      <img src="materials/icons/coffee.svg">
      <div class="news-image" style="background: 50% 50% / cover url(${item.image})"></div>
    </div>
    <span class="news-description">${item.title}</span>
    <span class="news-date">${item.date}</span>
  </div>
  `;
  block.addEventListener("click", function(){
    [].forEach.call(cl("news"), bl=>bl.changeVisible(false));
    this.changeVisible(true);
    id("newsFullImage").changeCSS({background: `50% 50% / cover url(${item.image})`});
    id("newsFullText").tag("h3")[0].innerText = item.title;
    id("newsFullText").tag("span")[0].innerText = item.description;
  });
  id("newsContainer").append(block);
});
cl("news")[0].changeVisible(true);

window.addEventListener("resize", function() {
  w = window.innerWidth; h = window.innerHeight;
  scrollWindow(scroll.current);
});
