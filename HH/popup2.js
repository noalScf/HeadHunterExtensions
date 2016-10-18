var JsonResumes=null;
var Resumes=null;
var Views=null;

JsonResumes=chrome.extension.getBackgroundPage().Resumes;
Resumes=JSON.parse(JsonResumes);
ViewsQuery();




function ViewsQuery() {
  oauthProvider.auth(function(token) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event, text) {
      if (xhr.readyState === 4 && xhr.status === 200) {
		 Views=JSON.parse(xhr.responseText);
		  RenderViews();
      }
    };
    xhr.open('GET', 'https://api.hh.ru/resumes/'+Resumes.items[0].id+'/views', true);
    xhr.setRequestHeader('Authorization', 'Bearer '+ token);
    xhr.send();
  });
};

function RenderViews(){
	
	var divFIO = document.getElementById('FIO');
	divFIO.innerHTML=Resumes.items[0].last_name+" "+Resumes.items[0].first_name;
	
	var divBack = document.getElementById('Back');
	var aBack = document.createElement('a');
	aBack.className="glyphicon glyphicon-arrow-left";
	aBack.href=chrome.extension.getURL('popup.html');
	divBack.appendChild(aBack);
	



	
    var body = document.getElementById('View');
    var tbl = document.createElement('table');
    tbl.className="table";
    var tbdy = document.createElement('tbody');
    for (var i=0;i<parseInt(Views.per_page);i++) {
        var tr = document.createElement('tr');
        
				var td = document.createElement('td');
                td.innerHTML=Views.items[i].employer.name;
				td.className="tdWidth1";
                tr.appendChild(td);
				var td = document.createElement('td');
                td.innerHTML=normalizeDate(Views.items[i].created_at);
				td.className="tdWidth2";
                tr.appendChild(td);
				var td = document.createElement('td');
				
					var aView = document.createElement('a');
					aView.className="glyphicon glyphicon-share-alt";
					aView.href=Views.items[i].employer.alternate_url;
					aView.title="HH Title";
					td.appendChild(aView);
					
					aView.onclick= function() {
					chrome.tabs.create(
						{
							url: this.href
						},
					function(tab) {
						this.lastTabId = tab.id;
						}.bind(this)
					);
					};
					
                tr.appendChild(td);

        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}

function normalizeDate(date){ 
var dateTime = new Date(date); 
return ((dateTime.getDate()<10)?'0'+dateTime.getDate():dateTime.getDate())+'.'+
(((dateTime.getMonth()+1)<10)?'0'+(dateTime.getMonth()+1):(dateTime.getMonth()+1))+'.'+
dateTime.getFullYear()+', '+ 
((dateTime.getHours()<10)?0+dateTime.getHours():dateTime.getHours())+':'+
((dateTime.getMinutes()<10)?'0'+dateTime.getMinutes():dateTime.getMinutes());
}