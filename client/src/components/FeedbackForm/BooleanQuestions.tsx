import  { useState } from 'react';
import styles from "./FeedbackForm.module.css";
import { IQuestionLang, SingleQuiz } from '../../types/template';
import { useDispatch } from 'react-redux';
import { addQuestion } from '../../features/feedBackSlice';
import React from 'react';


interface question {
  questions: SingleQuiz,
  category:string,

}
const BooleanQuestions = ({ questions, category }: question) => {
  const dispatch =useDispatch()
  const [switchState, setSwitchState] = useState(true);
  const [booleanState, setBooleanState]= useState("")
  const rows = switchState ? 'row' : 'row-reverse';
  // const [booleanQuestion,setBooleanQuestion ] = useState<string>({question:questions.question})


  const handleDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setSwitchState(!switchState)
    setBooleanState("selected")
    const question: IQuestionLang = {
        _id: questions._id,
        lang: questions.lang,
        question: questions.question,
      answer: (!switchState).toString(),
        type:'boolean'
    }
    direction() // change diff display
    dispatch(addQuestion({question,category}))
}
  
    const direction =() =>{
      
        if(switchState){
         return { flexDirection: "row" }
        }
        else {
          return {flexDirection: "row-reverse" }
        }
 
      }
    return (
      <div className={styles.bolContainer}>
       
        <p className={styles.bolQuestion}>{questions.question}</p>      
            <div className={styles.bolComponent} >
          <div className={`${styles.bolDecision} ${(switchState && booleanState==="") ? styles.bolInitial : (switchState && booleanState==="selected") ? styles.bolTrue: styles.bolFalse}`}
style={{ flexDirection: rows, transition: "flexDirection ease 4s" }}
            onClick={(e) => handleDivClick(e) }>
      <p className={styles.bolCircle}  >

        { booleanState==="" ? "Click": switchState.toString()}
        </p>
    </div>
  </div>
        </div>
    );
};

export default BooleanQuestions;