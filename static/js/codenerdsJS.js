var selectedLanguage='C'
var listOfUsers;
var listOfQues;
var linesToShow=" 1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>";
var clicked=false;
function setLanguage(lang)
{
  document.getElementById("selectedLanguage").innerHTML=lang
  selectedLanguage=lang
}
function getResponse(data,url,successfunc)
{
var xmlHttpRequest=new XMLHttpRequest();
xmlHttpRequest.onreadystatechange=function(){
if(this.readyState==4 && this.status==200)
{
var responseString=this.responseText;
var responseJSON=JSON.parse(responseString);
if(responseJSON.success)
{
successfunc(responseJSON.response);
}
else
{
alert("soame error")
}
}
};
xmlHttpRequest.open("POST",url,true); 
xmlHttpRequest.setRequestHeader("Content-type","application/json");
xmlHttpRequest.send(JSON.stringify(data));
}

function compileAndTest()
{
  document.getElementById("savedstatus").innerHTML="Saved!"
document.getElementById("source_testcases_output_div").style.display="block";
document.getElementById("source_testcases_output_div").scrollIntoView();
var code=document.getElementById("editor").value;
var ques_id=document.getElementById("ques_div").name;
url="/compileAndTest"
data={"ques_id":ques_id,"code":code,"language":selectedLanguage}
getResponse(data,url,function(response){
document.getElementById("source_testcases_output").innerHTML=response;
document.getElementById("testcases_output").style.display="none";
document.getElementById("spinner_output").style.display="none";
document.getElementById("source_testcases_output_div").style.display="block";
document.getElementById("output_div").style.display="none";
});
}

function submit()
{
document.getElementById("savedstatus").innerHTML="Saved!"
document.getElementById("testcases_output").style.display="none";
document.getElementById("spinner_output").style.display="block";
document.getElementById("source_testcases_output_div").style.display="none";
document.getElementById("output_div").style.display="block";
document.getElementById("output_div").scrollIntoView();
var code=document.getElementById("editor").value;
var ques_id=document.getElementById("ques_div").name;
url="/submit"
data={"ques_id":ques_id,"code":code,"language":selectedLanguage}
getResponse(data,url,function(response){
  if(response.error==true)
  {
    document.getElementById("output_div").style.display="none";
    document.getElementById("source_testcases_output_div").scrollIntoView();
    document.getElementById("source_testcases_output_div").style.display="block";
    document.getElementById("source_testcases_output").innerHTML=response.response    
    document.getElementById("spinner_output").style.display="none";
    document.getElementById("testcases_output").style.display="none";
}else{
var res=response.response
var k=1
for(i in res)
{
if(res[i]==true)
{
document.getElementById("testcase"+k).innerHTML="check"
document.getElementById("testcase"+k).classList.add("text-success")
document.getElementById("testcase"+k).classList.remove("text-danger")
}else{
document.getElementById("testcase"+k).innerHTML="close"
document.getElementById("testcase"+k).classList.remove("text-success")
document.getElementById("testcase"+k).classList.add("text-danger")
}
k++
}
document.getElementById("testcases_output").style.display="block";
document.getElementById("spinner_output").style.display="none";
document.getElementById("source_testcases_output_div").style.display="none";
document.getElementById("output_div").style.display="block";
}
});

}



function getQuestion(ques_id)
{ 
    var url ="/getQuestion"; 
    var data= { "ques_id" : ques_id }
    getResponse(data,url,function(response){
    document.getElementById("ques_div").innerHTML=response.question;
    document.getElementById("editor").value=response.code;
    document.getElementById("ques_div").name=ques_id;
    document.getElementById("main").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("codeEditor").style.display='block';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("output_div").style.display="none";
   document.getElementById("editorlineNo").innerHTML=linesToShow

});
}


