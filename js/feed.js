
// $(document).ready(()=>{
//     $("#postform").submit((e)=>
//     {
//         e.preventDefault()
//         const mycontent= $("#post-content").val()
//         console.log("here")
//         $.post("/postnew",{content: mycontent} ,function(err, result){
//             if (err){
//                 console.log(err)
//                 alert("couldn't post")
//             }})
//     })
// })




// const socket = io();
// const id_el = document.getElementById("id")


// socket.emit("user_info", id_el.innerText)




// $(document).click(function (e) {
//     e.stopPropagation();
//     var container = $("#dropdown");

//     //check if the clicked area is dropDown or not
//     if (container.has(e.target).length === 0) {
//         $('#dropdown').hide();
//     }
// })

// $(document).ready(function(){
//     // Show hide popover
//     $("#dropdown").click(function(){
//         $(this).find(".dropdown-menu").slideToggle("fast");
//     });
// });



const acc_id_el= document.getElementById("acc_id").innerText

const dropdown_el = document.getElementById("dropdown")
const search_bar_el= document.getElementById("search_bar")


// ('body').click(function(event){
//     $dropdowns.not($dropdowns.has(event.target)).hide();
//  });

document.onclick= function(e){
    console.log(e.target.id)
    console.log(e.target.id!=='search_input' & e.target.id!=='search_bar' )

    if(e.target.id!=='search_input' && e.target.id!=='search_bar'){
        console.log("insie")
        dropdown_el.style.display='none'
    }
}




const search_inpu_el = document.getElementById("search_input");
search_inpu_el.addEventListener("input", (e) => {
    const val = search_inpu_el.value
    fetch("/getusers", {
        method: "POST", body: JSON.stringify({
            input: { val }
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(result => result.json())
        .then((final_res) => {
            dropdown_el.innerHTML = ""
            for (let i = 0; i < final_res.length; i++) {

                dropdown_el.innerHTML = dropdown_el.innerHTML + `<li class=" flex items-center gap-x-3 p-3"> <img src=../profile_img/${final_res[i].profile} class="w-8 h-8 rounded-full" alt="" /> <a href= /userinfo?id=${final_res[i].id}> ${final_res[i].name} </a> </li>`

            }
            dropdown_el.style.display='block'

        })
})




const Form = (props) => {
    const setload = props.reloadFunction
    const [content, setcontent] = React.useState("")
    

    function onformsubmission(e) {
        e.preventDefault()
        $.post("/postnew", { content: content }, function (err, result) {
            if (err) {
                alert("couldn't post")
            }
        })
        e.target.children[0].value=""
        setload(cur_val => !cur_val)

    }
    return (
            <section className="w-full sm:w-2/3">
                <form action="/postnew" method="post" id="postform" onSubmit={onformsubmission} className="relative">
                <textarea  onChange={(e) => setcontent(e.target.value)} id="post-content" placeholder="what's on your mind?" name="content"  className="resize-none outline-none border-none block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg h-36"></textarea>
                    <button type="submit" className="absolute bottom-0 right-0  border-none text-white  bg-postback rounded-md cursor-pointer p-1 text-xs sm:text-sm sm:p-2 ">post<i class="fab fa-telegram-plane mx-1"></i></button>
                </form>
            </section>
    )
}

const Post = () => {
    const [posts, setPost] = React.useState([]);
    const [reload, setReload] = React.useState(false);
    
   
    
    React.useEffect(() => {
        fetch("/allpost")
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
        <Form reloadFunction={setReload}></Form>
        {
            posts.length ? <div className="font-extrabold text-4xl mt-8">Posts</div>
            : <div className="mt-16 mb-5 sm:mt-40">No Posts available</div>
            
        }        
        {
            posts.map((elem, index) => {
                return (
                    <div className="bg-white w-full mt-8 pb-2 px-6 pt-3 flex flex-col rounded-lg last:mb-8  sm:w-1/2" key={index}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-x-3">
                                <img src={'../profile_img/'+ elem.profile } className="w-14 h-14 rounded-full" alt="" />
                                <div className="flex flex-col">
                                    <h3 className="text-xl bold">{elem.name}</h3>
                                    <span className="text-gray-400 text-xs"> {elem.date_posted}</span>
                                </div>
                            </div>
                            {
                              parseInt(elem.user_id) === parseInt(acc_id_el) &&
                                    <div className="relative">
                                        <i onClick={handelClick} style={{cursor: 'pointer'}} class="fa-solid fa-ellipsis" ></i>
                                        <div className="absolute  bg-postback p-2 rounded-lg" style={{display:'none'}}>
                                            <button className="text-white" onClick={(e) => handleEdit(e, myRef.current[index],elem.poster_id)} > Edit</button>
                                            <button className="text-white" onClick={(e) => handleDelete(e,elem.poster_id)}> Delete</button>
                                        </div>
                                    </div>  
                            }
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
