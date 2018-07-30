function fileStruct(childerData) {
	var temp = `<div class="item" data-file-id="${childerData.id}">
                                    <lable class="checkbox"></lable>
                                    <div class="file-img">
                                        <i></i>
                                    </div>
                                    <p class="file-title-box">
                                        <span class="file-title">${childerData.title}</span>
                                        <span class="file-edtor">
                                            <input class="edtor" value="${childerData.title}" type="text"/>
                                        </span>
                                    </p>
                                </div>`;
	return temp;
}

//准备文件区域结构（此处纯属函数调用）
function filesHtml(childerData) {
	var temp = `<div class="file-item">
                               ${fileStruct(childerData)}
                 </div>`;
	return temp;

}

function createPathNav(dataFiled,dataId){
		var parent = dataControl.getParents(dataFiled, dataId).reverse();
		var navHtml = "";
		var len = "";
		parent.forEach(function(datas, index) {
			if(parent.length - 1 == index) {
				return;
			}
			navHtml += `<a href="javascript:;" style="z-index:${len--}" data-file-id="0">${datas.title}</a>`;
		});

		navHtml += `
    	   <span class="current-path" style="z-index:${len--}" data-file-id="0">${parent[parent.length-1].title}</span>`;
    	   
    	   return navHtml;
}
//创建目录结构
function createFile(dataFiled, renderId) {
	var html = "";
	var child = dataControl.getChildById(dataFiled, renderId);
	child.forEach(function(item) {
		html += filesHtml(item);
	});
	return html;
}

//渲染树形菜单
function treeHtml(data, treeId) {
	var childer = dataControl.getChildById(data, treeId);
	
	//使用递归来添加树形菜单内容
	var html = "<ul>";
	childer.forEach(function(item) {
		//判断层级
		var level = dataControl.getLevelById(data, item.id);
		//判断当前数据有没有子数据 	
		/*tree-contro tree-contro-none 倒三角样式*/
		var hashChild = dataControl.hasChilds(data, item.id);
		var className = hashChild ? "tree-contro" : "tree-contro-none";
		
		html += `<li>
                    <div class="tree-title  ${className}" data-file-id="${item.id}" style="padding-left:${level*14}px;">
                          <span>
                               <strong class="ellipsis">${item.title}</strong>
                                   <i class="ico"></i>
                          </span>
                     </div>
                     ${treeHtml(data,item.id)}
                 </li>`;
	});
	html += "</ul>";
	return html;
}

function createTree(item){
	var newLi=document.createElement("li");
	newLi.innerHTML= `<div class="tree-title tree-contro-none" data-file-id="${item.id}" style="padding-left:${item.level*14}px;">
                   <span>
                       <strong class="ellipsis">${item.title}</strong>
                            <i class="ico"></i>
                   </span>
                </div>
                <ul></ul>
               `;
   return newLi;
}

//定位树形菜单位置
function postionId(postionId) {
	var selected = document.querySelector(".tree-title[data-file-id='" + postionId + "']");
	tools.addClass(selected, "tree-nav");
}