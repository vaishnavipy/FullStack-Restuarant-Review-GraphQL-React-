import { useQuery,gql, useMutation, useSubscription } from "@apollo/client";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react/cjs/react.development";


function Reviews() {

        const [input,setInput] = useState("");

        const [reviewArr,setReviewArr] = useState([])

        const {slug} = useParams();

        const INSERT_REVIEWS = gql`
        mutation insert_reviews($review:String!,$res_id:Int!) {
            insert_reviews(objects: {review:$review, res_id: $res_id}) {
            affected_rows
            }
        }`
        ;

        const GET_REVIEWS = gql`
        query get_reviews($id:Int!) {
            reviews(where: {restuarant: {id: {_eq: $id}}}) {
            review
            restuarant {
                name
              }
            }
        }`;

        const REVIEW_SUBSCRIPTION = gql`
        subscription MySubscription($id:Int!) {
            reviews(where: {restuarant: {id: {_eq: $id}}}) {
              review
            }
          }
          `;


        const {loading,err,data} = useQuery(GET_REVIEWS,{variables:{id:Number(slug)}});

        const [insertReview,{error:mutation_err ,data:inserted_data}] = useMutation(INSERT_REVIEWS,{onCompleted:()=>setInput("")});

          const {data:realtime_review,error:subscription_err} = useSubscription(REVIEW_SUBSCRIPTION,{variables:{id:Number(slug)}})


        if(mutation_err){
            console.log(mutation_err)
        }

        if(subscription_err){
            console.log(subscription_err)
        }
        useEffect(()=>{

            if(realtime_review && realtime_review.reviews){

                setReviewArr(realtime_review.reviews)

            }else{

            if(data && data.reviews){
            
            setReviewArr(data.reviews)
            }
        }

        },[data,realtime_review])

        function handleChange(e){
            setInput(e.target.value)
        }
        function handleSubmit(){
            insertReview({variables:{review:input,res_id:Number(slug)} })
        }

        const rows = reviewArr.map((obj)=> {
            return(<div id={obj.id} className="name" >{obj.review} </div>)
        })


  return (
    <div className="home">
         <h1>Houstonian's</h1>
         <h2>{data && data.reviews.length !==0 ? data.reviews[0].restuarant.name : ""}</h2>
        <div><input  type="text" name="input" value={input} onChange={handleChange}/><button onClick={handleSubmit}>Add Review</button></div>

       {rows.length !==0 ? <div className="restuarant-container"> {rows }  </div> :"" }
      
    </div>
  );
}

export default Reviews;
