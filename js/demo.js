const database=firebase.database();

var groundTypes=[];
var indices=[];
var groundNames=[];
var indx=0,items=0;
var selNames=[];


function clicked(){

    var checks=document.getElementsByTagName('input');

    var div=document.getElementsByClassName('section-container final-list')[0];
    div.innerHTML='';
        
    var heading=document.createElement('h2');

    document.getElementsByClassName('btn btn-info btn-final')[0].onclick=function(){
        localStorage.setItem('selected-names',JSON.stringify(selNames));
        window.document.location='../html/checkout.html';
    }

    var ol=document.createElement('ol');
    selNames=[];

    for(var i=0;i<checks.length;i++){
        if(checks[i].checked==true){
            selNames.push(checks[i].name);

            var p=document.createElement('li');
            p.innerHTML=checks[i].name;
            ol.appendChild(p);
        }
    }
    if(selNames.length==0){
        alert("Select items");
    }
    else{
        heading.innerHTML="Selected";
        div.appendChild(heading);
        div.appendChild(ol);
        document.getElementsByClassName('btn btn-info btn-final')[0].style.display='block';
    }
}

function fetchInner(loc,name){

    document.getElementsByClassName('btn btn-danger btn-submit')[0].style.display='block';
    var div=document.getElementsByClassName('select-list')[0];
    div.innerHTML='';
    var form=document.createElement('form');
    form.className='select-form';

    document.getElementsByClassName('btn btn-danger btn-submit')[0].onclick=function(){
        clicked();
    }

    var heading=document.createElement('h2');
    heading.innerHTML="Resources available at "+name;
    div.appendChild(heading);

    database.ref(loc).once('value',function(snapshot){
        
        var keys=Object.keys(snapshot.val());
        for(var i in keys){
            var divTemp=document.createElement('div');
            divTemp.className='form-check';

            var input=document.createElement('input');
            input.type='checkbox';
            input.className='form-check-input';
            input.name=keys[i];
            input.value=snapshot.val()[keys[i]];
            input.id=loc+'/'+keys[i];

            var label = document.createElement('label')
            label.htmlFor = keys[i];
            label.className='form-check-label  check-text';
            label.appendChild(document.createTextNode(keys[i]));

            divTemp.appendChild(input);
            divTemp.appendChild(label);
            form.appendChild(divTemp);
        }
        div.appendChild(form);
    });
}

function fetchGrdNames(i){

    document.getElementsByClassName('btn btn-success dropdown-toggle')[0].innerHTML=i+' names';
    var ground_name_drop=document.getElementsByClassName('ground-names')[0];
    var j=groundTypes.indexOf(i);
    i=j+1;
    j=0;
    ground_name_drop.innerHTML='';
    document.getElementsByClassName('ground-names-div')[0].style.display='block';
    for(var j=indices[i-1];j<indices[i];j++){
        var temp1A=document.createElement('a');
        temp1A.setAttribute('class',"dropdown-item");
        temp1A.setAttribute('id','Bookings/'+groundTypes[i-1]+'/'+groundNames[j]);
        temp1A.innerHTML=groundNames[j];
        temp1A.onclick=function(temp1A){
            fetchInner(this.id,this.innerHTML);
        };
        ground_name_drop.appendChild(temp1A);
    }
}

function fetchGrdTypes(){
    
    indices.push(groundNames.length);
    var ground_type_drop=document.getElementsByClassName('ground-types')[0];

    for(var i=1;i<items+1;i++){

        var tempA=document.createElement('a');
        tempA.setAttribute('class','dropdown-item');
        tempA.setAttribute('id','Bookings/'+groundTypes[i-1]);
        
        tempA.onclick=function(tempA){
            // clicked(this.getAttribute('id'));
            fetchGrdNames(this.innerHTML);
        };

        tempA.innerHTML=groundTypes[i-1];
        ground_type_drop.appendChild(tempA);
    }
}

function fetchData(){

    var loc='Bookings';
    database.ref(loc).once('value',function(snapshot){
        var i=0
        snapshot.forEach(
            function(_){
                groundTypes.push(Object.keys(snapshot.val())[i]);
                // console.log(groundTypes[i]); 
                i++;
            }
        )
    }).then(()=>{
        for(var a in groundTypes){
            database.ref(loc+'/'+groundTypes[a]).once('value',function(child){
                var j=0;
                indices.push(indx);
                items++;
                child.forEach(

                    function(_){
                        groundNames.push(Object.keys(child.val())[j]);
                        // console.log(Object.keys(child.val())[j]);
                        j++;
                        indx++;
                    }
                )
            }).then(()=>{

                // var temp=0;
                // for(temp=indices[items-1];temp<indx;temp++){
                //     console.log(groundNames[temp]);
                // }
            });
        }
        setTimeout(fetchGrdTypes,400);
    });
}

window.onload=fetchData();