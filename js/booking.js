// const userId=document.getElementById("userId")
// const userName=document.getElementById("userName")
// const userAge=document.getElementById("userAge")
// const addBtn=document.getElementById("addBtn")
// const remBtn=document.getElementById("removeBtn")
// const updBtn=document.getElementById("updateBtn")

// addBtn.addEventListener('click',(e)=>{
//     e.preventDefault();
//     rootRef.child(userId.value).set({
//         name:userName.value,
//         age:userAge.value
//     });
// })

// updBtn.addEventListener('click',(e)=>{

//     e.preventDefault();

//     const newData={
//         age:userAge.value,
//         name:userName.value
//     };
//     rootRef.child(userId.value).update(newData);
// })

// remBtn.addEventListener('click',(e)=>{
//     e.preventDefault();
//     rootRef.child(userId.value).remove().then(()=>{
//         window.alert('User removed');
//     })
//     .catch(error=>{
//         window.alert(error);
//     })
// })

// rootRef.orderByKey().limitToFirst(2).on('value',snapshot=>{
//     console.log(snapshot.val());
// })

// rootRef.orderByChild('age').on('value',snapshot=>{
//     console.log(snapshot.val());
// })

const database=firebase.database();
const rootRef=database.ref('user');

var groundTypes=[];
var indices=[];
var groundNames=[];
var indx=0,items=0;

function clicked(id){
    console.log(id);
}

var key=[];

function fetchInner(ul,loc){

    database.ref(loc).once('value',function(snapshot){
        
        var keys=Object.keys(snapshot.val());
        for(var i in keys){
            ul.setAttribute('id',loc);
            var li=document.createElement('li');
            var li1=document.createElement('button');
            li1.setAttribute("id",loc+'/'+keys[i]);
            key.push(loc+'/'+keys[i])
            li1.setAttribute('class','btn btn-primary');
            li1.innerHTML=keys[i]+':'+snapshot.val()[keys[i]];
            li.appendChild(li1);
            ul.appendChild(li);

            // console.log(document.getElementById(li1.id).innerHTML);
        }
    });
}

function fetchMore(){
    
    indices.push(groundNames.length);
    var divObj=document.getElementById('divClass');
    var olLi=document.createElement('ol');

    var i,j;
    for(i=1;i<items+1;i++){

        var temp=document.createElement('li');
        var heading=document.createElement('h2');
        heading.innerHTML=groundTypes[i-1];
        temp.appendChild(heading);

        for(j=indices[i-1];j<indices[i];j++){
            var ul=document.createElement('ul');
            ul.innerHTML=groundNames[j];
            fetchInner(ul,'Bookings/'+groundTypes[i-1]+'/'+groundNames[j]);
            temp.appendChild(ul);
        }
        olLi.appendChild(temp);
        divObj.appendChild(olLi);
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
        setTimeout(fetchMore,1000);
    });
    // var dict=[{key:'a',value:'b'}];
    // console.log(dict[0].key);
}

window.onload=fetchData();