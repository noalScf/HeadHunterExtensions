// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
//
// Copyright (c) 2015 Nikita Kovalev, HeadHunter


//var z=document.getElementById('button2');
//console.log(z);
//z.onclick= function() {
//alert("click button2");
//chrome.browserAction.setPopup({popup: 'popup2.html'});
//}

var JsonResumes=null;
var Resumes=null;
JsonResumes=chrome.extension.getBackgroundPage().Resumes;
Resumes=JSON.parse(JsonResumes);
console.log(JsonResumes);

var todayTime =new Date();
var nData=new Date(normalizeDate(todayTime));
var millisecondsTodayTime = todayTime.getTime();

console.log("millisecondsTodayTime "+millisecondsTodayTime);

function CreateView() {
var Table=chrome.extension.getBackgroundPage().HHTable;
console.log(Table);


var divFIO = document.getElementById('FIO');
divFIO.innerText=Table.lastName+" "+Table.fistName;

var divHead = document.getElementById('Photo');
var aClk = document.createElement('a');
	aClk.className="aClk";
	aClk.href=Table.linkes;
	aClk.title="HH Title";
divHead.appendChild(aClk);

var img = document.createElement('img');
	img.className="img-rounded";
	img.src=Table.photo;
	img.width="100";
aClk.appendChild(img);

aClk.onclick= function() {
chrome.tabs.create(
        {
          url: Table.linkes
        },
        function(tab) {
			
          this.lastTabId = tab.id;
        }.bind(this)
    );
};





var divInfo = document.getElementById('Info');
//var divKolView = document.createElement('div');
//	divKolView.className="divKolView";
//	divKolView.innerHTML="Всего просмотров: "+Table.totalViews;
//divInfo.appendChild(divKolView);


var aView = document.createElement('a');
	aView.className="aView";
	aView.href=chrome.extension.getURL('popup2.html');
	aView.innerHTML="Всего просмотров: "+Table.totalViews;
divInfo.appendChild(aView);


var divKolViewNew = document.createElement('div');
	divKolViewNew.className="divKolViewNew";
	divKolViewNew.innerHTML="Новых просмотров: "+Table.newViews;
divInfo.appendChild(divKolViewNew);



var aUpdate = document.createElement('a');
	aUpdate.className="aUpdate";
	aUpdate.href=Table.linkes;
	
	
	var UpdateData=new Date(Table.update);
	var millisecondsUpdateTime = UpdateData.getTime();
	console.log("millisecondsUpdateTime"+millisecondsUpdateTime);
	
	millisecondsDelta=millisecondsTodayTime-millisecondsUpdateTime;
	
	var hours=~~(millisecondsDelta/(1000*60*60))%24;
	var minutes=~~(millisecondsDelta/(1000*60))%60;
	var seconds=~~(millisecondsDelta/1000)%60;
	
	
	
	console.log("hours "+hours+" minutes "+minutes+" seconds "+seconds);
	
	aUpdate.title="После обновления прошло "+hours+":"+minutes+":"+seconds;
	aUpdate.innerHTML="Последнее обновление: "+"<br>"+normalizeDate(Table.update);
divInfo.appendChild(aUpdate);

setInterval(Update, 3600000); 

aUpdate.onclick=function(){Update()}


function Update(){
chrome.extension.getBackgroundPage().Publish();
chrome.extension.getBackgroundPage().getResumes();
Table=chrome.extension.getBackgroundPage().HHTable;
aUpdate.innerHTML="Последнее обновление: "+normalizeDate(Table.update);
}
}

function normalizeDate(date){ 
var dateTime = new Date(date); 
return ((dateTime.getDate()<10)?'0'+dateTime.getDate():dateTime.getDate())+'.'+
(((dateTime.getMonth()+1)<10)?'0'+(dateTime.getMonth()+1):(dateTime.getMonth()+1))+'.'+
dateTime.getFullYear()+', '+ 
((dateTime.getHours()<10)?0+dateTime.getHours():dateTime.getHours())+':'+
((dateTime.getMinutes()<10)?'0'+dateTime.getMinutes():dateTime.getMinutes());
}



function Views() {
  oauthProvider.auth(function(token) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event, text) {
      if (xhr.readyState === 4 && xhr.status === 200) {
		 console.log("Views "+xhr.responseText);
      }
    };
    xhr.open('GET', 'https://api.hh.ru/resumes/'+Resumes.items[0].id+'/views', true);
    xhr.setRequestHeader('Authorization', 'Bearer '+ token);
    xhr.send();
  });
};




//var output = document.getElementById('output');
//output.innerText = Resumes;



CreateView()
Views()

