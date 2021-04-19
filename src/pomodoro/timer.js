import React from "react";
// import classNames from "../utils/class-names";
// import useInterval from "../utils/useInterval";
import { secondsToDuration } from "../utils/duration";
import { minutesToDuration } from "../utils/duration";


function timer ({session , isTimerRunning , duration}){
    const width=()=>{
     
        let totalTime= (session?.label === "Focusing") ? duration.focusDuration*60 : duration.breakDuration*60 ;
     
        let perCent= 100-(session?.timeRemaining/totalTime)*100;
        return perCent
      }

    if (!session){
        return null
    }
    return (
        <div>
        {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
        <div className="row mb-2">
          <div className="col">
            {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
            <h2 data-testid="session-title">
            {session?.label} for {(session?.label=== "Focusing")?  minutesToDuration(duration.focusDuration) : (session?.label=== "On Break")? minutesToDuration(duration.breakDuration) : minutesToDuration(duration.focusDuration)} minutes
            </h2>
            {/* TODO: Update message below correctly format the time remaining in the current session */}
            <p className="lead" data-testid="session-sub-title">
            {(isTimerRunning || !session)?  secondsToDuration(session?.timeRemaining) + " remaining": "PAUSED"} 
            </p>
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: "20px" }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={width} // TODO: Increase aria-valuenow as elapsed time increases
                style={{ width: width()+"%"}} // TODO: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
      </div>
    )
}
export default timer 