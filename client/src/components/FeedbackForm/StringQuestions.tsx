import React from 'react';

//Styling
import styles from "./FeedbackForm.module.css";

//Redux
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';
import { addQuestion } from '../../features/feedBackSlice';

//Types
import { SingleQuiz } from '../../types/template';
import { IQuestionLang } from '../../types/template';

interface question {
    questions: SingleQuiz,
    category: string,

}

const StringQuestions = ({ questions, category }: question) => {
    
    const dispatch = useDispatch<AppDispatch>();
   
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault()
        const question: IQuestionLang = {
            _id: questions._id,
            lang: questions.lang,
            question: questions.question,
            answer: e.target.value,
            type:'string'
        }

        dispatch(addQuestion({question,category}))
    }
    return (
        <div className={styles.sMain}>
          
              <p>{questions.question}</p> 
            <textarea className={styles.sTextarea} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { handleInputChange(e) }}
                id="" cols={5} rows={5} placeholder='Type your answer..'>
            </textarea>
        
            

        </div>
    );
};

export default StringQuestions;