/**
 * Created with JetBrains WebStorm.
 * User: Sara(fyx1014@hotmail.com)
 * Date: 13/11/12
 * Time: 15:10
 * To change this template use File | Settings | File Templates.
 */

$(function () {
  'use strict';

  var deskId = $('#deskId').val();
  render(deskId);

  $("#addDesk").bind("click", function(event){

    var desk = {
      name: $("#name").val()
      , capacity: $("#capacity").val()
      , type: $("#inputType").attr("value")
      , sortLevel: $("#sort").val()
      , supportPaddling : $("#paddling").attr("value") === "0"
    };


    if (!check_desk(desk)) {

      if (deskId) {

        desk.id = deskId;

        smart.dopost("/desk/update.json", desk, function(err, result) {
          if (err) {
            smart.error(err,i18n["js.common.update.error"],false);
          } else {
            window.location = "/shop/desk/list";
          }
        });
      } else {
        smart.dopost("/desk/add.json", desk, function(err, result) {
          if (err) {
            smart.error(err,i18n["js.common.add.error"],false);
          } else {
            window.location = "/shop/desk/list";
          }
        });
      }
    }
  });

});

function render(deskId) {

  if (deskId) {

    smart.doget("/desk/findOne.json?deskId=" + deskId , function(err, result) {
      if (err) {
        smart.error(err,i18n["js.common.search.error"],false);
      } else {

        $("#name").val(result.name);
        $("#capacity").val(result.capacity);
        $("#sort").val(result.sortLevel);
        new ButtonGroup("inputType", result.type).init();
        if(result.supportPaddling){
          new ButtonGroup("paddling", "0").init();
        }else{
          new ButtonGroup("paddling", "1").init();
        }
      }
    });
  } else {
    new ButtonGroup("inputType", "0").init();
    new ButtonGroup("paddling", "0").init();
  }
}

function check_desk(desk) {
  var flag = 0;
  if (desk.name == "") {
    Alertify.log.error(i18n["js.public.check.desk.name"]);
    flag = 1;
  } else if (desk.capacity == "") {
    Alertify.log.error(i18n["js.public.check.desk.capacity"]);
    flag = 1;
  } else if (desk.type == "") {
    Alertify.log.error(i18n["js.public.check.desk.type"]);
    flag = 1;
  }

  return flag;
}
