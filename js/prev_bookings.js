const database=firebase.database();
const users=database.ref('Users');
const prev=database.ref('prev_bookings');

function getData(){
    
    var pass=document.getElementById('pass').value;
    var reg=document.getElementById('regNo').value;
    var head=document.getElementById('prev_heading');
    var para=document.getElementById('prev_data');
    var data="";
    head.style.display="none";
    para.innerHTML="";

    if(reg.length!=9)
        alert("Enter a valid registation number");

    else if(pass.length<6)
        alert("Enter a valid password");

    else{
        var key=[];
        var values=[];
        users.once('value',function(snapshot){
            var i=0;
            snapshot.forEach(
                function(_){
                    key=Object.keys(snapshot.val());
                    values=Object.values(snapshot.val());
                }
            );
        }).then(()=>{
            var found=false;
            for(var i=0;i<key.length;i++){
                if(key[i]==reg){
                    found=true;
                    if(values[i][reg]==pass){
                        var tempKeys=[];
                        prev.once('value',function(temp){
                            tempKeys=Object.keys(temp.val());
                        }).then(()=>{
                            if(tempKeys.includes(reg)){
                                prev.child(reg).once('value',function(child){
                                    var vals=Object.values(child.val());
                                    for(var v in vals){
                                        var money=vals[v]['date'].split(":");
                                        data+=money[0]+' at '+money[1]+':'+money[2]+'<br>';
                                    }
                                    para.innerHTML=data;
                                    head.style.display="block";
                                });
                            }
                            else{
                                para.innerHTML="No data found"
                            }
                        });
                    }
                    else
                        alert("Wrong Password");
                }
            }
            if(!found){
                para.innerHTML="No data found"
            }
        });
    }
}

function onStart(){

    var btn=document.getElementById("submit-btn");

    btn.onclick=function(){
        getData();
    }
}

window.onload=onStart();