function changeDIV(div_id)
{
 if(div_id=="arrays")
 {
    document.getElementById("update_profile").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("output_div").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='block';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="dashboard")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='block';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="linkedlist")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='block';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="tree")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='block';
    document.getElementById("stack").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="stack")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='block';
    document.getElementById("queue").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="queue")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("queue").style.display='block';
    document.getElementById("arrays").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="ga")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='block';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="dp")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='block';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="dc")
   {
    document.getElementById("user_profile").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("dc").style.display='block';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    
   }
   if(div_id=="bf")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='block';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    }
  
   if(div_id=="backtrack")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='block';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="easy")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='block';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="medium")
   {
    document.getElementById("output_div").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("main").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='block';
    document.getElementById("hard").style.display='none';
    
   }
   if(div_id=="hard")
   {
    document.getElementById("main").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("output_div").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='block';
    
   }
   if(div_id=="update_profile")
   {
    document.getElementById("main").style.display='none';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("output_div").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("update_profile").style.display='block';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("userprofile").style.display='none';
    document.getElementById("hard").style.display='none';
  }
  if(div_id=="userprofile")
   {
    document.getElementById("main").style.display='none';
    document.getElementById("userprofile").style.display='block';
    document.getElementById("source_testcases_output_div").style.display="none";
    document.getElementById("output_div").style.display='none';
    document.getElementById("codeEditor").style.display='none';
    document.getElementById("backtrack").style.display='none';
    document.getElementById("bf").style.display='none';
    document.getElementById("dc").style.display='none';
    document.getElementById("ga").style.display='none';
    document.getElementById("dp").style.display='none';
    document.getElementById("linkedlist").style.display='none';
    document.getElementById("update_profile").style.display='none';
    document.getElementById("tree").style.display='none';
    document.getElementById("stack").style.display='none';
    document.getElementById("queue").style.display='none';
    document.getElementById("arrays").style.display='none';
    document.getElementById("easy").style.display='none';
    document.getElementById("medium").style.display='none';
    document.getElementById("hard").style.display='none';
  }
  

 }

function getListOfUsersAndQuestions()
{
url="/getListOfUsersAndQuestions"
data={}
getResponse(data,url,function(response){
listOfUsers=response.usersList;
listOfQues=response.quesList;
});
}



function getLineNumber(textarea) 
{

  var lines=textarea.value.substr(0, textarea.selectionStart).split("\n").length;
  var i=1,j=17,k=2,mode=0,start=1,end=18
  var linesToShowLocal=""
  while(j<lines)
  {
    mode=lines%17
    start=i+mode
    end=start+17
    i=j
    j=j*2
  }
  linesToShowLocal=start
  start++
  var xx=end.toString().length+2
  var editorlineNo=document.getElementById("editorlineNo")
  editorlineNo.style.width=xx+"%"
  document.getElementById("editor").style.width=(100-xx)+"%"
  while(start<end)
  {
    linesToShowLocal=linesToShowLocal+"<br>"+start
    start++
  }
  if(linesToShowLocal.length>3)
  {  
  document.getElementById("editorlineNo").innerHTML=linesToShowLocal
  }
  linesToShow=linesToShowLocal
}


