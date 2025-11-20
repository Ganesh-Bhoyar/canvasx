import { HTTP_URL } from "@/config";
import axios from "axios";

 
import React from "react";

const use_debouce=(value:any,delay:number)=>{
    //const [debouncedValue, setDebouncedValue] = React.useState(value);
    const [response,setResponse]=React.useState(null);
  
    React.useEffect(() => {
      const handler = setTimeout(async () => {
        const responce=await axios({
            method:"POST",
            url:`${HTTP_URL}/rooms`,
            data:{query:value}
        });
        setResponse(responce.data.rooms)
      }, delay);
  
      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);
  
    return response;
  };
  
  export default use_debouce;