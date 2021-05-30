const database=firebase.database();

var enteredReg;
var selName,key,date,time;
var prev=[];

function fetchCheck(){
    selNames=JSON.parse(localStorage.getItem('selected-names'));

    var div=document.getElementsByClassName('list-div')[0];
    var ol=document.createElement('ol');
    for(var i=0;i<selNames.length;i++){
        var p=document.createElement('li');
        p.innerHTML=selNames[i];
        ol.appendChild(p);
    }
    div.appendChild(ol);
}

function validate(){

    var actualDate=moment().format('DD');
    var actualMonth=moment().format('MM');
    var actualYear=moment().format('YYYY');
    var actualHour=moment().format('hh');
    var actualMins=moment().format('mm');

    prev=[];
    var selDate,selMonth,selYear,selHour,selMins;
    enteredReg=document.getElementById('regNo').value;
    var pass=document.getElementById('pass').value;
    var dateFull=document.getElementById('date').value;
    var passed=false;

    if(!dateFull || dateFull==""){
        alert("Select a date")
    }

    else{

        dateFull=document.getElementById('date').value.split('T');
        var date=dateFull[0].split('-');
        var time=dateFull[1].split(':');

        selDate=moment().format(date[2]);
        selMonth=moment().format(date[1]);
        selYear=moment().format(date[0]);
        selHour=moment().format(time[0])
        selMins=moment().format(time[1]);

        if(selHour>12)
            actualHour=''+(12+parseInt(actualHour));

        if(selYear<actualYear)
            alert("Select a future date and time");
        
        else if(selYear==actualYear && selMonth<actualMonth)
            alert("Select a future date and time");
        
        else if(selYear==actualYear && selMonth==actualMonth && selDate<actualDate)
            alert("Select a future date and time");
        
        else if(selYear==actualYear && selMonth==actualMonth && selDate==actualDate && selHour<actualHour)
            alert("Select a future date and time");

        else if(selYear==actualYear && selMonth==actualMonth && selDate==actualDate && selHour==actualHour && selMins<=actualMins)
            alert("Select a future date and time");
        
        else
            passed=true;
    }

    if(passed){
        if(enteredReg=='' || pass=='' || dateFull==null || dateFull=="")
            alert('Enter all fields properly');
    
        else if(enteredReg.length!=9)
            alert('Registration number invalid');

        else if(pass.length<6)
            alert('Password too short');   
         
        else{
            database.ref('Users').once('value',function(snapshot){
                key=Object.keys(snapshot.val());

                if(key.includes(enteredReg)){
                    database.ref('Users/'+enteredReg).once('value',function(child){

                        if(child.val()[enteredReg].localeCompare(pass)==0){
                            database.ref('prev_bookings/'+enteredReg).push({'date':selDate+'/'+selMonth+'/'+selYear+':'+selHour+':'+selMins});
                            alert("Booking done");
                            window.document.location='../html/index.html';
                        }
                        else
                            alert('Wrong password');
                    });
                }
                else{
                    console.log('No user found');
                    database.ref('Users').child(enteredReg).set({[enteredReg]:pass});
                    database.ref('prev_bookings/'+enteredReg).push({'date':selDate+'/'+selMonth+'/'+selYear+':'+selHour+':'+selMins});
                    alert("Booking done");
                    window.document.location='../html/index.html';
                }
            });
        }
    }
}

var submit=document.getElementById('submit-btn');
submit.onclick=function(){
    
    validate();
}

window.onload=fetchCheck()