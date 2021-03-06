﻿// 根据输入的树形结构对象在用户指定元素内渲染树形结构
// 用户点击删除按钮将在指定元素上触发nodedelete.treeview事件
//
(function ($) {
  $.widget("qdq.treeview", {
  
    options: {
      // 渲染对象格式要求：树形结构，包含name属性用于显示
      // 无根节点的树形数据结构
      data: {}, // 需要渲染的数据，如果传入的为json字符串，解析为对象
      nodedelete: function () {}, // 节点删除默认处理程序
      nodeselected: function () {} // 节点被点击默认处理程序
    }, // end options
    
    _create: function ()
    {
      var treeviewself = this;
      
      if (typeof this.options.data === "string")
      {
        this.options.data = $.parseJSON(this.options.data);
      } // end if
      
      // 如果根元素没有name属性，不用渲染了
      if (typeof this.options.data.name !== "undefined")
      {
        this._root = $("<ul></ul>").addClass("treeview")
          .append(this._createNode(this.options.data))
          .appendTo(this.element);
          

        // 托管点击事件：切换节点开关状态
        this._root.find(".sign").on("click", function (event) {
          var self = $(this);
          var target = $(event.target);
          
          self.parent().toggleClass("folder-close folder-open");
          self.parent().filter(".folder-close").children("ul").stop(true, true).slideUp("normal");
          self.parent().filter(".folder-open").children("ul").stop(true, true).slideDown("normal");
          // 每个点击事件切换本节点，不影响父节点
          event.stopPropagation();
        });
        
        // 监听删除节点点击事件，处理删除
        this._root.find(".node-delete").on("click", function (event) {
          var target = $(event.target);
          target.parent().remove();
          treeviewself._labelLastNode();
          treeviewself._trigger("nodedelete", null, target.parent());
          event.stopPropagation();
        });
        
        // 监听节点点击事件，提供用户操作
        this._root.find(".nodecontent").on("click", function (event) {
          var target = $(event.target);
          treeviewself._trigger("nodeselected", null, target.parent());
          event.stopPropagation();
        });
        
        this._labelLastNode();
      } // end if
    }, // end _create()
    
    
    // 根据传入节点递归生成对应li结构,
    // @return: 如果节点为叶节点，返回对应li，如果非叶节点，在其li下递归生成ul
    // @param: node 树形结构对象
    _createNode: function (node)
    {
      // 生成默认节点
      var root = $("<li></li>").append($("<span></span>").append(node.name).addClass("nodecontent"))
        .attr("data-name", node.name)
        .append($("<span></span>").addClass("node-delete"));
      
      if (typeof node.children !== "undefined" && node.children.length !== 0)
      {
        var child = $("<ul></ul>");
        for (var i = 0; i < node.children.length; ++i)
        {
          child.append(this._createNode(node.children[i]));
        } // end if
        root.append(child);
        root.addClass("folder-open collapsable");
        root.prepend($("<span></span>").addClass("folder"));
        root.prepend($("<span></span>").addClass("sign"));
      } // end if
      else
      {
        root.prepend($("<span></span>").addClass("file"));
      } // end else
      return root;
    }, // end _createNode()
    
    // 每一个ul的最后一个li添加标记，如果是叶节点添加类lastleaf，如果不是叶节点添加lastnode
    _labelLastNode: function ()
    {
        // 最后一个li如果包含ul标记类lastnode，如果不包含ul标记类lastleaf
        this._root.find("li:last-child()").not(".collapsable").addClass("lastleaf")
          .end().filter(".collapsable").addClass("lastnode");
    }, // end _labelLastNode()

    removeNode: function (name)
    {
      this._root.find("li").filter(function () {
        var self = $(this);
        return self.data("name") === name;
      }).remove();
    } // end removeNode()
    
    
    
  });
}(jQuery));