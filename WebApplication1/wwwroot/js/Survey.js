let activeIndex = 0;
let scrollTopPadding = -270;
let wrapper;
let fields;
let btnGroup;
let textarea;
var isSubmitted;
var visiblePopover;


function setActiveTab() {
  fields.removeClass('active');
  let activeField = fields.eq(activeIndex);
  activeField.addClass('active');
  activeField.find('input').focus();
}

function deleteAllPopover() {
    for (var i = 0; i < fields.length; i++) {
        if (visiblePopover != i + 1) {
            $(fields[i]).find("[data-toggle='popover']").popover('hide');
        }
    }
}

function deletePopoverByField(field) {
    $(field).find("[data-toggle='popover']").popover('hide');
}


function scrollToActiveField(field) {

  deleteAllPopover();
  let index = fields.index(field);
  if (index !== activeIndex) {



      activeIndex = index;




    let offset = $(field).offset().top;

    wrapper.animate({ scrollTop: wrapper.scrollTop() + offset  + scrollTopPadding }, 200);


    setTimeout(function () { $(field).find("button").first().focus(); }, 0);
    setActiveTab();


    if (getActiveButtonValue(field) > 0) {
        focusToTextArea(field, getActiveButtonValue(field));
    }
  }
}


function getActiveButtonValue(field) {

    if ($(field).find(".btn.btn-default.active").length > 0) {
        return parseInt($(field).find(".btn.btn-default.active").text());
    }
    return 0;
}

function focusToTextArea(field,visibleRange) {


    //  Focus And show to Text Area
    textarea.css("background-size", "0 2px, 100% 0px");

    $(field).children("textarea").each(function (i, object) {
        $(object).hide();
        if (visibleRange >= parseInt($(object).attr("visible-from")) &&
            visibleRange <= parseInt($(object).attr("visible-to"))) {
            $(object).show();

            setTimeout(function () { $(object).css("background-size", "0 2px, 100% 1px").focus(); }, 0);
            
        }
    });
}

function buttonEnterClick(e,btn) {
    var currentField = $(btn).parent().parent().parent(".field");

    $(btn).parent().fadeOut(300).fadeIn(150).fadeOut(300).fadeIn(150, function () {

        currentField.find(".helpertext").hide();
        let nextFieldIndex = fields.index(currentField) + 1;
        setTimeout(function () { fields.eq(nextFieldIndex).click(); }, 0);


        if (currentField.attr("class").indexOf("last-field") > 0) {
            SendSurvey();
        }
        return false;

    });

}

function SendSurvey() {

    isSubmitted = true;
    activeIndex = -1;
    for (var i = 0; i < fields.length; i++) {
        if ($($(fields)[i]).find(".btn.active").length == 0) {
            alert(1);
            $(fields[i]).find("[data-toggle='popover']").popover({ title: "", content: "", trigger: "manual", viewport: "#containerdiv" }).popover("show");
            visiblePopover = i + 1;

            scrollToActiveField($(fields)[i]);
            break;
        }

    }


    var surveyJson = {
       'SurveyId': 0
      ,'QualityRate': 0
      ,'QualityComment': ''
      ,'ValueRate': 0
      ,'ValueComment': ''
      ,'ServiceRate': 0 
      ,'ServiceComment': ''
      ,'AmbienceRate': 0
      ,'AmbienceComment': ''
      ,'RecommendRate': 0
      ,'RecommendPoorArea': ''
      ,'RecommendImprovements': ''
      ,'RecommendSuggestions': ''
      ,'LastVisit': 0
      ,'LastVisitComment': '' 
      ,'Action': ''
      ,'Status': '' 
      ,'DateTime': ''
      ,'Customer': ''
      ,'MobileNo': ''
      ,'Email': ''
      ,'CheckNo': ''
      ,'TableNo': ''
      ,'ManagerId': 0 
      ,'StaffId': 0
      ,'OutletId': 0
    }




}

function scrollToActiveFieldByIndex(index) {
  scrollToActiveField(fields.eq(index));
}