function searchUsers(user)
{
var button=document.getElementById("dropdownMenuButton")
var ul=document.getElementById("usersDropdown");
var none=document.createElement("li")
var img=document.createElement("img")
img.classList.add("rounded")
img.alt="Cinque Terre"
img.width="35"
img.height="35"
var node
document.getElementById("dropdownmenu").style.display="block"
none.classList.add("list-group-item")
none.classList.add("dropdown-item")
none.appendChild(document.createTextNode("No result found."))
none.name="none"
none.id="none"
none.style.cursor="pointer"
user.style.color='black';
var k=0;
var node;
user.focus()
if(user.value.length==0) 
{
  while((ul.childNodes.length)>k)
  {
  ul.removeChild(ul.childNodes[k])
  k++
  }
  document.getElementById("dropdownmenu").style.display="none"
 return;                               
} 
var i;
for(i=0;i<listOfUsers.length;i++)
{
if(listOfUsers[i].username.toUpperCase().startsWith(user.value.toUpperCase())) break;
}
var j;
for(j=0;j<listOfQues.length;j++)
{
if(listOfQues[j].question.toUpperCase().startsWith(user.value.toUpperCase())) break;
}
if(i==listOfUsers.length && j==listOfQues.length)
{
  while((ul.childNodes.length)>k)
  {
  ul.removeChild(ul.childNodes[k])
  k++
  }
  if(!ul.contains(document.getElementById("none")))
  {
      ul.appendChild(none);
  }
}
else
{
if(ul.contains(document.getElementById("none")))
{
  ul.removeChild(document.getElementById("none"));
}
if(i<listOfUsers.length)
{
if(!ul.contains(document.getElementById(listOfUsers[i].username)))
{
li=document.createElement("li")
li.classList.add("list-group-item")
li.classList.add("dropdown-item")
img.src="static/img/"+listOfUsers[i].profile_pic
li.appendChild(img)
node=document.createTextNode(listOfUsers[i].username);
li.appendChild(node)
li.name=listOfUsers[i].username
li.id=listOfUsers[i].username
li.style.cursor="pointer"
li.classList.add("text-gray-900")
li.onclick=createClickHandlerForUser(i)
if(ul.childNodes.length>0)
{
ul.insertBefore(li,ul.childNodes[0])
}else{
ul.appendChild(li)
}
}
}else{
if(!ul.contains(document.getElementById(listOfQues[j].ques_id)))
{
li=document.createElement("li")
li.classList.add("list-group-item")
li.classList.add("dropdown-item")
node=document.createTextNode(listOfQues[j].question);
li.appendChild(node)
li.name=listOfQues[j].ques_id
li.id=listOfQues[j].ques_id
li.style.cursor="pointer"
li.classList.add("text-gray-900")
li.onclick=createClickHandlerForQuestion(listOfQues[j].ques_id)
if(ul.childNodes.length>0)
{
ul.insertBefore(li,ul.childNodes[0])
}else{
ul.appendChild(li)
}
}
}
}
}

function createClickHandlerForUser(x)
{
return function()
{
  document.getElementById("dropdownmenu").style.display="none"
showUserProfile(x);
};
}

function createClickHandlerForQuestion(x)
{
return function()
{
document.getElementById("dropdownmenu").style.display="none"
getQuestion(x);
};
}



function showUserProfile(i){
url="/getUserInfo"
data={"username":listOfUsers[i].username}
getResponse(data,url,function(response){
document.getElementById("username").innerHTML=response.fname+" "+response.lname
document.getElementById("userinstitution").innerHTML=response.institution
document.getElementById("userscore").innerHTML=response.quesDetails.score
document.getElementById("usersolvedques").innerHTML=response.quesDetails.solved_ques
document.getElementById("userqeasy").innerHTML=response.quesDetails.easy+" %"
document.getElementById("userqhard").innerHTML=response.quesDetails.hard+" %"
document.getElementById("userqmedium").innerHTML=response.quesDetails.medium+"%"
document.getElementById("userqeasydiv").style.width=response.quesDetails.easy+"%"
document.getElementById("userqharddiv").style.width=response.quesDetails.hard+"%"
document.getElementById("userqmediumdiv").style.width=response.quesDetails.medium+" %"
//document.getElementById("userqeasydiv").aria-valuenow=response.quesDetails.easy
//document.getElementById("userqharddiv").aria-valuenow=response.quesDetails.hard
//document.getElementById("userqmediumdiv").aria-valuenow=response.quesDetails.medium
document.getElementById("userprofilepic").src="static/img/"+response.profile_pic
changeDIV('userprofile')
});
}


window.addEventListener("load",getListOfUsersAndQuestions())

