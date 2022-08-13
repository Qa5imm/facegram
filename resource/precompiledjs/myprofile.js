"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var notification_el = document.getElementById("notification");
var drop_button_el = document.getElementById("dropdown");
var dropdown_content_el = document.getElementById("dropdown_content");
var profiles_id = document.getElementById("userid");
var myid_el = document.getElementById("myid");
var freind_request_el = document.getElementById("freind_request");
var message_el = document.getElementById("message");
var bell_button_el = document.getElementById("bell_button");
var options_button_el = document.getElementById("options_dropdown");

if (freind_request_el.innerText == "notifictaion") {
  notification_el.style.display = "block";
}

if (freind_request_el.innerText == "Friend") {
  message_el.style.display = "block";
} else {
  message_el.style.display = "none";
}

if (profiles_id.innerText == myid_el.innerText) {
  message_el.style.display = "none";
  freind_request_el.style.display = "none";
  bell_button_el.style.display = "block";
}

freind_request_el.addEventListener("click", function () {
  if (freind_request_el.innerText == "Add Friend") {
    fetch("/friend_req", {
      method: "POST",
      body: JSON.stringify({
        input: {
          req_id: profiles_id.innerText
        }
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(function (final_res) {
      console.log(final_res);

      if (final_res.status == 200) {
        freind_request_el.innerText = "cancel req";
      }
    });
  } else if (freind_request_el.innerText == "cancel req") {
    fetch("/cancel_req", {
      method: "POST",
      body: JSON.stringify({
        input: {
          req_id: profiles_id.innerText
        }
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(function (final_res) {
      console.log(final_res);

      if (final_res.status == 200) {
        freind_request_el.innerText = "Add Friend";
      }
    });
  } else if (freind_request_el.innerText == "Accept request") {
    fetch("/accept_req", {
      method: "POST",
      body: JSON.stringify({
        input: {
          req_id: profiles_id.innerText
        }
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(function (final_res) {
      console.log(final_res);

      if (final_res.status == 200) {
        freind_request_el.innerText = "Friend";
        message_el.style.display = "block";
      } else {
        freind_request_el.innerText = "Add Friend";
      }
    });
  }
});
drop_button_el.addEventListener("click", function () {
  if (dropdown_content_el.style.display == "block") {
    dropdown_content_el.style.display = "none";
  } else {
    dropdown_content_el.style.display = "block";
  }

  if (notification_el.style.display == "block") {
    notification_el.style.display = "none";
  }
});

function myfucntion() {
  console.log("foo");

  if (options_button_el.style.display == "none") {
    console.log("uo");
    options_button_el.style.display = "block";
  } else {
    options_button_el.style.display = "none";
  }
}

var Post = function Post() {
  var _React$useState = React.useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      posts = _React$useState2[0],
      setPost = _React$useState2[1];

  var _React$useState3 = React.useState(false),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      reload = _React$useState4[0],
      setReload = _React$useState4[1];

  React.useEffect(function () {
    console.log(profiles_id.innerText);
    fetch("/mypost", {
      method: "POST",
      body: JSON.stringify({
        input: {
          req_id: profiles_id.innerText
        }
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(function (result) {
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
  }, posts.length ? /*#__PURE__*/React.createElement("div", {
    className: "font-extrabold text-4xl mt-8"
  }, "Posts") : /*#__PURE__*/React.createElement("div", {
    className: "mt-10 mb-5"
  }, "No Posts available"), posts.map(function (elem, index) {
    return /*#__PURE__*/React.createElement("div", {
      className: "bg-white w-full mt-8 pb-2 px-6 pt-3 flex flex-col rounded-lg last:mb-8",
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
    }, " ", elem.date_posted))), /*#__PURE__*/React.createElement("div", {
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