// DOCUMENT CODE START HERE
$(document).ready(() => {
  wrapper = $('.wrapper');
  fields = $('.field'); 
  textarea = $('.field textarea');
 
  $(".helpertext").hide();
  $(".lblComment").hide();


 

  setTimeout(function () { $(".first-field").focus(); }, 0);




  $("div[btn-type=select]").children(".fa-check").hide();


  fields.click(function() {
    scrollToActiveField(this);
  });

 $("#question-nav-up").on("click", function () {
      let currentActiveField = $("#formSurvey").find(".field.active");
      if (currentActiveField.length > 0) {
          let nextInputIndex = inputs.index(currentActiveField) - 1;
          if (nextInputIndex > 0) {
              inputs.eq(nextInputIndex).focus();
          }
      }
  });
 
  $("#question-nav-down").on("click", function () {
      let currentActiveField = $("#formSurvey").find(".field.active");
      if (currentActiveField.length > 0) {
          let nextInputIndex = inputs.index(currentActiveField) + 1;
          if (nextInputIndex < inputs.length) {
              inputs.eq(nextInputIndex).focus();
          }
      }
  });


  let inputs = $('.field input');
  inputs.focus(function(){
    scrollToActiveField($(this).parent());
  });


  inputs.keydown(function(event) {
    if (event.keyCode === 13 && this.validity.valid) { // enter
        let nextInputIndex = inputs.index(this) + 1;
        if (nextInputIndex < inputs.length) {
          inputs.eq(nextInputIndex).focus();
        }
      }
  });

    // additional for textarea


  textarea.css("background-size", "0 2px, 100% 0px");

  //textarea.keydown(function (event) {
  //    if (event.keyCode === 13 && this.validity.valid) { // enter

  //        var currentField = $(this).parent();


  //        let nextFieldIndex = fields.index(currentField) + 1;
  //        scrollToActiveField(fields.eq(nextFieldIndex));
  //    }
  //});

  textarea.on("focusout", function (event) {

  });

  textarea.on("focus", function (event) {
      $(".helpertext").remove();
      var helperHtml = '<div class="helpertext">' + 
          '<p class="hint-text"> SHIFT + ENTER to make a line break</p>' + 
          '<div style="height:20px;line-height:24px;">' +
          '<div style="margin-top: 0 !important;" class="btn btn-primary btn-sm m-t-10" onclick="return buttonEnterClick(event,this);">OK<i class="fa fa-check" style="margin-left:5px;"></i></div>' +
          '  press <b>ENTER</b></div></div >';


      $(this).parent(".field").append(helperHtml);
     
  });

 

  textarea.keyup(function (event) {
      $(this).css('height', '10px');
          var h = $(this).prop("scrollHeight") + 'px';
          $(this).css('height', h);
  });

  textarea.keydown(function (event) {
      var textareas = $(this).parent().children("textarea");

      if (event.shiftKey && event.keyCode === 13) {
          //var text = $(this).val();
          //var matches = text.match(/\n/g);
          //var cnt = (matches ? matches.length : 0) + 1;
          //$(this).attr('row', cnt);
          var h = $(this).prop("scrollHeight") + 'px';
          $(this).css('height', h);

      }
      else if (event.keyCode === 13 && this.validity.valid) { // enter

          let nextAreaIndex = textareas.index($(this)) + 1;

          if (textareas.eq(nextAreaIndex).length > 0) {
                  textareas.eq(nextAreaIndex).focus();
          }
          else {
              var currentField = $(this).parent();
              if (currentField.attr("class").indexOf("last-field") > 0) {
                  SendSurvey();
              }
              $(this).parent().find(".helpertext").find(".btn").fadeOut(300).fadeIn(150).fadeOut(300).fadeIn(150, function () {
                  
                  let nextFieldIndex = fields.index(currentField) + 1;
                      scrollToActiveField(fields.eq(nextFieldIndex));
              });
              return false;
          }
      }
  });

  setActiveTab();
  
  btnGroup = $('.btn.btn-default'); 

  btnGroup.click(function () {


    $(this).parent(".btn-group-lg").children().removeClass("active");

    if ($(this).attr("btn-type") == "select") {
        $(this).parent().parent().parent().find(".btn-cons").removeClass("active");
    }
    $(this).addClass("active");



    deletePopoverByField($(this).parent(".btn-group-lg").parent(".btn-toolbar").parent(".form-group").parent(".field"));


    var selectedButtonVal = parseInt($(this).text());
    $(this).parent(".btn-group-lg").parent(".btn-toolbar").parent(".form-group").parent(".field").children(".lblComment").hide();
    $(this).parent(".btn-group-lg").parent(".btn-toolbar").parent(".form-group").parent(".field").children("textarea").hide();

    
    if ($(this).attr("btn-type") == "select") {



            $(this).parent().parent().parent().find("i").hide();

            $(this).children(".fa-check").show();

            $(this).fadeOut(300).fadeIn(150).fadeOut(300).fadeIn(150, function () {
                var currentField = $(this).parent().parent().parent().parent();
                let nextFieldIndex = fields.index(currentField) + 1;
                //scrollToActiveField(fields.eq(nextFieldIndex));
                setTimeout(function () { fields.eq(nextFieldIndex).click(); }, 0);
            });
            
        }
        else {

            //  Focus And show to Text Area
            focusToTextArea($(this).parent(".btn-group-lg").parent(".btn-toolbar").parent(".form-group").parent(".field"), selectedButtonVal);


            // Show Element (label) base on visible range
            $(this).parent(".btn-group-lg").parent(".btn-toolbar").parent(".form-group").parent(".field").children(".lblComment").each(function (i, object) {

                if (selectedButtonVal >= parseInt($(object).attr("visible-from")) &&
                    selectedButtonVal <= parseInt($(object).attr("visible-to"))) {
                    $(object).show();
                }
            });


            $(".lblComment.First").hide();
        }

  });




    // COLISION DETECTION OUTSIDE CONTAINER DIV
    attachEvent(document.getElementById('containerdiv'), "scroll", update);
    attachEvent(window, "resize", update);
    update();




});

