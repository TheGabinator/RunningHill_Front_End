import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';
import {API_getSentences_Link, API_getwordsByWordtype_Link, API_PostNewSentencetoAPI_Link} from "./API_Links";



function App() {  
  const [sentence, setSentences] = useState([]);
  const [words, setwords] = useState([]);
  const [wordtype, setWordtype] = useState("Verb");
  const [newsentence, setnewSentence] = useState("");
  const [status, setstatus] = useState("");

  const [pageNumber, setPageNumber] = useState(0);
  const sentencesperpage = 10;
  const pagevisited = pageNumber * sentencesperpage;

  useEffect(()=> {
    getSentences();
    getTypes();
  }, [wordtype]);

  const getSentences = async ()=>{    
    const data = await fetch(API_getSentences_Link)
    .then((response)=> response.json())
    .then((data) => {           
      setSentences(data);   
    })
    .catch(err => alert(err+ "\\nPlease reload the page"));                    
  }

  const getSelectedType = (e)=>{
    setWordtype(e.target.innerHTML);
    getTypes();

  }

  const getTypes = async ()=>{    
    const data = await fetch(API_getwordsByWordtype_Link + wordtype)
    .then((response)=> response.json())
    .then((data) => {           
      setwords(data);   
    })
    .catch(err => alert(err+ "\\nPlease reload the page"));                    
  }

  const getNewSentence = (e, data)=>{
    setnewSentence(newsentence + " " + e.target.innerHTML);
  }

  const displaySentences = sentence
      .map((sentence)=>{
        return(
           
            <div className='allsentence' >              
                <span>{sentence.sentence}</span> <br/> 
            </div>  
        )          
      });

      const displayWords = words
      .map((word, index)=>{
        return(           
            <div className='selectedwords'> <a className='selectedwords' href="#">
              <label className='selectedwords' id={index} value={word.word} onClick={(e)=>{getNewSentence(e, "data")}} > {word.word} </label>  
              </a>
            </div>  
        )          
      });

      const AddSentence = async ()=>{
        if(newsentence =="" )
        {
            setstatus("Please ensure a sentence is formulated");
            return;
        }
        setstatus("");

        let item = {sentence: newsentence };                    
        
        const result = await fetch(`http://localhost:5000/api/sentences`, {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body:JSON.stringify(item)            
        })        
        .then((response)=> response.json())
        .then((data) => {                          
        })
        .catch(err => alert(err+ "\\nPlease reload the page"));            
        getSentences();
        setnewSentence("");      
    }

  return (
    <div className="App">

              <header className='header'>
              <br/> <br/>
              <span className='wordtype' id="Adjective" onClick={(e) => (getSelectedType(e))}>Verb</span>
              <span className='wordtype' id="Adverb" onClick={(e) => (getSelectedType(e))} >Adverb</span>
              <span className='wordtype' id="Adjective"  onClick={(e) => (getSelectedType(e))}>Noun</span>
              <span className='wordtype' id="Adjective" onClick={(e) => (getSelectedType(e))}>Pronoun</span>
              <span className='wordtype' id="Adjective" onClick={(e) => (getSelectedType(e))}>Preposition</span>
              <span className='wordtype' id="Adjective" onClick={(e) => (getSelectedType(e))} >Adjective</span>
              <span className='wordtype' id="Conjunction" onClick={(e) => (getSelectedType(e))}>Conjunction</span>
              <span className='wordtype' id="Determiner" onClick={(e) => (getSelectedType(e))}>Determiner</span>
              <span className='wordtype' id="Exclamation" onClick={(e) => (getSelectedType(e))}>Exclamation</span>
              
              <br/>
              {newsentence}
              
              <br/><br/>
              <p>Create a sentence by selecting the word type above, then selecting your <br/>word from the list created after selecting the word type. 
              <br/> Watchout for the list below under the header "Select your words below" <br/>click on your word to populate the sentence text </p>
              <br/><br/>
              <span className='status'> {status} </span>
              <div >
                <input type="text" className='newsentence' disabled="true" value={newsentence} placeholder="New sentence formed here" onChange={(e)=>{setnewSentence(e.target.value)}}/> 
                <input type="button" id="save" className='savebutton' name="Save" value="Save Sentence" onClick={AddSentence} />
                <input type="button" id="clear" className='savebutton' name="Save" value="Clear" onClick={()=> {setnewSentence("")}} />  
              </div>                                             
              </header>

              <body className='wordbody'>
                <div className='leftsection'>
                  <span className='wordtypeheader'>Select your words below</span>
                  <span className='wordtypelist'> {wordtype}  </span>
                     <br/>
                    {displayWords}
                </div>
                <div className='mainsection'>                
                <span className='displayedsentences'>All constructed sentences</span>  <br/>
                  {displaySentences} 
                </div>                
              </body>      
    </div>
  );
}

export default App;
