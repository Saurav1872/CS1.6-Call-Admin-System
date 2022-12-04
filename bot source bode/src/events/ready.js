module.exports= {
    name:"ready",
    run:(client)=>{
        console.log(" Successfully Logged in as ",client.user.tag)
    }
}