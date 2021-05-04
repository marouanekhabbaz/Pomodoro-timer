import "./App.css";
import React, { useState } from "react";
// import classNames from "./utils/class-names";
import useInterval from "./utils/useInterval";
import Pomodoro from "./pomodoro/Pomodoro";
import PlayPa from "./pomodoro/playpause"
import Timer from "./pomodoro/timer"
// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}


function App() {
 
    // Timer starts out paused
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    // The current session - null where there is no session running
    const [session, setSession] = useState(null);
  
    // ToDo: Allow the user to adjust the focus and break duration.
    // const focusDuration = 25;
    // const breakDuration = 5;
    let initial={
      "focusDuration":25,
      "breakDuration" : 5,
      "disable":true
    };
   
  const [duration, setDuration]= useState(initial) 
    // ToDo: Allow the user to adjust the focus and break duration.
  
 
  
  const durationBreakHundler = (event) => {
    let tagName = event.target.tagName
    let btn = (tagName === 'SPAN')? event.target.parentNode: event.target;
    // btn = btn.querySelector("data-testid[increase-focus]") 
    let minus= btn.querySelector( ".oi-minus")
    let plus= btn.querySelector(".oi-plus")
    let timer= duration.breakDuration
    if (minus){
      setDuration(
        {
          ...duration,
          "breakDuration": (timer === 1)? timer :timer-=1
        }
      )
    } else if (plus){
      setDuration(
        {
          ...duration,
          "breakDuration": (timer ===15 )? timer :timer+=1
        })
    }
  }
  const durationFocusHundler = (event) => {
    let tagName = event.target.tagName
    let btn = (tagName === 'SPAN')? event.target.parentNode: event.target;
    // btn = btn.querySelector("data-testid[increase-focus]") 
    let minus= btn.querySelector( ".oi-minus")
    let plus= btn.querySelector(".oi-plus")
    let timer= duration.focusDuration
    if (minus){
      setDuration(
        {
          ...duration,
          "focusDuration": (timer  === 5 )? timer :timer-=5
        }
      )
    } else if (plus){
      setDuration(
        {
          ...duration,
          "focusDuration": (timer ===60 )? timer :timer+=5
        })
    }
    }
    const stopHandler = (event)=>{  
      if (session) {
      setIsTimerRunning(false)
   setSession(null)
   setDuration({
     ...duration,
    disable:true
   }
   )
    }
    }
    /**
     * Custom hook that invokes the callback function every second
     *
     * NOTE: You will not need to make changes to the callback function
     */
  
    useInterval(() => {
        if (session.timeRemaining === 0) {
          new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
          return setSession(nextSession(duration.focusDuration, duration.breakDuration));
        }
        return setSession(nextTick);
      },
      isTimerRunning ? 1000 : null
    );
  
    /**
     * Called whenever the play/pause button is clicked.
     */
    function playPause() {
      setDuration({
        ...duration,
        disable: false
      })
      setIsTimerRunning((prevState) => {
        const nextState = !prevState;
        if (nextState) {
          setSession((prevStateSession) => {
            // If the timer is starting and the previous session is null,
            // start a focusing session.
            if (prevStateSession === null) {
              return {
                label: "Focusing",
                timeRemaining:duration.focusDuration * 60,
              };
            }
            return prevStateSession;
          });
        }
        return nextState;
      });
    }
   
  return (
    <div className="App">
      <header className="App-header container">
        <h1>Pomodoro Timer</h1>
      </header>
      <div className="container">
        <Pomodoro  isTimerRunning={isTimerRunning}  session={session} duration={duration} durationFocusHundler={durationFocusHundler} durationBreakHundler={durationBreakHundler}/>
        <PlayPa playPause={playPause} isTimerRunning={isTimerRunning} stopHandler={stopHandler} duration={duration}/>
        <Timer session={session} isTimerRunning={isTimerRunning} duration={duration} />
        
      </div>
    </div>
  );
}

export default App;
