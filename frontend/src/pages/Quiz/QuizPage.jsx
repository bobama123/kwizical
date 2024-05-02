import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AudioButton from "../../components/AudioButton/AudioButton";
import Question from "../../components/Question/Question";
import Answer from "../../components/Answer/Answer";
import { answers } from "../../../helpers/answer_generator";
import GenrePicker from "../../components/GenrePicker/GenrePicker";
import Difficulty from "../../components/Difficulty/difficulty";
import { Navigation } from "../../components/Navigation/Navigation";


export const QuizPage = () => {
  const [shuffledArtistAnswerList, setShuffledArtistAnswerList] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);
  const [time, setTime] = useState(0);
  const [playButtonState, setPlayButtonState] = useState(false);
  const [selectedBackground, setSelectedBackground] =
    useState("bg-homepage-background-2");
  const [questionType, setQuestionType] = useState(null)
  const [questionNumber, setQuestionNumber] = useState(1);
  const navigate = useNavigate();
  const [interactionDisabled, setInteractionDisabled] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleAnswerButtonClick = () => {
    setInteractionDisabled(true);
    setTimeout(() => {
      setQuestionNumber(questionNumber + 1);
    }, 1000);
  };


  useEffect(() => {
    setAnimate(false);

    if (questionNumber <= 5) {
      answers(selectedGenre, selectedDifficulty).then(
        ({ selectedTrack, shuffledArtistAnswerList, questionType }) => {
          setShuffledArtistAnswerList(shuffledArtistAnswerList);
          setSelectedTrack(selectedTrack);
          setQuestionType(questionType);
          setInteractionDisabled(false);
          setAnimate(true);
        }
      );
    } else {
      setTimeout(() => {
        navigate("/score");
      }, 750);
    }
  }, [selectedGenre, selectedDifficulty, questionNumber, navigate]);


const handlePlayPause = useCallback((newState) => {
    setPlayButtonState(newState);
    //When play is pressed, sets to isplaying. When pressed again, sets to !isplaying
  }, []);

  useEffect(() => {
    let interval;
    if (playButtonState) {
      interval = setInterval(() => {
        setTime((prevTimer) => {
          console.log("Timer updated:", prevTimer + 1); // Log the updated timer value
          return prevTimer + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playButtonState]);

  const handleGenrePicker = (genreID, backgroundClass) => {
    setSelectedGenre(genreID);
    setSelectedBackground(backgroundClass);
    localStorage.setItem('genreID', genreID); //Adding genreID to LocalStorage to get it in ScorePage

  };

  const handleDifficultyPicker = (difficultyID) => {
    setSelectedDifficulty(difficultyID);
  };
 

  return (
    <>
      <div
        className={
          "min-h-screen relative overflow-hidden bg-homepage-background-2 bg-full"
        }
      >
        <Navigation />
        {selectedGenre === 0 ? (
          <div className="animate__animated animate__slideInRight absolute inset-0 flex justify-center items-center">
            <GenrePicker onGenreSelect={handleGenrePicker}></GenrePicker>
          </div>
        ) : 
        selectedDifficulty === 0 ? (
          <div className="animate__animated animate__slideInRight">
            <Difficulty onDifficultySelect={handleDifficultyPicker}></Difficulty>
          </div>
        ) :
        (
          <>
          <div
              className={
                `absolute inset-0 flex flex-col items-center justify-center 
            animate__animated animate__slideInRight ${selectedBackground} bg-cover`
                // The above Tailwind code applies the sliding animation to the transition from the genre 'page' to the quiz 'page'
              }
            >

              <div
                className={`${
                  animate ? "animate__animated animate__slideInRight" : ""
                }`}
              >
                <div
                  className="text-2xl text-white"
                  hidden={interactionDisabled}
                >
                  Question {questionNumber} of 5
                </div>
                <div className="p-5">
                  <AudioButton
                    trackPreview={selectedTrack.preview}
                    onPlayPause={handlePlayPause}
                    playButtonState={playButtonState}
                  />
                </div>
                <div className={`p-5 text-2xl`}>
                  <Question questionType={questionType} />
                </div>
                <div className={`p-5`}>
                  <Answer
                    shuffledArtistAnswerList={shuffledArtistAnswerList}
                    selectedTrack={selectedTrack}
                    onAnswerButtonClick={handleAnswerButtonClick}
                    interactionDisabled={interactionDisabled}
                    time={time}
                  />
                </div>
              </div>
              </div>
          </>
        )}
      </div>
    </>
  );
};