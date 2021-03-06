jQuery(document).ready(function ($) {
  // aos
  AOS.init();

  // rellax
  var rellax = new Rellax(".rellax", {
    center: true,
  });

  $(document).ready(function() {
    $("#MyModal").modal();
  });
});

// Preloader
const preloader = document.querySelector(".preloader");

preloader.classList.add("show-preloader");

window.addEventListener("load", function () {
  setTimeout(function () {
    preloader.classList.remove('show-preloader');
  }, 0500);
});

// Pop-up
const popUpOpen = document.querySelector(".pop-up-open");
const popUp = document.querySelector(".pop-up--container");
const body = document.querySelector("body");
const popUpClose = document.querySelector(".pop-up-close");
const readLess = document.querySelector(".read-less");

popUpOpen.addEventListener("click", () => {
  popUp.classList.add("pop-up--active");
  body.classList.add("overflow-hiden"); 
});

popUpClose.addEventListener("click", () => {
  popUp.classList.remove("pop-up--active");
  body.classList.remove("overflow-hiden");
});

readLess.addEventListener("click", () => {
  popUp.classList.remove("pop-up--active");
  body.classList.remove("overflow-hiden");
});

// File drop uploader
document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  const dropZoneElement = inputElement.closest(".drop-zone");

  dropZoneElement.addEventListener("click", (e) => {
    inputElement.click();
  });

  const buttonBrowse = document.querySelector(".file-input-button");

  buttonBrowse.addEventListener("click", (e) => {
    inputElement.click();
  });

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("drop-zone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }

    dropZoneElement.classList.remove("drop-zone--over");
  });
});

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
  let thumbnailElement = dropZoneElement.querySelector(".drop-zone__file-name");

  // Remove the prompt
  if (dropZoneElement.querySelector(".drop-zone__prompt")) {
    dropZoneElement.querySelector(".drop-zone__prompt").remove();
  }

  // Create thumbnail element
  if (!thumbnailElement) {
    thumbnailElement = document.createElement("span");
    thumbnailElement.classList.add("drop-zone__file-name");
    dropZoneElement.appendChild(thumbnailElement);
  }

  thumbnailElement.dataset.label = file.name;
}

// Input Tag
const tagContainer = document.querySelector('.tag-container')

const input = document.querySelector('.tag-container textarea')

let tags = []

function createTag(label) {
  const div = document.createElement('div')
  div.setAttribute('class', 'tag')
  const span = document.createElement('span')
  span.innerHTML = label
  const closeBtn = document.createElement('i')
  closeBtn.setAttribute('class', 'material-icons')
  closeBtn.setAttribute('data-item', label)
  closeBtn.innerHTML = 'close'

  div.appendChild(span)
  div.appendChild(closeBtn)
  return div
}

function reset() {
  document.querySelectorAll('.tag').forEach(function(tag) {
    tag.parentElement.removeChild(tag)
  })
}

function addTags() {
  reset()
  tags.slice().reverse().forEach(function(tag) {
    const input = createTag(tag)
    tagContainer.prepend(input)
  })
}

input.addEventListener('keyup', function(e) {
  if(input.value != '' && input.value.length > 2){
    if(e.key === 'Enter'){
      tags.push(input.value)
      addTags()
      input.value = ''
    }
  }
  else {
    input.addEventListener('keydown', function (e) {
      const keyCode = e.which || e.keyCode;
    
      if (keyCode === 13 && !e.shiftKey) {
        e.preventDefault();
      }
    });
  }
})

document.addEventListener('click', function(e) {
  if (e.target.tagName == 'I') {
    const value = e.target.getAttribute('data-item')
    const index = tags.indexOf(value)
    tags = [...tags.slice(0, index), ...tags.slice(index + 1)]
      addTags()
  }
})

// Boost calculate
const select = document.getElementById('impressions');
let boostResult = document.querySelector(".boost__impressions--sum");
let boostSum = document.querySelector(".boost-sum");

select.addEventListener('change', function boostInput(boost) {
  boost = '$' + (select.options[select.selectedIndex].value / 40);
  boostResult.innerHTML = boost;
  boostSum.innerHTML = boost;
});

// Input title
let titleLenght = document.querySelector(".title-form__input-title--display");

function titleInput(title) {
  title = title.value.length;
  titleLenght.innerHTML = title + "/40";
}

// Block enter on textarea title
const eleTitle = document.getElementById("title-form__input-title");

eleTitle.addEventListener("keydown", function (e) {
  const keyCode = e.which || e.keyCode;

  if (keyCode === 13 && !e.shiftKey) {
    e.preventDefault();
  }
});

// Card input and validator
document.addEventListener("DOMContentLoaded", () => {
  for (const el of document.querySelectorAll("[placeholder][data-slots]")) {
    const pattern = el.getAttribute("placeholder"),
      slots = new Set(el.dataset.slots || "_"),
      prev = ((j) =>
        Array.from(pattern, (c, i) => (slots.has(c) ? (j = i + 1) : j)))(0),
      first = [...pattern].findIndex((c) => slots.has(c)),
      accept = new RegExp(el.dataset.accept || "\\d", "g"),
      clean = (input) => {
        input = input.match(accept) || [];
        return Array.from(pattern, (c) =>
          input[0] === c || slots.has(c) ? input.shift() || c : c
        );
      },
      format = () => {
        const [i, j] = [el.selectionStart, el.selectionEnd].map((i) => {
          i = clean(el.value.slice(0, i)).findIndex((c) => slots.has(c));
          return i < 0
            ? prev[prev.length - 1]
            : back
            ? prev[i - 1] || first
            : i;
        });
        el.value = clean(el.value).join``;
        el.setSelectionRange(i, j);
        back = false;
      };
    let back = false;
    el.addEventListener("keydown", (e) => (back = e.key === "Backspace"));
    el.addEventListener("input", format);
    el.addEventListener("focus", format);
    el.addEventListener("blur", () => el.value === pattern && (el.value = ""));
  }
});

var user_name = document.querySelector(".user_name");
var set_card_number = document.querySelector(".set_card_number");
var user_cardcvv = document.querySelector(".user_card_cvv");
var user_name_input = document.getElementById("user_name_input");
var user_card_number_input = document.getElementById("user_card_number_input");

function userName(name) {
  user_name.innerHTML = name;
}

function userCardNumber(cardNumber) {
  set_card_number.innerHTML = cardNumber;
}

function usercardcvv(cvv) {
  user_cardcvv.innerHTML = cvv;
}
