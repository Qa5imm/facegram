




const notification_el= document.getElementById("notification")
const drop_button_el= document.getElementById("dropdown")
const dropdown_content_el= document.getElementById("dropdown_content")
const profiles_id = document.getElementById("userid")
const myid_el = document.getElementById("myid")
const freind_request_el= document.getElementById("freind_request")
const message_el= document.getElementById("message")
const bell_button_el= document.getElementById("bell_button")
const options_button_el= document.getElementById("options_dropdown")
















if(freind_request_el.innerText == "notifictaion"){
    notification_el.style.display="block"
}

if(freind_request_el.innerText == "Friend"){
    message_el.style.display="block"
}
else{
    message_el.style.display="none"
}

if(profiles_id.innerText == myid_el.innerText)
{
    message_el.style.display="none"
    freind_request_el.style.display="none"
    bell_button_el.style.display="block"
}


freind_request_el.addEventListener("click",()=>
{
    if (freind_request_el.innerText=="Add Friend"){
        fetch("/friend_req", {
            method:"POST", body: JSON.stringify({
            input:{req_id: profiles_id.innerText }
        }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
        }})
            .then((final_res)=>
            {
                console.log(final_res)
                if (final_res.status==200)
                {
                    freind_request_el.innerText="cancel req"
                }        
            })
    }
    else if(freind_request_el.innerText=="cancel req")
    {
        fetch("/cancel_req", {
            method:"POST", body: JSON.stringify({
            input:{req_id: profiles_id.innerText }
        }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
        }})
            .then((final_res)=>
            {
                console.log(final_res)
                if (final_res.status==200)
                {
                    freind_request_el.innerText="Add Friend"
                }        
            })
        
    }
    else if(freind_request_el.innerText=="Accept request")
    {
        fetch("/accept_req", {
            method:"POST", body: JSON.stringify({
            input:{req_id: profiles_id.innerText }
        }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
        }})
            .then((final_res)=>
            {
                console.log(final_res)
                if (final_res.status==200){
                    freind_request_el.innerText="Friend"
                    message_el.style.display="block"
                }
                else{
                    freind_request_el.innerText="Add Friend"

                }    
            })
        
    }

})


drop_button_el.addEventListener("click",()=>
{
    
        if (dropdown_content_el.style.display=="block")
        {
            dropdown_content_el.style.display="none"
        }
        else
        {
            dropdown_content_el.style.display="block"
        }

        if (notification_el.style.display=="block")
        {
            notification_el.style.display= "none";
        }
})


function myfucntion(){
    console.log("foo")

    if(options_button_el.style.display == "none"){
        console.log("uo")
        options_button_el.style.display= "block"
    }
    else{
        options_button_el.style.display= "none"
    }
}


const Post = () => {
    const [posts, setPost] = React.useState([]);
    const [reload, setReload] = React.useState(false);
    
   
    
    React.useEffect(() => {
        console.log(profiles_id.innerText)
        fetch(`/mypost`,{
            method:"POST", body: JSON.stringify({
            input:{req_id: profiles_id.innerText }
        }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
        }})
            .then((result) => result.json())
            .then((final_res) => {
                setPost(final_res)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [reload])




    
    
    const handleDelete = (event, param) => {
        $.post(`/delpost`, { post_id: param }, function (err, result) {
            if (err) {
                alert("couldn't post")
            }
        })
        event.target.parentElement.parentElement.children[0].click()
        setReload(cur_val => !cur_val)
      };

   
    const myRef = React.useRef([]); 
    myRef.current = posts.map((_, i) => myRef.current[i] || React.createRef());

      
    

    // const handleUpdate = (event, param,id) => {
    //     console.log("hwrw")
    //     event.preventDefault()
    //     param.current.setAttribute("disabled",""); 
    //     // updated_msg=event.target.children[0].value
    //     const updated_msg=event.target.children[0].value
    //     console.log(event.target.children[0].value)
    //     console.log(id)
    //     $.post('/update', { post_id: id , msg:updated_msg }, function (err, result) {
    //         if (err) {
    //             alert("couldn't post")
    //         }
    //     })
    //     console.log("htete")
    //     setReload(cur_val => !cur_val)
    //     };


        function handelClick(e){
            if(e.target.parentElement.children[1].style.display === 'none'){
    
                e.target.parentElement.children[1].style.display = 'block'
            }
            else{
                e.target.parentElement.children[1].style.display = 'none'
            }
        }

        const handleEdit = (event, param, id) => {
            if(event.target.innerText=="Edit"){
                param.current.removeAttribute("disabled")
                event.target.innerText= "Save"
                param.current.contentEditable='true'
                param.current.focus()
            }
                    
            else if(event.target.innerText == "Save"){

            param.current.contentEditable='false'
            const updated_msg= param.current.innerText
            $.post('/update', { post_id: id , msg:updated_msg }, function (err, result) {
                if (err) {
                    alert("couldn't post")
                }
            })
            event.target.innerText = "Edit"
            event.target.parentElement.parentElement.children[0].click()
            setReload(cur_val => !cur_val)

        }};

    return (<div className="w-full flex flex-col items-center">
        {
            posts.length ? <div className="font-extrabold text-4xl mt-8">Posts</div>
            : <div className="mt-10 mb-5">No Posts available</div>
            
        }
        
        {
            posts.map((elem, index) => {
                return (
                    <div className="bg-white w-full mt-8 pb-2 px-6 pt-3 flex flex-col rounded-lg last:mb-8" key={index}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-x-3">
                                <img src={'../profile_img/'+ elem.profile } className="w-14 h-14 rounded-full" alt="" />
                                <div className="flex flex-col">
                                    <h3 className="text-xl bold">{elem.name}</h3>
                                    <span className="text-gray-400 text-xs"> {elem.date_posted}</span>
                                </div>
                            </div>
                                <div className="relative">
                                    <i onClick={handelClick} style={{cursor: 'pointer'}} class="fa-solid fa-ellipsis" ></i>
                                    <div className="absolute  bg-postback p-2 rounded-lg" style={{display:'none'}}>
                                        <button className="text-white" onClick={(e) => handleEdit(e, myRef.current[index],elem.poster_id)} > Edit</button>
                                        <button className="text-white" onClick={(e) => handleDelete(e,elem.poster_id)}> Delete</button>
                                    </div>
                                </div> 
                        </div>
                       
                      
                        <div className="mt-4 px-1 h-full grow overflow-auto">
                            <div  id="post-content" contentEditable="false"  suppressContentEditableWarning={true} role="textbox"  name="content"  class="bg-inherit outline-none border-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg" key={"OKAYG_" + (10000 + Math.random() * (1000000 - 10000))}  ref={myRef.current[index]}> {elem.content} </div>
                        </div>
                
                </div>)
            })
        }
    </div>)
}

const root = ReactDOM.createRoot(document.getElementById("app"))
root.render(<Post></Post>)















