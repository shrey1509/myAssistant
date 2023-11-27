'use client'
import Image from 'next/image'
import { useState,useEffect } from "react"
import OpenAI from 'openai';
export default function Home() {
  const [key,setKey] = useState("")
  const [keyAdded,setKeyAdded] = useState(false)
  const [name,setName] = useState("")
  const [instructions,setInstructions] = useState("")
  const [types,setTypes] = useState([])
  const [functions,setFunctions] = useState([])
  const [update,setUpdate] = useState(false)
  const [files,setFiles] = useState([])
  const [openai,setOpenai] = useState(null)
  const [assistantId,setAssistantId] = useState(null)
  const createAssistant = async() => {
    if(keyAdded==true&&key!=""){
      if(name!=""&&instructions!=""){
        let fileIds = []

        const filePromises = files.map(async (file) => {
        let saveFile = await openai.files.create({
            file: file,
            purpose: "assistants",
        });
        return saveFile.id; // Return the id for each file
        });
        fileIds = await Promise.all(filePromises);

        let tools = []
        types.forEach((tool)=>
          tools.push({"type":tool})
        )
        functions.forEach((fn)=>
          tools.push({"type":"function","function":JSON.parse(fn)})
        )
        const assistant = await openai.beta.assistants.create({
          name: name,
          description: instructions,
          model:"gpt-3.5-turbo-1106",
          tools: tools,
          file_ids: fileIds
        })
        console.log(assistant)
        setAssistantId(assistant.id)
        
      }else{
        alert("Add you assistant's name and instructions!")
      }
    }else{
      alert('Add your OpenAI Key!')
    }
  }
  const addType = (type) => {
    if(types.includes(type)){
      var filteredArray = types.filter(e => e !== type)
      setTypes(filteredArray)
    }else{
      setTypes([...types,type])
    }
  }
  const addFunction = (index,input) => {
    functions[index] = input
    setUpdate((prev)=>!prev)
  }
  const removeFunction = (index) => {
    if(index==0){
      setFunctions([])
    }else{
      let newFns = functions.splice(index,1)
      setFunctions(newFns)
    }
  }
  const shareEmbed = (type) => {
    if(type==0){
      navigator.clipboard.writeText('<iframe src="'+window.location.host+'/embed/'+assistantId+'?key='+key+'" />')
    }else{
      navigator.clipboard.writeText(window.location.host+'/embed/'+assistantId+'?key='+key)
    }
  }
  useEffect(()=>{
    if(keyAdded==true&&key!=""){
      setOpenai(new OpenAI({apiKey:key, dangerouslyAllowBrowser: true}))
    }
  },[keyAdded])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between md:p-8 bg-myBg">
      <div className="min-h-[90vh] w-full md:rounded-xl md:p-8 md:pb-0 bg-white flex flex-col">
        <div id="header" className="flex items-center justify-between flex-wrap gap-2 bg-slate-900 text-white px-2 md:px-8 py-4 md:rounded-xl ">
            <div className="flex items-center gap-2">
              <Image src="assistant.svg" height={50} width={50} alt="logo"/>
              <h6 className="  text-3xl font-semibold">myAssistant</h6>
            </div>
            {keyAdded==false?<div className="flex pt-4 md:pt-0 gap-2 text-sm text-black">
              <input className="bg-white p-2 md:w-80 rounded-xl" value={key} required onChange={(e)=>setKey(e.target.value)} />
              <button onClick={()=>setKeyAdded(true)} className="bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">Add OpenAI Key</button>
            </div>:<div className=" text-sm font-semibold cursor-pointer">
              OpenAI Key Added
            </div>}
        </div>
        {assistantId==null?<div className=" max-w-3xl px-8 py-6 flex flex-col gap-5 text-gray-800">
          <div>
            <label for="name" className="block mb-2 text-sm font-medium ">Enter assistant name</label>
            <input  id="name" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="UX Designer" required value={name} onChange={(e)=>setName(e.target.value)}/>
          </div>
          <div>
            <label for="instructions" className="block mb-2 text-sm font-medium ">Enter instructions</label>
            <textarea id="instructions" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required placeholder="Act as a UX Designer to help with my project." value={instructions} onChange={(e)=>setInstructions(e.target.value)}/>
          </div>
          <div>
            <label for="type" className="block mb-2 text-sm font-medium ">Select type of assistant</label>
            <div className="flex flex-col gap-3 text-sm">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"  onClick={()=>addType('code_interpreter')}/>
                <div className="w-9 h-5 bg-myBg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-mySecondary  after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:bg-myPrimary"></div>
                <span className="ms-3 font-medium ">Code Interpreter</span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer"  onClick={()=>addType('retrieval')}/>
                <div className="w-9 h-5 bg-myBg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-mySecondary  after:rounded-full after:w-4 after:h-4 after:transition-all peer-checked:bg-myPrimary"></div>
                <span className="ms-3 font-medium ">Retrieval</span>
              </label>
              <div className="flex items-center gap-5 cursor-pointer">
                <div className=" rounded-full bg-myBg text-mySecondary text-xl font-bold px-2 w-min" onClick={()=>{setFunctions([...functions,''])}}>+</div>
                <span className="font-medium ">Functions</span>

              </div>
            </div>
            {functions.map((fn,index)=><div key={index} className="relative">
              <textarea id="functions" className="bg-gray-50 mt-3 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 h-60" required placeholder='{"name": "get_weather", "description": "Determine weather in my location"}'  value={fn} onChange={(e)=>addFunction(index,e.target.value)}/>
              <div className="absolute z-10 top-1 right-4 font-bold cursor-pointer" onClick={()=>removeFunction(index)}>x</div>
              </div>)}


          </div>
          <div>
            <label className="block mb-2 text-sm font-medium " for="user_avatar">Upload files</label>
            <input className="block text-sm border border-gray-300 rounded-lg p-2 cursor-pointer bg-gray-50 focus:outline-none" aria-describedby="user_avatar_help" id="user_avatar" type="file" onChange={(e)=>setFiles([...files,e.target.files[0]])}/>
            <small>{files.map((file,index)=>(index!=files.length-1)?file.name+", ":file.name)}</small>
          </div>

        
          <button onClick={createAssistant} className=" bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ">Submit</button>
        </div>:<div className="h-full grow px-8 py-6 flex flex-col gap-5 text-gray-800">
          <div class="flex gap-2 justify-between w-full">
            <div class="flex items-center gap-2">
              <Image src='link.svg' width={20} height={20} alt="share"/>
              <h6 className="font-semibold text-xl">Share your chatbot</h6>
            </div>
            <div class="flex gap-2">
              <button onClick={()=>shareEmbed(0)} className=" bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2.5 text-center ">
                  Copy Embed
              </button>
              <button onClick={()=>shareEmbed(1)} className=" bg-mySecondary hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-4 py-2.5 text-center ">
                  Copy Link
              </button>
            </div>
          </div>  
          <iframe src={"/embed/"+assistantId+'?key='+key} className="h-full grow rounded-xl"/>
        </div>}
      </div>
    </main>
  )
}
