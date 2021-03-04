import { useLazyQuery } from "@apollo/client";
import { lazy, useEffect, useState } from "react";
import {gql,useQuery} from "@apollo/client"
import { useHistory } from "react-router-dom";


function Home() {

    const [restuarantArr,setRestuarantArr] = useState([])

    const [input,setInput] = useState("");

    const history = useHistory()

    const GET_RESTUARANTS = gql`
    query get_restuarants {
        restuarants {
          id
          name
          cuisine
        }
      }
    
    `;

    const FIND_RESTUARANT = gql`
    query find_restuarant($name:String!) {
        restuarants(where: {name: {_like: $name}}) {
          id
          name
          cuisine
        }
      }
      `;

    const {loading,error,data} = useQuery(GET_RESTUARANTS);

    const [findPlace,{error:lazyErr,data:lazyData}] = useLazyQuery(FIND_RESTUARANT);

    if(lazyErr){
        console.log(lazyErr)
    }

    useEffect(()=>{

        if(data && data.restuarants){
            setRestuarantArr(data.restuarants)
        }
       

    },[data])

    useEffect(()=>{
    
        if(lazyData && lazyData.restuarants.length !== 0){
                
            setRestuarantArr(lazyData.restuarants)
        }

    },[lazyData])

  

    function handleChange(e){
        setInput(e.target.value)
    }

  
    function capitalize(str){
        if(input){
        return str[0].toUpperCase()+str.slice(1);
        }
        return "";
    }
   

    function handleSearch(){
        findPlace({variables:{name:`%${capitalize(input)}%`}})
    }

    function goToPage(id){
        history.push(`/restuarant/id:${id}`)
    }

    const rows = restuarantArr.map((obj)=> {
        return(<div id={obj.id} className="name" onClick={()=>{goToPage(obj.id)}}>{obj.name} <span>{obj.cuisine}</span></div>)
    })



  return (
    <div  className="home">
        <h1>Houstonian's</h1>
        <div><input  type="text" name="input" value={input} onChange={handleChange}/><button onClick={handleSearch}>Search</button></div>
        <div className="restuarant-container">
      
        { rows}
        </div>
    </div>
  );
}

export default Home;
