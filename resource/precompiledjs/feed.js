"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }


var acc_id_el = document.getElementById("acc_id").innerText;
var dropdown_el = document.getElementById("dropdown");
var search_bar_el = document.getElementById("search_bar"); 

document.onclick = function (e) {
  console.log(e.target.id);
  console.log(e.target.id !== 'search_input' & e.target.id !== 'search_bar');

  if (e.target.id !== 'search_input' && e.target.id !== 'search_bar') {
    console.log("insie");
    dropdown_el.style.display = 'none';
  }
};

var search_inpu_el = document.getElementById("search_input");
search_inpu_el.addEventListener("input", function (e) {
  var val = search_inpu_el.value;
  fetch("/getusers", {
    method: "POST",
    body: JSON.stringify({
      input: {
        val: val
      }
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(function (result) {
    return result.json();
  }).then(function (final_res) {
    dropdown_el.innerHTML = "";

    for (var i = 0; i < final_res.length; i++) {
      dropdown_el.innerHTML = dropdown_el.innerHTML + "<li class=\" flex items-center gap-x-3 p-3\"> <img src=../profile_img/".concat(final_res[i].profile, " class=\"w-8 h-8 rounded-full\" alt=\"\" /> <a href= /userinfo?id=").concat(final_res[i].id, "> ").concat(final_res[i].name, " </a> </li>");
    }

    dropdown_el.style.display = 'block';
  });
});

var Form = function Form(props) {
  var setload = props.reloadFunction;

  var _React$useState = React.useState(""),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      content = _React$useState2[0],
      setcontent = _React$useState2[1];

  function onformsubmission(e) {
    e.preventDefault();
    $.post("/postnew", {
      content: content
    }, function (err, result) {
      if (err) {
        alert("couldn't post");
      }
    });
    e.target.children[0].value = "";
    setload(function (cur_val) {
      return !cur_val;
    });
  }

  return /*#__PURE__*/React.createElement("section", {
    className: "w-full sm:w-2/3"
  }, /*#__PURE__*/React.createElement("form", {
    action: "/postnew",
    method: "post",
    id: "postform",
    onSubmit: onformsubmission,
    className: "relative"
  }, /*#__PURE__*/React.createElement("textarea", {
    onChange: function onChange(e) {
      return setcontent(e.target.value);
    },
    id: "post-content",
    placeholder: "what's on your mind?",
    name: "content",
    className: "resize-none outline-none border-none block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg h-36"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "absolute bottom-0 right-0  border-none text-white  bg-postback rounded-md cursor-pointer p-1 text-xs sm:text-sm sm:p-2 "
  }, "post", /*#__PURE__*/React.createElement("i", {
    "class": "fab fa-telegram-plane mx-1"
  }))));
};

var Post = function Post() {
  var _React$useState3 = React.useState([]),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      posts = _React$useState4[0],
      setPost = _React$useState4[1];

  var _React$useState5 = React.useState(false),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      reload = _React$useState6[0],
      setReload = _React$useState6[1];

  React.useEffect(function () {
    fetch("/allpost").then(function (result) {
      return result.json();
    }).then(function (final_res) {
      setPost(final_res);
    })["catch"](function (err) {
      console.log(err);
    });
  }, [reload]);

  var handleDelete = function handleDelete(event, param) {
    $.post("/delpost", {
      post_id: param
    }, function (err, result) {
      if (err) {
        alert("couldn't post");
      }
    });
    event.target.parentElement.parentElement.children[0].click();
    setReload(function (cur_val) {
      return !cur_val;
    });
  };

  var myRef = React.useRef([]);
  myRef.current = posts.map(function (_, i) {
    return myRef.current[i] || React.createRef();
  }); 

  function handelClick(e) {
    if (e.target.parentElement.children[1].style.display === 'none') {
      e.target.parentElement.children[1].style.display = 'block';
    } else {
      e.target.parentElement.children[1].style.display = 'none';
    }
  }

  var handleEdit = function handleEdit(event, param, id) {
    if (event.target.innerText == "Edit") {
      param.current.removeAttribute("disabled");
      event.target.innerText = "Save";
      param.current.contentEditable = 'true';
      param.current.focus();
    } else if (event.target.innerText == "Save") {
      param.current.contentEditable = 'false';
      var updated_msg = param.current.innerText;
      $.post('/update', {
        post_id: id,
        msg: updated_msg
      }, function (err, result) {
        if (err) {
          alert("couldn't post");
        }
      });
      event.target.innerText = "Edit";
      event.target.parentElement.parentElement.children[0].click();
      setReload(function (cur_val) {
        return !cur_val;
      });
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "w-full flex flex-col items-center"
  }, /*#__PURE__*/React.createElement(Form, {
    reloadFunction: setReload
  }), posts.length ? /*#__PURE__*/React.createElement("div", {
    className: "font-extrabold text-4xl mt-8"
  }, "Posts") : /*#__PURE__*/React.createElement("div", {
    className: "mt-16 mb-5 sm:mt-40"
  }, "No Posts available"), posts.map(function (elem, index) {
    return /*#__PURE__*/React.createElement("div", {
      className: "bg-white w-full mt-8 pb-2 px-6 pt-3 flex flex-col rounded-lg last:mb-8  sm:w-1/2",
      key: index
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-start"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-x-3"
    }, /*#__PURE__*/React.createElement("img", {
      src: '../profile_img/' + elem.profile,
      className: "w-14 h-14 rounded-full",
      alt: ""
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "text-xl bold"
    }, elem.name), /*#__PURE__*/React.createElement("span", {
      className: "text-gray-400 text-xs"
    }, " ", elem.date_posted))), parseInt(elem.user_id) === parseInt(acc_id_el) && /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("i", {
      onClick: handelClick,
      style: {
        cursor: 'pointer'
      },
      "class": "fa-solid fa-ellipsis"
    }), /*#__PURE__*/React.createElement("div", {
      className: "absolute  bg-postback p-2 rounded-lg",
      style: {
        display: 'none'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "text-white",
      onClick: function onClick(e) {
        return handleEdit(e, myRef.current[index], elem.poster_id);
      }
    }, " Edit"), /*#__PURE__*/React.createElement("button", {
      className: "text-white",
      onClick: function onClick(e) {
        return handleDelete(e, elem.poster_id);
      }
    }, " Delete")))), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 px-1 h-full grow overflow-auto"
    }, /*#__PURE__*/React.createElement("div", {
      id: "post-content",
      contentEditable: "false",
      suppressContentEditableWarning: true,
      role: "textbox",
      name: "content",
      "class": "bg-inherit outline-none border-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg",
      key: "OKAYG_" + (10000 + Math.random() * (1000000 - 10000)),
      ref: myRef.current[index]
    }, " ", elem.content, " ")));
  }));
};

var root = ReactDOM.createRoot(document.getElementById("app"));
root.render( /*#__PURE__*/React.createElement(Post, null));