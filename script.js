var w = window.innerWidth, h = window.innerHeight;
const scroll = {
  current: Math.floor(window.scrollY/h),
  possible: true,
  delay: 666,
  max: 4,
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
           `https://picsum.photos/seed/${+ new Date()}/400/400`,
           "09.07.2021"),
  new News("Новина 3",
           "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...",
           `https://picsum.photos/seed/${+ new Date() + 1}/400/400`,
           "02.06.2021"),
  new News("Новина 4",
           "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
           `https://picsum.photos/seed/${+ new Date() + 2}/400/400`,
           "01.06.2021"),
  new News("Новина 5",
           "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
           `https://picsum.photos/seed/${+ new Date() + 3}/400/400`,
           "25.05.2021"),
  new News("Новина 6",
           "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...",
           `https://picsum.photos/seed/${+ new Date() + 4}/400/400`,
           "21.05.2021"),
  new News("Новина 7",
           "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
           `https://picsum.photos/seed/${+ new Date() + 5}/400/400`,
           "14.05.2021"),
  new News("Новина 8",
           "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
           `https://picsum.photos/seed/${+ new Date() + 6}/400/400`,
           "02.05.2021"),
];

scrollWindow(scroll.current);

for (let i=0; i<scroll.max; i++) {
  let label = document.createElement("label");
  label.innerHTML='<input type="radio" name="navigation"><div></div>';
  label.addEventListener("click", function(){
    if (!i) id("navigation").changeVisible(false);
    scroll.current = i;
    scrollWindow(scroll.current);
  });
  id("navigation").append(label);
}

function scrollWindow(i) {
  window.scrollTo({top: i*h, behavior: "smooth"});
  if (i) {
    [].forEach.call(id("backgrounds").children, block=>block.changeVisible(false));
    id("backgrounds").children[i-1].changeVisible(true);
  }
}

if (scroll.current) {
  name("navigation")[scroll.current].checked = true;
  id("navigation").changeVisible(true);
}

document.addEventListener("mousewheel", function(e) {
  if (!(id("newsContainer").contains(e.target) || id("map").contains(e.target))) {
    if (scroll.possible) {
      if (e.deltaY > 0) {
          if (scroll.current*h < document.body.scrollHeight && scroll.current < scroll.max-1) scroll.current++;
          id("navigation").changeVisible(true);
      } else if (scroll.current > 0) {
        if (!--scroll.current) id("navigation").changeVisible(false);
      }
      scrollWindow(scroll.current);
      name("navigation")[scroll.current].checked = true;
      scroll.possible = false;
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
});