// DOCUMENT CODE END HERE



// exit
$("#btnSubmit").click(function (e) {

      SendSurvey();
});




// COLLISION CODE FOR POPOVER VALIDATION START HERE

var visibleY = function (el) {
    if (el == null) return false;

    var rect = el.getBoundingClientRect(), top = rect.top, height = rect.height,
        el = el.parentNode;
    do {
        rect = el.getBoundingClientRect();
        if (top <= rect.bottom === false) return false;
        // Check if the element is out of view due to a container scrolling
        if ((top + height) <= rect.top) return false
        el = el.parentNode;
    } while (el != document.body);
    // Check its within the document viewport
    return top <= document.documentElement.clientHeight;
};

// Stuff only for the demo
function attachEvent(element, event, callbackFunction) {
    if (element.addEventListener) {
        element.addEventListener(event, callbackFunction, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + event, callbackFunction);
    }
};

var update = function () {

    if (!isSubmitted) return false;

    // Q1
    if ($("#q1BtnToolbar").find("button.btn.btn-default.active").length == 0) {
        
        if (visibleY(document.getElementById("q1BtnToolbar"))) {
                if (visiblePopover == 1) {
                    $('#q1BtnToolbar').popover('show');
                }
            }
        else {
            if (visiblePopover == 1) {
                $('#q1BtnToolbar').popover('hide');
            }
         }
        
    }


    // Q2
    if ($("#q2BtnToolbar").find("button.btn.btn-default.active").length == 0) {
     
            if (visibleY(document.getElementById("q2BtnToolbar"))) {
                if (visiblePopover == 2) {
                    $('#q2BtnToolbar').popover('show');
                }
            }
            else {
                if (visiblePopover == 2) {
                    $('#q2BtnToolbar').popover('hide');
                }
            }
        
    }


    // Q3
    if ($("#q3BtnToolbar").find("button.btn.btn-default.active").length == 0) {
  
        if (visibleY(document.getElementById("q3BtnToolbar"))) {
                if (visiblePopover == 3) {
                    $('#q3BtnToolbar').popover('show');
                }
          }
        else {
        
            if (visiblePopover == 3) {
                $('#q3BtnToolbar').popover('hide');
            }
        }
        
    }

    // Q4
    if ($("#q4BtnToolbar").find("button.btn.btn-default.active").length == 0) {

        if (visibleY(document.getElementById("q4BtnToolbar"))) {
            if (visiblePopover == 4) {
                $('#q4BtnToolbar').popover('show');
            }
        }
        else {
            if (visiblePopover == 4) {
                $('#q4BtnToolbar').popover('hide');
            }
        }
        
    }


    // Q6
    if ($("#q6BtnToolbar").find("button.btn.btn-default.active").length == 0) {

        if (visibleY(document.getElementById("q6BtnToolbar"))) {
            if (visiblePopover == 6) {
                $('#q6BtnToolbar').popover('show');
            }
        }
        else {
            if (visiblePopover == 6) {
                $('#q6BtnToolbar').popover('hide');
            }

        }
        
 
    }

};




// COLLISION CODE FOR POPOVER VALIDATION END HERE