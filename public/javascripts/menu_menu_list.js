/**
 * Created with JetBrains WebStorm.
 * User: Sara(fyx1014@hotmail.com)
 * Date: 13/11/22
 * Time: 15:10
 * To change this template use File | Settings | File Templates.
 */

$(function () {
  'use strict';

  // add menu
  $("#addMenu").bind("click", function(event){
    window.location = "add";
  })
  // show list
  render(0, 20);
  // get the events for buttons
  events();
});

/**
 * get list
 */
function render(start, count,keyword) {

  var jsonUrl = "/menu/list.json?";
  jsonUrl += "start=" + start;
  jsonUrl += "&count=" + count;

  if(keyword){
    keyword = keyword ? encodeURIComponent(keyword) : "";
    jsonUrl += "&keyword=" + keyword;
  }
  smart.doget(jsonUrl, function(e, result){

    if (smart.error(e, i18n["js.common.search.error"], true)) {
      return;
    }

    var list = result.items;
    var index = 1;
    var tmpl = $('#tmpl_menu_list').html();
    var container = $("#menu_list");
    container.html("");

    _.each(list, function(row){

      container.append(_.template(tmpl, {
        "id": row._id
        , "index": index++
        , "name": row.name
        , "comment": row.comment
        , "status" : row.status == 1 ? i18n["html.label.menu.open"] : i18n["html.label.menu.close"]
        , "editat": smart.date(row.editat)
      }));
    });

    if(!list || list.length == 0 ){
      container.html(i18n["js.common.list.empty"]);
    }

    // 设定翻页
    smart.pagination($("#pagination_area"), result.totalItems, count, function(active, rowCount){
      render.apply(window, [active, count]);
    });
  });

}

function events() {

  $("#txt_search").bind("change",function(){
    var _keyword = '';
    _keyword =  $("#txt_search").val();
    smart.paginationInitalized = false;
    render(0, 20,_keyword);
  });

  $("#doSearch").bind("click",function(){
    var _keyword = '';
    _keyword =  $("#txt_search").val();
    smart.paginationInitalized = false;
    render(0, 20,_keyword);
  });

  // list events
  $("#menu_list").on("click", "a", function(event){

    var target = $(event.target);
    var operation = target.attr("operation")
      , rowId = target.attr("rowId");

    if (operation == "edit") {
      window.location = "/menu/menu/edit/" + rowId;
    }

    if (operation == "delete") {
      Alertify.dialog.labels.ok = i18n["js.common.dialog.ok"];
      Alertify.dialog.labels.cancel = i18n["js.common.dialog.cancel"];
      Alertify.dialog.confirm(i18n["js.common.delete.confirm"], function () {

        smart.dodelete("/menu/remove.json", {"id": rowId}, function(err, result){
          if (smart.error(err,i18n["js.common.delete.error"], false)) {

          } else {
            render(0, 20);
            Alertify.log.success(i18n["js.common.delete.success"]);
          }
        });
      }, function () {
        // Cancel
      });
    }
  });
}

