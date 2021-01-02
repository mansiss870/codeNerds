function validation(frm)
{
var fn=frm.firstName.value;
var vv="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,. ";
var x=0;
while(x<fn.length)
{
if(vv.indexOf(fn.charAt(x))==-1)
{
frm.firstName.classList.add("is-invalid");
frm.firstName.classList.remove("is-valid");
return false;
}
frm.firstName.classList.add("is-valid");
frm.firstName.classList.remove("is-invalid");
x++; 
}
var ln=frm.lastName.value;
var vv="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz,. ";
var x=0;
while(x<ln.length)
{
if(vv.indexOf(ln.charAt(x))==-1)
{
frm.lastName.classList.add("is-invalid");
frm.lastName.classList.remove("is-valid");

return false;
}
frm.lastName.classList.add("is-valid");
frm.lastName.classList.remove("is-invalid");
x++; 
}
var pwd=frm.inputPassword.value;
var rpwd=frm.repeatPassword.value;
if(pwd!=rpwd)
{
frm.inputPassword.classList.add("is-invalid");
frm.inputPassword.classList.remove("is-valid");
frm.repeatPassword.classList.add("is-invalid");
frm.repeattPassword.classList.remove("is-valid");
return false;
}else{
frm.inputPassword.classList.add("is-valid");
frm.inputPassword.classList.remove("is-invalid");
frm.repeatPassword.classList.add("is-valid");
frm.repeattPassword.classList.remove("is-invalid");
return false;
}
return false;
}
