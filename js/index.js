(function() {
	//内容大小更改
	var hearder = tools.$(".header")[0];
	var weiyun = tools.$(".weiyun-content")[0];
	var hearderH = hearder.offsetHeight;
	var getPidInput = tools.$("#getPidInput");
	var empt = tools.$(".g-empty")[0]; //获得遮罩层
    //设置容器高度
	changeHeight();
	
	window.onresize = changeHeight;
	//加载内容高度,可视区域自适应
	function changeHeight() {
		var viewHeight = document.documentElement.clientHeight;
		weiyun.style.height = viewHeight - hearderH + "px";
	}
	
	//渲染文件区域
	var fileList = tools.$('.file-list')[0];
	// 导航区域
	var pathNav = tools.$(".path-nav")[0];
	//树形菜单区域
	var treeMenu = tools.$(".tree-menu")[0];
	//获取data数据
    var dataFiled = data.files;
    
	pathNav.innerHTML = createPathNav(dataFiled,0);//渲染导航区域
	fileList.innerHTML = createFile(dataFiled, 0); //创建目录结构
	treeMenu.innerHTML = treeHtml(dataFiled, -1); //右侧树形菜单
	
	postionId(0);

	//文件夹点击事件
	tools.addEvent(fileList, "click", function(ev) {
		//获取事件源并找到父级是否是item
		var target = ev.target;
		if(tools.parents(target, ".item")) {
			target = tools.parents(target, ".item");
			var dataId = target.dataset.fileId;
			renderNavFile(dataId); //渲染导航数据
		}
	});

	//树形菜单点击事件
	tools.addEvent(treeMenu, "click", function(ev) {
		var target = ev.target;
		//查找树形菜单的父级绑定
		if(tools.parents(target, ".tree-title")) {
			target = tools.parents(target, ".tree-title");
			var dataId = target.dataset.fileId; //获取当前div data-Filed-id
			renderNavFile(dataId); //渲染数据
		}
	});

	var fileItem = tools.$('.file-item', fileList);
	var checkboxs = tools.$('.checkbox', fileList);
	var checkedAll = tools.$('.checked-all')[0];

	tools.addEvent(checkedAll, 'click', function(ev) {
		var isChecked = tools.toggleClass(this, 'checked');
		if(isChecked) {
			tools.each(fileItem, function(item, index) {
				tools.addClass(item, 'file-checked');
				tools.addClass(checkboxs[index], 'checked');
			});
		} else {
			tools.each(fileItem, function(item, index) {
				tools.removeClass(item, 'file-checked');
				tools.removeClass(checkboxs[index], 'checked');
			});
		}

	});

	tools.each(fileItem, function(item, index) {
		bindfileItem(item);
	});

	/**
	 * 绑定右侧鼠标移入移出事件
	 * @param {Object} item
	 */
	function bindfileItem(item) {
		console.log(item);
		var checkBox = tools.$('.checkbox', item)[0];
		//文件鼠标移入的操作
		tools.addEvent(item, 'mouseover', function(ev) {
			tools.addClass(this, 'file-checked');
		});
		tools.addEvent(item, 'mouseout', function(ev) {
			if(!tools.hasClass(checkBox, 'checked')) {
				tools.removeClass(this, 'file-checked');
			}
		});
		//单选框点击事件
		tools.addEvent(checkBox, 'click', function(ev) {
			var ischeck = tools.toggleClass(this, 'checked');
			if(ischeck) {
				//判断是否选中
				if(selectArr().length == checkboxs.length) {
					tools.addClass(checkedAll, 'checked');
				}
			} else {
				tools.removeClass(checkedAll, 'checked');
			}
			ev.stopPropagation();
		});
	}

	//新建目录
	var create = tools.$('.create')[0];
	tools.addEvent(create, 'click', function() {
		empt.style.display="none";
		var newFile = createFileElement({
			id: new Date().getTime(),
			title: "new sas"
		});
		fileList.insertBefore(newFile, fileList.firstElementChild);

		var fileTitle = tools.$('.file-title',newFile)[0];
		var fileEdtor = tools.$('.file-edtor',newFile)[0];
		var edtor = tools.$('.edtor',newFile)[0];

		fileTitle.style.display = 'none';
		fileEdtor.style.display = 'block';
		edtor.focus();
		create.keyStauts = true;
	});

	//给document绑定事件,当鼠标按下时edtor不可编辑
	tools.addEvent(document, 'mousedown', function() {
		if(create.keyStauts) {
			var fristElement = fileList.firstElementChild;
			//创建成功
			var edtor = tools.$('.edtor', fristElement)[0];
			var val = edtor.value.trim();
			if(val == "") {
				fristElement.removeChild(fristElement);
			} else {
				var fileTitle = tools.$('.file-title', fristElement)[0];
				var fileEdtor = tools.$('.file-edtor', fristElement)[0];

				fileTitle.style.display = "block";
				fileEdtor.style.display = "none";
				fileTitle.innerHTML = val;
				//绑定右侧导航事件
				bindfileItem(fristElement);
				
              	var fileId = tools.$('.item',fristElement)[0].dataset.fileId;
              	var pid=getPidInput.value;
				//向data添加数据
				var newDatas = {
					id: fileId,
					pid: pid,
					title: val,
					type: "file"
				};
				dataFiled.unshift(newDatas);
				//根据当前pid找到当前父级元素div 
				var treeDiv= document.querySelector(".tree-title[data-file-id='" + pid + "']");
                var treeUl= treeDiv.nextElementSibling;
                var lev= dataControl.getLevelById(dataFiled,fileId);
                treeUl.appendChild(createTree({id:fileId,level:lev,title:val}));
                if(treeUl.innerHTML !=null){
                	tools.addClass(treeDiv,"tree-contro");
                	tools.removeClass(treeDiv,"tree-contro-none");
                }
                tipsFn("ok","新建文件夹");
                
			}
			create.keyStauts = false;
		}

	});
	//封裝弹窗插件
	var fullTip  = tools.$(".full-tip-box")[0];
	var tipText =  tools.$(".text",fullTip)[0]; 
	
	/**
	 * @param {Object} cls 提示框样式 ok or err
	 * @param {Object} title 文本标题
	 */
	function tipsFn(cls,title){
		//初始的时候从最初的时候出现
		fullTip.style.top="-32px";
		fullTip.style.transition='none';
		
		setTimeout(function(){
			fullTip.style.className="full-tip-box";
			fullTip.style.top=0;
			fullTip.style.transition='.3s';
			tools.addClass(fullTip,cls);
		},0);
		clearInterval(fullTip.timer);
		//3秒缓存时间
		fullTip.timer=setTimeout(function(){
			fullTip.style.top= '-32px';
			fullTip.style.transition='.3s';
		},1000);
	}
	
	
	//创建文件夹
	function createFileElement(filedate) {
		var fileItem = document.createElement("div");
		fileItem.className = "file-item";
		fileItem.innerHTML = fileStruct(filedate);
		return fileItem;
	}

	//选中的数组
	function selectArr() {
		var arr = [];
		//checkbox和item一一对应
		tools.each(checkboxs, function(checkbox, index) {
			if(tools.hasClass(checkbox, 'checked')) {
				arr.push(fileItem[index]);
			}
		});
		return arr;
	}

	//渲染导航区域数据
	function renderNavFile(dataId) {
		getPidInput.value=dataId;//记录每次渲染的id
		pathNav.innerHTML = createPathNav(dataFiled,dataId);
		//添加右侧目录结构
		if(dataControl.hasChilds(dataFiled, dataId)) {
			empt.style.display = "none";
			fileList.innerHTML = createFile(dataFiled, dataId);
		} else {
			empt.style.display = "block";
			fileList.innerHTML="";
		}
		// 定位到当前节点样式
		var treeN = tools.$(".tree-nav", treeMenu)[0];
		tools.removeClass(treeN, "tree-nav");
		postionId(dataId);
		tools.each(fileItem,function(item){
			bindfileItem(item) ;
		});
	}
	
	//生成框选div
	var newDiv=null;
	var clx=0,cly=0;
	tools.addEvent(document,"mousedown",function(ev){
		
		var target =ev.target;
		if(tools.parents(target,".nav-a")){
			return;
		}
		 clx = ev.clientX;
	     cly = ev.clientY;
	    if(!newDiv){
	    	newDiv=document.createElement("div");
	   	    newDiv.className="selectTab";
	   	    document.body.appendChild(newDiv);
	    }
	    newDiv.style.width=0;
	    newDiv.style.height=0;
	    newDiv.style.display="block";
	    tools.addEvent(document,"mousemove", moveFn);
	    tools.addEvent(document,"mouseup",upFn);
	    //去掉默认行为
	    ev.preventDefault();
	    
	});
	 function moveFn(e){
	 	
	    	var w=clx - e.clientX;
	    	var h=cly- e.clientY;
	    	
	    	//鼠标拖拽原理 那个小就赋予top left
	    	newDiv.style.top=Math.min(cly,e.clientY)+"px";
	    	newDiv.style.left=Math.min(clx,e.clientX)+"px";
	    	
	    	newDiv.style.height=Math.abs(h)+"px";
	    	newDiv.style.width=Math.abs(w)+"px";
	    	
	    	//碰撞检测
	    	tools.each(fileItem,function(item,index){
	    		console.log(item);
	    		if(tools.collisionRect(newDiv,item)){
	    			//当碰撞的时候
	    			tools.addClass(item,"file-checked");
	    			tools.addClass(checkboxs[index],"checked");
	    		}else{
	    			tools.removeClass(item,"file-checked");
	    			tools.removeClass(checkboxs[index],"checked");
	    		}
	    	});
	 }
	 function upFn(e){
	 	tools.removeEvent(document,"mousemove",moveFn);
	 	tools.removeEvent(document,"mouserup",upFn);
	 	newDiv.style.display="none";
	 	 
	 }
	

}())