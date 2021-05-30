const database=firebase.database();

function setData(){

    var date=moment().format('DD/MM/YYYY');
    var amt=document.getElementById('amt').value;
    var reg=document.getElementById('regNo').value;

    if(reg.length!=9)
        alert("Enter a valid registation number");

    else{
        var options = {
            "key": "rzp_test_m1rkd8I14Rh01e",
            "amount": ""+amt+"00",
            "currency": "INR",
            "name": "BookMySlot",
            "description": "Payment for charity",
            "image": "../Images/full_logo.png",
            // "order_id": "order_9A33XWu170gUtm", 
            "handler": function (response){
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)
                var data={
                    "Amount":amt+":"+date
                }
                database.ref('prev_donations').child(reg).push(data);
                alert("Payment done");
                window.document.location='../html/index.html';
            },
            "prefill": {
                "name": "Gaurav Kumar",
                "email": "gaurav.kumar@example.com",
                "contact": "9999999999"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#e28f83"
            }
        };
        var rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
                alert("Payment failed");
                window.document.location='../html/index.html';
                // alert(response.error.code);
                // alert(response.error.description);
                // alert(response.error.source);
                // alert(response.error.step);
                // alert(response.error.reason);
                // alert(response.error.metadata.order_id);
                // alert(response.error.metadata.payment_id);
        });
        rzp1.open();
    }
}

function getData(){
    document.getElementById('pay-btn').onclick = function(e){
        setData();
        e.preventDefault();
    }
}

window.onload=getData();